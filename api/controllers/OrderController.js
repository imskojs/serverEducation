/**
 * Created by andy on 26/05/15
 * As part of IonicWorkshop
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 26/05/15
 *
 */

/** @ignore */
var validator = require('validator');
var Promise = require('bluebird');

/**
 * 주문에 대한 요청을 처리해주는 Controller.
 * @module OrderController
 */
module.exports = {
  find: find,
  checkout: checkout
};


/**
 *
 * 주문 검색
 *
 *  변수:<br>
 *  <ul>
 *    <li>search: "사용자 아이디로 가지고 있는 주문을 검색 한다"</li>
 *    <li>sort: "주문 검색 결과의 순서를 정한다"</li>
 *    <li>limit: "주문 검색 결과의 양을 제한한다"</li>
 *    <li>skip: "주어진 양만큼 주문 검색 결과의 첫부분을 넘기고 결과 값을 돌려준다"</li>
 *    <li>populate: "주문과 연관있는 아이템을 같이 가져 온다"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 제시한 조건의 주문 리스트를 가져온다.
 *
 */

function find(req, res) {
  // 모든 변수를 하나의 Object로 가져온다
  var params = req.allParams();

  // Query를 만들기 준비
  var query = {};

  // 검색 변수 포함 확인
  if (params.owner)
    query.where = {
      owner: params.owner
    }

  // sort 변수 포함 확인
  if (params.sort)
    query.sort = params.sort;


  var limit = parseInt(params.limit, 10);
  if (limit) {
    query.limit = limit + 1; // 실질적으로는 10이면 11개를 가져와 11개째가 있으면 더 10보다 상품이 더 많다고 표현함
  } else
    query.limit = 100 + 1;  // 사실상 100개 이상 가지고 올 이유가 없기 때문에 100이상은 100개로 고정

  // 넘길 data 수 포함 확인 (10: 10개를 넘기고 그다음 10개부터
  // 가져온다 페이지 하나당 10개를 보여주는 UI이라면 페이지 번호 * 10 해서 넘기면 간단하게 pagination이 가능)
  var skip = parseInt(params.skip, 10);
  if (skip)
    query.skip = skip;


  // create promise ref
  var queryPromise = Order.find(query);

  // association 결과 값 변수 포함 확인
  if (params.populate) {
    var populate = params.populate.split(',');
    _.each(populate, function (propName) {
      if (Order.isAssociation(propName))
        queryPromise = queryPromise.populate(propName);
    });
  }

  // query의 총 갯수 promise 포함
  delete query.limit;
  delete query.skip;
  var countPromise = Order.count(query);

  // db query 실행 그리고 결과값 return
  Promise.all([queryPromise, countPromise])
    .spread(function (orders, count) {
      // See if there's more
      var more = (orders[limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more)orders.splice(limit - 1, 1);

      res.ok({orders: orders, more: more, total: count});
    })
    .catch(function (err) {
      sails.log.error(err);
      res.send(500, {
        message: "주문 읽기를 실패 했습니다."
      });
    });
}

/**
 *
 *  주문을 저장한다
 *
 *  요청 body:<br>
 *  <ul>
 *    <li>(<span style="color:red;">필수</span>)order: "주문이름"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 주문을 만들고 만들어진 주문을 받는다.
 *
 */
function checkout(req, res) {
  // 모든 변수를 하나의 Object로 가져온다
  var order = req.allParams();

  // 필수 변수가 있는지 확인
  if (!order.order)
    return res.send(400, {message: "모든 변수를 입력해주세요."});

  // history record 남기기
  // order.owner = req.user.id;
  // order.createdBy = req.user.id;
  // order.updatedBy = req.user.id;

  // db query 실행 그리고 결과값 return
  Order.create(order)
    .then(function (order) {
      res.ok(order);
    })
    .catch(function (err) {
      sails.log.error(err);
      res.send(500, {
        message: "주문 만들기를 실패 했습니다."
      });
    });
}


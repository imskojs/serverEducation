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
 * 리뷰에 대한 요청을 처리해주는 Controller.
 * @module ReviewController
 */
module.exports = {
  find: find,
  create: create,
  update: update,
  destroy: destroy
};

/**
 *
 *  특정상품에 리뷰를 검색한다
 *
 *  변수:<br>
 *  <ul>
 *    <li>review: "해당 리뷰의 리뷰를 가져온다"</li>
 *    <li>sort: "리뷰 검색 결과의 순서를 정한다"</li>
 *    <li>limit: "리뷰 검색 결과의 양을 제한한다"</li>
 *    <li>skip: "주어진 양만큼 리뷰 검색 결과의 첫부분을 넘기고 결과 값을 돌려준다"</li>
 *    <li>populate: "리뷰과 연관있는 아이템을 같이 가져 온다"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 제시한 조건의 리뷰 리스트를 가져온다.
 *
 */
function find(req, res) {

  // 모든 변수를 하나의 Object로 가져온다
  var params = req.allParams();

  // Query를 만들기 준비
  var query = {};

  // 검색 변수 포함 확인
  if (params.review)
    query.where = {
      review: params.review
    }


  // sort 변수 포함 확인
  if (params.sort)
    query.sort = params.sort;


  // 제한 data 수 포함 확인
  if (params.limit && validator.isInt(params.limit, {min: 1, max: 100}))
    query.limit = params.limit;
  else
    query.limit = 100;


  // 넘길 data 수 포함 확인
  if (params.skip && validator.isInt(params.skip))
    query.skip = params.skip;

  // create promise ref
  var queryPromise = Review.find(query);

  // association 결과 값 변수 포함 확인
  if (params.populate) {
    var populate = params.populate.split(',');
    _.each(populate, function (propName) {
      if (Review.isAssociation(propName))
        queryPromise = queryPromise.populate(propName);
    });
  }

  // query의 총 갯수 promise 포함
  var countPromise = Review.count(query);

  // db query 실행 그리고 결과값 return
  Promise.all([queryPromise, countPromise])
    .spread(function (reviews, count) {
      // See if there's more
      var more = (reviews[query.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more)reviews.splice(query.limit - 1, 1);

      res.ok({reviews: reviews, more: more, total: count});
    })
    .catch(function (err) {
      sails.log.error(err);
      res.send(500, {
        message: "리뷰 읽기를 실패 했습니다."
      });
    });
}

/**
 *
 *  특정 상품에 리뷰를 작성한다
 *
 *  TODO: need logic implementation
 *  아래 조건이 성립되어야 작성가능
 *  1. 이미 리뷰를 작성 하지 않음
 *  (시간이 남을때) 2. 리뷰를 작성 하려는 상품에 주문내역이 있어야함
 *
 * 요청 body:<br>
 *  <ul>
 *    <li>(<span style="color:red;">필수</span>)content: "리뷰 내용"</li>
 *    <li>(<span style="color:red;">필수</span>)stars: "리뷰 별점"</li>
 *    <li>(<span style="color:red;">필수</span>)review: "리뷰 상품"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 리뷰를 만들고 만들어진 리뷰를 받는다.
 *
 */
function create(req, res) {

  // 모든 변수를 하나의 Object로 가져온다
  var review = req.allParams();

  // 필수 변수가 있는지 확인
  if (!review.content || !review.stars || !review.review)
    return res.send(400, {message: "모든 변수를 입력해주세요."});


  // history record 남기기
  review.owner = req.user.id;
  review.createdBy = req.user.id;
  review.updatedBy = req.user.id;

  // db query 실행 그리고 결과값 return
  Review.create(review)
    .then(function (review) {
      res.ok(review);
    })
    .catch(function (err) {
      sails.log.error(err);
      res.send(500, {
        message: "리뷰 만들기를 실패 했습니다."
      });
    });

}

/**
 *
 *  리뷰를 수정한다
 *
 *  TODO: need logic implementation
 *  아래 조건이 성립되어야 작성가능
 *  1. 리뷰의 주인만 수정 가능
 *
 *  요청 body:<br>
 *  <ul>
 *    <li>(<span style="color:red;">필수</span>)id: "제시한 아이디의 리뷰를 수정한다"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 리뷰를 수정하고 수정된 리뷰를 받는다.
 *
 */
function update(req, res) {

  // 모든 변수를 하나의 Object로 가져온다
  var review = req.body;


  // 필수 변수가 있는지 확인
  if (!review.id)
    return res.send(400, {message: "모든 변수를 입력해주세요."});

  var id = review.id;

  // history record 남기기

  review.owner = req.user.id;
  review.createdBy = req.user.id;
  review.updatedBy = req.user.id;

  // 필요없는 association 방지
  delete review.id;

  Review.findOne({id: id, owner: req.user.id})
    .then(function (foundReview) {
      if (foundReview) {
        review = _.extend(foundReview, review);
        return Review.update({id: foundReview.id}, review);
      }
      else return null;
    })
    .then(function (review) {
      res.ok(review);
    })
    .catch(function (err) {
      sails.log.error(err);
      res.send(500, {
        message: "리뷰 수정을 실패 했습니다."
      });
    });
}

/**
 *
 *  리뷰를 지운다
 *
 *  변수:<br>
 *  <ul>
 *    <li>(<span style="color:red;">필수</span>)id: "제시한 아이디의 리뷰를 지운다"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 제시한 아이디의 리뷰를 지우고 지워진 리뷰를 받는다.
 *
 */
function destroy(req, res) {
  // 모든 변수를 하나의 Object로 가져온다
  var id = req.param("id");

  // 필수 변수가 있는지 확인
  if (!id)
    return res.send(400, {message: "모든 변수를 입력해주세요."});

  // db query 실행 그리고 결과값 return
  Review.destroy({id: id})
    .then(function (reviews) {
      res.ok(reviews);
    })
    .catch(function (err) {
      sails.log.error(err);
      res.send(500, {
        message: "리뷰 지우기를 실패 했습니다."
      });
    });
}


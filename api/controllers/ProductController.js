/**
 * Created by andy on 26/05/15
 * As part of IonicWorkshop
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 26/05/15
 *
 *
 */

/** @ignore */
var validator = require('validator');

/**
 * 상품에 대한 요청을 처리해주는 Controller.
 * @module ProductController
 */
module.exports = {
  find: find,
  findOne: findOne,
  create: create,
  update: update,
  destroy: destroy
};

/********************************************************
 *                     Implementation
 ********************************************************/

/**
 *
 * 상품 검색
 *
 *  변수:<br>
 *  <ul>
 *    <li>search: "이 키워드를 이름으로 가지고 있는 상품을 검색 한다"</li>
 *    <li>sort: "상품 검색 결과의 순서를 정한다"</li>
 *    <li>limit: "상품 검색 결과의 양을 제한한다"</li>
 *    <li>skip: "주어진 양만큼 상품 검색 결과의 첫부분을 넘기고 결과 값을 돌려준다"</li>
 *    <li>populate: "상품과 연관있는 아이템을 같이 가져 온다"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 제시한 조건의 상품 리스트를 가져온다.
 *
 */

function find(req, res) {
  // 모든 변수를 하나의 Object로 가져온다
  var params = req.allParams();

  // Query를 만들기 준비
  var query = {};

  // 검색 변수 포함 확인
  if (params.search)
    query.where = {
      name: {
        contains: params.search
      }
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
  var queryPromise = Product.find(query);

  // association 결과 값 변수 포함 확인
  if (params.populate) {
    var populate = params.populate.split(',');
    _.each(populate, function (propName) {
      if (Product.isAssociation(propName));
      queryPromise = queryPromise.populate(propName);
    });
  }

  // query의 총 갯수 promise 포함
  var countPromise = Product.count(query);

  // db query 실행 그리고 결과값 return
  Promise.all([productPromise, countPromise])
    .spread(function (products, count) {
      // See if there's more
      var more = (products[query.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more)products.splice(query.limit - 1, 1);

      res.ok({products: products, more: more, total: count});
    })
    .catch(function (err) {
      sails.log.error(err);
      res.send(500, {
        message: "상품 읽기를 실패 했습니다."
      });
    });
}

/**
 *
 *  특정 상품에 상세 정보를 가져온다
 *
 *  변수:<br>
 *  <ul>
 *    <li>(<span style="color:red;">필수</span>)id: "제시한 아이디의 상품을 가져온다"</li>
 *    <li>populate: "상품과 연관있는 아이템을 같이 가져 온다"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 하나의 상품을 가져온다.
 *
 */
function findOne(req, res) {

  // 모든 변수를 하나의 Object로 가져온다 
  var params = req.allParams();

  // 필수 변수가 있는지 확인
  if (!params.id)
    return res.send(400, {message: "모든 변수를 입력해주세요."});

  // Query를 만들기 준비
  var query = {
    where: {
      id: params.id
    }
  };

  // create promise ref
  var queryPromise = Product.find(query);

  // association 결과 값 변수 포함 확인
  if (params.populate) {
    var populate = params.populate.split(',');
    _.each(populate, function (propName) {
      if (Product.isAssociation(propName));
      queryPromise = queryPromise.populate(propName);
    });
  }

  // db query 실행 그리고 결과값 return
  Promise.all([productPromise])
    .spread(function (product) {
      res.ok(product);
    })
    .catch(function (err) {
      sails.log.error(err);
      res.send(500, {
        message: "상품 읽기를 실패 했습니다."
      });
    });
}

/**
 *
 *  새로운 상품을 만든다
 *
 *  요청 body:<br>
 *  <ul>
 *    <li>name: "상품이름"</li>
 *    <li>description: "상품 설명"</li>
 *    <li>price: "원래 가격"</li>
 *    <li>salePrice: "세일 가격"</li>
 *    <li>photos: "저장된 상품의 사진들 아이디"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 상품을 만들고 만들어진 상품을 받는다.
 *
 */
function create(req, res) {

  // 모든 변수를 하나의 Object로 가져온다 
  var product = req.allParams();

  // 필수 변수가 있는지 확인
  if (!product.name || !product.description)
    return res.send(400, {message: "모든 변수를 입력해주세요."});


  // history record 남기기
  product.owner = req.user.id;
  product.createdBy = req.user.id;
  product.updatedBy = req.user.id;

  // 필요없는 association 방지
  delete product.reviews;

  // db query 실행 그리고 결과값 return
  Product.create(product)
    .then(function (product) {
      res.ok(product);
    })
    .catch(function (err) {
      sails.log.error(err);
      res.send(500, {
        message: "상품 만들기를 실패 했습니다."
      });
    });
}

/**
 *
 *  상품을 수정한다
 *
 *  요청 body:<br>
 *  <ul>
 *    <li>(<span style="color:red;">필수</span>)id: "제시한 아이디의 상품을 수정한다"</li>
 *    <li>name: "상품이름"</li>
 *    <li>description: "상품 설명"</li>
 *    <li>price: "원래 가격"</li>
 *    <li>salePrice: "세일 가격"</li>
 *    <li>photos: "저장된 상품의 사진들 아이디"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 상품을 수정하고 수정된 상품을 받는다.
 *
 */
function update(req, res) {

  // 모든 변수를 하나의 Object로 가져온다
  var product = req.allParams();


  // 필수 변수가 있는지 확인
  if (!product.id)
    return res.send(400, {message: "모든 변수를 입력해주세요."});

  var id = product.id;

  // history record 남기기

  product.owner = req.user.id;
  product.createdBy = req.user.id;
  product.updatedBy = req.user.id;

  // 필요없는 association 방지
  delete product.id;
  delete product.reviews;

  // db query 실행 그리고 결과값 return
  Product.update({id: id}, product)
    .then(function (product) {
      res.ok(product);
    })
    .catch(function (err) {
      sails.log.error(err);
      res.send(500, {
        message: "상품 수정을 실패 했습니다."
      });
    });
}

/**
 *
 *  상품을 지운다
 *
 *  변수:<br>
 *  <ul>
 *    <li>(<span style="color:red;">필수</span>)id: "제시한 아이디의 상품을 지운다"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 제시한 아이디의 상품을 지우고 지워진 상품을 받는다.
 *
 */
function destroy(req, res) {

  // 모든 변수를 하나의 Object로 가져온다
  var id = req.params.id;

  // 필수 변수가 있는지 확인
  if (!id)
    return res.send(400, {message: "모든 변수를 입력해주세요."});

  // db query 실행 그리고 결과값 return
  Product.destory({id: id})
    .then(function (products) {
      res.ok(products);
    })
    .catch(function (err) {
      sails.log.error(err);
      res.send(500, {
        message: "상품 지우기를 실패 했습니다."
      });
    });

}


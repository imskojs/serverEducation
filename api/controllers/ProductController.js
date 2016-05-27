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
var Promise = require('bluebird');

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
  // params: {
  //  search: '바지',
  //  limit: 20,
  //  skip: 30
  //  populate: ['photos']
  // }
  var params = req.allParams();


  // Query를 만들기 준비
  var query = {};

  // 검색 변수 포함 확인
  //  검색어가 있으면 (예: search: "바지")
  //
  // query: {
  //  where: {
  //    name: {contains: "바지" }
  //  }
  // }
  //
  //  상품중에 "바지" 바지라는 단어가 들어간 상품을 검색한다
  //
  if (params.search)
    query.where = {
      name: {
        contains: params.search
      }
    }

  // sort 변수 포함 확인 예 ('createdAt DESC' = 상품 만든 최근 순서로 가져온다,
  // 'createdAt ASC' = 상품 만들 순서대로 가져온다, 'price DESC' = 가장 비싼 물품순서로 가져온다)
  // query: {
  //  where: {
  //    name: {contains: "바지" }
  //  },
  //  sort: 'price DESC'
  // }
  //
  if (params.sort)
    query.sort = params.sort;


  // 제한 data 수 포함 확인 (10 : 10개만 가져온다)
  // query: {
  //  where: {
  //    name: {contains: "바지" }
  //  },
  //  sort: 'price DESC',
  //  limit: 10
  // }
  //
  var limit = parseInt(params.limit, 10);
  if (limit) {
    query.limit = limit + 1; // 실질적으로는 10이면 11개를 가져와 11개째가 있으면 더 10보다 상품이 더 많다고 표현함
  } else
    query.limit = 100 + 1; // 사실상 100개 이상 가지고 올 이유가 없기 때문에 100이상은 100개로 고정


  // 넘길 data 수 포함 확인 (10: 10개를 넘기고 그다음 10개부터
  // 가져온다 페이지 하나당 10개를 보여주는 UI이라면 페이지 번호 * 10 해서 넘기면 간단하게 pagination이 가능)
  var skip = parseInt(params.skip, 10);
  if (skip)
    query.skip = skip;

  // 상품을 찾아오는 약속을 Product.find라는 기본적인 sails model.find 함수에서 받아온다.
  // 약속들은은 밑에 Promise.all이라는 함수에서 실행하여 모든 약속이 실행 됐을때 한번에 관리한다.
  var queryPromise = Product.find(query).populate('photo');

  // association 결과 값 변수 포함 확인 ('photos,owner') ','를 사용해 어떤 연관된 모델을 가져올지 정의 한다
  // e.g. 'photos,owner' = 같은 경우 상품을 가져올때 'photos' = 상품에 사진도 같이 가져 온다, 'owner' = '상품에 주인도 가져온다'
  // populate같은 경우 query가 아니라 상품을 찾은 후 다른 Photo 또는 User를 사용 하여 연결 하는 부분이기 때문에
  // 함수로서 받는다.
  //
  // 만약에 API 자체에서 모델 populate에 변수를 관리를 안하게 될시에 그리고 API가 무조껀 photos,owner를 가져올시에
  // Product.find(query)
  //  .populate('photos')   <-- 상품 연관된 사진들을 가져오는 함수
  //  .populate('owner')    <-- 상품 연관된 주인을 가져오는 함수
  //  .then(function(products){ <-- 결과가 다 실행 됏을시에 마지막 관리 하는 함수는 개발자 몫
  //
  //      products = 찾아온 상품들 + 연관된 사진들 + 상품 주인 이라고 볼수 있다
  //      res.send(200, products) <-- 바로 돌려줄수도 있다
  //  });
  //
  if (params.populate) {
    var populate = params.populate.split(',');
    _.each(populate, function(propName) {
      if (Product.isAssociation(propName))
        queryPromise = queryPromise.populate(propName);
    });
  }

  // query의 총 갯수 promise 포함
  // 총 갯수를 가져올때 limit 또는 skip이 들어가면
  // 그 query가 적용 된값이 돌아 온다 limit = 10 라면  count가 10개임
  // 그 query가 적용 된값이 돌아 온다 limit = 10 + skip = 5 라면  count가 10개 가져와서 5개 넘겨서 5개 되어 버림
  // 그렇게 때문에 query에서 limit가 skip을 지워줘야 전체 숫자를 가져 올수 있다.
  delete query.limit;
  delete query.skip;
  var countPromise = Product.count(query);

  // 상품을 찾고 총수를 찾고 난 뒤 결과를 관리하는 부분
  Promise.all([queryPromise, countPromise])

  //   <-- then이랑 spread는 큰 차이점이 없지만 then은 결과를 하나의 Array에 결과를 넣어준다
  //    .then(function(result){
  //       result: [
  //        '0': [
  //            상품들  <-- products
  //         ],
  //        '1': 전체 숫자가  <-- count
  //      ]
  //    })
  // spread로 결과값을 받으면 아래와 같이 결과가 나누어서 돌려준다 조금더 관리하기 쉬워진다.

  .spread(function(products, count) {
      // Limit으로 10를 변수로 가져왓으면 11개를 가져와 더 있는 지 체크 하는 부분
      var more = (products[limit - 1]) ? true : false;
      // 10 요청에 11개 가져왔을때 11개 째를 지우고 10개로 만든뒤 더 있다고 more: true 로 답변을 해준다. 11개째가 없으면 당연히 more: false 로  답변을 해준다.
      if (more) products.splice(limit - 1, 1);

      // res.ok는 답변에 http 답변 코드 200이 이미 들어가 있는 것이라 보면 된다
      // 아래에 답변은 res.send(200, {products: products, more: more, total: count})
      // 과 같습니다.
      res.ok({ products: products, more: more, total: count });
    })
    // 간단한 에러 관리를 위해 전부 서버 잘못으로 돌리는 부분
    .catch(function(err) {
      // 나중에 무슨 문제엿는지 체크 위해 error 로깅을 남긴다.
      sails.log.error(err);

      // 실패 하더라도 요청에 답변을 줘서 클라이언트가 답변 기다리는 걸 방지.
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
    return res.send(400, { message: "모든 변수를 입력해주세요." });

  // Query를 만들기 준비
  var query = {
    where: {
      id: params.id
    }
  };

  // findOne은 하나만 찾는 함수 이다
  var queryPromise = Product.findOne(query);

  // association 결과 값 변수 포함 확인 ('photos,owner') ','를 사용해 어떤 연관된 모델을 가져올지 정의 한다
  // e.g. 'photos,owner' = 같은 경우 상품을 가져올때 'photos' = 상품에 사진도 같이 가져 온다, 'owner' = '상품에 주인도 가져온다'
  // populate같은 경우 query가 아니라 상품을 찾은 후 다른 Photo 또는 User를 사용 하여 연결 하는 부분이기 때문에
  // 함수로서 받는다.
  //
  // 만약에 API 자체에서 모델 populate에 변수를 관리를 안하게 될시에 그리고 API가 무조껀 photos,owner를 가져올시에
  // Product.find(query)
  //  .populate('photos')   <-- 상품 연관된 사진들을 가져오는 함수
  //  .populate('owner')    <-- 상품 연관된 주인을 가져오는 함수
  //  .then(function(products){ <-- 결과가 다 실행 됏을시에 마지막 관리 하는 함수는 개발자 몫
  //
  //      products = 찾아온 상품들 + 연관된 사진들 + 상품 주인 이라고 볼수 있다
  //      res.send(200, products) <-- 바로 돌려줄수도 있다
  //  });
  //
  if (params.populate) {
    var populate = params.populate.split(',');
    _.each(populate, function(propName) {
      if (Product.isAssociation(propName))
        queryPromise = queryPromise.populate(propName);
    });
  }

  // 상품을 찾고 뒤 결과를 관리하는 부분
  Promise.all([queryPromise])
    .spread(function(product) {
      // find와 다르게 Array가 아닌
      // 하나의 Object로 돌려받는다.
      res.ok(product);
    })
    // 간단한 에러 관리를 위해 전부 서버 잘못으로 돌리는 부분
    .catch(function(err) {
      // 나중에 무슨 문제엿는지 체크 위해 error 로깅을 남긴다.
      sails.log.error(err);

      // 실패 하더라도 요청에 답변을 줘서 클라이언트가 답변 기다리는 걸 방지.
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

  // 모든 변수를 하나의 Object로 가져온다 allParams 같은 경우
  // query-param, url-encode param, body 자체를 다 체크 하기 때문에
  // POST PUT DELETE에서도 문제없이 사용할수 있다
  var product = req.allParams();

  // 필수 변수가 있는지 확인 controller에서 관리하는 필수 부분
  if (!product.name || !product.description)
    return res.send(400, { message: "모든 변수를 입력해주세요." });


  // history record 남기기 나중에는
  // 관리자로 로그인 되어 있을시에만 가능하게 만든다
  // 그렇기 때문에 입증후 req.user 에 사용자의 대한 정보가 담겨 져있게 된다.
  //  보안 적용 후 다시 uncomment 하면 되는 부분이라고 보면 된다.
  sails.log("req.user :::\n", req.user);
  product.owner = req.user.id;
  product.createdBy = req.user.id;
  product.updatedBy = req.user.id;

  // 필요없는 association 방지 review부분을 상품 만들때 같이 만들수 있다.
  // 하지만 그러면 Rest API  Rule에 하나의 함수가 상품도 만들고 리뷰도 만들어 버리기 때문에
  // 위반 된다. 그러므로 Controller 자체에서 지워버리고 저장 한다.
  delete product.reviews;

  // create는 관련 모델을 새로 하나 만드는 함수 이다
  Product.create(product)
    .then(function(product) {

      // 만들고 완성된 상품을 돌려준다.
      res.ok(product);
    })
    // 간단한 에러 관리를 위해 전부 서버 잘못으로 돌리는 부분
    .catch(function(err) {
      // 나중에 무슨 문제엿는지 체크 위해 error 로깅을 남긴다.
      sails.log.error(err);

      // 실패 하더라도 요청에 답변을 줘서 클라이언트가 답변 기다리는 걸 방지.
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

  // 모든 변수를 하나의 Object로 가져온다 allParams 같은 경우
  // query-param, url-encode param, body 자체를 다 체크 하기 때문에
  // POST PUT DELETE에서도 문제없이 사용할수 있다
  var product = req.allParams();


  // 필수 변수가 있는지 확인 controller에서 관리하는 필수 부분
  if (!product.id)
    return res.send(400, { message: "모든 변수를 입력해주세요." });

  var id = product.id;

  // history record 남기기 나중에는
  // 관리자로 로그인 되어 있을시에만 가능하게 만든다
  // 그렇기 때문에 입증후 req.user 에 사용자의 대한 정보가 담겨 져있게 된다.
  //  보안 적용 후 다시 uncomment 하면 되는 부분이라고 보면 된다.
  product.owner = req.user.id;
  product.createdBy = req.user.id;
  product.updatedBy = req.user.id;

  // 필요없는 association 방지 review부분을 상품 만들때 같이 만들수 있다.
  // 하지만 그러면 Rest API  Rule에 하나의 함수가 상품도 만들고 리뷰도 만들어 버리기 때문에
  // 위반 된다. 그러므로 Controller 자체에서 지워버리고 저장 한다.
  // id는 수정하면 안된다
  delete product.id;
  delete product.reviews;

  // udpate는 관련 모델을 수정하는 함수 이다
  // update({수정할 상품의 조건 현재로는 상품을 유니크한 id}, 어떻게 수정할것인가의 내용)
  Product.update({ id: id }, product)
    .then(function(product) {

      // 수정된 상품을 돌려준다.
      res.ok(product);
    })
    // 간단한 에러 관리를 위해 전부 서버 잘못으로 돌리는 부분
    .catch(function(err) {
      // 나중에 무슨 문제엿는지 체크 위해 error 로깅을 남긴다.
      sails.log.error(err);

      // 실패 하더라도 요청에 답변을 줘서 클라이언트가 답변 기다리는 걸 방지.
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

  // req.param(변수이름)을 하면 요청에 원하는 변수를 가져올수 있다 지우는
  // 데에는 사실 상품 아이디만 있으면 되기 때문에
  // 아이디만 가져온다.
  var id = req.param("id");

  // 필수 변수가 있는지 확인 controller에서 관리하는 필수 부분
  if (!id)
    return res.send(400, { message: "모든 변수를 입력해주세요." });

  // delete는 관련 모델을 지우는 함수 이다
  // destroy({지울 상품의 조건 현재로는 상품을 유니크한 id})
  // 조건에 맞는 상품들은 다 지워지기 때문에 조심해 하는 부분이 있다
  // e.g. {name: "바지"} 로 넣게 된다면 상품 이름 "바지" 인 상품은
  // 다 지워지게 된다
  Product.destroy({ id: id })
    .then(function(products) {

      // 조건에 맞는 상품들은 다 지워지기 때문에 지워진 결과 상품도 Array로 오게 된다.
      res.ok(products);
    })
    // 간단한 에러 관리를 위해 전부 서버 잘못으로 돌리는 부분
    .catch(function(err) {
      // 나중에 무슨 문제엿는지 체크 위해 error 로깅을 남긴다.
      sails.log.error(err);

      // 실패 하더라도 요청에 답변을 줘서 클라이언트가 답변 기다리는 걸 방지.
      res.send(500, {
        message: "상품 지우기를 실패 했습니다."
      });
    });

}

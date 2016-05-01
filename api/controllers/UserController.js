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
 * 사용자에 대한 요청을 처리해주는 Controller.
 * @module UserController
 */
module.exports = {
  find: find,
  findOne: findOne,
  create: create,
  update: update,
  destroy: destroy
};

/**
 *
 *  사용자를 검색한다
 *
 *  변수: <br>
 *  <ul>
 *    <li>email: "이 키워드를 이름으로 가지고 있는 사용자를 검색 한다"</li>
 *    <li>sort: "사용자 검색 결과의 순서를 정한다"</li>
 *    <li>limit: "사용자 검색 결과의 양을 제한한다"</li>
 *    <li>skip: "주어진 양만큼 사용자 검색 결과의 첫부분을 넘기고 결과 값을 돌려준다"</li>
 *    <li>populate: "사용자과 연관있는 아이템을 같이 가져 온다"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 제시한 조건의 사용자 리스트를 가져온다.
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
      email: {
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
  var queryPromise = User.find(query);

  // association 결과 값 변수 포함 확인
  if (params.populate) {
    var populate = params.populate.split(',');
    _.each(populate, function (propName) {
      if (User.isAssociation(propName))
        queryPromise = queryPromise.populate(propName);
    });
  }

  // query의 총 갯수 promise 포함
  var countPromise = User.count(query);

  // db query 실행 그리고 결과값 return
  Promise.all([queryPromise, countPromise])
    .spread(function (users, count) {
      // See if there's more
      var more = (users[query.limit - 1]) ? true : false;
      // Remove item over 20 (only for check purpose)
      if (more)users.splice(query.limit - 1, 1);

      res.ok({users: users, more: more, total: count});
    })
    .catch(function (err) {
      sails.log.error(err);
      res.send(500, {
        message: "사용자 읽기를 실패 했습니다."
      });
    });
}

/**
 *
 *  특정 사용자의 상세 정보를 가져온다
 *
 *  변수:<br>
 *  <ul>
 *    <li>(<span style="color:red;">필수</span>)id: "제시한 아이디의 사용자를 가져온다"</li>
 *    <li>populate: "사용자과 연관있는 아이템을 같이 가져 온다"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 하나의 사용자를 가져온다.
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
  var queryPromise = User.findOne(query);

  // association 결과 값 변수 포함 확인
  if (params.populate) {
    var populate = params.populate.split(',');
    _.each(populate, function (propName) {
      if (User.isAssociation(propName))
        queryPromise = queryPromise.populate(propName);
    });
  }

  // db query 실행 그리고 결과값 return
  Promise.all([queryPromise])
    .spread(function (user) {
      res.ok(user);
    })
    .catch(function (err) {
      sails.log.error(err);
      res.send(500, {
        message: "사용자 읽기를 실패 했습니다."
      });
    });
}

/**
 *
 *  사용자를 만든다
 *
 *  요청 body:<br>
 *  <ul>
 *    <li>(<span style="color:red;">필수</span>)email: "사용자 이메일"</li>
 *    <li>(<span style="color:red;">필수</span>)password: "사용자 비밀번호"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 사용자를 만들고 만들어진 사용자를 받는다.
 *
 */
function create(req, res) {

  // 모든 변수를 하나의 Object로 가져온다
  var user = req.allParams();

  // 필수 변수가 있는지 확인
  if (!user.email || !user.password)
    return res.send(400, {message: "모든 변수를 입력해주세요."});


  // history record 남기기
  user.owner = req.user.id;
  user.createdBy = req.user.id;
  user.updatedBy = req.user.id;

  // 필요없는 association 방지
  delete user.orders;
  delete user.reviews;

  User.findOne({email: user.email})
    .then(function (foundUser) {
      if (!foundUser)
        return User.create(user);
      else
        return null;
    })
    .then(function (user) {
      if (user)
        res.ok(user);
      else
        res.send(400, {message: "이미 동일한 이메일을 사용하는 사용자가 존재합니다."});
    })
    .catch(function (err) {
      sails.log.error(err);
      res.send(500, {
        message: "사용자 만들기를 실패 했습니다."
      });
    });
}

/**
 *
 *  사용자를 수정한다
 *
 *  요청 body:<br>
 *  <ul>
 *    <li>(<span style="color:red;">필수</span>)id: "제시한 아이디의 사용자를 수정한다"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 사용자를 수정하고 수정된 사용자를 받는다.
 *
 */
function update(req, res) {

  // 모든 변수를 하나의 Object로 가져온다
  var user = req.allParams();


  // 필수 변수가 있는지 확인
  if (!user.id)
    return res.send(400, {message: "모든 변수를 입력해주세요."});

  var id = user.id;

  // history record 남기기

  user.owner = req.user.id;
  user.createdBy = req.user.id;
  user.updatedBy = req.user.id;

  // 필요없는 association 방지
  delete user.id;
  delete user.orders;
  delete user.reviews;
  delete user.role;

  // db query 실행 그리고 결과값 return
  User.update({id: id}, user)
    .then(function (user) {
      res.ok(user);
    })
    .catch(function (err) {
      sails.log.error(err);
      res.send(500, {
        message: "사용자 수정을 실패 했습니다."
      });
    });
}

/**
 *
 *  사용자를 지운다
 *
 *  변수:<br>
 *  <ul>
 *    <li>(<span style="color:red;">필수</span>)id: "제시한 아이디의 사용자를 지운다"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 제시한 아이디의 사용자를 지우고 지워진 사용자를 받는다.
 *
 */
function destroy(req, res) {

  // 모든 변수를 하나의 Object로 가져온다
  var id = req.param("id");

  // 필수 변수가 있는지 확인
  if (!id)
    return res.send(400, {message: "모든 변수를 입력해주세요."});

  // db query 실행 그리고 결과값 return
  User.destroy({id: id})
    .then(function (users) {
      res.ok(users);
    })
    .catch(function (err) {
      sails.log.error(err);
      res.send(500, {
        message: "사용자 지우기를 실패 했습니다."
      });
    });

}


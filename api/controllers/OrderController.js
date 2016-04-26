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


/**
 * 주문에 대한 요청을 처리해주는 Controller.
 * @module OrderController
 */
module.exports = {
  checkout: checkout
};


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
  order.owner = req.user.id;
  order.createdBy = req.user.id;
  order.updatedBy = req.user.id;

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


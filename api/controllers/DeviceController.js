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
 * 기기에 대한 요청을 처리해주는 Controller.
 * @module DeviceController
 */
module.exports = {
  pushAll: pushAll,
  register: register,
};


/**
 *
 *  전체 푸시 메세지를 보낸다
 *
 *  변수:<br>
 *  <ul>
 *    <li>(<span style="color:red;">필수</span>)title: "푸시 메세지 제목"</li>
 *    <li>(<span style="color:red;">필수</span>)message: "푸시 메세지 내용"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 푸시 메세지를 보낸다.
 *
 */
function pushAll(req, res) {

  // 모든 변수를 하나의 Object로 가져온다
  var push = req.allParams();

  // 필수 변수가 있는지 확인
  if (!push.title || !push.message)
    return res.send(400, {message: "모든 변수를 입력해주세요."});

  Device.find()
    .then(function (devices) {
      PushService.sendAll(devices, push.title, push.message);
      res.send(200, {
        message: "Message sent."
      });
    })
    .catch(function (err) {
      sails.log.error(err);
      return res.send(500, {
        message: "기기 등록을 실패 했습니다."
      });

    });
}

/**
 *
 *  기기를 푸시메세지에 등록 한다
 *
 *  변수:<br>
 *  <ul>
 *    <li>(<span style="color:red;">필수</span>)deviceId: "기기 아이디"</li>
 *    <li>(<span style="color:red;">필수</span>)platform: "기기 플랫폼"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 기기를 푸시메세지에 등록 한다.
 *
 */
function register(req, res) {

  // 모든 변수를 하나의 Object로 가져온다
  var device = req.allParams();

  // 필수 변수가 있는지 확인
  if (!device.deviceId || !device.platform)
    return res.send(400, {message: "모든 변수를 입력해주세요."});

  Device.findOrCreate({
      deviceId: device.deviceId
    }, device)
    .then(function (createdDevice) {
      res.send(200, {
        device: createdDevice
      });
    })
    .catch(function (err) {
      sails.log.error(err);
      return res.send(500, {
        message: "기기 등록을 실패 했습니다."
      });
    });
}

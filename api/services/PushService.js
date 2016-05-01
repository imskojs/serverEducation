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
var apn = require('apn');

/**
 * 재사용 가능한 서버 푸시 메세지 서비스
 * @service PushService
 */
module.exports = {
  getAndroidPushService: getAndroidPushService,
  getIOSPushService: getIOSPushService,
  sendAll: sendAll
};

/**
 *
 *  Google Cloud Messaging (GCM) 서비스를 돌려준다
 *
 * @returns {*}
 */
function getAndroidPushService() {
  return sails.config.connections.gcm;
};

/**
 *
 *  Apple Push Notification (APN) 서비스를 돌려준다
 *
 * @returns {*}
 */
function getIOSPushService() {
  return new apn.Connection(sails.config.connections.apnConfig);
};

/**
 *
 * @param devices 푸시를 보낼 기기들
 * @param title 푸시 메세지 제목
 * @param message 푸시 메세지 내용
 * @param data 푸시 메세지 data
 * @param collapseKey 푸시 메세지 카테고리
 */
function sendAll(devices, title, message, data, collapseKey) {


  // 특정한 카테고리를 받거나 기본으로 'NEWS_TO_USER'를 사용한다.
  var collapseKey = collapseKey || 'NEWS_TO_USER';

  // 각각 푸시 메세지 서비스를 가져온다
  var gcm = this.getAndroidPushService();
  var apnConnection = this.getIOSPushService();


  for (var i = 0; i < devices.length; i++) {


    switch (devices[i].platform) {
      // 안드로이드이면 GCM을 사용한다
      case 'ANDROID':
        sails.log.debug({
          deviceId: devices[i].deviceId,
          title: title,
          message: message
        });

        gcm.send({
          registrationId: devices[i].deviceId,
          collapseKey: collapseKey,
          delayWhileIdle: true,
          timeToLive: 3600,
          data: {
            title: title,
            message: message
          }
        });
        break;

      // 애플이면 APN을 사용한다

      case 'IOS':
        var myDevice = new apn.Device(devices[i].deviceId);

        var note = new apn.Notification();

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 0;
        note.sound = "ping.aiff";
        note.alert = title;
        note.payload = {'message': message};

        apnConnection.pushNotification(note, myDevice);
        break;
    }
  }
}
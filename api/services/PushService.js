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


module.exports = {

  getAndroidPushService: function () {
    return sails.config.connections.gcm;
  },

  getIOSPushService: function () {
    return new apn.Connection(sails.config.connections.apnConfig);
  },

  sendAll: function (devices, title, message, data, collapseKey) {


    var collapseKey = collapseKey || 'NEWS_TO_USER';

    // Fetchd push services
    var gcm = this.getAndroidPushService();
    var apnConnection = this.getIOSPushService();


    for (var i = 0; i < devices.length; i++) {


      switch (devices[i].platform) {

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
};


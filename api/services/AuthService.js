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
var jwt = require('jsonwebtoken');


module.exports = {

  // Creates OAuthToken with random generated secret code in sails.
  getToken: function (userinfo) {
    var secret = sails.config.session.secret;
    var token = jwt.sign(userinfo, secret, {'expiresIn': "365 days"});
    return token;
  },

  // Verifies OAuthToken with random generated secret code in sails.
  verifyToken: function (token, callback) {
    var secret = sails.config.session.secret;
    jwt.verify(token, secret, callback);
  },

};

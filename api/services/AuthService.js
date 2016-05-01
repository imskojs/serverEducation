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


/**
 * 재사용 가능한 서버 보안 서비스
 * @service AuthService
 */
module.exports = {

  // Creates OAuthToken with random generated secret code in sails.
  getToken: getToken,

  // Verifies OAuthToken with random generated secret code in sails.
  verifyToken: verifyToken,

};

/**
 *
 * 사용자의 정보 및 서버에 secret을 사용하여 비밀 Token을 만든다
 *
 * @param userinfo 사용자 정보를 변수로 받는다
 * @return 만들어진 Token을 돌려준다
 */
function getToken(userinfo) {
  var secret = sails.config.session.secret;
  var token = jwt.sign(userinfo, secret, {'expiresIn': "365 days"});
  return token;
};

/**
 *
 * 주어진 Token이 서버에서 만들진 것인지 확인한다.
 *
 * @param token 확인할 Token을 받는다
 * @param callback 맞는 Token인지 확인하고 결과를 돌려준다
 */
function verifyToken(token, callback) {
  var secret = sails.config.session.secret;
  jwt.verify(token, secret, callback);
};
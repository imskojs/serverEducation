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
 * Token으로 관리자를 확인 하는 Policy
 * @service BearAuthAdmin
 */
module.exports = function (req, res, next) {

  var auth = req.headers.authorization;
  if (!auth || auth.search('Bearer ') !== 0) {
    return next();
  }

  var token;

  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0], credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      next();
    }

    AuthService.verifyToken(token, function (err, userInfo) {
      if (err)
        return next();
      User.findOne({id: userInfo.id})
        .exec(function (err, user) {

          if (user && user.role === "ADMIN") {
            req.token = token;
            req.user = user;
            req.session.authenticated = true;
            next();
          } else {
            next();
          }
        });
    });
  } else {
    next();
  }
};

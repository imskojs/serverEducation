/**
 * Created by andy on 3/08/15
 * As part of applicatplatform
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Andy Yoon Yong Shin - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Andy Yoon Yong Shin <andy.shin@applicat.co.kr>, 3/08/15
 *
 */

var Promise = require('bluebird');

module.exports = function (sails) {

  return {
    identity: 'users',
    /**
     * Local cache of Model name -> id mappings to avoid excessive database lookups.
     */
    _modelCache: {},

    initialize: function (next) {

      sails.log('UsersHook : initializing users hook');

      sails.after('hook:orm:loaded', function () {
        return injectUser()
          .then(function () {
            next();
          })
          .catch(function (error) {
            sails.log.error("error", error);
            next(error);
          });
      });
    }
  };
}


function injectUser() {
  sails.log('UsersHook : injecting users');
  var userToCreate = sails.config.users.initialUser;

  return new Promise(function (resolve, reject) {
    User.create(userToCreate)
      .then(function (users) {
        resolve(users);
      })
      .catch(function (err) {
        reject(err);
      });
  });
}



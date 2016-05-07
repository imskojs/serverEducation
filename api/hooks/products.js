/**
 * Created by andy on 5/7/16.
 */

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
    identity: 'products',
    /**
     * Local cache of Model name -> id mappings to avoid excessive database lookups.
     */
    _modelCache: {},

    initialize: function (next) {

      sails.log('ProductsHook : initializing product hook');

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
  sails.log('ProductHook : injecting products');

  var promises = [];


  _.each(sails.config.products.initialProducts, function(productToCreate){
    promises.push(new Promise(function (resolve, reject) {
      Product.findOrCreate({name: productToCreate.name}, productToCreate)
        .then(function (products) {
          resolve(products);
        })
        .catch(function (err) {
          reject(err);
        });
    }));
  });



  return Promise.all(promises);
}



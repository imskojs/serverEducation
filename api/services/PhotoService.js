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
var Promise = require('bluebird');
var cloudinary = require('cloudinary');
var fs = require('fs');

var appTags = [];

module.exports = {
  init: init,
  getService: getService,

  upload: upload,
  uploadForUpdate: uploadForUpdate,
  remove: remove
};

function init() {
  cloudinary.config(sails.config.connections.cloudinary);
  appTags = sails.config.connections.cloudinary.tags;
}

function getService() {
  return cloudinary;
}


function upload(req) {

  var allUpstreams = new Promise(function (resolve, reject) {
    req.file('file').upload(function (err, uploads) {
      if (err)
        return reject(err);
      return resolve(uploads)
    })
  });

  return Promise.resolve(allUpstreams)
    .bind({})
    .then(function (imageInServer) {
      this.imageInServer = imageInServer[0];
      return cloudinary.uploader.upload(this.imageInServer.fd, null, {tags: appTags})
    })
    .then(function (imageInCloudinary) {
      fs.unlink(this.imageInServer.fd);

      _.each(req.body, function (value, key) {
        if (key.indexOf('.' > -1)) {
          var newKey = key.split('.')[0];
          req.body[newKey] = [value];
          delete req.body[key];
        }
      });
      var imageToSave = _.extend(imageInCloudinary, req.body);
      return Photo.create(imageToSave);
    });
}

function uploadForUpdate(req) {

  var allUpstreams = new Promise(function (resolve, reject) {
    req.file('file').upload(function (err, uploads) {
      if (err)
        return reject(err);
      return resolve(uploads)
    })
  });

  return Promise.resolve(allUpstreams)
    .bind({})
    .then(function (imageInServer) {
      this.imageInServer = imageInServer[0];
      return cloudinary.uploader.upload(this.imageInServer.fd, null, {tags: appTags})
    })
    .then(function (imageInCloudinary) {
      fs.unlink(this.imageInServer.fd);

      _.each(req.body, function (value, key) {
        if (key.indexOf('.' > -1)) {
          var newKey = key.split('.')[0];
          req.body[newKey] = [value];
          delete req.body[key];
        }

      });
      var imageToSave = _.extend(imageInCloudinary, req.body);
      return imageToSave;
    });
}


// TODO: need to check thi function
function remove(id, callback) {
// Find photo metadata first
  Photo.findOne({id: id})
    .then(function (photo) {

      sails.log.debug("removing photo:" + photo.id);

      // If exist delete from cloud
      return cloudinary.uploader.destroy(photo.public_id, null);
    })
    .then(function (photo) {

      sails.log.debug('after: ' + JSON.stringify(photo));
      // On success delete metadata from out db
      return Photo.destroy({id: id});
    })
    .then(function (photos) {
      if (callback)
        return callback(null, photos);
    })
    .catch(function (err) {
      if (callback)
        return callback(err);
    });
}


/**********************************
 *
 *         Private Method
 *
 **********************************/


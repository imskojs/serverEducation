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


/**
 * 재사용 가능한 서버 사진기능
 * @service PhotoService
 */
module.exports = {
  init: init,
  upload: upload,
  remove: remove
};

/**
 *  사진 서비스 설정
 */
function init() {
  cloudinary.config(sails.config.connections.cloudinary);
}

/**
 *
 * 사진을 서버에 받은 후 Cloudinary에 업로드 하고
 * DB에 저장한후 저장한 사진 data를 약속으로 돌려준다.
 *
 * @param req: 요청을 받는 다.
 * @returns {*}: 약속을 (promise) 돌려준다.
 *
 */
function upload(req) {

  // 요청으로 들어온 모든 file 업로드를 받는다
  var allUpstreams = new Promise(function (resolve, reject) {
    req.file('file').upload(function (err, uploads) {
      if (err)
        return reject(err);
      return resolve(uploads)
    })
  });

  // 사진을 Cloudinary에 업로드 한다
  return Promise.resolve(allUpstreams)
    .bind({})
    .then(function (imageInServer) {
      this.imageInServer = imageInServer[0];
      return cloudinary.uploader.upload(this.imageInServer.fd, null)
    })
    // 잠시 서버에 저장한 사진을 지운다
    .then(function (imageInCloudinary) {
      fs.unlink(this.imageInServer.fd);

      // 사진과 같이 업로드된 meta-data 를 저장한다
      var imageToSave = _.extend(imageInCloudinary, req.body);

      // 사진을 DB에 저장한다
      return Photo.create(imageToSave);
    });
}

/**
 *
 * @param (<span style="color:red;">필수</span>)id: 지울 사진 아이디
 * @param callback: 요청 처리 후 명령
 */
function remove(id, callback) {
  // 사진을 찾는다
  Photo.findOne({id: id})
    .then(function (photo) {
      // Cloudinary에서 지운다
      return cloudinary.uploader.destroy(photo.public_id, null);
    })
    .then(function (photo) {
      // DB에서 사진을 지운다
      return Photo.destroy({id: id});
    })
    .then(function (photos) {
      // 지운후 명령을 실행 한다
      if (callback)
        return callback(null, photos);
    })
    .catch(function (err) {
      if (callback)
        return callback(err);
    });
}



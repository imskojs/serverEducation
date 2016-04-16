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
var associations = ['owner', 'createdBy', 'updatedBy'];

/**
 * 기기 모델
 *  <br>
 *  현재 모델이 지정된 attribute 이외에 attribute들도 받아 들일것인가. (true: 안받아들인다, false: 받아들인다)
 *  <br>
 *  schema: false,
 *  <br>
 *  <br>
 *  attributes:
 *  <ul>
 *    <li>deviceId: {unique: true, type: 'STRING', maxLength: 256, required: true, notNull: true}</li>
 *    <li>platform: {type: 'STRING', required: true, notNull: true, enum: ['IOS', 'ANDROID']}</li>
 *    <li>owner: {model: 'User'}</li>
 *    <li>createdBy: {model: 'User'}</li>
 *    <li>updatedBy: {model: 'User'}</li>
 *  </ul>
 *  <br>
 *  <br>
 *  Helper function
 *  <br>
 *  isAssociation: module.exports.isAssociation
 * @class Device
 * @type {{schema: boolean, attributes: {deviceId: {unique: boolean, type: string, maxLength: number, required: boolean, notNull: boolean}, platform: {type: string, required: boolean, notNull: boolean, enum: string[]}, owner: {model: string}, createdBy: {model: string}, updatedBy: {model: string}}}}
 */
module.exports = {
  schema: false,
  attributes: {

    /** Properties */
    deviceId: {unique: true, type: 'STRING', maxLength: 256, required: true, notNull: true},
    platform: {type: 'STRING', required: true, notNull: true, enum: ['IOS', 'ANDROID']},

    /** Associations */
    owner: {model: 'User'},
    createdBy: {model: 'User'},
    updatedBy: {model: 'User'}
  },
  isAssociation: function (propName) {
    return validator.isIn(propName, associations);
  }
};


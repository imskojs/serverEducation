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
var associations = ['profilePhoto', 'reviews', 'orders', 'devices',
  'owner', 'createdBy', 'updatedBy'];

/**
 * 사용자 모델
 *  <br>
 *  현재 모델이 지정된 attribute 이외에 attribute들도 받아 들일것인가. (true: 안받아들인다, false: 받아들인다)
 *  <br>
 *  schema: false,
 *  <br>
 *  <br>
 *  attributes:
 *  <ul>
 *    <li>profilePhoto: {model: 'photo'}</li>
 *    <li>reviews: {collection: 'Review', via: 'owner'}</li>
 *    <li>orders: {collection: 'Order', via: 'owner'}</li>
 *    <li>devices: {collection: 'Device', via: 'owner'}</li>
 *    <li>owner: {model: 'User'}</li>
 *    <li>createdBy: {model: 'User'}</li>
 *    <li>updatedBy: {model: 'User'}</li>
 *  </ul>
 *  <br>
 *  <br>
 *  Helper function
 *  <br>
 *  isAssociation: module.exports.isAssociation
 * @class User
 * @type {{schema: boolean, attributes: {profilePhoto: {model: string}, reviews: {collection: string, via: string}, orders: {collection: string, via: string}, devices: {collection: string, via: string}, owner: {model: string}, createdBy: {model: string}, updatedBy: {model: string}}, isAssociation: module.exports.isAssociation}}
 */
module.exports = {
  schema: false,
  attributes: {

    /** Associations */
    profilePhoto: {model: 'photo'},
    reviews: {collection: 'Review', via: 'owner'},
    orders: {collection: 'Order', via: 'owner'},
    devices: {collection: 'Device', via: 'owner'},
    owner: {model: 'User'},
    createdBy: {model: 'User'},
    updatedBy: {model: 'User'}
  },
  isAssociation: function (propName) {
    return validator.isIn(propName, associations);
  }
};


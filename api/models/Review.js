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
var associations = ['product', 'owner', 'createdBy', 'updatedBy'];

/**
 * 리뷰 모델
 *  <br>
 *  현재 모델이 지정된 attribute 이외에 attribute들도 받아 들일것인가. (true: 안받아들인다, false: 받아들인다)
 *  <br>
 *  schema: false,
 *  <br>
 *  <br>
 *  attributes:
 *  <ul>
 *    <li>content: {type: 'String', required: true}</li>
 *    <li>stars: {type: 'Integer'}</li>
 *    <li>product: {model: 'Product'}</li>
 *    <li>owner: {model: 'User'}</li>
 *    <li>createdBy: {model: 'User'}</li>
 *    <li>updatedBy: {model: 'User'}</li>
 *  </ul>
 *  <br>
 *  <br>
 *  Helper function
 *  <br>
 *  isAssociation: module.exports.isAssociation
 * @class Review
 * @type {{schema: boolean, attributes: {content: {type: string, required: boolean}, stars: {type: string}, product: {model: string}, owner: {model: string}, createdBy: {model: string}, updatedBy: {model: string}}}}
 */
module.exports = {
  schema: false,
  attributes: {
    /** Properties */
    content: {type: 'String', required: true},
    stars: {type: 'Integer'},

    /** Associations */
    product: {model: 'Product'},
    owner: {model: 'User'},
    createdBy: {model: 'User'},
    updatedBy: {model: 'User'}
  },
  isAssociation: function (propName) {
    return validator.isIn(propName, associations);
  }
};


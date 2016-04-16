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
 * 주문 모델
 *  <br>
 *  현재 모델이 지정된 attribute 이외에 attribute들도 받아 들일것인가. (true: 안받아들인다, false: 받아들인다)
 *  <br>
 *  schema: false,
 *  <br>
 *  <br>
 *  attributes:
 *  <ul>
 *    <li>order: {type: 'json'}</li>
 *    <li>owner: {model: 'User'}</li>
 *    <li>createdBy: {model: 'User'}</li>
 *    <li>updatedBy: {model: 'User'}</li>
 *  </ul>
 *  <br>
 *  <br>
 *  Helper function
 *  <br>
 *  isAssociation: module.exports.isAssociation
 * @class Order
 * @type {{schema: boolean, attributes: {order: {type: string}, owner: {model: string}, createdBy: {model: string}, updatedBy: {model: string}}, isAssociation: module.exports.isAssociation}}
 */
module.exports = {
  schema: false,
  attributes: {


    /** Properties */
    // Require product id to increment product sales
    //{
    //  // product must include id and be at leat one embed in it
    //  totalPrice: int
    //  Products: []
    //
    // }
    order: {type: 'json'},

    /** Associations */
    owner: {model: 'User'},
    createdBy: {model: 'User'},
    updatedBy: {model: 'User'}
  },
  isAssociation: function (propName) {
    return validator.isIn(propName, associations);
  }
};


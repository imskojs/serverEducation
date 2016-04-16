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
var associations = ['photos', 'reviews',
  'owner', 'createdBy', 'updatedBy'];

/**
 * 상품 모델
 *  <br>
 *  현재 모델이 지정된 attribute 이외에 attribute들도 받아 들일것인가. (true: 안받아들인다, false: 받아들인다)
 *  <br>
 *  schema: false,
 *  <br>
 *  <br>
 *  attributes:
 *  <ul>
 *    <li>name: {type: string, required: boolean}</li>
 *    <li>description: {type: string, required: boolean}</li>
 *    <li>price: {type: string}, salePrice: {type: string}</li>
 *    <li>photos: {collection: string, via: string}</li>
 *    <li>reviews: {collection: string, via: string}</li>
 *    <li>owner: {model: string}</li>
 *    <li>createdBy: {model: string}</li>
 *    <li>updatedBy: {model: string}</li>
 *  </ul>
 *  <br>
 *  <br>
 *  Helper function
 *  <br>
 *  isAssociation: module.exports.isAssociation
 * @class Product
 * @type {{schema: boolean, attributes: {name: {type: string, required: boolean}, description: {type: string, required: boolean}, price: {type: string}, salePrice: {type: string}, photos: {collection: string, via: string}, reviews: {collection: string, via: string}, owner: {model: string}, createdBy: {model: string}, updatedBy: {model: string}}, isAssociation: module.exports.isAssociation}}
 */
module.exports = {
  schema: false,
  attributes: {

    /** Properties */
    name: {type: 'String', required: true},
    description: {type: 'String', required: true},
    price: {type: 'Integer',},
    salePrice: {type: 'Integer',},

    /** Associations */
    photos: {collection: 'Photo', via: 'product'},
    reviews: {collection: 'Review', via: 'product'},
    owner: {model: 'User'},
    createdBy: {model: 'User'},
    updatedBy: {model: 'User'}
  },
  isAssociation: function (propName) {
    return validator.isIn(propName, associations);
  }
};


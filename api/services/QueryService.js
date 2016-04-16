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

module.exports = {
  applyPopulate: applyPopulate,
};

/********************************************************
 *                      Public Methods
 ********************************************************/


function applyPopulate(queryPromise, populate) {
  if (!populate)
    return;

  _.each(populate, function (populateProp) {
    queryPromise = queryPromise.populate(populateProp);
  });
}



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

/**
 * 재사용 가능한 서버 쿼리 서비스
 * @service QueryService
 */
module.exports = {
  applyPopulate: applyPopulate,
};

/********************************************************
 *                      Public Methods
 ********************************************************/

/**
 *
 * 약속에 populate task를 더 해준다.
 *
 * @param queryPromise task가 더 해질 약속
 * @param populate 더 할 populate task의 이름들
 */
function applyPopulate(queryPromise, populate) {
  if (!populate)
    return;

  _.each(populate, function (populateProp) {
    queryPromise = queryPromise.populate(populateProp);
  });
}



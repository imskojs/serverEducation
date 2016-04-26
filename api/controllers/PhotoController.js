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
 * 사진에 대한 요청을 처리해주는 Controller.
 * @module UserController
 */
module.exports = {
  create: create,
  destroy: destroy
};

/**
 *
 *  사진을 업로드 한다
 *
 *  요청 body:<br>
 *  <ul>
 *    <li>(<span style="color:red;">필수</span>)file: "사진 file stream"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 사진을 만들고 만들어진 사진을 받는다.
 *
 */
function create() {
  PhotoService.upload(req)
    .then(function (file) {
      // 저장한 사진을 돌려준다.
      res.send(200, file);
    })
    .catch(function (err) {
      sails.log.error(err);
      return res.send(500, {message: '사진 업로드를 실패 하였습니다.'});
    });
}

/**
 *
 *  사진을 지운다
 *
 *  변수:<br>
 *  <ul>
 *    <li>(<span style="color:red;">필수</span>)id: "제시한 아이디의 사진을 지운다"</li>
 *  <ul>
 *
 * @param req {JSON}
 * @param res {JSON}
 * @return {JSON} 제시한 아이디의 사진을 지우고 지워진 사진을 받는다.
 *
 */
function destroy() {
  // 모든 변수를 하나의 Object로 가져온다
  var id = req.params.id;

  // 필수 변수가 있는지 확인
  if (!id)
    return res.send(400, {message: "모든 변수를 입력해주세요."});

  // 지우기 요청
  PhotoService.remove(id, function (err, files) {
    // 에러 관리
    if (err) {
      sails.log.error(err);
      return res.send(500, {
        message: "사진 지우기를 실패 했습니다."
      });
    }

    // 요청 결과
    return res.send(200, files);
  });
}


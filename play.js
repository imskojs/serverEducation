/**
 * Created by andy on 4/7/16.
 */

var validator = require('validator');

var params = {
  test: ""
}

console.log(validator.isWhitelisted("user", "user"));

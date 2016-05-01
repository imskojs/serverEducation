/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  '/': {
    view: 'homepage'
  },

  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the custom routes above, it   *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/

  /**************************************
   *               Order
   *************************************/

  'GET /order/find': 'OrderController.find',
  'POST /order/checkout': 'OrderController.checkout',

  /**************************************
   *               Product
   *************************************/

  'GET /product/find': 'ProductController.find',
  'GET /product/findOne': 'ProductController.findOne',
  'POST /product/create': 'ProductController.create',
  'PUT /product/update': 'ProductController.update',
  'DELETE /product/destroy': 'ProductController.destroy',


  /**************************************
   *               Photo
   *************************************/

  'POST /photo/create': 'PhotoController.create',
  'DELETE /photo/destroy': 'PhotoController.destroy',


  /**************************************
   *               Review
   *************************************/

  'GET /review/find': 'ReviewController.find',
  'POST /review/create': 'ReviewController.create',
  'PUT /review/update': 'ReviewController.update',
  'DELETE /review/destroy': 'ReviewController.destroy',


  /**************************************
   *               User
   *************************************/

  'GET /user/find': 'UserController.find',
  'GET /user/findOne': 'UserController.findOne',
  'POST /user/create': 'UserController.create',
  'PUT /user/update': 'UserController.update',
  'DELETE /user/destroy': 'UserController.destroy',

  /**************************************
   *               Auth
   *************************************/

  'GET /checkEmail': 'AuthController.checkEmail',
  'POST /login': 'AuthController.login',
  'GET /logout': 'AuthController.logout',
  'POST /register': 'AuthController.register',

  /**************************************
   *               Device
   *************************************/

  'GET /device/push': 'DeviceController.pushAll',
  'POST /device/register': 'DeviceController.register',

};

/**
 * Connections
 * (sails.config.connections)
 *
 * `Connections` are like "saved settings" for your adapters.  What's the difference between
 * a connection and an adapter, you might ask?  An adapter (e.g. `sails-mysql`) is generic--
 * it needs some additional information to work (e.g. your database host, password, user, etc.)
 * A `connection` is that additional information.
 *
 * Each model must have a `connection` property (a string) which is references the name of one
 * of these connections.  If it doesn't, the default `connection` configured in `config/models.js`
 * will be applied.  Of course, a connection can (and usually is) shared by multiple models.
 * .
 * Note: If you're using version control, you should put your passwords/api keys
 * in `config/local.js`, environment variables, or use another strategy.
 * (this is to prevent you inadvertently sensitive credentials up to your repository.)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.connections.html
 */


/** @ignore */
var gcm = require('push-notify');

module.exports.connections = {

  /***************************************************************************
   *                                                                          *
   * MongoDB is the leading NoSQL database.                                   *
   * http://en.wikipedia.org/wiki/MongoDB                                     *
   *                                                                          *
   * Run: npm install sails-mongo                                             *
   *                                                                          *
   ***************************************************************************/
  someMongodbServer: {
    adapter: 'sails-mongo',
    host: 'localhost',
    port: 27017,
    // user: 'username',
    // password: 'password',
    database: 'shopping'
  },


  /**
   *  Image Server Config (Cloudinary)
   */

  /**
   *  Push Message Config
   */
  gcm: gcm.gcm({
    apiKey: 'AIzaSyC_VqSFmRXD7TxrXKPMIyQ8HI4vQYJ5FR4'
  }),

  apnConfig: {
    "cert": __dirname + '/ssl/cert.pem',
    "key": __dirname + '/ssl/key.pem'
  },















































































  cloudinary: {
    cloud_name: 'appdev',
    api_key: '355231636137138',
    api_secret: 'p_5ViDMlrlNZJFUP91trdUmo904',
    tags: ['APPLICAT', 'SHOWPLA']

    // cloud_name: 'applicatworkshop',
    // api_key: '646323879887636',
    // api_secret: 'B-ROp8wTI_U5QvJmaQWOvuZ9H6E',
    // tags: []
  },

};

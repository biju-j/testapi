'use strict';
var mocha = require('mocha');
var SupportAPI = require('../lib/support.js');
var logging      = require( '../config/config-log4js.js' );
var logger=logging.LOG;
var chai   = require( 'chai' );
var expect = chai.expect;
var now = new Date();
var supportapi = new SupportAPI();
var bRole='check_admin';
describe(' Check Tests', function(){
           this.timeout(200000);

           it('Database Constants fetch', function(done){
                     supportapi.fetcher(bRole,'/search/campaings', function(text){
                     logger.info("Database constants> "+text);
                     // expect(text).to.contain("MimeType", "MediaUrlMap", "thumbnail", "ShaHash");
                     done();
                  });
           });

           it('Fetch medias of a user', function(done){
                     supportapi.fetcher(bRole,'/user/6411/medias', function(text){
                     // logger.info("Standard Supported medias  > "+text);
                     expect(text).to.contain("MimeType", "MediaUrlMap", "thumbnail", "ShaHash");
                     done();
                  });
           });

           it('All Countries fetch', function(done){
                       supportapi.fetcher(bRole,'/countries', function(text){
                       // logger.info("Countries  > "+text);
                       expect(text).to.contain("India", "US","Argentina", "NeedZipCode", "IsoCode");
                       done();
                    });
           });

           it('All supported Currencies', function(done){
                     supportapi.fetcher(bRole,'/currencies', function(text){
                     // logger.info('Supported Currencies >'+text);
                     expect(text).to.contain("Pound", "Euro", "US Dollar");
                     done();
                });
           });
});



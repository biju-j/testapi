'use strict';
var mocha = require('mocha');
var SupportAPI = require('../lib/support.js');
var logging      = require( '../config/config-log4js.js' );
var logger=logging.LOG;
var chai   = require( 'chai' );
var expect = chai.expect;
var now = new Date();
var supportapi = new SupportAPI();
var bRole='blippar_admin';
describe(' GENERIC functions and MEDIA, MEDIACODER functions Tests', function(){
           this.timeout(200000);

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

           it('STANDARD supported Medias fetch', function(done){
                     supportapi.fetcher(bRole,'/medias/standard', function(text){
                     // logger.info("Standard Supported medias  > "+text);
                     expect(text).to.contain("MimeType", "MediaUrlMap", "thumbnail", "ShaHash");
                     done();
                  });
           });

           it('Upload to MediaCoder', function(done){
                  var mediaresp = ' ';
                  supportapi.mediauploader('blippar_admin','/../resources/assets/teamwork.mp4', function(text) {
                        mediaresp += text;
                    //expect(groupresp).to.have.all.keys("BlippId", "CreatedAt");
                    logger.info('mediaresp-------'+mediaresp);
                  done();
                });
           });

           it('Media job details', function(done){
                    supportapi.mediauploader('blippar_admin','/../resources/assets/teamwork.mp4', function(text1) {
                    supportapi.mediapoller(bRole,'/api/v1/transcoder/jobs/'+text1, function(text) {
                        expect(text).to.contain("blipp_media_preset", "SUBMITTED", "THUMBS_CREATED", "PROGRESSING", "COMPLETED");
                        logger.info('Media job details'+text);
                        done();
                      });
                  });
           });



});
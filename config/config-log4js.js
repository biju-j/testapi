/*This config is used for configuring log4js*/
var log4js = require('log4js');
var now = new Date();
var strDateTime = [[AddZero(now.getDate())+AddZero(now.getMonth() + 1)+now.getFullYear()]+[AddZero(now.getHours())+AddZero(now.getMinutes())]+AddZero(now.getHours())];
//Pad given value to the left with "0"
function AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
}
log4js.configure({
appenders: [
   { type: 'console' },
   { type: 'file', filename: './logs/automatexecution'+ strDateTime +'.log',
   category: 'automatexecution' }
  ]
});
var logger  = log4js.getLogger('automatexecution');
            logger.setLevel('DEBUG');
module.exports.LOG=logger;

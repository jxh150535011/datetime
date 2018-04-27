'use strict';

const gDateTime = require('./index');

console.log(gDateTime.format(new Date(),'yyyy-MM-dd hh'));
console.log(gDateTime.format(new Date(),'yyyy-MM-dd HH'));


console.log(gDateTime.format('2015-09-08 06','yyyy-MM-dd h'));
console.log(gDateTime.format('2015-09-08 06','yyyy-MM-dd hh'));
	'use strict';

	const gDateTime = require('./index');

	console.log(gDateTime.format(new Date(),'yyyy-MM-dd hh'));//2015-09-08 06
	console.log(gDateTime.format(new Date(),'yyyy-MM-dd HH'));//2015-09-08 06


	console.log(gDateTime.format('2015-09-08 06','yyyy-MM-dd h'));//2015-09-08 6
	console.log(gDateTime.format('2015-09-08 06','yyyy-MM-dd hh'));//2015-09-08 06
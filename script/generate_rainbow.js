"use strict";

const fs = require('fs');
const path = require('path');
const Jimp = require("jimp");

const inputPng = path.join( __dirname, '..', 'assets', 'app-icon', 'png', '192.png' );
const outputDir = path.join( __dirname, '..', 'assets', 'app-icon', 'rainbow' );

const steps = 50;

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

Jimp.read(inputPng, function (err, image) {
	if (err) throw err;
	
	var total = steps;
    var done = 0;
    
    for( let i = 1; i <= total; i++ ) {
	    console.log('generating frame', i, '...');
	    image.color([
		    { apply: 'hue', params: [ 360 / total ] }
		]);
		
		image.write( path.join( outputDir, i + '.png' ), function( err ){
			if( err ) return console.err( err );
			
			console.log('generated frame', i)
			
			if( ++done === total ) {
				console.log('all frames generated');				
			}
		})
    }
	    
});
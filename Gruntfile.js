module.exports = function(grunt) {
	'use strict';
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
        	dist: {
            	// the files to concatenate
            	src: [
            	 		'js/common.js',
            	 		'js/myStorage.js',
            	 		'js/cache.js',
            	 		'js/lazyimg.js',
            	],
            	// the location of the resulting JS file
            	dest: 'dist/common.js'
        	}
    	}
	});
	grunt.loadNpmTasks("grunt-contrib-concat");

	grunt.registerTask("default",["concat"]);
};
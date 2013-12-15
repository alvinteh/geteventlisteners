module.exports = function(grunt) {
	 "use strict";

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		concat: {
            dist: {
                files: {
                	"dist/geteventlisteners.js": ["src/*.js"],
                }
            }
        },
        jshint: {
            files: [
            	"src/*.js"
        	],
            options: {
                jshintrc: ".jshintrc"
            }
        },
		uglify: {
			all: {
            	files: {
                	"dist/geteventlisteners.min.js": ["dist/geteventlisteners.js"]
                },
				options: {
                	preserveComments: false,
                    banner: "/*! geteventlisteners <%= pkg.version %> | 2013 Alvin Teh | MIT-licensed */",
            	}
            }
        },
        watch: {
            files: ["src/*.js"],
        },
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask("default", ["jshint", "concat", "uglify"]);
}
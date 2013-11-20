module.exports = function(grunt) {
	grunt.initConfig({
	  pkg: grunt.file.readJSON('package.json'),
	  exec: {
	    build: {
	      command: 'nexe -o "release/Makerware Configurator"',
	    }
	  }
	});

	grunt.loadNpmTasks('grunt-exec');

	grunt.registerTask('default', ['exec']);
}
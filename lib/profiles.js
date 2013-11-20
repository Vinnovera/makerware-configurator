module.exports = function() {
	var publ = this,
		priv = {},

		fs	= require('fs'),	

		dir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/Things/Profiles/';

	publ.getProfilesDir = function() {
		return dir;
	};

	publ.readProfileDir = function(callback) {
		callback = callback || function() {};

		fs.readdir(dir, function(err, nodes) {
			var ret = [],
				i;

			for (i in nodes) {
				if (nodes[i][0] !== '.') {
					ret.push(nodes[i]);
				}
			}
			callback(ret);
		});
	};
};
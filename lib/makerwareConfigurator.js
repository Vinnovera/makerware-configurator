module.exports = new function() {
	var publ = this,
		priv = {},

		Wizard 	 = require('cli-wizard'),
		Profiles = require('./profiles'),
		Profile  = require('./profile'),
		
		wizard	 = new Wizard,
		profiles = new Profiles,
		profile,

		unsaved	 = false;

	priv.setProfile = function(name) {
		profile = new Profile(name);
	}

	priv.saveProfile = function() {
		if (profile) {
			profile.save(function() {
				unsaved = false;

				priv.alert('Profile saved!', wizard.reload);
			});
		}
	}

	priv.saveProfileAs = function() {
		if (profile) {
			wizard.forward('Save profile as...', function() {
				profiles.readProfileDir(function(list) {
					console.log('Available editable profiles:\n');

					wizard.menu([list]);

					wizard.question('Choose an existing profile or enter a new name:', function(name) {
						if (name) {
							wizard.reset(1);
							name = list.hasOwnProperty(name - 1) ? list[name - 1] : name;

							profile.save(function() {
								priv.alert('Profile saved as "' + name + '"!', priv.askForPropertyToEdit);
							}, name);
						}
						else {
							priv.alert('Invalid profile number or name', wizard.reload);
						}
					});
				});
			});
		}
	}

	priv.menu = function(choices) {
		choices = [choices];

		if (profile) {
			var extras = {};

			if (unsaved) {
				extras['S'] = ['Save profile "' + profile.name + '"'];
			}

			extras['A'] = ['Save profile as...'];

			choices.push(extras);
		}

		wizard.menu(choices);
	}

	priv.question = function(question, callback) {
		callback = callback || function() {};

		wizard.question(question, function(answer) {
			var letter = isNaN(parseInt(answer)) ? answer.toLowerCase() : answer;

			if (letter == 's') {
				priv.saveProfile();
			}
			else if (letter == 'a') {
				priv.saveProfileAs();
			}
			else {
				callback(answer);
			}
		});
	}

	priv.alert = function(message, callback) {
		callback = callback || function() {};

		wizard.clearConsole();

		console.log(message);

		setTimeout(callback, message.length * 50);
	}

	priv.askForProfile = function() {
		wizard.forward(null, function() {
			profiles.readProfileDir(function(list) {
				console.log('Available editable profiles:\n');

				priv.menu(list);

				priv.question('Wich profile do you want to edit?', function(num) {
					if (list.hasOwnProperty(num - 1)) {
						priv.setProfile(list[num - 1]);
						priv.askForPropertyToEdit();
					}
					else {
						priv.alert('Invalid profile number', wizard.reload);
					}
				});
			})
		})
	}

	priv.askForPropertyToEdit = function(prop) {
		prop = prop || {};
		wizard.forward(prop.name || profile.name, function() {
			console.log('Profile: %s', profile.name);

			if (prop.name) {
				console.log('Setting: %s', prop.name);
			}

			console.log('');

			var properties = profile.getProperties(prop),
				property,
				i,
				menu = [];

			for (i in properties) {
				property = properties[i];
				if (!property.settings) {
					menu.push([property.name, property.value]);
				}
				else {
					menu.push([property.name]);
				}
			}

			priv.menu(menu);

			priv.question('Wich setting do you want to edit?', function(num) {
				if (properties.hasOwnProperty(num - 1)) {
					var property = properties[num - 1];
					if (property.settings) {
						priv.askForPropertyToEdit(property);
					}
					else {
						priv.askForPropertyValue(property);
					}
				}
				else {
					priv.alert('Invalid setting number', wizard.reload);
				}
			});
		});
	}

	priv.askForPropertyValue = function(property) {
		wizard.forward(property.name, function() {
			console.log('Profile: %s', profile.name);
			console.log('Setting: %s', property.name);

			if (property.description) {
				console.log('\n' + property.description);
			}

			console.log('\nValid values:  ' + property.getValidValues());
			console.log('Current value: ' + property.value);

			priv.menu();

			priv.question('Enter new value for setting:', function(value) {
				if (property.set(value)) {
					unsaved = true;

					wizard.backward();
				}
				else {
					priv.alert('Invalid value. Value need to be ' + property.getValidValues(), wizard.reload);
				}
			})
		});
	}

	publ.start = function() {
		priv.askForProfile();
	}
}
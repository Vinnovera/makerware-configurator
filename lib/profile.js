module.exports = function(name) {
	var publ = this,
		priv = {},

		fs = require('fs'),	

		Profiles 	= require('./profiles'),
		Property 	= require('./property'),

		profiles 	= new Profiles,

		root 		= profiles.getProfilesDir(),
		name		= publ.name = name,
		dir 		= root + name,
		file 		= dir + '/miracle.json',
		properties 	= JSON.parse(fs.readFileSync(file)),

		profileJSON = {
		   "machine_type" : [
		      "replicator_single",
		      "replicator_dual",
		      "replicator_2",
		      "replicator_2x",
		      "thing_o_matic_single",
		      "thing_o_matic_dual"
		   ],
		   "slicer" : "miraclegrue"
		},

		settings = [
			{
				name: 'Right extruder settings',
				settings: [
					{ key: 'extruderTemp0', 		name: 'Temperature (°C)', 		validate: 'integer',	property: properties,						description: 'Defines the target temperatures of two extruders. If you are using a single extruder MakerBot, like a Replicator 2, your extruder is extruder 0. If you are using a dual extruder MakerBot, like a Replicator 2X, extruder 0 is the right side extruder and extruder 1 is the left side extruder. If you are using a single extruder MakerBot or printing on only one of the extruders in a dual extruder MakerBot, the setting for the extruder that is not present or not in use will be ignored. Temperatures entered here are set in units of degrees Celsius.' },
					{ key: 'feedDiameter', 			name: 'Filament diameter (mm)',	validate: 'float',		property: properties.extruderProfiles[0],	description: 'Specify the diameter of the filament you will be using. If this value is too low, your extruder will extrude too much plastic. If it is too high, your extruder will extrude too little.' },
/*
					{ key: 'feedstockMultiplier', 	name: 'Feed stock multiplier',  validate: 'float',		property: properties.extruderProfiles[0],	description: 'For reasons that include differences in filament density and die swell, the volume of plastic going into extruder might not be the same as the volume of plastic coming out of the extruder. The number set here compensates for that difference.' },
					{ key: 'retractDistance', 		name: 'Retract distance (mm)',  validate: 'float',		property: properties.extruderProfiles[0],	description: 'Your extruder will retract the amount of filament specified here before travel moves, in order to prevent ooze.' }
*/
				]
			},
			{
				name: 'Left extruder settings',
				description: '',
				settings: [
					{ key: 'extruderTemp1', 		name: 'Temperature (°C)', 		validate: 'integer',	property: properties,						description: 'Defines the target temperatures of two extruders. If you are using a single extruder MakerBot, like a Replicator 2, your extruder is extruder 0. If you are using a dual extruder MakerBot, like a Replicator 2X, extruder 0 is the right side extruder and extruder 1 is the left side extruder. If you are using a single extruder MakerBot or printing on only one of the extruders in a dual extruder MakerBot, the setting for the extruder that is not present or not in use will be ignored. Temperatures entered here are set in units of degrees Celsius.' },
					{ key: 'feedDiameter', 			name: 'Filament diameter (mm)',	validate: 'float',		property: properties.extruderProfiles[1],	description: 'Specify the diameter of the filament you will be using. If this value is too low, your extruder will extrude too much plastic. If it is too high, your extruder will extrude too little.' },
/*
					{ key: 'feedstockMultiplier', 	name: 'Feed stock multiplier', 	validate: 'float',		property: properties.extruderProfiles[1], 	description: 'For reasons that include differences in filament density and die swell, the volume of plastic going into extruder might not be the same as the volume of plastic coming out of the extruder. The number set here compensates for that difference.' },
					{ key: 'retractDistance', 		name: 'Retract distance (mm)', 	validate: 'float',		property: properties.extruderProfiles[1],	description: 'Your extruder will retract the amount of filament specified here before travel moves, in order to prevent ooze.' }
*/
				]
			},
			{ key: 'platformTemp', 			name: 'Platform temperature (°C)', 	validate: 'integer',	description: 'Defines the target temperature for a heated build plate. If your MakerBot does not have a heated build plate, the value entered here will be ignored. Temperatures entered here are set in units of degrees Celsius.' },
			{ key: 'layerHeight', 			name: 'Layer height (mm)',			validate: 'float',		description: 'Defines the height of each layer.'},
			{ key: 'numberOfShells', 		name: 'Number of shells',			validate: 'integer',	description: 'The number of shells is the number of outlines printed before the extruder moves on to infill or to the next layer. Each additional shell after the first one is slightly inset from the previous shell. If any layer of your model cannot accommodate the number of shells you have specified, the slicer will print as many shells as possible.' },
			{ key: 'doDynamicSpeed', 		name: 'Dynamic speed', 				validate: 'bool',		description: 'Dynamic Speed reduces your feedrate on tight curves for better surface quality. When set to true, the slicer will slow down your feedrate in situations determined by the Dynamic Speed settings below.' },
			{ key: 'sparseInfillPattern', 	name: 'Infill pattern',				validate: ['linear','hexagonal','catfill','sharkfill','moroccanstar'], description: 'This setting determines the infill pattern, and must contain the name of one of the specific infill patterns built into the MakerBot Slicer. Choices include "linear," "hexagonal", "catfill", "sharkfill" and "moroccanstar."'},
			{ key: 'infillDensity', 		name: 'Infill density',				validate: 'float',		description: 'This setting determines the density of infill, and must be set to a value between 0 and 1. A setting of 0 results in a hollow object and a setting of 1 results in a solid one.' },
			{ key: 'doRaft', 				name: 'Raft',						validate: 'bool',		description: 'Determines whether or not your toolpath will include a raft. If it is set to "false," all raft-related settings will be ignored.'},
			{ key: 'doSupport', 			name: 'Supports',					validate: 'bool',		description: 'This setting turns support structures on and off. When doSupport is set to "false", all support-related settings will be ignored.' },
			{ key: 'doPurgeWall', 			name: 'Purge wall', 				validate: 'bool',		description: 'The purge wall is a feature designed to reduce traces of material left by the inactive extruder during a dual extrusion print. When "doPurgeWall" is set to "true," printed objects will include two printed walls that will catch any excess plastic hanging from the extruder nozzle so that the excess does not attach itself to the printed object. When "doPurgeWall" is set to "false," the purge walls will not be printed and the purge wall settings below will be ignored.' },
			{ key: 'doFanCommand', 			name: 'Filament cooling fan',		validate: 'bool',		description: 'Set "doFanCommand" to "true" to insert a GCode command to turn on an active cooling fan during a build. The "fanLayer" setting (see below) determines where in the GCode this commend will be inserted. If the "doFanCommand" setting is set to "false," the "fanLayer" setting will be ignored.' },
			{
				name: 'Speeds',
				settings: [
					{ key: 'feedrate', 				name: 'Raft base (mm/sec)',  				validate: 'integer',	property: properties.extrusionProfiles.raftbase,			description: 'Affects extrusion on the base layer of rafts. When "doRaft" is set to "false," this setting will be ignored.' },
					{ key: 'feedrate', 				name: 'First layer with raft (mm/sec)', 	validate: 'integer',	property: properties.extrusionProfiles.firstlayerraft,		description: 'Affects extrusion on the first layer of your object only if the object is being printed with a raft. This setting will apply to the first printed layer that is part of your object and not to any layers that are part of the raft.' },
					{ key: 'feedrate',				name: 'First layer w/o raft (mm/sec)', 		validate: 'integer',	property: properties.extrusionProfiles.firstlayer,			description: 'Affects extrusion on the first layer of your object only if the object is being printed without a raft.'},
					{ key: 'feedrate', 				name: 'Infill (mm/sec)', 					validate: 'integer',	property: properties.extrusionProfiles.infill,				description: 'Affects extrusion on all infill.' },
					{ key: 'feedrate', 				name: 'Insets (mm/sec)', 					validate: 'integer',	property: properties.extrusionProfiles.insets,				description: 'Affects extrusion on all shells except for the outermost one.' },
					{ key: 'feedrate', 				name: 'Outlines (mm/sec)',  				validate: 'integer',	property: properties.extrusionProfiles.outlines,			description: 'Affects extrusion only on the outermost shell.' },
					{ key: 'rapidMoveFeedRateXY',	name: 'XY travel speed (mm/sec)', 			validate: 'integer',	property: properties,										description: 'Controls the speed of travel moves along the X and Y axes' },
					{ key: 'rapidMoveFeedRateZ',	name: 'Z travel speed (mm/sec)',			validate: 'integer',	property: properties,										description: 'Controls the speed of travel moves along the Z axis' },
					{ key: 'feedrate', 				name: 'Bridges speed (mm/sec)', 			validate: 'integer',	property: properties.extrusionProfiles.bridges,				description: 'Affects extrusion on areas identified as bridges. If "doBridging" is set to "false," this setting will be ignored.' },
				]
			}
		];

	publ.getProperties = function(prop) {
		var ret = [],
			sett,
			i,
			property,
			setting;

		prop 	= prop || {};
		setts 	= prop.settings || settings;

		for (i in setts) {
			setting = setts[i];
			props 	= setting.property || properties;

			if (props.hasOwnProperty(setting.key)) {
				property = props[setting.key];
				if (typeof property !== 'undefined') {
					ret.push(new Property({ 
						key: 			setting.key, 
						name: 			setting.name, 
						value: 			property, 
						property: 		props,
						validate:       setting.validate,
						description: 	setting.description,
						settings: 		setting.settings
					}));
				}
			}
			else if (setting.settings) {
				ret.push(new Property({ 
					name: 			setting.name,
					description: 	setting.description,
					settings: 		setting.settings
				}));
			}
		}

		return ret;
	}

	publ.save = function(callback, newName) {
		callback = callback || function() {};

		if (newName) {
			name 	= publ.name = newName;
			dir    	= root + name;
			file  	= dir + '/miracle.json';

			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);

				var profileFile = dir + '/profile.json',
					profileData = JSON.stringify(profileJSON, false, 4);
					
				fs.writeFileSync(profileFile, profileData);
			}
		}

		var data = JSON.stringify(properties, false, 4);

		fs.writeFile(file, data, callback);
	}
};
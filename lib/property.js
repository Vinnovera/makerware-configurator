module.exports = function(data) {
	var publ = this,
		priv = {},

		key 			= data.key, 
		name 			= publ.name			= data.name, 
		value 			= publ.value 		= data.value, 
		property 		= data.property,
		validate       	= data.validate,
		description		= publ.description 	= data.description,
		settings 		= publ.settings 	= data.settings;

	publ.hasSettings = function() {
		return typeof settings !== 'undefined'
	}

	publ.set = function(value) {
		if (publ.validate(value)) {
			property[key] = publ.parse(value);

			return true;
		}

		return false;
	}

	publ.parse = function(value) {
		if (validate === 'integer') {
			value = parseInt(value);
		}
		else if (validate === 'float') {
			value = parseFloat(value);
		}
		else if (validate === 'bool') {
			value = (value === 'true');
		}

		return value;
	}

	publ.validate = function(value) {
		if (validate === 'integer') {
			return /^-?\d+$/.test(value);
		}
		else if (validate === 'float') {
			return /^-?\d*(\.\d+)?$/.test(value);
		}
		else if (validate === 'bool') {
			return value === 'true' || value === 'false';
		}
		else if (validate instanceof Array) {
			return validate.indexOf(value) >= 0;
		}

		return false;
	}

	publ.getValidValues = function() {
		if (validate === 'integer') {
			return 'whole number';
		}
		else if (validate === 'float') {
			return 'decimal number';
		}
		else if (validate === 'bool') {
			return 'true or false';
		}
		else if (validate instanceof Array) {
			return validate.join(', ');
		}

		return false;
	}
};

class	CoreUtils
{
	static	IsObject(_obj)
	{
		if (CoreUtils.IsValid(_obj) == true)
			return _obj.constructor == Object;
		else
			return false;
	}

	static	IsBool(_obj)
	{
		return (_obj === true || _obj === false);
	}

	static	IsNumber(_obj)
	{
		return Number.isFinite(_obj);
	}	

	static	IsString(_str)
	{
		if (typeof _str === 'string' || _str instanceof String)
			return true;
		else
			return false;
	}

	static	IsArray(_obj)
	{
		return Array.isArray(_obj);
	}

	static	IsValid(_obj)
	{
		if (typeof _obj === 'undefined')
			return false;
		if (_obj == null)
			return false;
		return true;
	}

	static	IsNull(_obj)
	{
		if (typeof _obj === 'undefined')
			return true;
		if (_obj == null)		
			return true;
		return false;
	}
	
	static	IsBoolAlike(_obj)
	{
		if (CoreUtils.IsBool(_obj) == true)
			return true;
		else if (CoreUtils.IsString(_obj) == true)
		{
			if ( (_obj.toLowerCase() == "true") || (_obj.toLowerCase() == "false") )
				return true;
		}

		return false;
	}

	static	IsNumberAlike(_obj)
	{
		if (CoreUtils.IsNumber(_obj) == true)
			return true;
		else if (CoreUtils.IsString(_obj) == true)
		{
			let	number = CoreUtils.ToNumber(_obj);
			if (number.toString() == _obj)
				return true;
		}

		return false;
	}	

	static	ToString(_obj)
	{
		if (CoreUtils.IsNull(_obj) == true)
			return "";

		if ( (CoreUtils.IsObject(_obj) == true) || (CoreUtils.IsArray(_obj) == true) )
			return JSON.stringify(_obj);
		else
			return _obj.toString();
	}	

	static	ToNumber(_str)
	{
		let	value = Number(_str);
		if (isNaN(value) == true)
			return 0;
		else
			return value;
	}

	static	ReformatJSON(_json)
	{
		// try to parse the string to JSON
		try
		{
			let	str = JSON.stringify(_json);
			return JSON.parse(str);
		}
		catch
		{
			return {};
		}			
	}

	static	Copy(_obj)
	{
		return CoreUtils.ReformatJSON(_obj);
	}	
};

module.exports = {
	CoreUtils
};

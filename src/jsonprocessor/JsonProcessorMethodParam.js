const { CoreUtils } = require("../utils/CoreUtils");
const { ObjUtils } = require("../utils/ObjUtils");
const { StringUtils } = require("../utils/StringUtils");
const { ArrayUtils } = require("../utils/ArrayUtils");

class	JsonProcessorMethodParam
{
	static	get	TYPE_ANY()			{ return "any"; }	
	static	get	TYPE_OBJECT()		{ return "object"; }	
	static	get	TYPE_LIST()			{ return "list"; }	
	static	get	TYPE_VALUE()		{ return "value"; }	
	static	get	TYPE_STRING()		{ return "string"; }	
	static	get	TYPE_NUMBER()		{ return "number"; }	
	static	get	TYPE_BOOL()			{ return "bool"; }	

	constructor(_name, _type, _isOptional, _default)
	{
		this.__name = _name;
		this.__type = _type;
		this.__isOptional = _isOptional;
		this.__default = _default;
	}

	isOptional()
	{
		return this.__isOptional;
	}

	getDefaultValue()
	{
		return this.__default;
	}

	getName()
	{
		return this.__name;
	}

	getType()
	{
		return this.__type;
	}

	static	ParamAny(_name, _isOptional = false)
	{
		return new JsonProcessorMethodParam(_name, JsonProcessorMethodParam.TYPE_ANY, _isOptional, null);
	}

	static	ParamObject(_name, _isOptional = false)
	{
		return new JsonProcessorMethodParam(_name, JsonProcessorMethodParam.TYPE_OBJECT, _isOptional, null);
	}

	static	ParamList(_name, _isOptional = false)
	{
		return new JsonProcessorMethodParam(_name, JsonProcessorMethodParam.TYPE_LIST, _isOptional, []);
	}

	static	ParamValue(_name, _isOptional = false, _default = "")
	{
		return new JsonProcessorMethodParam(_name, JsonProcessorMethodParam.TYPE_VALUE, _isOptional, _default);
	}

	static	ParamString(_name, _isOptional = false, _default = "")
	{
		return new JsonProcessorMethodParam(_name, JsonProcessorMethodParam.TYPE_STRING, _isOptional, _default);
	}

	static	ParamNumber(_name, _isOptional = false, _default = 0)
	{
		return new JsonProcessorMethodParam(_name, JsonProcessorMethodParam.TYPE_NUMBER, _isOptional, _default);
	}

	static	ParamBool(_name, _isOptional = false, _defaultValue = false)
	{
		return new JsonProcessorMethodParam(_name, JsonProcessorMethodParam.TYPE_BOOL, _isOptional, _defaultValue);
	}	

	static	DefaultValue(_type)
	{
		switch(_type)
		{
			case JsonProcessorMethodParam.TYPE_LIST:	return [];
			case JsonProcessorMethodParam.TYPE_VALUE:	return "";
			case JsonProcessorMethodParam.TYPE_STRING:	return "";
			case JsonProcessorMethodParam.TYPE_NUMBER:	return 0;
			case JsonProcessorMethodParam.TYPE_BOOL:	return false;
			case JsonProcessorMethodParam.TYPE_ANY:
			case JsonProcessorMethodParam.TYPE_OBJECT:
			default:
				return null;
		}
	}

	static	GetType(_value)
	{
		// undefined?
		if (typeof _value === 'undefined')
			return JsonProcessorMethodParam.TYPE_ANY;
	
		// null?
		if (_value == null)
			return JsonProcessorMethodParam.TYPE_ANY;

		// object?
		if (CoreUtils.IsObject(_value) == true)
			return JsonProcessorMethodParam.TYPE_OBJECT;

		// list?
		if (CoreUtils.IsArray(_value) == true)
			return JsonProcessorMethodParam.TYPE_LIST;

		// string?
		if (CoreUtils.IsString(_value) == true)
			return JsonProcessorMethodParam.TYPE_STRING;

		// number?
		if (CoreUtils.IsNumber(_value) == true)
			return JsonProcessorMethodParam.TYPE_NUMBER;

		// boolean?
		if (typeof _value == "boolean")
			return JsonProcessorMethodParam.TYPE_BOOL;
			
		return JsonProcessorMethodParam.TYPE_ANY;
	}

	static	IsTypeOk(_type, _requestedType)
	{
		// same ones?
		if (_type == _requestedType)
			return true;
		
		// ANY? we accept all
		if (_requestedType == JsonProcessorMethodParam.TYPE_ANY)
			return true;
		
		// VALUE? we accept string, number and bool
		if (_requestedType == JsonProcessorMethodParam.TYPE_VALUE)
			return _type == JsonProcessorMethodParam.TYPE_STRING || _type == JsonProcessorMethodParam.TYPE_NUMBER || _type == JsonProcessorMethodParam.TYPE_BOOL;

		// nope
		return false;
	}
}

module.exports = {
	JsonProcessorMethodParam
};

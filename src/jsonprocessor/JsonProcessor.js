const { CoreUtils } = require("../utils/CoreUtils");
const { ObjUtils } = require("../utils/ObjUtils");
const { ArrayUtils } = require("../utils/ArrayUtils");
const { StringUtils } = require("../utils/StringUtils");
const { JsonProcessorMethods } = require("./JsonProcessorMethods");

class	JsonProcessor
{
	constructor(_jsonData)
	{
		// user cache: turn this to true to activate the cache
		this.__useCache = false;

		// contexts with data and cache associated. We need at least one!
		this.__contexts = [];
		this.pushContext(_jsonData);

		// build the methods
		this.__methods = JsonProcessorMethods.GetMethods();
	}

	getData()
	{
		return this.__contexts[this.__contexts.length-1].data;
	}

	getCache()
	{
		return this.__contexts[this.__contexts.length-1].cache;
	}

	pushContext(_data)
	{
		// add a new context
		this.__contexts.push({
			data: CoreUtils.Copy(_data),
			cache: {}
		});
	}

	popContext()
	{
		// make sure we dont get rid of the original one
		if (this.__contexts <= 1)
			return;
		
		// remove the last element
		this.__contexts.pop();
	}

	getValue(_path, _default=null)
	{
		return ObjUtils.GetValue(this.getData(), _path, _default);
	}

	getValueToInt(_path, _default = 0)
	{
		return ObjUtils.GetValueToInt(this.getData(), _path, _default);
	}

	getValueToFloat(_path, _default = 0)
	{
		return ObjUtils.GetValueToFloat(this.getData(), _path, _default);
	}

	getValueToBool(_path, _default = false)
	{
		return ObjUtils.GetValueToBool(this.getData(), _path, _default);
	}

	setValue(_field, _value, _addPrefix = true)
	{
		let	data = this.getData();
		if (data != null)
		{
			if (_addPrefix == true)
				data["_" + _field] = _value;
			else
				data[_field] = _value;
		}
	}

	define(_name, _instruction)
	{
		let	result = this.process(_instruction);
		this.setValue(_name, result);
		return result;
	}

	defineObject(_name, _keysAndInstructions)
	{
		// create a new object
		let	newObject = this.createObject(_keysAndInstructions);

		// set it
		this.setValue(_name, newObject);

		return newObject;
	}

	createObject(_keysAndInstructions)
	{
		// create a new object
		let	listValues = [];

		// create each value in the object
		for(const key in _keysAndInstructions)
		{
			listValues.push({
				"key": key,
				"value": this.process(_keysAndInstructions[key])
			});
		}

		// unflatten it
		let	newObject = ObjUtils.Unflatten(listValues);

		// return it
		return newObject;
	}

	defineList(_name, _listInstruction, _keysAndInstructions, _sortByFields)
	{
		// create a new list
		let	newList = [];
		
		// process the first instruction to get the list
		let	list = this.process(_listInstruction);

		// now we process each object in it
		for(let i=0; i<list.length; i++)
		{
			// push a new context based on this object
			this.pushContext(list[i]);

			// create a new object for it
			let	newObject = this.createObject(_keysAndInstructions);

			// add it
			newList.push(newObject);

			// remove the context
			this.popContext();
		}

		// sort the list?
		let	sortByValues = _sortByFields.split("|");
		let	sortedList = ArrayUtils.Sort(newList, sortByValues);

		// set it
		this.setValue(_name, sortedList);		

		return newList;
	}

	cacheContains(_instruction)
	{
		if (this.__useCache == true)
			return this.getCache().hasOwnProperty(_instruction);
		else
			return false;
	}	

	cacheGet(_instruction)
	{
		if (this.__useCache == true)
			return this.getCache()[_instruction];
		else
			return "";
	}

	cacheSet(_instruction, _value)
	{
		if (this.__useCache == true)
			this.getCache()[_instruction] = CoreUtils.Copy(_value);
	}

	process(_instruction)
	{
		// check the cache
		if (this.cacheContains(_instruction) == true)
		{
			return this.cacheGet(_instruction);
		}

		let	value = "";

		// is it the dollar sign? return the json data
		if (_instruction == "$")
		{
			value = this.getData();
		}
		// is it a static string?
		else if ( (_instruction.startsWith("'") == true) && (_instruction.endsWith("'") == true) )
		{
			value = _instruction.substring(1, _instruction.length - 1);

			// is it an accessor? Do we want to get the value? It needs to start with > and finish with <
			if ( (value.startsWith(">") == true) && (value.endsWith("<") == true) )
			{
				let	realInstruction = value.substring(1, value.length - 1);
				value = this.getValue(realInstruction, "");
			}
			else
			{
				value = StringUtils.ToAny(value);
			}
		}
		// otherwise it could be a method?
		else
		{
			// detect if it's a method
			let method = this.methodFromInstruction(_instruction);
			if (method != null)
			{
				// extract the parameters
				let params = StringUtils.ExtractParameters(_instruction);

				// is it an ALIAS?
				let	aliasInstruction = ObjUtils.GetValue(method, "alias", "");
				if (StringUtils.IsEmpty(aliasInstruction) == false)
				{
					// create the new instruction
					let	newInstruction = ObjUtils.SubstituteValuesInString(aliasInstruction, params, true);

					// process it
					value = this.process(newInstruction);
				}
				else
				{
					// process them
					let finalParams = [];
					for(let i=0; i<params.length; i++)
					{
						let valueBuf = this.process(params[i]);
						finalParams.push(valueBuf);
					}

					// process the method
					value = JsonProcessorMethods.Exe(method, finalParams);
				}
			}
			// no function? it's probably a value from the stats
			else
			{
				value = this.getValue(_instruction, "");
			}
		}

		// save it to the cache
		this.cacheSet(_instruction, value);

		return value;
	}

	methodFromInstruction(_instruction)
	{
		// ends with the parenthesis?
		if (_instruction.endsWith(")") == true)
		{
			// test each method
			for(const method in this.__methods)
			{
				// starts with it?
				if (_instruction.startsWith(method + "(") == true)
					return this.__methods[method];
			}
		}

		return null;
	}





	static	CreateFromJSON(_jsonData)
	{
		let	newProcessor = new JsonProcessor(_jsonData);

		return newProcessor;
	}

	static	CreateFromString(_jsonStr)
	{
		// parse the string
		let	jsonData = StringUtils.ToJSON(_jsonStr, true);
		if (jsonData == null)
			return null;
		else
			return JsonProcessor.CreateFromJSON(_jsonData);
	}
}

module.exports = {
	JsonProcessor
};

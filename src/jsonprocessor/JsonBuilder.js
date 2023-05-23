import { ObjUtils } from '../utils/ObjUtils';
import { StringUtils } from '../utils/StringUtils';
import { JsonProcessor } from './JsonProcessor';

class	JsonBuilder
{
	static	get	OPERATOR_SET()			{ return "="; }	
	static	get	OPERATOR_INC()			{ return "++"; }	
	static	get	OPERATOR_DEC()			{ return "--"; }	
	static	get	OPERATOR_ADD()			{ return "+="; }	
	static	get	OPERATOR_SUB()			{ return "-="; }	

	constructor()
	{
		// initialize the data
		this.reset();
	}

	reset()
	{
		this.__data = {
			in: {},
			out: {}
		};
	}

	getOutput()
	{
		return this.__data.out;
	}

	setValue(_path, _value, _operator = "=")
	{
		// we're going to determine the value depending on the operator
		let	newValue = _value;

		// depending on the operator
		// - INC?
		if (_operator == JsonBuilder.OPERATOR_INC)
		{
			newValue = this.getValueToNumber(_path, 0) + 1;
		}
		// - DEC?
		else if (_operator == JsonBuilder.OPERATOR_DEC)
		{
			newValue = this.getValueToNumber(_path, 0) - 1;
		}
		// - ADD?
		else if (_operator == JsonBuilder.OPERATOR_ADD)
		{
			newValue = this.getValueToNumber(_path, 0) + StringUtils.ToNumber(_value);
		}
		// - SUB?
		else if (_operator == JsonBuilder.OPERATOR_SUB)
		{
			newValue = this.getValueToNumber(_path, 0) - StringUtils.ToNumber(_value);
		}

		// set it
		this.__data = ObjUtils.SetValue(this.__data, _path, newValue);
	}

	getValue(_path, _default = "")
	{
		return ObjUtils.GetValue(this.__data, _path, _default);
	}

	getValueToNumber(_path, _default = 0)
	{
		return ObjUtils.GetValueToNumber(this.__data, _path, _default);
	}

	setInput(_obj)
	{
		this.__data.in = _obj;
	}

	processInstruction(_instruction)
	{
		if (StringUtils.IsEmpty(_instruction) == true)
			return "";
			
		// create a processor
		let	processor = JsonProcessor.CreateFromJSON(this.__data);

		// process it
		return processor.process(_instruction);
	}

	processPath(_path)
	{
		// do we contain the '['?
		let	chunks = _path.split("[");
		
		// nothing?
		if (chunks.length <= 1)
			return _path;
		// otherwise we're going to make sure we process it
		else
		{
			// extract the rest
			let	toProcess = chunks.splice(1).join('[');

			// does it contains "in"?
			toProcess = this.processPathForSection(toProcess, "in");

			// does it contains "out"?
			toProcess = this.processPathForSection(toProcess, "out");

			// rebuild the final path
			return chunks[0] + "[" + toProcess;
		}
	}

	processPathForSection(_path, _section)
	{
		// does it contains "in"?
		let	sectionCode = _section + ".";
		if (_path.includes(sectionCode) == true)
		{
			// flatten the IN parameters
			let	flatten = ObjUtils.Flatten(this.__data[_section], false, true, sectionCode);

			// replace them
			_path =	StringUtils.ReplaceAllMulti(_path, flatten);
			if (_section == "out")
			{

				console.log("New path = " + _section + " > " + _path);
				console.log(flatten);
			}
		}

		return _path;
	}

}

module.exports = {
	JsonBuilder
};
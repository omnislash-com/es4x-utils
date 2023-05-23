
class	MathUtils
{
	static	Min(_value1, _value2)
	{
		if (_value1 <= _value2)
			return _value1;
		else
			return _value2;
	}	

	static	Max(_value1, _value2)
	{
		if (_value1 >= _value2)
			return _value1;
		else
			return _value2;
	}	

	static	MinList(_list)
	{
		if (Array.isArray(_list) == false)
			return 0;

		let	valueFound = 0;
		let	valueFoundSet = false;
		for(let value of _list)
		{
			if (valueFoundSet == false)
			{
				valueFound = value;
				valueFoundSet = true;
			}
			else if (value < valueFound)
			{
				valueFound = value;
			}
		}

		return valueFound;
	}

	static	MaxList(_list)
	{
		if (Array.isArray(_list) == false)
			return 0;
			
		let	valueFound = 0;
		let	valueFoundSet = false;
		for(let value of _list)
		{
			if (valueFoundSet == false)
			{
				valueFound = value;
				valueFoundSet = true;
			}
			else if (value > valueFound)
			{
				valueFound = value;
			}
		}

		return valueFound;
	}

	static	MinMaxList(_list, _margin = 0)
	{
		let	min = 0;
		let	max = 0;
		let	set = false;
		if (Array.isArray(_list) == true)
		{
			for(let value of _list)
			{
				if (set == false)
				{
					min = value;
					max = value;
					set = true;
				}
				else
				{
					// max?
					if (value > max)
						max = value;
	
					// min?
					if (value < min)
						min = value;
				}
			}	
		}

		// margin?
		if (min == max)
		{
			min -= _margin;
			max += _margin;
		}
		
		return [min, max];
	}

	static	Abs(_value)
	{
		if (_value >= 0)
			return _value;
		else
			return - _value;
	}

	static	Round(_value, _decimals = 0)
	{
		if (_decimals == 0)
			return Math.round(_value);
		
		// calculate our divider
		let	divider = 10;
		for(let i=1; i<_decimals; i++)
			divider = divider * 10;
			
		// calculate it
		return Math.round(_value*divider)/divider;
	}

	static	RoundUp(_value, _multiple)
	{
		if (_value == 0)
			return 0;
		if (_multiple <= 1)
			return _value;

		// divide the value by the multiple
		let	newValue = _value / _multiple;

		// ceil it
		if (newValue >= 0)
			newValue = Math.ceil(newValue);
		else
			newValue = Math.floor(newValue);

		// multipy it again
		newValue = newValue * _multiple;

		return newValue;
	}

	static	FormatToK(_value, _doAbs = false)
	{
		// 0?
		if (_value == 0)
			return "0";

		// do abs?
		if (_doAbs == true)
			_value = MathUtils.Abs(_value);

		// round it
		let	roundedValue = MathUtils.RoundUp(_value, 1000);

		// divide by 1000
		roundedValue = roundedValue / 1000;

		// add a K at the end
		return roundedValue.toString() + "K";
	}

	static	FormatToKList(_list, _doAbs = false)
	{
		if (Array.isArray(_list) == false)
			return [];

		let	newList = [];
		for(let value of _list)
		{
			newList.push(MathUtils.FormatToK(value, _doAbs));
		}
		return newList;
	}

	static	FindScale(_list, _multiple = 1)
	{
		if (Array.isArray(_list) == false)
			return 0;
		if (_list.length == 0)
			return 0;

		// find the max and min
		let	max = MathUtils.MaxList(_list);
		let	min = MathUtils.MinList(_list);

		// make sure they're both positive
		max = MathUtils.Abs(max);
		min = MathUtils.Abs(min);

		// find the highest value
		let	scale = MathUtils.Max(min, max);

		// round it
		return MathUtils.RoundUp(scale, _multiple);
	}

	static	BuildScale(_list, _ticks = 0, _multiple = 1)
	{
		// find the scale from the list
		let	scale = MathUtils.FindScale(_list, _multiple);

		// 0?
		if (scale == 0)
			return [0];

		// otherwise we're going to build the list: -scale - ... - 0 - ... - +scale
		if (_ticks < 0)
			_ticks = 0;
		let	interval = scale / (_ticks + 1);
		
		// build the final list
		let	finalScale = [];
		let	nbValues = 3 + _ticks * 2;
		for(let i=0; i<nbValues; i++)
		{
			let	value = -scale + i*interval;
			finalScale.push(value);
		}

		return finalScale;
	}

	static	BuildScaleDomain(_list, _multiple = 1)
	{
		// find the scale from the list
		let	scale = MathUtils.FindScale(_list, _multiple);

		// 0?
		if (scale == 0)
			return [-_multiple, _multiple];
		else
			return [-scale, scale];		
	}

	static	Normalize(_value, _value0, _value1)
	{
		if (_value0 == _value1)
			return 0;
		let result = (_value - _value0) / (_value1 - _value0);

		return MathUtils.Clamp01(result);		
	}

	static	Clamp01(_value)
	{
		if (_value <= 0)
			return 0;
		else if (_value >= 1)
			return 1;
		else
			return _value;
	}

	static	RandomInt(_min, _max)
	{
		_min = Math.ceil(_min);
		_max = Math.floor(_max);
		return Math.floor(Math.random() * (_max - _min) + _min); //The maximum is exclusive and the minimum is inclusive
	}

	static	RandomIntInclusive(_min, _max)
	{
		_min = Math.ceil(_min);
		_max = Math.floor(_max);
		return Math.floor(Math.random() * (_max - _min + 1) + _min); //The maximum is inclusive and the minimum is inclusive
	}

	static	Div(_v1, _v2)
	{
		if (_v2 == 0)
			return 0;

		return _v1 / _v2;
	}

	static	DoCalculation(_value1, _value2, _calc = "+")
	{
		// ADD
		if (_calc == "+")
			return _value1 + _value2;
		// SUB
		else if (_calc == "-")
			return _value1 - _value2;
		// MUL
		else if (_calc == "*")
			return _value1 * _value2;
		// DIV
		else if (_calc == "/")
		{
			if (_value2 != 0)
				return _value1 / _value2;
			else
				return 0;
		}
		else
			return _value1 + _value2;
	}
}

module.exports = {
	MathUtils
};
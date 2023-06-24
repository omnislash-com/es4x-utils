const { CoreUtils } = require("../utils/CoreUtils");

class	ArrayUtils
{
	static	IsEmpty(_array)
	{
		// is it an array?
		if (CoreUtils.IsArray(_array) == true)
			return _array.length == 0;
		else
			return true;
	}

	static	Sort(_array, _sortByFields)
	{
		// no fields?
		if (_sortByFields.length == 0)
			return _array;
		
		return _array.sort(function(a, b) {

			let diff = 0;
			for(let i=0; i<_sortByFields.length; i++)
			{
				// different? we return
				let fieldToCheck = _sortByFields[i];

				// type of search ascending?
				if (fieldToCheck.startsWith('-') == true)
				{
					fieldToCheck = fieldToCheck.substr(1);
					diff = parseFloat(a[fieldToCheck]) - parseFloat(b[fieldToCheck]);
				}
				else
				{
					diff = parseFloat(b[fieldToCheck]) - parseFloat(a[fieldToCheck]);
				}

				if (diff != 0)
					break;
			}

			return diff;
		});
	}

	static	EnsureUnique(_array)
	{
		let	finalArray = [];
		for(let item of _array)
		{
			if (finalArray.includes(item) == false)
				finalArray.push(item);
		}
		return finalArray;
	}

	static	MergeUnique(_array1, _array2)
	{
		for(let i=0; i<_array2.length; i++)
		{
			if (_array1.includes(_array2[i]) == false)
				_array1.push(_array2[i]);
		}
		return _array1;
	}

	static	FindMissingEntries(_array, _newArray)
	{
		// check the inputs
		if (ArrayUtils.IsEmpty(_newArray) == true)
			return [];
		if (ArrayUtils.IsEmpty(_array) == true)
			return _newArray;

		let	missingEntries = [];
		for(let entry of _newArray)
		{
			if (_array.includes(entry) == false)
				missingEntries.push(entry);
		}
		return missingEntries;
	}

	static	Reverse(_list)
	{
		let	newList = [];

		if (CoreUtils.IsArray(_list) == true)
		{
			for(let i=_list.length-1; i>=0; i--)
			{
				newList.push(_list[i]);
			}
		}

		return newList;
	}

	static	FillWithColor(_count, _color = "#FFFFFF")
	{
		let	colors = [];
		let	currentOpacity = 100;
		let	lowestOpacity = 20;
		let	opacityStep = (currentOpacity - lowestOpacity) / (_count - 1);
		for(let i=0; i<_count; i++)
		{
			// convert the opacity to HEXA
			let	alpha = Math.round(currentOpacity / 100 * 255);
			let	alphaHex = alpha.toString(16);
			
			// add it
			colors.push(_color + alphaHex.toUpperCase());

			// decrement
			currentOpacity -= opacityStep;
			if (currentOpacity < 0)
				currentOpacity = 0;
		}

		return colors;
	}

	static	Fill(_count, _start=0, _step=1)
	{
		let	newList = [];
		for(let i=0; i<_count; i++)
		{
			newList.push(_start + _step*i);
		}
		return newList;
	}

	static	InvertValues(_list, _max)
	{
		let	newList = [];

		if (CoreUtils.IsArray(_list) == true)
		{
			for(let i=0; i<_list.length; i++)
			{
				if (CoreUtils.IsNumber(_list[i]) == true)
				{
					newList.push(_max - _list[i]);
				}
				else
				{
					newList.push(_list[i]);
				}
			}
		}

		return newList;
	}	

	static	ConvertElementsToString(_list)
	{
		let	newList = [];

		if (CoreUtils.IsArray(_list) == true)
		{
			for(let i=0; i<_list.length; i++)
			{
				newList.push(CoreUtils.ToString(_list[i]));
			}
		}

		return newList;
	}	

	static	Compare(_array1, _array2)
	{
		// different size?
		if (_array1.length != _array2.length)
			return false;
		
		// they are the same size, all elements in the first one must be in the second one
		for(let i=0; i<_array1.length; i++)
		{
			if (_array2.includes(_array1[i]) == false)
				return false;
		}

		// vice versa
		for(let i=0; i<_array2.length; i++)
		{
			if (_array1.includes(_array2[i]) == false)
				return false;
		}

		return true;
	}
};

module.exports = {
	ArrayUtils
};

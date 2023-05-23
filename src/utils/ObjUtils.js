const { CoreUtils } = require("./CoreUtils");
const { ArrayUtils } = require("./ArrayUtils");
const { StringUtils } = require("./StringUtils");
const { MathUtils } = require("./MathUtils");

class	ObjUtils
{
	/**
	 * @param {object} _dest: Object where to add the new fields
	 * @param {object} _fields: Object containing the fields to add
	 */
	static	AddFields(_dest, _fields)
	{
		// if not null
		if (_fields != null)
		{
			// add each one of them
			for(const property in _fields)
			{
				_dest[property] = _fields[property];
			}
		}

		return _dest;
	}

	/**
	 * @param {object} _obj: Object to join the fields
	 * @param {string} _delimiterValue: delimiter to use between key = value
	 * @param {string} _delimiterObj: delimiter to use between each new key
	 * @param {boolean} _escapeURI: if TRUE, it'll be escaped for URI
	 */	
	static	Join(_obj, _delimiterValue, _delimiterObj, _escapeURI = true)
	{
		let	output = "";

		// is the object valid?
		if (_obj != null)
		{
			let	i = 0;
			for(const key in _obj)
			{
				// add the delimiter between each field?
				if (i > 0)
					output += _delimiterObj;
				
				// join the property and value
				if (_escapeURI == true)
					output += encodeURIComponent(key) + _delimiterValue + encodeURIComponent(_obj[key]);
				else
					output += key + _delimiterValue + _obj[key];

				// increment i
				i++;
			}
		}

		return output;
	}

	static	CopyFieldsOnly(_obj, _fieldsToKeep)
	{
		let	newObj = {};
		let	nbErrors = 0;

		// copy each field
		for(const key in _fieldsToKeep)
		{
			let	value = ObjUtils.GetValue(_obj, key, _fieldsToKeep[key]);
			if (value != null)
				newObj[key] = value;
			else
				nbErrors++;
		}

		if (nbErrors == 0)
			return newObj;
		else
			return null;
	}

	static	CopyAndRenameFieldsOnly(_obj, _fieldsToKeep)
	{
		let	newObj = {};

		// copy each field
		for(const key in _fieldsToKeep)
		{
			let	value = ObjUtils.GetValue(_obj, key, null);
			if (value != null)
			{
				// determine the new key
				let	newKey = StringUtils.IsEmpty(_fieldsToKeep[key]) ? key : _fieldsToKeep[key];

				// set the value
				newObj[newKey] = value;
			}
		}

		return newObj;
	}

	static	CopyFieldsOnlyFromList(_obj, _fieldsToKeepList)
	{
		let	newObj = {};

		// do we need to copy all?
		let	copyAll = _fieldsToKeepList.includes("*");

		// do we need to copy all
		if (copyAll == true)
			return CoreUtils.Copy(_obj);
		
		// do key per key
		for(let key of _fieldsToKeepList)
		{
			// check for rename factor
			let	chunks = key.split(":");
			let	keySrc = chunks[0].trim();
			if ( (keySrc.startsWith("*") == true) || (keySrc.startsWith("@") == true) )
				keySrc = keySrc.substring(1);

			// get the value
			let	value = ObjUtils.GetValue(_obj, keySrc, null);
			if (value != null)
			{
				newObj = ObjUtils.SetValue(newObj, keySrc, value);
			}
		}

		return newObj;
	}	

	static	GetValueToBool(_obj, _path, _default=false)
	{
		return StringUtils.ToBool(ObjUtils.GetValue(_obj, _path, _default));
	}

	static	GetValueToInt(_obj, _path, _default=0)
	{
		return StringUtils.ToInt(ObjUtils.GetValue(_obj, _path, _default));
	}

	static	GetValueToIntInRange(_obj, _path, _min, _max, _default=0)
	{
		// get the value to int
		let	value = ObjUtils.GetValueToInt(_obj, _path, _default);
		if (value < _min)
			value = _min;
		else if (value > _max)
			value = _max;
		return value;
	}	

	static	GetValueToNumber(_obj, _path, _default=0)
	{
		return CoreUtils.ToNumber(ObjUtils.GetValue(_obj, _path, _default));
	}

	static	GetValueToFloat(_obj, _path, _default=0)
	{
		return StringUtils.ToFloat(ObjUtils.GetValue(_obj, _path, _default));
	}

	static	GetValueToString(_obj, _path, _default = "")
	{
		// get the value
		let	value = ObjUtils.GetValue(_obj, _path, _default);

		// cast it to string
		return CoreUtils.ToString(value);
	}

	static	GetValue(_obj, _path, _default = null)
	{
		// object is valid and we have a key?
		if ( (CoreUtils.IsValid(_obj) == true) && (_path != "") )
		{
			// make sure we have a string
			_path = _path.toString();

			// is this an array?
			if (CoreUtils.IsArray(_obj) == true)
			{
				// does it start with the index?
				if (_path.startsWith("[") == true)
				{
					// split the key with '.'
					let keys = _path.split('.');
					let first_key = keys.shift();

					// do we need the value right away? "[0]"
					let	arrayPathInfo = ObjUtils.GetArrayIndexFromPathWithObject(first_key, _obj);
					if (arrayPathInfo != null)
					{
						if (StringUtils.IsEmpty(arrayPathInfo.path) == true)
						{
							if ( (arrayPathInfo.index >= 0) && (arrayPathInfo.index < _obj.length) )
							{
								// get the content
								let	content = _obj[arrayPathInfo.index];

								// do we need to go into it?
								if (keys.length > 0)
								{
									let new_key = keys.join('.');
									return ObjUtils.GetValue(content, new_key, _default);
								}
								else
									return content;
							}
							else
								return _default;
						}
					}
				}
				// otherwise we combine it
				else
				{
					let	combinedArray = [];
					for(let i=0; i<_obj.length; i++)
					{
						// get the value
						let	valueBuf = ObjUtils.GetValue(_obj[i], _path, _default);
						if (valueBuf != null)
						{
							// if the returned value is an array, we concat
							if (CoreUtils.IsArray(valueBuf) == true)
							{
								combinedArray = combinedArray.concat(valueBuf);
							}
							// otherwise we just add it
							else
							{
								combinedArray.push(valueBuf);
							}
						}
					}
					return combinedArray;
				}
			}

			// quickly check if we have it?
			if (ObjUtils.HasProperty(_obj, _path) == true)
				return _obj[_path];

			// split the key with '.'
			let keys = _path.split('.');
	
			// do we have one?
			if (keys.length >= 1)
			{
				// get the first key
				let first_key = keys.shift();
				let array_index = null;
	
				// is it an array index?
				let	arrayPathInfo = ObjUtils.GetArrayIndexFromPathWithObject(first_key, _obj);
				if (arrayPathInfo != null)
				{
					first_key = arrayPathInfo.path;
					array_index = arrayPathInfo.index;
				}
	
				// do we have that key in the object?
				if (ObjUtils.HasProperty(_obj, first_key) == true)
				{
					// last key and not valid?
					if ( (keys.length == 0) && (CoreUtils.IsValid(_obj[first_key]) == false) )
						return _default;
	
					// is it a value in the array?
					if (array_index != null)
					{
						if (ObjUtils.HasProperty(_obj[first_key], array_index) == false)
							return _default;
					}
	
					// if we don't have any other key, we return it
					if (keys.length == 0)
					{
						if (array_index != null)
							return _obj[first_key][array_index];
						else
							return _obj[first_key];
					}
					else
					{
						// build the remaining of the keys
						let new_key = keys.join('.');
	
						// call us again!
						if (array_index != null)
							return ObjUtils.GetValue(_obj[first_key][array_index], new_key, _default);
						else
							return ObjUtils.GetValue(_obj[first_key], new_key, _default);
					}
				}
			}
		}
	
		// error somewhere
		return _default;
	}

	static	SetValue(_obj, _path, _value, _createIfNull = true, _appendToArray = false)
	{
		// path empty?
		if (StringUtils.IsEmpty(_path) == true)
			return _obj;

		// is the object an array?
		if (CoreUtils.IsArray(_obj) == true)
		{
			for(let i=0; i<_obj.length; i++)
			{
				_obj[i] = ObjUtils.SetValue(_obj[i], _path, _value);
			}
			return _obj;
		}

		// split it with "."
		let	chunks = _path.split(".");
		let	fieldToEdit = chunks[chunks.length-1];

		// get the object before
		let	subPath = "";
		let	subObject = _obj;
		if (chunks.length >= 2)
		{
			// create the subpath
			subPath = chunks.splice(0, chunks.length-1).join(".");

			// get the object
			subObject = ObjUtils.GetValue(_obj, subPath, null);

			// that object doesn't exist?
			if (subObject == null)
			{
				if (_createIfNull == true)
					subObject = {};
				else
					return _obj;
			}
		}

		// ensure sub object is an object
		if (CoreUtils.IsValid(subObject) == false)
			subObject = {};

		// if it's not an object, we exit
		if (CoreUtils.IsObject(subObject) == false)
			return _obj;

		// are we editing an array?
		let	arrayPathInfo = ObjUtils.GetArrayIndexFromPathWithObject(fieldToEdit, subObject, true);
		if (arrayPathInfo != null)
		{
			// get the object
			let	arrayToSet = ObjUtils.GetValue(subObject, arrayPathInfo.path, []);

			// if it's a proper array
			if (CoreUtils.IsArray(arrayToSet) == true)
			{
				// get the index
				let	indexToUse = arrayPathInfo.index;

				// make sure we have enough index
				while(arrayToSet.length < indexToUse)
					arrayToSet.push(null);

				// set the item in the array
				arrayToSet[indexToUse] = _value;

				// set the array in the object
				subObject[arrayPathInfo.path] = arrayToSet;
			}
			else
				return _obj;
		}
		else
		{
			// if we need to append an array, we check for things
			if (_appendToArray == true)
			{
				// initialize the array
				if (ObjUtils.HasProperty(subObject, fieldToEdit) == false)
					subObject[fieldToEdit] = [];
				if (CoreUtils.IsNull(subObject[fieldToEdit]) == true)
					subObject[fieldToEdit] = [];

				// if it's an array and the value is not null
				if ( (CoreUtils.IsArray(subObject[fieldToEdit]) == true) && (CoreUtils.IsNull(_value) == false) )
				{
					// if it's an array
					if (CoreUtils.IsArray(_value) == true)
					{
						subObject[fieldToEdit] = subObject[fieldToEdit].concat(_value);
					}
					else
					{
						subObject[fieldToEdit].push(_value);
					}
				}
			}
			else
			{
				// set the value
				subObject[fieldToEdit] = _value;
			}
		}

		// if we have a sub path, we recursively set it
		if (StringUtils.IsEmpty(subPath) == false)
			return ObjUtils.SetValue(_obj, subPath, subObject);
		else
			return subObject;
	}

	static	GetArrayIndexFromPathWithObject(_path, _obj, _canCreate = false)
	{
		// first we extract the information from the path
		let	arrayPathInfo = StringUtils.GetArrayIndexFromPath(_path);
		if (arrayPathInfo == null)
			return null;

		// get the array
		let	list = StringUtils.IsEmpty(arrayPathInfo.path) ? _obj : ObjUtils.GetValue(_obj, arrayPathInfo.path, []);

		// if the index is empty, we search within the object
		let	notFound = false;
		let	realIndex = arrayPathInfo.index;
		if (realIndex < 0)
		{
			// now we search for the index
			realIndex = ObjUtils.FindFirst(list, arrayPathInfo.search.field, arrayPathInfo.search.value, "==", null, true);
			if (realIndex < 0)
				notFound = true;
		}
		// does it have an action?
		else if (StringUtils.IsEmpty(arrayPathInfo.action) == false)
		{
			// if it's empty we don't have anything
			if (ArrayUtils.IsEmpty(list) == true)
				notFound = true;

			// FIRST?
			if (arrayPathInfo.action == StringUtils.ARRAY_ACTION_FIRST)
				realIndex = 0;
			// LAST
			else if (arrayPathInfo.action == StringUtils.ARRAY_ACTION_LAST)
				realIndex = list.length - 1;
			// NEW?
			else if (arrayPathInfo.action == StringUtils.ARRAY_ACTION_NEW)
				notFound = true;
		}

		// not found?
		if (notFound == true)
		{
			// if we can create, we set the index to the end
			if (_canCreate == true)
				realIndex = list.length;
			else
				return null;
		}

		return {
			"path": arrayPathInfo.path,
			"index": realIndex
		};
	}

	static	Flatten(_obj, _convertToString = false, _flattenArray = false, _prefix = "")
	{
		let	newObject = {};

		// object is valid?
		if (CoreUtils.IsValid(_obj) == true)
		{
			// for each key in the object
			for(const key in _obj)
			{
				// get the value
				let	value = _obj[key];

				// is it an object?
				if (CoreUtils.IsObject(value) == true)
				{
					// flatten that object
					let	subObject = ObjUtils.Flatten(value, _convertToString, _flattenArray);

					// add all the fields
					for(const subKey in subObject)
					{
						let	newKey = key + "." + subKey;
						newObject[_prefix + newKey] = subObject[subKey];
					}
				}
				// is it an array?
				else if (CoreUtils.IsArray(value) == true)
				{
					// are we flattening the array?
					if (_flattenArray == true)
					{
						// put each value
						for(let i=0; i<value.length; i++)
						{
							// flatten the content
							let	subObject = ObjUtils.Flatten(value[i], _convertToString, _flattenArray);

							// add all the fields
							for(const subKey in subObject)
							{
								let	newKey = key + "[" + i + "]." + subKey;
								newObject[_prefix + newKey] = subObject[subKey];
							}
						}
					}
					else
					{
						// are we converting to string?
						if (_convertToString == true)
							value = CoreUtils.ToString(value);

						newObject[_prefix + key] = value;
					}
				}
				// if not, we just set the value
				else
				{
					// are we converting to string?
					if (_convertToString == true)
						value = CoreUtils.ToString(value);
					
					newObject[_prefix + key] = value;
				}
			}
		}

		return newObject;
	}

	static	ConvertToFieldValueList(_obj)
	{
		// first we flatten the object
		let	flattenObj = ObjUtils.Flatten(_obj);

		// now we convert the dictionnary to a list of object with key and value fields
		let	listObj = [];
		for(const key in flattenObj)
		{
			listObj.push({
				'field': key,
				'value': flattenObj[key]
			});
		}
		return listObj;
	}

	static	ConvertToFieldValueListAndSort(_obj, _sortOrder = "")
	{
		// first we convert
		let	newList = ObjUtils.ConvertToFieldValueList(_obj);

		// now we sort
		let	fieldToSort = _sortOrder + "value";
		let	sortedList = ArrayUtils.Sort(newList, [fieldToSort]);

		// return it
		return sortedList;
	}

	static	RemoveAttributes(_obj, _attributes)
	{
		for(let i=0; i<_attributes.length; i++)
		{
			if (ObjUtils.HasProperty(_obj, _attributes[i]) == true)
				delete _obj[_attributes[i]];
		}
		return _obj;
	}

	static	Merge(_obj, _additionalFieldsObj, _overwrite = true)
	{
		if (CoreUtils.IsValid(_obj) == false)
			_obj = {};
		if (CoreUtils.IsValid(_additionalFieldsObj) == false)
			return _obj;

		// loop for the fields and set them
		for(const key in _additionalFieldsObj)
		{
			// if we don't want to override we need to make sure it doesnt exist
			if (_overwrite == false)
			{
				if (ObjUtils.HasProperty(_obj, key) == false)
					_obj[key] = _additionalFieldsObj[key];
			}
			else
				_obj[key] = _additionalFieldsObj[key];
		}

		return _obj;
	}

	static	HasProperty(_obj, _key)
	{
		return CoreUtils.IsValid(_obj[_key]);
	}

	static	HasKeys(_obj)
	{
		return ObjUtils.CountKeys(_obj) !== 0;
	}

	static	Keys(_obj)
	{
		if (CoreUtils.IsValid(_obj) == false)
			return [];
		return Object.keys(_obj);
	}

	static	CountKeys(_obj)
	{
		if (CoreUtils.IsValid(_obj) == false)
			return 0;
		return Object.keys(_obj).length;
	}

	static	SortArrayInObject(_obj, _arrayKey, _sortByFields)
	{
		if (ObjUtils.HasProperty(_obj, _arrayKey) == true)
		{
			_obj[_arrayKey] = ArrayUtils.Sort(_obj[_arrayKey], _sortByFields);
		}

		return _obj;
	}	

	static	DuplicateListInObject(_obj, _arrayKey, _newArrayKey)
	{
		let newList = [];
		let	existingList = ObjUtils.GetValue(_obj, _arrayKey, []);
		for(let i=0; i<existingList.length; i++)
		{
			newList.push(existingList[i]);
		}
		_obj[_newArrayKey] = newList;

		return _obj;
	}	

	static	ToArrayOfField(_arrayOfObjects, _field)
	{
		let	finalArray = [];
		if (CoreUtils.IsArray(_arrayOfObjects) == true)
		{
			for(let i=0; i<_arrayOfObjects.length; i++)
			{
				let	value = ObjUtils.GetValue(_arrayOfObjects[i], _field, null);
				if (value != null)
					finalArray.push(value);
			}
		}
		return finalArray;
	}

	static	ToArrayOfFieldWithIndexes(_arrayOfObjects, _field)
	{
		// make the list of ids and save the index of objects with it
		let	ids = [];
		let	itemsWithReference = [];
		for(let i=0; i<_arrayOfObjects.length; i++)
		{
			let	id = ObjUtils.GetValue(_arrayOfObjects[i], _field, 0);
			if (id > 0)
			{
				if (ids.includes(id) == false)
				ids.push(id);
				itemsWithReference.push(i);
			}
		}		

		return {
			"ids": ids,
			"indexes": itemsWithReference
		};
	}

	static	ArrayToDictionary(_list, _keyField)
	{
		let	obj = {};
		for(let i=0; i<_list.length; i++)
		{
			let	id = ObjUtils.GetValue(_list[i], _keyField, null);
			if (id != null)
				obj[id] = _list[i];
		}
		return obj;
	}

	static	ReplaceIdWithObjectInList(_items, _indexes, _objects, _field)
	{
		for(let i=0; i<_indexes.length; i++)
		{
			// get the index
			let	itemIndex = _indexes[i];

			// get the id of the object
			let	id = ObjUtils.GetValue(_items[itemIndex], _field, null);

			// set it
			_items[itemIndex][_field] = ObjUtils.GetValue(_objects, id, null);
		}		

		return _items;
	}

	static	BuildListOfObjectsFromIdAndDict(_ids, _dict)
	{
		if (CoreUtils.IsArray(_ids) == false)
			return [];
		if (_ids.length == 0)
			return [];
		if (ObjUtils.HasKeys(_dict) == false)
			return [];

		let	finalList = [];
		for(let i=0; i<_ids.length; i++)
		{
			if (_dict.hasOwnProperty(_ids[i]) == true)
				finalList.push(_dict[_ids[i]]);
		}
		return finalList;
	}

	static	GetValueRecursive(_obj, _field, _depthMax = -1, _objKeys = [])
	{
		let	values = [];

		// have we reached the depth?
		if (_depthMax == 0)
			return values;

		// are we an array?
		if (CoreUtils.IsArray(_obj) == true)
		{
			for(let i=0; i<_obj.length; i++)
			{
				// get the values
				let	subValues = ObjUtils.GetValueRecursive(_obj[i], _field, _depthMax - 1, _objKeys);

				// insert them in ours
				values = ArrayUtils.MergeUnique(values, subValues);				
			}
		}
		// are we an object?
		else if (CoreUtils.IsObject(_obj) == true)
		{
			for(const key in _obj)
			{
				// is it another object? If yes, we go in it
				if ( (CoreUtils.IsObject(_obj[key]) == true) || (CoreUtils.IsArray(_obj[key]) == true) )
				{
					// we are going to see inside if the the object has the key
					let	goInside = true;
					if (_objKeys.length > 0)
					{
						if ( (CoreUtils.IsObject(_obj[key]) == true) && (_objKeys.includes(key) == false) )
							goInside = false;
					}

					if (goInside == true)
					{
						// get the values
						let	subValues = ObjUtils.GetValueRecursive(_obj[key], _field, _depthMax - 1, _objKeys);

						// insert them in ours
						values = ArrayUtils.MergeUnique(values, subValues);
					}
				}
				else
				{
					// is it the key we're looking for? and we're not null?
					if ( (key == _field) && (_obj[key] != null) )
					{
						// try to add it
						if (values.includes(_obj[key]) == false)
							values.push(_obj[key]);
					}
				}
			}
		}

		return values;
	}

	static	ReplaceValueRecursive(_obj, _field, _replaceDict, _targetField, _default = null, _depthMax = -1)
	{
		// have we reached the depth?
		if (_depthMax == 0)
			return _obj;

		// are we an array?
		if (CoreUtils.IsArray(_obj) == true)
		{
			for(let i=0; i<_obj.length; i++)
			{
				_obj[i] = ObjUtils.ReplaceValueRecursive(_obj[i], _field, _replaceDict, _targetField, _default, _depthMax - 1);
			}
		}
		// are we an object?
		else if (CoreUtils.IsObject(_obj) == true)
		{
			for(const key in _obj)
			{
				// is it another object? If yes, we go in it
				if ( (CoreUtils.IsObject(_obj[key]) == true) || (CoreUtils.IsArray(_obj[key]) == true) )
				{
					_obj[key] = ObjUtils.ReplaceValueRecursive(_obj[key], _field, _replaceDict, _targetField, _default, _depthMax - 1);
				}
				else
				{
					// is it the key we're looking for? and we're not null?
					if ( (key == _field) && (_obj[key] != null) )
					{
						// retrieve the content
						let	content = ObjUtils.GetValue(_replaceDict, _obj[key], _default);

						// if the target field is empty, we just copy the fields there
						if (StringUtils.IsEmpty(_targetField) == true)
						{
							_obj = ObjUtils.Merge(_obj, content);
						}
						else
						{
							// replace it
							_obj[_targetField] = content;
						}
					}
				}
			}
		}
		
		return _obj;
	}

	static	EnsureStringsNotNull(_obj, _keys)
	{
		for(let i=0; i<_keys.length; i++)
		{
			// get the value
			let	value = ObjUtils.GetValue(_obj, _keys[i], "");

			// ensure its not null
			value = StringUtils.EnsureNotNull(value);

			// save it
			_obj[_keys[i]] = value;
		}

		return _obj;
	}

	static	SubstituteValuesInString(_str, _obj, _objIsArray = false)
	{
		if (StringUtils.IsEmpty(_str) == true)
			return "";
		
		return _str.replace(/\{\{(.*?)\}\}/g, function (placeholder, capturedText, matchingIndex, inputString)
		{
			// find the value to search and default value
			let	key = capturedText;
			let	defaultValue = "";

			// split with '|'
			let	chunks = capturedText.split("|");
			if (chunks.length == 2)
			{
				key = chunks[0];
				defaultValue = chunks[1];
			}

			// if the object is an array, the key is the index
			if (_objIsArray == true)
			{
				let	index = StringUtils.ToInt(key);
				if ( (index >= 0) && (index < _obj.length) )
					return _obj[index];
				else 
					return defaultValue;
			}
			else
			{
				return ObjUtils.GetValue(_obj, key, defaultValue);
			}
		});
	}

	static	ExtractValuesToString(_obj, _fieldsToExtract)
	{
		// create a new object
		let	newObject = {};

		// nothing to extract?
		if (CoreUtils.IsObject(_fieldsToExtract) == false)
			return newObject;

		// process each field
		for(const key in _fieldsToExtract)
		{
			// get the value
			let	value = ObjUtils.GetValue(_obj, key, "");

			// convert it to string
			value = CoreUtils.ToString(value);

			// set it
			newObject[_fieldsToExtract[key]] = value;
		}

		return newObject;
	}

	static	Unflatten(_listValues)
	{
		// create a new object
		let	newObject = {};

		// make the list of sub keys to do and arrays
		let	subObjects = {
		};

		// go through all the values
		for(let i=0; i<_listValues.length; i++)
		{
			let	key = ObjUtils.GetValue(_listValues[i], "key", "");
			let	value = ObjUtils.GetValue(_listValues[i], "value", null);

			if ( (StringUtils.IsEmpty(key) == false) && (value != null) )
			{
				// split with the field separator "."
				let	chunks = key.split(".");

				// do we have only one chunk? we just get the value
				if (chunks.length == 1)
				{
					// get the value
					let	valueToInsert = StringUtils.ToJSON(value);

					// is it part of an array?
					let	arrayInfo = ObjUtils.IsKeyArray(key);
					if (arrayInfo.is_array == true)
					{
						// make sure we have the array
						if (newObject.hasOwnProperty(arrayInfo.key) == false)
							newObject[arrayInfo.key] = [];
						
						// make sure we have the right size to insert this new object
						let	nbMissing = arrayInfo.array_index + 1 - newObject[arrayInfo.key].length;
						for(let j=0; j<nbMissing; j++)
							newObject[arrayInfo.key].push(null);
						
						// add the new value
						newObject[arrayInfo.key][arrayInfo.array_index] = valueToInsert;
					}
					else
					{
						newObject[key] = valueToInsert;
					}
				}
				// it's in a sub object
				else
				{
					// get the key of the sub object
					let	subObjectKey = chunks[0];

					// prepare the data to insert
					let	subObjectValue = {
						"key": chunks.slice(1).join("."),
						"value": value
					};

					// look if the key is an array
					let	arrayInfo = ObjUtils.IsKeyArray(subObjectKey);
					
					// if we don't have that sub object, we init an empty array
					if (subObjects.hasOwnProperty(arrayInfo.key) == false)
					{
						subObjects[arrayInfo.key] = {
							"is_array": arrayInfo.is_array,
							"data": []
						};
					}

					// if it's an array
					if (arrayInfo.is_array == true)
					{
						// make sure we have the right number of items
						let	nbMissing = arrayInfo.array_index + 1 - subObjects[arrayInfo.key].data.length;
						for(let j=0; j<nbMissing; j++)
							subObjects[arrayInfo.key].data.push([]);

						// now we add that instruction
						subObjects[arrayInfo.key].data[arrayInfo.array_index].push(subObjectValue);
					}
					// just an object
					else
					{
						// create a new key / value for that sub object
						subObjects[arrayInfo.key].data.push(subObjectValue);
					}
				}
			}
		}

		// now we create the sub objects recursively
		for(const subObjectKey in subObjects)
		{
			// is it an array?
			if (subObjects[subObjectKey].is_array == true)
			{
				newObject[subObjectKey] = [];
				for(let j=0; j<subObjects[subObjectKey].data.length; j++)
				{
					let	newArrayObject = ObjUtils.Unflatten(subObjects[subObjectKey].data[j]);
					newObject[subObjectKey].push(newArrayObject);
				}
			}
			// just an object
			else
			{
				newObject[subObjectKey] = ObjUtils.Unflatten(subObjects[subObjectKey].data);
			}
		}

		return newObject;
	}

	static	IsKeyArray(_key)
	{
		let	isArray = false;
		let	key = _key;
		let	index = -1;
		if (_key.endsWith("]") == true)
		{
			let	arrayChunks = _key.split("[");
			if (arrayChunks.length == 2)
			{
				// extract the key and array index
				key = arrayChunks[0];
				index = StringUtils.ToInt(arrayChunks[1].slice(0, -1));
				isArray = true;
			}
		}

		return {
			"is_array": isArray,
			"key": key,
			"array_index": index
		};
	}

	static	GroupBy(_list, _key)
	{
		let	keysIndex = {};
		let	finalList = [];

		for(let i=0; i<_list.length; i++)
		{
			// do we have that one already?
			let	keyValue = ObjUtils.GetValueToString(_list[i], _key);
			if (StringUtils.IsEmpty(keyValue) == false)
			{
				// do we have it already?
				if (keysIndex.hasOwnProperty(keyValue) == false)
				{
					// add an empty object and save the index
					finalList.push([]);

					keysIndex[keyValue] = finalList.length-1;
				}

				// merge the objects
				finalList[keysIndex[keyValue]].push(_list[i]);
			}
		}

		return finalList;			
	}

	static	CompareValues(_comparison, _value1, _value2, _forceString = false)
	{
		if (CoreUtils.IsValid(_value1) == false)
			_value1 = "";
		if (CoreUtils.IsValid(_value2) == false)
			_value2 = "";

		// one of them is a number?
		if ( ((CoreUtils.IsNumber(_value1) == true) || (CoreUtils.IsNumber(_value2) == true)) && (_forceString == false) )
		{
			_value1 = CoreUtils.ToNumber(_value1);
			_value2 = CoreUtils.ToNumber(_value2);
		}
		else
		{
			_value1 = _value1.toString().toLowerCase().trim();
			_value2 = _value2.toString().toLowerCase().trim();
		}

		// EQUALS
		if ( (_comparison == "==") || (_comparison == "=") )
			return _value1 == _value2;
		// DIFFERENT
		else if ( (_comparison == "!=") || (_comparison == "<>") )
			return _value1 != _value2;
		// GREATHER THAN
		else if (_comparison == ">")
			return _value1 > _value2;
		// GREATHER THAN or EQUALS
		else if (_comparison == ">=")
			return _value1 >= _value2;
		// LOWER THAN
		else if (_comparison == "<")
			return _value1 < _value2;
		// LOWER THAN or EQUALS
		else if (_comparison == "<=")
			return _value1 <= _value2;
		else
		{
			// STRING? €
			if ( (CoreUtils.IsString(_value1) == true) && (CoreUtils.IsString(_value2) == true) )
			{
				// CONTAINS
				if (_comparison == "€")
				{
					return _value1.includes(_value2) == true;
				}
				// NOT CONTAINS
				else if (_comparison == "!€")
				{
					return _value1.includes(_value2) == false;
				}
				// STARTS WITH
				else if (_comparison == "[>")
				{
					return _value1.startsWith(_value2) == true;
				}
				// ENDS WITH
				else if (_comparison == "<]")
				{
					return _value1.endsWith(_value2) == true;
				}
				// INCLUDES
				else if (_comparison == "in")
				{
					// split the the second value
					let	possibilities = _value2.split("|");
					return possibilities.includes(_value1) == true;
				}
				// DOESNT INCLUDE
				else if (_comparison == "nin")
				{
					// split the the second value
					let	possibilities = _value2.split("|");
					return possibilities.includes(_value1) == false;
				}
			}

			return _value1 == _value2;		
		}
	}

	static	ValidatesConditionList(_obj, _conditions)
	{
		for(let condition of _conditions)
		{
			// get the value
			let	objValue = ObjUtils.GetValue(_obj, condition.field, "");

			// compare it
			let	ok = ObjUtils.CompareValues(condition.comparison, objValue, condition.value);

			// fals?
			if (ok == false)
				return false;
		}

		return true;
	}

	static	ValidatesCondition(_obj, _field, _value, _comparison = "==")
	{
		// extract the conditions
		let	conditions = ObjUtils.ExtractConditions(_field, _value, _comparison);

		// validates it
		return ObjUtils.ValidatesConditionList(_obj, conditions);
	}

	static	ExtractConditions(_field, _value, _comparison = "==")
	{
		let	conditions = [];
	
		// split the fields with the separator ":"
		let	fields = StringUtils.Split(_field, ":", false);
		let	values = StringUtils.Split(_value, ":", false);
		let	comparisons = StringUtils.Split(_comparison, ":", false);

		// for each one
		for(let i=0; i<fields.length; i++)
		{
			// create a new condition
			let	newCondition = {
				field: fields[i].trim(),
				value: i < values.length ? values[i] : values[0],
				comparison: i < comparisons.length ? comparisons[i] : "==",
			};

			// add it
			conditions.push(newCondition);
		}

		return conditions;
	}

	static	FindFirst(_list, _conditionField, _conditionValue, _conditionComparison = "==", _default = null, _returnIndex = false)
	{
		// not an array?
		if (ArrayUtils.IsEmpty(_list) == false)
		{
			// extract the conditions
			let	conditions = ObjUtils.ExtractConditions(_conditionField, _conditionValue, _conditionComparison);

			for(let i=0; i<_list.length; i++)
			{
				// validates the condition?
				let	itemOk = ObjUtils.ValidatesConditionList(_list[i], conditions);
				if (itemOk)
					return _returnIndex ? i : _list[i];
			}
		}

		return _returnIndex ? -1 : _default;
	}

	static	MergeObjectsFromKeys(_object, _objectToAdd, _keysToKeep, _convertBoolToInt = true)
	{
		let	newObject = {};

		// foreach key
		for(let key of _keysToKeep)
		{
			// separate with ~ in case we want to rename it
			let	chunks = key.split(":");
			let	keySrc = chunks[0].trim();

			// does is start with '*' to tell that we need to count the occurences?
			let	countOccurences = false;
			let	listValues = false;
			if (keySrc.startsWith("*") == true)
			{
				keySrc = keySrc.substring(1);
				countOccurences = true;
			}
			else if (keySrc.startsWith("@") == true)
			{
				keySrc = keySrc.substring(1);
				listValues = true;
			}

			// get the destination key
			let	keyDst = (chunks.length >= 2) ? chunks[1].trim() : keySrc;

			// do we need to count occurrences?
			if (countOccurences == true)
			{
				// make sure we keep the existing ones in the current object
				for(const keyBuf in _object)
				{
					if (keyBuf.startsWith(keyDst + "_") == true)
						newObject[keyBuf] = _object[keyBuf];
				}

				// get the value in the object to add
				let	otherValue = ObjUtils.GetValue(_objectToAdd, keySrc, "");

				// convert it to string
				otherValue = CoreUtils.ToString(otherValue);

				// if it's not empty
				if (StringUtils.IsEmpty(otherValue) == false)
				{
					// the destination key has the value at the end
					keyDst = keyDst + "_" + otherValue;

					// get our current count for it
					let	currentCount = ObjUtils.GetValueToInt(newObject, keyDst);

					// set it plus 1
					newObject[keyDst] = currentCount + 1;
				}
			}
			// are we just building a list?
			else if (listValues == true)
			{
				// we're building an array
				let	finalValue = [];

				// get our value
				let	ourValue = ObjUtils.GetValue(_object, keySrc, null);
				if (ourValue == null)
					ourValue = ObjUtils.GetValue(_object, keyDst, null);
				if (ourValue != null)
				{
					// is it an array?
					if (CoreUtils.IsArray(ourValue) == true)
						finalValue = ourValue;
					else
						finalValue.push(ourValue);
				}

				// check the other value
				let	otherValue = ObjUtils.GetValue(_objectToAdd, keySrc, null);
				if (otherValue == null)
					otherValue = ObjUtils.GetValue(_objectToAdd, keyDst, null);
				if (otherValue != null)
				{
					// is it an array?
					if (CoreUtils.IsArray(otherValue) == true)
						finalValue = finalValue.concat(otherValue);
					else
						finalValue.push(otherValue);
				}

				// save it
				newObject[keyDst] = finalValue;
			}
			else
			{
				// get both values
				let	ourValue = ObjUtils.GetValue(_object, keySrc, null);
				if (ourValue == null)
					ourValue = ObjUtils.GetValue(_object, keyDst, null);
				let	otherValue = ObjUtils.GetValue(_objectToAdd, keySrc, null);
				if (otherValue == null)
					otherValue = ObjUtils.GetValue(_objectToAdd, keyDst, null);

				// set it
				newObject[keyDst] = ObjUtils.GetMergedValue(ourValue, otherValue, _convertBoolToInt);
			}
		}

		return newObject;
	}

	static	GetMergedValue(_value, _valueOther, _convertBoolToInt = true)
	{
		let	newValue = _value;

		// is the value good?
		if (_value != null)
		{
			// is the key a number?
			// boolean?
			if ( (CoreUtils.IsBoolAlike(_value) == true) && (_convertBoolToInt == true) )
			{
				// initialize it to 0 or 1
				newValue = StringUtils.ToBool(_value) ? 1 : 0;

				// add the other
				newValue += StringUtils.ToBool(_valueOther) ? 1 : 0;
			}
			// number?
			else if (CoreUtils.IsNumberAlike(_value) == true)
			{
				// sum it
				newValue = CoreUtils.ToNumber(_value) + CoreUtils.ToNumber(_valueOther);
			}
			// array?
			else if (CoreUtils.IsArray(_value) == true)
			{
				// is the other one an array too?
				if (CoreUtils.IsArray(_valueOther) == true)
				{
					newValue = _value.concat(_valueOther);
				}
			}
		}
		// no value, we check the other one
		else if (_valueOther != null)
		{
			// is it a bool?
			if ( (CoreUtils.IsBoolAlike(_valueOther) == true) && (_convertBoolToInt == true) )
			{
				newValue = StringUtils.ToBool(_valueOther) ? 1 : 0;
			}
			// is it a number?
			else if (CoreUtils.IsNumberAlike(_valueOther) == true)
			{
				newValue = CoreUtils.ToNumber(_valueOther);
			}
			else if (_valueOther != null)
			{
				newValue = _valueOther;
			}
		}

		// return 0 if null
		if (newValue == null)
			return 0;

		return newValue;
	}

	static	MergeObjects(_object, _objectToAdd, _keysToKeep = null, _convertBoolToInt = true)
	{
		// do we have keys?
		if (ArrayUtils.IsEmpty(_keysToKeep) == false)
			return ObjUtils.MergeObjectsFromKeys(_object, _objectToAdd, _keysToKeep, _convertBoolToInt);

		let	newObject = {};

		// start with the object and do all the keys
		for(const key in _object)
		{
			// set it
			let	otherValue = ObjUtils.GetValue(_objectToAdd, key);
			newObject[key] = ObjUtils.GetMergedValue(_object[key], otherValue, _convertBoolToInt);
		}

		// now we add the other keys
		for(const key in _objectToAdd)
		{
			// if we haven't set yet
			if (newObject.hasOwnProperty(key) == false)
			{
				newObject[key] = ObjUtils.GetMergedValue(null, _objectToAdd[key], _convertBoolToInt);
			}
		}

		return newObject;
	}

	static	PrepareForAddSub(_obj, _avoidKey = false, _fieldKeyName = "key")
	{
		// nothing?
		if (CoreUtils.IsValid(_obj) == false)
			return null;
		
		// object?
		if (CoreUtils.IsObject(_obj) == true)
		{
			let	newObj = {};
			for(const key in _obj)
			{
				// do we need to avoid the key?
				if ( (key == _fieldKeyName) && (_avoidKey == true) )
					newObj[key] = _obj[key];
				else
					newObj[key] = ObjUtils.PrepareForAddSub(_obj[key]);
			}
			return newObj;
		}
		// array?
		else if (CoreUtils.IsArray(_obj) == true)
		{
			// create a new array
			let	result = [];
			for(let i=0; i<_obj.length; i++)
			{
				result.push(ObjUtils.PrepareForAddSub(_obj[i], true));
			}
			return result;
		}
		// string?
		else if (CoreUtils.IsString(_obj) == true)
		{
			let	newObj = {};
			newObj[_obj] = 1;
			return newObj;
		}
		// bool?
		else if (CoreUtils.IsBool(_obj) == true)
		{
			return _obj ? 1 : 0;
		}
		// number?
		else if (CoreUtils.IsNumber(_obj) == true)
		{
			return _obj;
		}

		return null;
	}

	static	AddSub(_obj, _objToAdd, _operation = "+", _fieldKeyName = "key")
	{
		// nothing?
		let	newObj = {};
		if (CoreUtils.IsValid(_obj) == true)
		{
			for(const key in _obj)
				newObj[key] = _obj[key];
		}

		// other one not empty?
		if (CoreUtils.IsObject(_objToAdd) == true)
		{
			// we're going to add all the keys from the other object
			for(const key in _objToAdd)
			{
				// is it an object?
				if (CoreUtils.IsObject(_objToAdd[key]) == true)
				{
					// get our object
					let	ourObj = ObjUtils.GetValue(_obj, key, {});

					// do the operation on the objects
					newObj[key] = ObjUtils.AddSub(ourObj, _objToAdd[key], _operation, _fieldKeyName);
				}
				// number?
				else if (CoreUtils.IsNumber(_objToAdd[key]) == true)
				{
					// get our value
					let	ourValue = ObjUtils.GetValue(_obj, key, 0);

					// is this a string?
					if (CoreUtils.IsString(ourValue) == true)
						ourValue = CoreUtils.ToNumber(ourValue);
	
					// do the operation
					// SUB
					if (_operation == "-")
						ourValue -= _objToAdd[key];
					// ADD
					else
						ourValue += _objToAdd[key];

					// set it
					newObj[key] = ourValue;					
				}
				// array?
				else if (CoreUtils.IsArray(_objToAdd[key]) == true)
				{
					// make sure we have an array there
					if (newObj.hasOwnProperty(key) == false)
						newObj[key] = [];

					// for each entry in the array
					for(let i=0; i<_objToAdd[key].length; i++)
					{
						// is it an object?
						if (CoreUtils.IsObject(_objToAdd[key][i]) == true)
						{
							// we need to find the key
							let	entryKey = ObjUtils.GetValue(_objToAdd[key][i], _fieldKeyName, "");
							if (StringUtils.IsEmpty(entryKey) == false)
							{
								// we need to find it in the original object
								let	found = false;
								for(let j=0; j<newObj[key].length; j++)
								{
									// is it an object?
									if (CoreUtils.IsObject(newObj[key][j]) == true)
									{
										// get the key
										let	keyBuf = ObjUtils.GetValue(newObj[key][j], _fieldKeyName, "");

										// is it the same one?
										if (keyBuf == entryKey)
										{
											// do the operation
											newObj[key][j] = ObjUtils.AddSub(newObj[key][j], _objToAdd[key][i], _operation, _fieldKeyName);
											newObj[key][j][_fieldKeyName] = entryKey;
											found = true;
											break;
										}
									}
								}

								// if not found, we add a new one
								if (found == false)
								{
									let	newEntry = ObjUtils.AddSub(_objToAdd[key][i], null, _operation, _fieldKeyName);
									newEntry[_fieldKeyName] = entryKey;
									newObj[key].push(newEntry);
								}
							}
						}
					}
				}
			}
		}

		return newObj;
	}

	static	IsAddSubEmpty(_obj)
	{
		if (CoreUtils.IsValid(_obj) == true)
		{
			for(const key in _obj)
			{
				// object?
				if (CoreUtils.IsObject(_obj[key]) == true)
				{
					let	isEmpty = ObjUtils.IsAddSubEmpty(_obj[key]);
					if (isEmpty == false)
						return false;
				}
				// number?
				else if (CoreUtils.IsNumber(_obj[key]) == true)
				{
					if (_obj[key] != 0)
						return false;
				}
			}

		}

		return true;
	}

	static	HighestKey(_obj)
	{
		let	isSet = false;
		let	value = 0;
		let	finalKey = "";
		for(const key in _obj)
		{
			// is it a number?
			if (CoreUtils.IsNumber(_obj[key]) == true)
			{
				// is it higher or better?
				if ( (isSet == false) || (_obj[key] > value) )
				{
					isSet = true;
					value = _obj[key];
					finalKey = key;
				}
			}
		}

		return finalKey;
	}

	static	LowestKey(_obj)
	{
		let	isSet = false;
		let	value = 0;
		let	finalKey = "";
		for(const key in _obj)
		{
			// is it a number?
			if (CoreUtils.IsNumber(_obj[key]) == true)
			{
				// is it higher or better?
				if ( (isSet == false) || (_obj[key] < value) )
				{
					isSet = true;
					value = _obj[key];
					finalKey = key;
				}
			}
		}

		return finalKey;
	}	

	static	AvgValues(_obj)
	{
		let	nb = 0;
		let	total = 0;
		for(const key in _obj)
		{
			// is it a number?
			if (CoreUtils.IsNumber(_obj[key]) == true)
			{
				total += _obj[key];
				nb++;
			}
		}

		let	avg = 0;
		if (nb > 0)
			avg = total / nb;
		return avg;
	}

	static	SumValuesInArray(_obj)
	{
		let	total = 0;
		if (CoreUtils.IsArray(_obj) == true)
		{
			for(let i=0; i<_obj.length; i++)
			{
				if (CoreUtils.IsNumber(_obj[i]) == true)
				{
					total += _obj[i];
				}
			}
		}
		return total;
	}

	static	SumValuesOfFieldInArray(_obj, _field)
	{
		let	total = 0;
		if (CoreUtils.IsArray(_obj) == true)
		{
			for(let i=0; i<_obj.length; i++)
			{
				// get it
				let	value = ObjUtils.GetValue(_obj[i], _field, 0);

				// is it a number?
				if (CoreUtils.IsNumber(value) == true)
				{
					total += value;
				}
			}
		}
		return total;
	}	

	static	SimplifyList(_list, _fieldsToKeep)
	{
		let	newList = [];
		
		if (CoreUtils.IsArray(_list) == true)
		{
			for(let i=0; i<_list.length; i++)
			{
				// simplify the object
				let	newObj = ObjUtils.CopyAndRenameFieldsOnly(_list[i], _fieldsToKeep);

				// add if it's valid
				if (newObj != null)
					newList.push(newObj);
			}
		}

		return newList;
	}

	static	ReplaceAllIdsWithObjectInList(_itemsList, _field, _objectsDict, _keepAssoc)
	{
		let	newList = [];
		for(let obj of _itemsList)
		{
			let	copyObj = CoreUtils.Copy(obj);

			// get the list of ids
			let	currentList = ObjUtils.GetValue(obj, _field);
			if (CoreUtils.IsArray(currentList) == true)
			{
				// rebuild the list with the new values
				let	finalList = _keepAssoc ? {} : [];
				for(let key of currentList)
				{
					// do we have it?
					if (_objectsDict.hasOwnProperty(key) == true)
					{
						if (_keepAssoc == true)
							finalList[key] = _objectsDict[key];
						else
							finalList.push(_objectsDict[key]);
					}
				}

				// set it
				newList.push(ObjUtils.SetValue(copyObj, _field, finalList));
			}
			else
			{
				newList.push(copyObj);
			}
		}

		return newList;		
	}

	static	ConvertObjectToList(_object)
	{
		if (CoreUtils.IsObject(_object) == true)
			return [_object];
		else if (CoreUtils.IsArray(_object) == true)
			return _object;
		else
			return [];
	}

	static	FindAllKeysStartingWithInList(_list, _keyStart)
	{
		let	keys = [];
		for(let obj of _list)
		{
			for(const key in obj)
			{
				if (key.startsWith(_keyStart) == true)
				{
					if (keys.includes(key) == false)
						keys.push(key);
				}
			}
		}
		return keys;
	}

	static	SerializeObject(_obj, _delimiterField = "&", _delimiterValue = "=", _encodeComponents = true)
	{
		if (CoreUtils.IsValid(_obj) == false)
			return "";

		let	elements = [];
		for(const key in _obj)
		{
			// encode the key
			let	encodedKey = _encodeComponents ? encodeURIComponent(key) : key;

			// encode the value
			let	value = CoreUtils.ToString(_obj[key]);
			let	encodedValue = _encodeComponents ? encodeURIComponent(value) : value;

			elements.push(encodedKey + _delimiterValue + encodedValue);
		}

		return elements.join(_delimiterField);
	}
};

module.exports = {
	ObjUtils
};

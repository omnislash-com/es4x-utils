const { ObjUtils } = require("../utils/ObjUtils");
const { StringUtils } = require("../utils/StringUtils");
const { CoreUtils } = require("../utils/CoreUtils");
const { MathUtils } = require("../utils/MathUtils");

class	JsonProcessorUtils
{
	static	FilterConditions(_conditions, _fields)
	{
		let	newConditions = [];
		for(let condition of _conditions)
		{
			if (_fields.includes(condition.field) == true)
			{
				newConditions.push(condition);
			}
		}
		return newConditions;
	}
	
	static	CleanConditionsPath(_conditions, _path)
	{
		let	newConditions = [];
		for(let condition of _conditions)
		{
			let	newField = condition.field;
			if (newField.startsWith(_path + ".") == true)
				newField = newField.replace(_path + ".", "");
			newConditions.push({
				field: newField,
				value: condition.value,
				comparison: condition.comparison
			});
		}
		return newConditions;
	}	

	static	FilterList(_list, _conditionField, _conditionValue, _conditionComparison = "==")
	{
		let	newList = [];

		// extract the conditions
		let	conditions = ObjUtils.ExtractConditions(_conditionField, _conditionValue, _conditionComparison);

		for(let i=0; i<_list.length; i++)
		{
			// validates the condition?
			let	itemOk = ObjUtils.ValidatesConditionList(_list[i], conditions);
			if (itemOk)
				newList.push(_list[i]);
		}

		return newList;
	}

	static	CombineObjectsInListWithConditions(_list, _addCount = false, _keysToKeep = null, _convertBoolToInt = true, _conditions = [], _keyFieldName = "key", _countFieldName = "count")
	{
		let	finalObject = {};
		let	objectsCombined = 0;

		let	checkForCondition = _conditions.length > 0;
		for(let obj of _list)
		{
			// do we need to check for a condition?
			let	itemOk = checkForCondition ? ObjUtils.ValidatesConditionList(obj, _conditions) : true;
			if (itemOk == true)
			{
				// merge the objects
				finalObject = ObjUtils.MergeObjects(finalObject, obj, _keysToKeep, _convertBoolToInt);
				objectsCombined += 1;
			}
		}		

		// nothing?
		if (objectsCombined == 0)
			return null;

		// do we add the count?
		if (_addCount == true)
		{
			if (finalObject.hasOwnProperty(_countFieldName) == false)
				finalObject[_countFieldName] = objectsCombined;
		}

		return finalObject;
	}
	
	static	CombineObjectsInList(_list, _addCount = false, _keysToKeep = null, _convertBoolToInt = true, _conditionField = "", _conditionValue = "", _conditionComparison = "==", _keyFieldName = "key", _countFieldName = "count")
	{
		// extract the conditions
		let	conditions = ObjUtils.ExtractConditions(_conditionField, _conditionValue, _conditionComparison);

		return JsonProcessorUtils.CombineObjectsInListWithConditions(_list, _addCount, _keysToKeep, _convertBoolToInt, conditions, _keyFieldName, _countFieldName);
	}

	static	MergeList(_list, _key, _addKey = false, _addCount = false, _keysToKeep = null, _convertBoolToInt = true, _conditionField = "", _conditionValue = "", _conditionComparison = "==", _keyFieldName = "key", _countFieldName = "count")
	{
		// extract the conditions
		let	conditions = ObjUtils.ExtractConditions(_conditionField, _conditionValue, _conditionComparison);

		return JsonProcessorUtils.MergeListWithConditions(_list, _key, _addKey, _addCount, _keysToKeep, _convertBoolToInt, conditions, _keyFieldName, _countFieldName);
	}
	
	static	MergeListWithConditions(_list, _key, _addKey = false, _addCount = false, _keysToKeep = null, _convertBoolToInt = true, _conditions = [], _keyFieldName = "key", _countFieldName = "count")
	{
		// first we group the object by the keys
		let	groups = ObjUtils.GroupBy(_list, _key);

		// now we merge each group
		let	finalList = [];
		for(let groupToMerge of groups)
		{
			if (groupToMerge.length > 0)
			{
				// merge them
				let	newObject = JsonProcessorUtils.CombineObjectsInListWithConditions(groupToMerge, _addCount, _keysToKeep, _convertBoolToInt, _conditions, _keyFieldName, _countFieldName);
				if (newObject != null)
				{
					// add the key?
					if (_addKey == true)
					{
						newObject[_keyFieldName] = ObjUtils.GetValue(groupToMerge[0], _key, "");
					}

					// add the combined object
					finalList.push(newObject);
				}
			}
		}

		return finalList;		
	}

	static	ExtractObjectsWithFields(_object, _path, _fieldsToKeep, _mergeKey = "", _addKey = false, _addCount = false, _convertBoolToInt = true, _conditionField = "", _conditionValue = "", _conditionComparison = "==", _keyFieldName = "key", _countFieldName = "count")
	{
		// prepare the list of conditions
		let	conditions = ObjUtils.ExtractConditions(_conditionField, _conditionValue, _conditionComparison);

		return JsonProcessorUtils.ExtractObjectsWithFieldsWithConditions(_object, _path, _fieldsToKeep, _mergeKey, _addKey, _addCount, _convertBoolToInt, conditions, _keyFieldName, _countFieldName);
	}

	static	ExtractObjectsWithFieldsWithConditions(_object, _path, _fieldsToKeep, _mergeKey = "", _addKey = false, _addCount = false, _convertBoolToInt = true, _conditions = [], _keyFieldName = "key", _countFieldName = "count")
	{
		// we're building a list of objects
		let	finalObjects = [];

		// convert our object in to a list of things to do
		let	objectsTodo = ObjUtils.ConvertObjectToList(_object);
		if (objectsTodo.length == 0)
			return finalObjects;

		// is the path empty? Then we just copy the fields
		if (StringUtils.IsEmpty(_path) == true)
		{
			// filter the conditions
			let	finalConditions = JsonProcessorUtils.FilterConditions(_conditions, _fieldsToKeep);

			// test each object
			for(let objBuf of objectsTodo)
			{
				// does the object satisfy the conditions?
				let	objOk = ObjUtils.ValidatesConditionList(objBuf, finalConditions);
				if (objOk == true)
				{
					// let just copy the fields
					let	newObj = ObjUtils.CopyFieldsOnlyFromList(objBuf, _fieldsToKeep);
					
					// add it
					finalObjects.push(newObj);
				}
			}
		}
		// we have a path, we're going to have to go in it
		else
		{
			// first we split the path to look at the first key
			let	pathChunks = _path.split(".");
			let	currentPath = pathChunks[0];
			let	remainingPathChunks = pathChunks.length >= 2 ? pathChunks.splice(1) : [];
			let	remainingPath = remainingPathChunks.join(".");

			// update the list of fields to keep
			let	fieldsToKeepCurrent = [];
			let	fieldsToKeepSub = [];
			for(let fieldToKeep of _fieldsToKeep)
			{
				// the field can either be in the current object or in a sub one
				let	isCurrent = true;
	
				// if it includes the ., it can either be a sub field from our current, or it can be in the sub
				if (fieldToKeep.includes(".") == true)
				{
					// split with .
					let	fieldChunks = fieldToKeep.split(".");

					// if the first chunk is one of the remaining path chunks, that means it;'s sub!
					if (remainingPathChunks.includes(fieldChunks[0]) == true)
						isCurrent = false;
					else if (fieldChunks[0] == currentPath)
					{
						isCurrent = false;
						fieldToKeep = fieldChunks.splice(1).join(".");
					}
				}

				// add the field to the right list
				if (isCurrent == true)
					fieldsToKeepCurrent.push(fieldToKeep);
				else
					fieldsToKeepSub.push(fieldToKeep);
			}

			// clean the conditions with the current path
			let	conditionsForNow = JsonProcessorUtils.CleanConditionsPath(_conditions, currentPath);

			// process each object in our list
			for(let objBuf of objectsTodo)
			{
				// get the new object
				let	subObject = ObjUtils.GetValue(objBuf, currentPath);

				// get the list of objects in the sub
				let	subObjectList = JsonProcessorUtils.ExtractObjectsWithFieldsWithConditions(subObject, remainingPath, fieldsToKeepSub, _mergeKey, _addKey, _addCount, _convertBoolToInt, conditionsForNow, _keyFieldName, _countFieldName);

				// do we need to merge the items?
				if (StringUtils.IsEmpty(_mergeKey) == false)
				{
					// clean the list of fields to keep: first we add all for our current path
					let	fieldsToKeepMerge = [];
					for(let fieldToKeep of _fieldsToKeep)
					{
						if (fieldToKeep.startsWith(currentPath + ".") == true)
							fieldsToKeepMerge.push(fieldToKeep.replace(currentPath + ".", ""));
					}

					// if we have a remaining path, we need to re-add all the existing ones
					if (StringUtils.IsEmpty(remainingPath) == false)
					{
						// extract the chunks to add
						let	chunksToAdd = remainingPath.split(".");
						for(let fieldToKeep of _fieldsToKeep)
						{
							for(let	fieldStart of chunksToAdd)
							{
								if (fieldToKeep.startsWith(fieldStart + ".") == true)
								{
									// split with : for the rename
									let	fieldName = fieldToKeep.replace(fieldStart + ".", "");
									let	fieldNameReal = fieldName.includes(":") ? fieldName.split(":")[1] : fieldName.replace("*", "").replace("@", "");

									// does it start with *?
									if (fieldName.startsWith("*") == true)
										fieldsToKeepMerge = fieldsToKeepMerge.concat(ObjUtils.FindAllKeysStartingWithInList(subObjectList, fieldNameReal + "_"));
									else
										fieldsToKeepMerge.push(fieldNameReal);
									break;
								}
							}
						}

						// add count and key?
						if (_addKey == true)
							fieldsToKeepMerge.push(_keyFieldName);
						if (_addCount == true)
							fieldsToKeepMerge.push(_countFieldName);
					}

					// if the condition is here: we make sure to add the condition field in each object!!
					let	finalConditions = JsonProcessorUtils.FilterConditions(_conditions, fieldsToKeepCurrent);

					// make sure to set the keys in each object
					for(let conditionBuf of finalConditions)
					{
						let	ourValue = ObjUtils.GetValue(objBuf, conditionBuf.field, "");
						for(let finalObj of subObjectList)
						{
							finalObj[conditionBuf.field] = ourValue;
						}
					}

					// verify the condition
					subObjectList = JsonProcessorUtils.MergeListWithConditions(subObjectList, _mergeKey, _addKey, _addCount, fieldsToKeepMerge, _convertBoolToInt, finalConditions, _keyFieldName, _countFieldName);
				}

				// do we have fields to copy from our own?
				if (fieldsToKeepCurrent.length > 0)
				{
					// extract our own fields
					let	ourFields = ObjUtils.CopyFieldsOnlyFromList(objBuf, fieldsToKeepCurrent);

					// now we just add each field in each new object
					for(let finalObj of subObjectList)
					{
						for(const key in ourFields)
						{
							finalObj[key] = ourFields[key];
						}
					}
				}				

				// add the objects
				finalObjects = finalObjects.concat(subObjectList);
			}

			if (StringUtils.IsEmpty(_mergeKey) == false)
			{
				finalObjects = JsonProcessorUtils.MergeListWithConditions(finalObjects, _mergeKey, _addKey, _addCount, null, _convertBoolToInt, [], _keyFieldName, _countFieldName);
			}
		}

		return finalObjects;
	}

	static	ExtractFromList(_list, _field, _addIfEmpty = false)
	{
		let	newList = [];

		if (CoreUtils.IsArray(_list) == true)
		{
			for(let i=0; i<_list.length; i++)
			{
				// get the value
				let	value = ObjUtils.GetValue(_list[i], _field, null);

				// is it empty?
				let	isEmpty = value == null;
				if (isEmpty == false)
				{
					if (CoreUtils.IsString(value) == true)
						isEmpty = StringUtils.IsEmpty(value);
				}

				if ( (isEmpty == false) || (_addIfEmpty == true) )
					newList.push(value);
			}
		}

		return newList;
	}	

	static	ExtractFromListMulti(_list, _fields, _default=null)
	{
		let	newList = [];

		if (CoreUtils.IsArray(_list) == true)
		{
			// foreach item
			for(let i=0; i<_list.length; i++)
			{
				// we're building an array of values
				let	newValues = [];

				// for each field
				for(let key of _fields)
				{
					// get the value
					let	value = ObjUtils.GetValue(_list[i], key, _default);

					// add it
					newValues.push(value);
				}

				// add the values
				newList.push(newValues);
			}
		}

		return newList;
	}	
	
	static	ExtractFromListWithCalculation(_list, _field1, _field2, _calc = "+")
	{
		let	newList = [];

		if (CoreUtils.IsArray(_list) == true)
		{
			for(let i=0; i<_list.length; i++)
			{
				// get both values
				let	value1 = ObjUtils.GetValueToFloat(_list[i], _field1);
				let	value2 = ObjUtils.GetValueToFloat(_list[i], _field2);

				// do the operation
				let	newValue = MathUtils.DoCalculation(value1, value2, _calc);

				// add it
				newList.push(newValue);
			}
		}

		return newList;
	}	
};

module.exports = {
	JsonProcessorUtils
};

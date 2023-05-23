/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { CoreUtils } from './src/utils/CoreUtils';
import { ObjUtils } from './src/utils/ObjUtils';
import { JsonProcessor } from './src/jsonprocessor/JsonProcessor';
import { JsonBuilder } from './src/jsonprocessor/JsonBuilder';

const suite = TestSuite.create("ES4X Utils");








suite.run();














function	assertListEquals(_context, _list1, _list2)
{
	// both lists
	if (Array.isArray(_list1) != Array.isArray(_list2))
	{
		console.error("Not arrays:");
		console.error(_list1);
		console.error(_list2);
		_context.assertEquals(Array.isArray(_list1), Array.isArray(_list2));
		return false;
	}

	// same size?
	if (_list1.length != _list2.length)	
	{
		console.error("Not same length:");
		console.error(_list1);
		console.error(_list2);
		_context.assertEquals(_list1.length, _list2.length);
		return false;
	}

	// compare each one
	for(let i=0; i<_list1.length; i++)
	{
		if (_list1[i] != _list2[i])
		{
			console.error("Not same value at index :" + i);
			console.error(_list1);
			console.error(_list2);
			_context.assertEquals(_list1[i], _list2[i]);
			return false;
		}
	}

	_context.assertEquals(Array.isArray(_list1), Array.isArray(_list2));
	return true;
}
/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { ObjUtils } from '../src/utils/ObjUtils';
import { ArrayUtils } from '../src/utils/ArrayUtils';

const suite = TestSuite.create("ES4X Test: ArrayUtils");


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


suite.test("ArrayUtils.Compare", function (context) {

	let	tests = [
		{
			"array1": [],
			"array2": [],
			"result": true
		},
		{
			"array1": ["test"],
			"array2": [],
			"result": false
		},
		{
			"array1": ["test"],
			"array2": ["test2"],
			"result": false
		},
		{
			"array1": [1, 2, 3, 4],
			"array2": [4, 3, 2, 1],
			"result": true
		},
		{
			"array1": [1, 2, 3, 3],
			"array2": [1, 2, 3, 4],
			"result": false
		},
		{
			"array1": ["aaa", 2, "super"],
			"array2": [2, "super", "aaa"],
			"result": true
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		let	result = ArrayUtils.Compare(tests[i].array1, tests[i].array2);
		if (result != tests[i].result)
			console.error("Error with test " + i);
	
		context.assertEquals(result, tests[i].result);
	}
});

suite.test("ArrayUtils.IsEmpty", function (context) {

	context.assertEquals(ArrayUtils.IsEmpty(null), true);
	context.assertEquals(ArrayUtils.IsEmpty([]), true);
	context.assertEquals(ArrayUtils.IsEmpty("test"), true);
	context.assertEquals(ArrayUtils.IsEmpty([1]), false);
	context.assertEquals(ArrayUtils.IsEmpty(["test", "test2"]), false);

});

suite.test("ArrayUtils.Fill", function (context) {

	let	tests = [
		{
			"count": 10,
			"start": 0,
			"step": 1,
			"paths": {
		//		"[0]": 0,//parseFloat((0).toString()),
				"[1]": parseFloat((1).toString()),
				"[2]": parseFloat((2).toString()),
				"[3]": parseFloat((3).toString()),
				"[4]": parseFloat((4).toString()),
				"[5]": parseFloat((5).toString()),
				"[6]": parseFloat((6).toString()),
				"[7]": parseFloat((7).toString()),
				"[8]": parseFloat((8).toString()),
				"[9]": parseFloat((9).toString()),
			}
		},
		{
			"count": 4,
			"start": 10,
			"step": -5,
			"paths": {
//				"[0]": 0,//parseFloat((10).toString()),
				"[1]": parseFloat((5).toString()),
//				"[2]": 0,//parseFloat((0).toString()),
				"[3]": parseFloat((-5).toString()),
			}
		},		
	];

	for(let i=0; i<tests.length; i++)
	{
		// fill the list
		let	result = ArrayUtils.Fill(tests[i].count, tests[i].start, tests[i].step);

		// compare the size
		if (result.length != tests[i].count)
		{
			console.error("ERROR LENGTH AT " + i);
			context.assertEquals(result.length, tests[i].count);
		}
		else
		{
			for(const path in tests[i].paths)
			{
				let	value = ObjUtils.GetValue(result, path);

				if (value != tests[i].paths[path])
					console.log("ERROR: " + path + " is different: " + value + " VS " + tests[i].paths[path]);
				context.assertEquals(parseFloat(value.toString()), parseFloat(tests[i].paths[path].toString()));
			}
		}
	}

});

suite.test("ArrayUtils.ConvertElementsToString", function (context) {

	let	tests = [
		{
			"list": [
				0,
				1,
				2.5,
				true,
				"already",
				{ "field": "value" },
				[1, 2, 3]
			],
			"paths": {
				"[0]": "0",
				"[1]": "1",
				"[2]": "2.5",
				"[3]": "true",
				"[4]": "already",
				"[5]": "{\"field\":\"value\"}",
				"[6]": "[1,2,3]",
			}
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// fill the list
		let	result = ArrayUtils.ConvertElementsToString(tests[i].list);

		// compare the size
		if (result.length != tests[i].list.length)
		{
			console.error("ERROR LENGTH AT " + i);
			context.assertEquals(result.length, tests[i].count);
		}
		else
		{
			for(const path in tests[i].paths)
			{
				let	value = ObjUtils.GetValue(result, path);

				if (value != tests[i].paths[path])
					console.log("ERROR: " + path + " is different: " + value + " VS " + tests[i].paths[path]);
				context.assertEquals(value, tests[i].paths[path]);
			}
		}
	}

});

suite.test("ArrayUtils.InvertValues", function (context) {

	let	tests = [
		{
			"max": 9,
			"list": [
				0,
				1,
				2.5,
				9,
				true,
				"already",
			],
			"paths": {
				"[0]": parseFloat((9).toString()),
				"[1]": parseFloat((8).toString()),
				"[2]": parseFloat((6.5).toString()),
				"[3]": parseFloat((0).toString()),
				"[4]": true,
				"[5]": "already"
			}
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// fill the list
		let	result = ArrayUtils.InvertValues(tests[i].list, tests[i].max);

		// compare the size
		if (result.length != tests[i].list.length)
		{
			console.error("ERROR LENGTH AT " + i);
			context.assertEquals(result.length, tests[i].count);
		}
		else
		{
			for(const path in tests[i].paths)
			{
				let	value = ObjUtils.GetValue(result, path);

				if (value != tests[i].paths[path])
					console.log("ERROR: " + path + " is different: " + value + " VS " + tests[i].paths[path]);
				context.assertEquals(value, tests[i].paths[path]);
			}
		}
	}

});

suite.test("ArrayUtils.FillWithColor", function (context) {

	let	tests = [
		{
			"count": 8,
			"color": "#FFFFFF",
			"paths": {
				"[0]": "#FFFFFFFF",
				"[1]": "#FFFFFFE2",
				"[2]": "#FFFFFFC5",
				"[6]": "#FFFFFF50",
				"[7]": "#FFFFFF33",
			}
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// fill the list
		let	result = ArrayUtils.FillWithColor(tests[i].count, tests[i].color);

		// compare the size
		if (result.length != tests[i].count)
		{
			console.error("ERROR LENGTH AT " + i);
			console.log(result);
			context.assertEquals(result.length, tests[i].count);
		}
		else
		{
			for(const path in tests[i].paths)
			{
				let	value = ObjUtils.GetValue(result, path);

				if (value != tests[i].paths[path])
				{
					console.log("ERROR: " + path + " is different: " + value + " VS " + tests[i].paths[path]);
					console.log(result);
				}
				context.assertEquals(value, tests[i].paths[path]);
			}
		}
	}

});

suite.test("ArrayUtils.Reverse", function (context) {

	let	tests = [
		{
			"list": [1, 2, 3, 4, 5, 6, 7, 8],
			"paths": {
				"[0]": 8,
				"[1]": 7,
				"[2]": 6,
				"[3]": 5,
				"[4]": 4,
				"[5]": 3,
				"[6]": 2,
				"[7]": 1,
			}
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// fill the list
		let	result = ArrayUtils.Reverse(tests[i].list);

		// compare the size
		if (result.length != tests[i].list.length)
		{
			console.error("ERROR LENGTH AT " + i);
			context.assertEquals(result.length, tests[i].count);
		}
		else
		{
			for(const path in tests[i].paths)
			{
				let	value = ObjUtils.GetValue(result, path);

				if (value != tests[i].paths[path])
					console.log("ERROR: " + path + " is different: " + value + " VS " + tests[i].paths[path]);
				context.assertEquals(value, tests[i].paths[path]);
			}
		}
	}

});

suite.test("ArrayUtils.FindMissingEntries", function (context) {

	assertListEquals(context, ArrayUtils.FindMissingEntries(null, undefined), []);	
	assertListEquals(context, ArrayUtils.FindMissingEntries([], undefined), []);	
	assertListEquals(context, ArrayUtils.FindMissingEntries([], ["test"]), ["test"]);	
	assertListEquals(context, ArrayUtils.FindMissingEntries(["test"], ["test"]), []);	
	assertListEquals(context, ArrayUtils.FindMissingEntries(["test"], ["test", "Test"]), ["Test"]);	

});	

suite.test("ArrayUtils.EnsureUnique", async function (context) {

	let	tests = [
		{
			values: [
				"test",
				"test",
				"test2",
				"test",
				"TEST2",
				"TEST"
			],
			result: [
				"test",
				"test2",
				"TEST2",
				"TEST"
			]
		},
	];
	
	for(let i=0; i<tests.length; i++)
	{
		// simplify the array to get only unique
		let	newArray = ArrayUtils.EnsureUnique(tests[i].values);

		// compare the arrays
		assertListEquals(context, newArray, tests[i].result);

	}
});


suite.run();

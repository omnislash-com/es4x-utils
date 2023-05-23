/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { ObjUtils } from '../src/utils/ObjUtils';
import { JsonProcessorUtils } from '../src/jsonprocessor/JsonProcessorUtils';

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

const suite = TestSuite.create("ES4X Test: JsonProcessorUtils");

suite.test("JsonProcessorUtils.MergeList TEST", function (context) {
	let	data = 
	[
		{
			"is_victory": 1,
			"user": "mikosaure",
			"id": "trait1",
			"kills": 22,
			"tier_2": 1,
			"tier_1": 1,
			"tier_3": 0,
			"assists": 3,
			"deaths": 5,
			"key": "trait1",
			"count": 2
		},
		{
			"is_victory": 1,
			"user": "mikosaure",
			"id": "trait2",
			"kills": 1,
			"tier_2": 0,
			"tier_1": 1,
			"tier_3": 0,
			"assists": 5,
			"deaths": 2,
			"key": "trait2",
			"count": 1
		},
		{
			"is_victory": 1,
			"user": "mikosaure",
			"id": "trait3",
			"kills": 3,
			"tier_2": 0,
			"tier_1": 0,
			"tier_3": 1,
			"assists": 2,
			"deaths": 2,
			"key": "trait3",
			"count": 1
		},
		{
			"is_victory": 0,
			"user": "mikosaure",
			"id": "trait1",
			"kills": 2,
			"tier_1": 1,
			"tier_3": 0,
			"assists": 5,
			"deaths": 3,
			"key": "trait1",
			"count": 1
		},
		{
			"is_victory": 0,
			"user": "mikosaure",
			"id": "trait2",
			"kills": 1,
			"tier_1": 1,
			"tier_3": 0,
			"assists": 5,
			"deaths": 2,
			"key": "trait2",
			"count": 1
		},
		{
			"is_victory": 0,
			"user": "mikosaure",
			"id": "trait3",
			"kills": 3,
			"tier_1": 0,
			"tier_3": 1,
			"assists": 2,
			"deaths": 2,
			"key": "trait3",
			"count": 1
		},
		{
			"is_victory": 1,
			"user": "mikosaure",
			"id": "trait3",
			"kills": 1,
			"tier_1": 1,
			"assists": 2,
			"deaths": 2,
			"key": "trait3",
			"count": 1
		}
	];

	let	result = JsonProcessorUtils.MergeList(data, "id", true, true, null, true);

	context.assertEquals(result.length, 3);
	context.assertEquals(result[0].key, "trait1");
	context.assertEquals(result[0].kills, 24);
	context.assertEquals(result[0].tier_1, 2);
	context.assertEquals(result[0].tier_2, 1);
	context.assertEquals(result[0].tier_3, 0);
	context.assertEquals(result[0].assists, 8);
	context.assertEquals(result[0].deaths, 8);
	context.assertEquals(result[1].key, "trait2");
	context.assertEquals(result[1].kills, 2);
	context.assertEquals(result[1].tier_1, 2);
	context.assertEquals(result[1].tier_2, 0);
	context.assertEquals(result[1].tier_3, 0);
	context.assertEquals(result[1].assists, 10);
	context.assertEquals(result[1].deaths, 4);
	context.assertEquals(result[2].key, "trait3");
	context.assertEquals(result[2].kills, 7);
	context.assertEquals(result[2].tier_1, 1);
	context.assertEquals(result[2].tier_2, 0);
	context.assertEquals(result[2].tier_3, 2);
	context.assertEquals(result[2].assists, 6);
	context.assertEquals(result[2].deaths, 6);
});

suite.test("JsonProcessorUtils.ExtractObjectsWithFields", function (context) {

	let	data = {
		matches: [
			{
				is_victory: "1",
				player: {
					user: "mikosaure",
					traits: [
						{
							id: "trait1",
							kills: 10,
							tier: 2,
							stats: {
								assists: 1,
								deaths: 2
							}
						},
						{
							id: "trait2",
							kills: 1,
							tier: 1,
							stats: {
								assists: 5,
								deaths: 2
							}
						},
						{
							id: "trait3",
							kills: 3,
							tier: 3,
							stats: {
								assists: 2,
								deaths: 2
							}
						},
					]
				}
			},
			{
				is_victory: "0",
				player: {
					user: "cassy",
					traits: [
						{
							id: "trait1",
							kills: 25,
							tier: 3,
							stats: {
								assists: 1,
								deaths: 3
							}
						},
						{
							id: "trait2",
							kills: 2,
							tier: 1,
							stats: {
								assists: 1,
								deaths: 3
							}
						},
						{
							id: "trait4",
							kills: 23,
							tier: 3,
							stats: {
								assists: 10,
								deaths: 3
							}
						},
					]
				}
			},			
		]
	}

	let	tests = [
		{
			pathObj: "matches",
			path: "",
			tocopy: [
				"is_victory",
			],
			tocheck: {
				"[0].is_victory": "1",
				"[1].is_victory": "0",
			}
		},
		{
			pathObj: "matches",
			path: "player.traits",
			tocopy: [
				"is_victory",
				"player.user",
				"traits.*"
			],
			tocheck: {
				"[0].is_victory": "1",
				"[0].user": "mikosaure",
				"[0].id": "trait1",
				"[0].kills": 10,
				"[0].tier": 2,
				"[0].stats.assists": 1,
				"[0].stats.deaths": 2,
				"[1].is_victory": "1",
				"[1].user": "mikosaure",
				"[1].id": "trait2",
				"[1].kills": 1,
				"[1].tier": 1,
				"[1].stats.assists": 5,
				"[1].stats.deaths": 2,
				"[2].is_victory": "1",
				"[2].user": "mikosaure",
				"[2].id": "trait3",
				"[2].kills": 3,
				"[2].tier": 3,
				"[2].stats.assists": 2,
				"[2].stats.deaths": 2,
				"[3].is_victory": "0",
				"[3].user": "cassy",
				"[3].id": "trait1",
				"[3].kills": 25,
				"[3].tier": 3,
				"[3].stats.assists": 1,
				"[3].stats.deaths": 3,
				"[4].is_victory": "0",
				"[4].user": "cassy",
				"[4].id": "trait2",
				"[4].kills": 2,
				"[4].tier": 1,
				"[4].stats.assists": 1,
				"[4].stats.deaths": 3,
				"[5].is_victory": "0",
				"[5].user": "cassy",
				"[5].id": "trait4",
				"[5].kills": 23,
				"[5].tier": 3,
				"[5].stats.assists": 10,
				"[5].stats.deaths": 3,
			}
		},
		{
			pathObj: "matches",
			path: "player.traits",
			tocopy: [
				"is_victory",
				"player.user",
				"traits.id",
				"traits.kills",
				"traits.tier",
				"traits.stats.assists",
				"traits.stats.deaths",
			],
			tocheck: {
				"[0].is_victory": "1",
				"[0].user": "mikosaure",
				"[0].id": "trait1",
				"[0].kills": 10,
				"[0].tier": 2,
				"[0].stats.assists": 1,
				"[0].stats.deaths": 2,
				"[1].is_victory": "1",
				"[1].user": "mikosaure",
				"[1].id": "trait2",
				"[1].kills": 1,
				"[1].tier": 1,
				"[1].stats.assists": 5,
				"[1].stats.deaths": 2,
				"[2].is_victory": "1",
				"[2].user": "mikosaure",
				"[2].id": "trait3",
				"[2].kills": 3,
				"[2].tier": 3,
				"[2].stats.assists": 2,
				"[2].stats.deaths": 2,
				"[3].is_victory": "0",
				"[3].user": "cassy",
				"[3].id": "trait1",
				"[3].kills": 25,
				"[3].tier": 3,
				"[3].stats.assists": 1,
				"[3].stats.deaths": 3,
				"[4].is_victory": "0",
				"[4].user": "cassy",
				"[4].id": "trait2",
				"[4].kills": 2,
				"[4].tier": 1,
				"[4].stats.assists": 1,
				"[4].stats.deaths": 3,
				"[5].is_victory": "0",
				"[5].user": "cassy",
				"[5].id": "trait4",
				"[5].kills": 23,
				"[5].tier": 3,
				"[5].stats.assists": 10,
				"[5].stats.deaths": 3,
			}
		},		
	];

	for(let i=0; i<tests.length; i++)
	{
		// create the new object
		let	obj = ObjUtils.GetValue(data, tests[i].pathObj);
		let	result = JsonProcessorUtils.ExtractObjectsWithFields(obj, tests[i].path, tests[i].tocopy);

		// do the tests
		for(const key in tests[i].tocheck)
		{
			// get the value
			let	value = ObjUtils.GetValue(result, key);

			// is it different?
			if (value != tests[i].tocheck[key])
			{
				console.error("Error: " + value + " is different than " + tests[i].tocheck[key] + " (test " + i + "." + key + ")");
				console.log(result);
			}

			context.assertEquals(value, tests[i].tocheck[key]);	
		}
	}


});	

suite.test("JsonProcessorUtils.ExtractObjectsWithFields With Merge", function (context) {

	let	data = {
		matches: [
			{
				is_victory: "1",
				player: {
					user: "mikosaure",
					traits: [
						{
							id: "trait1",
							kills: 10,
							tier: 2,
							stats: {
								assists: 1,
								deaths: 2
							}
						},
						{
							id: "trait1",
							kills: 12,
							tier: 1,
							stats: {
								assists: 2,
								deaths: 3
							}
						},
						{
							id: "trait2",
							kills: 1,
							tier: 1,
							stats: {
								assists: 5,
								deaths: 2
							}
						},
						{
							id: "trait3",
							kills: 3,
							tier: 3,
							stats: {
								assists: 2,
								deaths: 2
							}
						},
					]
				}
			},
			{
				is_victory: "0",
				player: {
					user: "cassy",
					traits: [
						{
							id: "trait1",
							kills: 25,
							tier: 3,
							stats: {
								assists: 1,
								deaths: 3
							}
						},
						{
							id: "trait2",
							kills: 2,
							tier: 1,
							stats: {
								assists: 1,
								deaths: 3
							}
						},
						{
							id: "trait4",
							kills: 23,
							tier: 3,
							stats: {
								assists: 10,
								deaths: 3
							}
						},
					]
				}
			},			
		]
	}

	// extract and merge
	let	fieldsToKeep = [
		"matches.is_victory",
		"player.user",
		"traits.id",
		"traits.kills",
		"traits.*tier",
		"traits.stats.assists:assists",
		"traits.stats.deaths:deaths",
	];
	let	mergeKey = "id";
	let	conditionField = "";
	let	conditionValue = "";
	let	conditionComp = "==";
	let	result = JsonProcessorUtils.ExtractObjectsWithFields(data, "matches.player.traits", fieldsToKeep, mergeKey, true, true, true, conditionField, conditionValue, conditionComp);

	context.assertEquals(result.length, 4);	

});	

suite.test("JsonProcessorUtils.ExtractObjectsWithFields With Merge2", function (context) {

	let	data = {
		matches: [
			{
				is_victory: 1,
				players: [
					{
						user: "mikosaure",
						omniscore: 89,
						traits: [
							{
								id: "trait1",
								score: 5,
								kills: 10,
								tier: 2,
								stats: {
									assists: 1,
									deaths: 2
								}
							},
							{
								id: "trait1",
								score: 12,
								kills: 12,
								tier: 1,
								stats: {
									assists: 2,
									deaths: 3
								}
							},
							{
								id: "trait2",
								score: 2,
								kills: 1,
								tier: 1,
								stats: {
									assists: 5,
									deaths: 2
								}
							},
							{
								id: "trait3",
								kills: 3,
								tier: 3,
								stats: {
									assists: 2,
									deaths: 2
								}
							},
						]
					}
				]
			},
			{
				is_victory: 0,
				players: [
					{
						user: "cassy",
						traits: [
							{
								id: "trait1",
								score: 1,
								kills: 25,
								tier: 3,
								stats: {
									assists: 1,
									deaths: 3
								}
							},
							{
								id: "trait2",
								score: 12,
								kills: 2,
								tier: 1,
								stats: {
									assists: 1,
									deaths: 3
								}
							},
							{
								id: "trait4",
								score: 5,
								kills: 23,
								tier: 3,
								stats: {
									assists: 10,
									deaths: 3
								}
							},
						]
					},
					{
						user: "mikosaure",
						omniscore: 56,
						traits: [
							{
								id: "trait1",
								score: 1,
								kills: 2,
								tier: 1,
								stats: {
									assists: 5,
									deaths: 3
								}
							},
							{
								id: "trait2",
								score: 13,
								kills: 1,
								tier: 1,
								stats: {
									assists: 5,
									deaths: 2
								}
							},
							{
								id: "trait3",
								score: 14,
								kills: 3,
								tier: 3,
								stats: {
									assists: 2,
									deaths: 2
								}
							},
						]
					}					
				]
			},			
			{
				is_victory: 1,
				players: [
					{
						user: "test",
						traits: [
							{
								id: "trait1",
								kills: 2,
								tier: 1,
								stats: {
									assists: 5,
									deaths: 3
								}
							},
							{
								id: "trait2",
								kills: 1,
								tier: 1,
								stats: {
									assists: 5,
									deaths: 2
								}
							},
							{
								id: "trait3",
								kills: 3,
								tier: 3,
								stats: {
									assists: 2,
									deaths: 2
								}
							},
						]
					}					
				]
			},					
			{
				is_victory: 1,
				players: [
					{
						user: "mikosaure",
						omniscore: 25,
						traits: [
							{
								id: "trait3",
								score: 3,
								kills: 1,
								tier: 1,
								stats: {
									assists: 2,
									deaths: 2
								}
							},
						]
					}					
				]
			},
		]
	};

	// list of tests to runs
	let	tests = [
		{
			fieldsToKeep: [
				"is_victory",
				"players.user",
				"players.@omniscore",
				"traits.id",
				"traits.kills",
				"traits.*tier",
				"traits.@score",
				"traits.stats.assists:assists",
				"traits.stats.deaths:deaths",
			],
			mergeKey: "id",
			conditionField: "players.user",
			conditionValue: "mikosaure",
			conditionComp: "==",
			length: 3,
			tests: {
				"[0].id": "trait1",
				"[0].user": "mikosaure",
				"[0].kills": 24,
				"[0].assists": 8,
				"[0].deaths": 8,
				"[0].count": 3,
				"[0].tier_1": 2,
				"[0].tier_2": 1,
				"[0].tier_3": 0,
				"[0].omniscore[0]": 89,
				"[0].omniscore[1]": 56,
				"[0].score[0]": 5,
				"[0].score[1]": 12,
				"[0].score[2]": 1,

				"[1].id": "trait2",
				"[1].user": "mikosaure",
				"[1].kills": 2,
				"[1].assists": 10,
				"[1].deaths": 4,
				"[1].count": 2,
				"[1].tier_1": 2,
				"[1].tier_2": 0,
				"[1].tier_3": 0,
				"[1].omniscore[0]": 89,
				"[1].omniscore[1]": 56,
				"[1].score[0]": 2,
				"[1].score[1]": 13,

				"[2].id": "trait3",
				"[2].user": "mikosaure",
				"[2].kills": 7,
				"[2].assists": 6,
				"[2].deaths": 6,
				"[2].count": 3,
				"[2].tier_1": 1,
				"[2].tier_2": 0,
				"[2].tier_3": 2,
				"[2].omniscore[0]": 89,
				"[2].omniscore[1]": 56,
				"[2].omniscore[2]": 25,
				"[2].score[0]": 14,
				"[2].score[1]": 3,				
			}
		},
		{
			fieldsToKeep: [
				"is_victory",
				"players.user",
				"players.@omniscore",
				"traits.id",
				"traits.kills",
				"traits.*tier",
				"traits.@score",
				"traits.stats.assists:assists",
				"traits.stats.deaths:deaths",
			],
			mergeKey: "id",
			conditionField: "is_victory:players.user:traits.id",
			conditionValue: "0:mikosaure:trait1",
			conditionComp: "!=",
			length: 1,
			tests: {
				"[0].id": "trait1",
				"[0].user": "mikosaure",
				"[0].kills": 22,
				"[0].assists": 3,
				"[0].deaths": 5,
				"[0].count": 2,
				"[0].tier_1": 1,
				"[0].tier_2": 1,
				"[0].omniscore[0]": 89,
				"[0].score[0]": 5,
				"[0].score[1]": 12,
			}
		}

	];

	for(let i=0; i<tests.length; i++)
	{
		let	result = JsonProcessorUtils.ExtractObjectsWithFields(ObjUtils.GetValue(data, "matches"), "players.traits", tests[i].fieldsToKeep, tests[i].mergeKey, true, true, true, tests[i].conditionField, tests[i].conditionValue, tests[i].conditionComp);

//		console.log(result);
	
		if (result.length != tests[i].length)
		{
			console.error("Test " + i + ": lists don't have the same length: " + result.length + " instead of " + tests[i].length);
			console.log(result);
			context.assertEquals(result.length, tests[i].length);	
		}
		else
		{
			for(const key in tests[i].tests)
			{
				let	value = ObjUtils.GetValue(result, key);

				if (value != tests[i].tests[key])
				{
					console.error("Test " + i + ", key = " + key + ": " + value + " instead of " + tests[i].tests[key]);
					console.log(result);
				}

				context.assertEquals(value, tests[i].tests[key]);	
			}
		}
	}
});	

suite.test("JsonProcessorUtils.ExtractFromList", function (context) {

	let	tests = [
		{
			"list": [
				{
					"field": "value 1"
				},
				{
					"field": 10
				},
				{
					"field2": 150
				},
				{
					"field": ""
				},
				{
					"field": "value 3"
				},
			],
			"field": "field",
			"length": 3,
			"paths": {
				"[0]": "value 1",
				"[1]": 10,
				"[2]": "value 3"
			}
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// fill the list
		let	result = JsonProcessorUtils.ExtractFromList(tests[i].list, tests[i].field);

		// compare the size
		if (result.length != tests[i].length)
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

suite.test("JsonProcessorUtils.ExtractFromListMulti", function (context) {

	let	tests = [
		{
			"list": [
				{
				   "time":0,
				   "value":64
				},
				{
				   "time":224,
				   "value":64
				},
				{
				   "time":270,
				   "value":65
				}
			 ],
			"fields": ["time", "value"],
			"length": 3,
			"paths": {
				"[0]": [0, 64],
				"[1]": [224, 64],
				"[2]": [270, 65]
			}
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// fill the list
		let	result = JsonProcessorUtils.ExtractFromListMulti(tests[i].list, tests[i].fields, 0);

		// compare the size
		if (result.length != tests[i].length)
		{
			console.error("ERROR LENGTH AT " + i);
			context.assertEquals(result.length, tests[i].count);
		}
		else
		{
			for(const path in tests[i].paths)
			{
				let	value = ObjUtils.GetValue(result, path);

				assertListEquals(context, tests[i].paths[path], value);
			}
		}
	}

});

suite.test("JsonProcessorUtils.ExtractFromListWithCalculation", function (context) {

	let	tests = [
		{
			"list": [
				{
					"field1": 0,
					"field2": 5,
				},
				{
				},
				{
					"field1": 100,
					"field2": 5,
				},
				{
					"field1": "0",
					"field2": "5",
				},
			],
			"field1": "field1",
			"field2": "field2",
			"calc": "+",
			"paths": {
				"[0]": parseFloat((5).toString()),
				"[1]": parseFloat((0).toString()),
				"[2]": parseFloat((105).toString()),
				"[3]": parseFloat((5).toString()),
			}
		},
		{
			"list": [
				{
					"field1": 0,
					"field2": 5,
				},
				{
				},
				{
					"field1": 100,
					"field2": 5,
				},
				{
					"field1": "0",
					"field2": "5",
				},
			],
			"field1": "field1",
			"field2": "field2",
			"calc": "-",
			"paths": {
				"[0]": parseFloat((-5).toString()),
				"[1]": parseFloat((0).toString()),
				"[2]": parseFloat((95).toString()),
				"[3]": parseFloat((-5).toString()),
			}
		},		
	];

	for(let i=0; i<tests.length; i++)
	{
		// fill the list
		let	result = JsonProcessorUtils.ExtractFromListWithCalculation(tests[i].list, tests[i].field1, tests[i].field2, tests[i].calc);

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

suite.test("JsonProcessorUtils.MergeList", function (context) {

	let	tests = [
		{
			list: [
				{name: "test1", mybool: true},
				{name: "test1", test: 1},
				{name: "test2", mybool: false, test: 2},
			],
			options: {
				add_key: false,
				add_count: false,
				to_keep: null,
				bool_to_int: false,
				condition: {
					field: "",
					value: "",
					comparison: "=="
				}
			},
			length: 2,
			to_check: {
				"[0].mybool": true,
				"[0].test": 1,
				"[0].count": null,
				"[0].key": null,
				"[1].mybool": false,
				"[1].test": 2,
				"[1].count": null,
			}
		},
		{
			list: [
				{name: "test1", mybool: true},
				{name: "test1", test: 1},
				{name: "test2", mybool: false, test: 2},
				{name: "test2", mybool: true, test: 5},
				{name: "test2", mybool: false, test: 1},
				{name: "test3", test: 1},
			],
			options: {
				add_key: true,
				add_count: true,
				to_keep: ["mybool", "test"],
				bool_to_int: true,
				condition: {
					field: "",
					value: "",
					comparison: "=="
				}
			},
			length: 3,
			to_check: {
				"[0].name": null,
				"[0].key": "test1",
				"[0].mybool": 1,
				"[0].test": 1,
				"[0].count": 2,
				"[1].name": null,
				"[1].key": "test2",
				"[1].mybool": 1,
				"[1].test": 8,
				"[1].count": 3,
				"[2].key": "test3",
				"[2].mybool": 0,
				"[2].test": 1,
				"[2].count": 1,
			}
		},		
		{
			list: [
				{name: "test1", mybool: true, kills: 5, stats: {assists: 5}, tier: 1, is_victory: "1"},
				{name: "test1", test: 1, kills: 2, stats: {assists: 1}, tier: 1, is_victory: "2"},
				{name: "test2", mybool: false, test: 2, kills: 1, tier: 2, is_victory: "1"},
				{name: "test2", mybool: "TRuE", test: 5, kills: 8, tier: 1, is_victory: "2"},
				{name: "test2", mybool: false, test: 1, kills: 9, stats: {assists: 12}, tier: 2, is_victory: "1"},
				{name: "test3", test: 1, kills: 1, stats: {assists: 4}, tier: 3, is_victory: "1"},
				{name: "test3", test: 1, kills: 2, stats: {assists: 4}, tier: 1, is_victory: "5"},
				{name: "test3", test: 1, kills: 3, stats: {assists: 4}, tier: 2, is_victory: "6"},
				{name: "test3", test: 1, kills: 4, stats: {assists: 4}, tier: 3, is_victory: "1"},
			],
			options: {
				add_key: true,
				add_count: true,
				to_keep: ["mybool", "test:rename", "kills", "stats.assists:assists", "*tier:level", "is_victory"],
				bool_to_int: true,
				condition: {
					field: "kills",
					value: "2",
					comparison: ">="
				}
			},
			length: 3,
			to_check: {
				"[0].name": null,
				"[0].key": "test1",
				"[0].mybool": 1,
				"[0].kills": 7,
				"[0].rename": 1,
				"[0].count": 2,
				"[0].assists": 6,
				"[0].level_1": 2,
				"[0].level_2": null,
				"[0].level_3": null,
				"[0].is_victory": 3,
				"[1].name": null,
				"[1].key": "test2",
				"[1].mybool": 1,
				"[1].rename": 6,
				"[1].count": 2,
				"[1].kills": 17,
				"[1].assists": 12,
				"[1].level_1": 1,
				"[1].level_2": 1,
				"[1].level_3": null,
				"[1].is_victory": 3,
				"[2].name": null,
				"[2].key": "test3",
				"[2].mybool": 0,
				"[2].rename": 3,
				"[2].count": 3,
				"[2].kills": 9,
				"[2].assists": 12,
				"[2].level_1": 1,
				"[2].level_2": 1,
				"[2].level_3": 1,
				"[2].is_victory": 12,
			}
		},			
	];

	for(let i=0; i<tests.length; i++)
	{
		// merge the list
		let	final = JsonProcessorUtils.MergeList(tests[i].list, "name", tests[i].options.add_key, tests[i].options.add_count, tests[i].options.to_keep, tests[i].options.bool_to_int, tests[i].options.condition.field, tests[i].options.condition.value, tests[i].options.condition.comparison);

		if (final.length != tests[i].length)
		{
			console.error("Error: not same number of elements at test " + i);
			// check the length
			context.assertEquals(final.length, tests[i].length);
		}
		else
		{
			// run the tests
			for(const key in tests[i].to_check)
			{
				let	result = ObjUtils.GetValue(final, key);

				if (result != tests[i].to_check[key])
				{
					console.log("Error at key = " + key + " of test " + i + ", we have " + result + " instead of " + tests[i].to_check[key]);
					console.log(final);
				}
				context.assertEquals(result, tests[i].to_check[key]);
			}
		}
	}

});

suite.test("JsonProcessorUtils.FilterList", function (context) {

	let	list = [
		{
			"class": "c1",
			"kills": 19,
			"is_user": true
		},
		{
			"class": "c1",
			"kills": 21,
			"is_user": false
		},
		{
			"class": "c2",
			"kills": 22,
			"is_user": true
		},
		{
			"class": "c3",
			"kills": 25,
			"is_user": false
		},
	];

	let	tests = [
		{
			"field": "class",
			"value": "c1",
			"comparison": "==",
			"length": 2,
			"paths": {
				"[0].kills": 19,
				"[1].kills": 21,
			}
		},
		{
			"field": "kills",
			"value": 20,
			"comparison": ">=",
			"length": 3,
			"paths": {
				"[0].kills": 21,
				"[1].kills": 22,
				"[2].kills": 25,
			}
		},		
		{
			"field": "is_user",
			"value": true,
			"comparison": "==",
			"length": 2,
			"paths": {
				"[0].kills": 19,
				"[1].kills": 22,
			}
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// filter the list
		let	result = JsonProcessorUtils.FilterList(list, tests[i].field, tests[i].value, tests[i].comparison);

		// compare the size
		if (result.length != tests[i].length)
		{
			console.error("ERROR LENGTH AT " + i);
			context.assertEquals(result.length, tests[i].length);
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

suite.test("JsonProcessorUtils.FilterList #2", function (context) {

	let	list = [
		{
			"class": "c1",
			"kills": 19,
			"is_user": true
		},
		{
			"class": "c1",
			"kills": 21,
			"is_user": false
		},
		{
			"class": "c2",
			"kills": 22,
			"is_user": true
		},
		{
			"class": "c3",
			"kills": 25,
			"is_user": false
		},
	];

	let	tests = [
		{
			"field": "class",
			"value": "c1",
			"comparison": "==",
			"paths": {
				"kills": 19,
			}
		},
		{
			"field": "kills",
			"value": 20,
			"comparison": ">=",
			"paths": {
				"kills": 21,
			}
		},		
		{
			"field": "is_user",
			"value": true,
			"comparison": "==",
			"paths": {
				"kills": 19,
			}
		},
		{
			"field": "kills",
			"value": 55,
			"comparison": "==",
			"paths": {
				"kills": null,
			}
		},		
		{
			"field": "class:kills",
			"value": "c1:19",
			"comparison": "==",
			"paths": {
				"class": "c1",
				"kills": 19,
			}
		},		
		{
			"field": "class:kills",
			"value": "c1:19",
			"comparison": "==:>=",
			"paths": {
				"class": "c1",
				"kills": 19,
			}
		},		
		{
			"field": "is_user:kills",
			"value": "false:20",
			"comparison": "==:>",
			"paths": {
				"class": "c1",
				"kills": 21,
			}
		},				
	];

	for(let i=0; i<tests.length; i++)
	{
		// filter the list
		let	result = ObjUtils.FindFirst(list, tests[i].field, tests[i].value, tests[i].comparison);

		for(const path in tests[i].paths)
		{
			let	value = ObjUtils.GetValue(result, path);

			if (value != tests[i].paths[path])
				console.log("ERROR: " + path + " is different: " + value + " VS " + tests[i].paths[path]);
			context.assertEquals(value, tests[i].paths[path]);
		}
	}

});


suite.run();

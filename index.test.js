/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { ObjUtils } from './src/utils/ObjUtils';
import { StringUtils } from './src/utils/StringUtils';
import { DateUtils } from './src/utils/DateUtils';
import { JavaUtils } from './src/utils/JavaUtils';
import { UrlUtils } from './src/utils/UrlUtils';
import { MathUtils } from './src/utils/MathUtils';
import { JsonProcessor } from './src/jsonprocessor/JsonProcessor';
import { JsonBuilder } from './src/jsonprocessor/JsonBuilder';

const suite = TestSuite.create("ES4X Utils");

// ObjUtils.HasProperty
suite.test("ObjUtils.HasProperty", function (context) {

	let	obj = {
		'id': 1,
		'code': undefined,
		'name': "",
		'bio': null
	};
	context.assertEquals(true, ObjUtils.HasProperty(obj, 'id'));
	context.assertEquals(true, ObjUtils.HasProperty(obj, 'name'));
	context.assertEquals(false, ObjUtils.HasProperty(obj, 'code'));
	context.assertEquals(false, ObjUtils.HasProperty(obj, 'bio'));
	context.assertEquals(false, ObjUtils.HasProperty(obj, 'other'));
});




function	compareArrays(_context, _list1, _list2)
{
	if (_list1.length == _list2.length)
	{
		for(let	i=0; i<_list1.length; i++)
		_context.assertEquals(_list1[i], _list2[i]);
	}
	else
		_context.assertEquals(_list1.length, _list2.length);
}


suite.test("StringUtils.ReplaceAll", function (context) {

	let	text = "test'1";
	let	expectedResult = "test''1";
	let	result = StringUtils.ReplaceAll(text, "'", "''");

	context.assertEquals(expectedResult, result);
});

// StringUtils.ToBool
suite.test("StringUtils.ToBool", function (context) {
	context.assertEquals(true, StringUtils.ToBool("true"));
	context.assertEquals(true, StringUtils.ToBool(true));
	context.assertEquals(true, StringUtils.ToBool("1"));
	context.assertEquals(true, StringUtils.ToBool("True"));
	context.assertEquals(true, StringUtils.ToBool("TRUE"));
	context.assertEquals(false, StringUtils.ToBool("false"));
	context.assertEquals(false, StringUtils.ToBool("0"));
	context.assertEquals(false, StringUtils.ToBool(false));
});

suite.test("ObjUtils.GetValueRecursive", function (context) {
	let	obj = {
		'id': 1,
		'user_id': 12,
		'users': [
			{
				'user_id': 12,
				'name': "supername",
				'origin': {
					'user_id': null
				}
			},
			{
				'user_id': 13,
				'name': "supername",
				'origin': {
					'user_id': 14
				}
			},
			{
				'user_id': 10,
				'name': "supername",
				'origin': {
					'user_id': 102
				}
			}
		],
		'info': {
			'author': "Mr Dark",
			'user_id': 1000
		}
	};

	let	ids = ObjUtils.GetValueRecursive(obj, "user_id");
	let	resultExpected = [12, 13, 14, 10, 102, 1000];

	context.assertEquals(ids.length, resultExpected.length);
	for(let i=0; i<ids.length; i++)
		context.assertEquals(ids[i], resultExpected[i]);
});

suite.test("ObjUtils.GetValueRecursive with LIST", function (context) {
	let	list = [
		{
			'user_id': 12,
			'name': "supername",
			'origin': {
				'user_id': null
			}
		},
		{
			'user_id': 13,
			'name': "supername",
			'origin': {
				'user_id': 14
			}
		},
		{
			'user_id': 10,
			'name': "supername",
			'origin': {
				'user_id': 102
			}
		}
	];

	let	ids = ObjUtils.GetValueRecursive(list, "user_id");
	let	resultExpected = [12, 13, 14, 10, 102];

	context.assertEquals(ids.length, resultExpected.length);
	for(let i=0; i<ids.length; i++)
		context.assertEquals(ids[i], resultExpected[i]);
});

suite.test("ObjUtils.GetValueRecursive with LIST 2", function (context) {
	let	list = [
		{
			"code":"5a2a69d4-f353-4630-ba05-ecdc79d5d16d",
			"created_at":"2021-11-17T21:08:35.771839Z",
			"is_read":true,
			"category":"social",
			"payload":{
				"code":"posts.like.post_liked",
				"type":"post_liked",
				"model":"like",
				"payload":{
					"target":{
						"post_id":47,
						"user_id":22
					},
					"user_id":34
				},
				"service":"posts",
				"created_at":"2021-11-12 00:00:00"
			}
		}
	];

	let	ids = ObjUtils.GetValueRecursive(list, "user_id");
	let	resultExpected = [22, 34];

	context.assertEquals(ids.length, resultExpected.length);
	for(let i=0; i<ids.length; i++)
		context.assertEquals(ids[i], resultExpected[i]);
});

suite.test("ObjUtils.ReplaceValueRecursive with LIST", function (context) {
	let	list = [
		{
			'user_id': 12,
			'name': "supername",
			'origin': {
				'user_id': null
			}
		},
		{
			'user_id': 13,
			'name': "supername",
			'origin': {
				'user_id': 14
			}
		},
		{
			'user_id': 10,
			'name': "supername",
			'origin': {
				'user_id': 102
			}
		}
	];

	let	users = {
		12: { "name": "user 12"},
		13: { "name": "user 13"},
		14: { "name": "user 14"},
		10: { "name": "user 10"},
	}

	let	final = ObjUtils.ReplaceValueRecursive(list, "user_id", users, "user_info");

	context.assertEquals(ObjUtils.GetValue(final[0], "user_info.name", ""), "user 12");
	context.assertEquals(ObjUtils.GetValue(final[0], "origin.user_info", null), null);
	context.assertEquals(ObjUtils.GetValue(final[1], "user_info.name", ""), "user 13");
	context.assertEquals(ObjUtils.GetValue(final[1], "origin.user_info.name", ""), "user 14");
	context.assertEquals(ObjUtils.GetValue(final[2], "user_info.name", ""), "user 10");
	context.assertEquals(ObjUtils.GetValue(final[2], "origin.user_info.name", ""), "");
});

suite.test("ObjUtils.SubstituteValuesInString", function (context) {
	let	obj = {
		'user_id': 12,
		'name': "supername",
		'origin': {
			'user_info': {
				"username": "mike"
			}
		}
	};

	let	str = "Good morning {{name}}, do you know this guy? {{origin.user_info.username}} and this one '{{testempty}}' and this one {{origin.user_info.username}} or event with a default {{empty|nick}} and another one {{origin.user_info.username|default2}}?";
	let	result = "Good morning supername, do you know this guy? mike and this one '' and this one mike or event with a default nick and another one mike?";

	let	output = ObjUtils.SubstituteValuesInString(str, obj);

	context.assertEquals(output, result);
});

suite.test("ObjUtils.ExtractValuesToString", function (context) {
	let	obj = {
		'user_id': 12,
		'name': "supername",
		'origin': {
			'user_id': 55
		}	
	};

	let	fields = {
		"user_id": "id",
		"name": "name",
		"origin.user_id": "target_id"
	}

	let	final = ObjUtils.ExtractValuesToString(obj, fields);

	context.assertEquals(ObjUtils.GetValue(final, "id", ""), "12");
	context.assertEquals(ObjUtils.GetValue(final, "name", ""), "supername");
	context.assertEquals(ObjUtils.GetValue(final, "target_id", ""), "55");
});

suite.test("StringUtils.ExtractHashtags", function (context) {
	let	tests = {
		"#": {
			"#this is a #hashtag, #Hashtag": ["this", "hashtag"],
			"no hashtag at all": [],
			"n#o #hash_tag #at,al#l": ["hash_tag", "at"],
			"this is the new version of #omnislash\r\n": ["omnislash"],
			"#surf #surf #test #toxicrepost we have to keep testing @gory to make the #perfectpost": ["surf", "test", "toxicrepost", "perfectpost"],
			"#test #test @timetoy #surf @timetoy ": ["test", "surf"]
		},
		"@": {
			"@this is a @hashtag": ["this", "hashtag"],
			"no hashtag at all": [],
			"n@o @hash_tag #at, #al@l": ["hash_tag"],
			"#test #test @timetoy #surf @timetoy ": ["timetoy"]
		},
		"/": {
			"/this is a /hashtag": ["this", "hashtag"],
			"no hashtag at all": [],
			"n/o /hash_tag /at,al/l": ["hash_tag", "at"],
			"test test /test /leagueoflegends": ["test", "leagueoflegends"],
			"/Leagueoflegends": ["leagueoflegends"]
		},
	};

	// test all of them
	for(const separator in tests)
	{
		for(const key in tests[separator])
		{
			let	result = StringUtils.ExtractHashtags(key, separator);
	
			// compare
			context.assertEquals(result.length, tests[separator][key].length);
			if (result.length == tests[separator][key].length)
			{
				for(let i=0; i<result.length; i++)
				{
					context.assertEquals(result[i], tests[separator][key][i]);
				}
			}
		}
	}
});


suite.test("StringUtils.ExtractYouTubeVideoID", function (context) {
	let	tests = {
		"http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index": "0zM3nApSvMg",
		"http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o": "QdK8U-VIH_o",
		"http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0": "0zM3nApSvMg",
		"http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s": "0zM3nApSvMg",
		"http://www.youtube.com/embed/0zM3nApSvMg?rel=0": "0zM3nApSvMg",
		"http://www.youtube.com/watch?v=0zM3nApSvMg": "0zM3nApSvMg",
		"http://youtu.be/0zM3nApSvMg": "0zM3nApSvMg",
		"https://youtu.be/vR60tNCGCIE": "vR60tNCGCIE",
	};

	// test all of them
	for(const key in tests)
	{
		let	result = StringUtils.ExtractYouTubeVideoID(key);

		context.assertEquals(result, tests[key]);
	}
});


suite.test("StringUtils.IsUrl", function (context) {
	let	tests = {
		"http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index": true,
		"twitch.tv/goryfigment": false,
		"https://twitter.com/drdisrespect/status/1298657188236255232": true,
		"twitch.tv/mb_doom": false,
		"https://www.youtube.com/embed/0zM3nApSvMg?rel=0": true
	};

	// test all of them
	for(const key in tests)
	{
		let	result = StringUtils.IsUrl(key);

		context.assertEquals(result, tests[key]);
	}
});

suite.test("StringUtils.ExtractURLs", function (context) {
	let	tests = {
		"j'aime bien http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index": ["http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index"],
		"twitch.tv/goryfigment": ["https://twitch.tv/goryfigment"],
		"Ici je met google.com and https://twitter.com/drdisrespect/status/1298657188236255232, test, and https://google.com": ["https://google.com", "https://twitter.com/drdisrespect/status/1298657188236255232"],
		"twitch.tv/mb_doom and https://twitch.tv/mb_doom": ["https://twitch.tv/mb_doom"],
		"ici je m,et,https://www.youtube.com/embed/0zM3nApSvMg?rel=0 and this one hahah.ha": ["https://www.youtube.com/embed/0zM3nApSvMg?rel=0"]
	};

	// test all of them
	for(const key in tests)
	{
		let	result = StringUtils.ExtractURLs(key);

		// compare
		context.assertEquals(result.length, tests[key].length);
		if (result.length == tests[key].length)
		{
			for(let i=0; i<result.length; i++)
			{
				context.assertEquals(result[i], tests[key][i]);
			}
		}
	}
});

suite.test("ObjUtils.HasKeys", function (context) {

	context.assertEquals(ObjUtils.HasKeys({}), false);
	context.assertEquals(ObjUtils.HasKeys(null), false);
	context.assertEquals(ObjUtils.HasKeys(undefined), false);
	context.assertEquals(ObjUtils.HasKeys({"key": true}), true);

});


suite.test("StringUtils.ToFloat", function (context) {

	context.assertEquals(StringUtils.ToInt("2.55"), 3);
	context.assertEquals(StringUtils.ToInt(1.55), 2);
	context.assertEquals(StringUtils.ToInt(1), 1);
	context.assertEquals(StringUtils.ToInt("5"), 5);
	context.assertEquals(StringUtils.ToFloat("2.55"), 2.55);
	context.assertEquals(StringUtils.ToFloat(1.55), 1.55);
	context.assertEquals(StringUtils.ToFloat(1), parseFloat((1).toString()));
	context.assertEquals(StringUtils.ToInt("test"), 0);
//	context.assertEquals(StringUtils.ToFloat("2"), Number(2.0));

});

suite.test("ObjUtils.IsArrayEmpty", function (context) {

	context.assertEquals(ObjUtils.IsArrayEmpty(null), true);
	context.assertEquals(ObjUtils.IsArrayEmpty([]), true);
	context.assertEquals(ObjUtils.IsArrayEmpty("test"), true);
	context.assertEquals(ObjUtils.IsArrayEmpty([1]), false);
	context.assertEquals(ObjUtils.IsArrayEmpty(["test", "test2"]), false);

});


suite.test("ObjUtils.Unflatten", function (context) {
	let	dataStr = [
		{
			"nothing": "nothing"
		},
		{
			"key": "first",
			"value": "does this work?"
		},
		{
			"key": "title.text",
			"value": "Omniscore"
		},
		{
			"key": "title.icons[1]",
			"value": "img/icon/1.png"
		},
		{
			"key": "value.text",
			"value": "44"
		},
		{
			"key": "compare.percent",
			"value": "10"
		},
		{
			"key": "compare.arrow",
			"value": "up"
		},
		{
			"key": "compare.arrow2"
		},
		{
			"key":"chart_data.test1.test2.test3",
			"value":"{\\\"hours\\\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,38,0]}"
		},
		{
			"key":"values[0].label",
			"value":"1st"
		 },
		 {
			"key":"values[0].label_color",
			"value":"#ffffff"
		 },
		 {
			"key":"values[0].text",
			"value":"0%"
		 },
		 {
			"key":"values[0].percent",
			"value":"0"
		 },
		 {
			"key":"values[1].label",
			"value":"2nd"
		 },
		 {
			"key":"values[1].label_color",
			"value":"#3aa8d9"
		 },
		 {
			"key":"values[1].text",
			"value":"0%"
		 },
		 {
			"key":"values[1].percent",
			"value":"0"
		 },
		 {
			"key":"values[2].label",
			"value":"3rd"
		 },
		 {
			"key":"values[2].label_color",
			"value":"#3aa8d9"
		 },
		 {
			"key":"values[2].text",
			"value":"0%"
		 },
		 {
			"key":"values[2].percent",
			"value":"0"
		 },
		 {
			"key":"values[3].label",
			"value":"4th"
		 },
		 {
			"key":"values[3].label_color",
			"value":"#3aa8d9"
		 },
		 {
			"key":"values[3].text",
			"value":"0%"
		 },
		 {
			"key":"values[3].percent",
			"value":"0"
		 },
		 {
			"key":"values[4].label",
			"value":"5th"
		 },
		 {
			"key":"values[4].label_color",
			"value":"#e1486d"
		 },
		 {
			"key":"values[4].text",
			"value":"0%"
		 },
		 {
			"key":"values[4].percent",
			"value":"0"
		 },
		 {
			"key":"values[5].label",
			"value":"6th"
		 },
		 {
			"key":"values[5].label_color",
			"value":"#e1486d"
		 },
		 {
			"key":"values[5].text",
			"value":"100%"
		 },
		 {
			"key":"values[5].percent",
			"value":"1"
		 },
		 {
			"key":"values[6].label",
			"value":"7th"
		 },
		 {
			"key":"values[6].label_color",
			"value":"#e1486d"
		 },
		 {
			"key":"values[6].text",
			"value":"0%"
		 },
		 {
			"key":"values[6].percent",
			"value":"0"
		 },
		 {
			"key":"values[7].label",
			"value":"8th"
		 },
		 {
			"key":"values[7].label_color",
			"value":"#e1486d"
		 },
		 {
			"key":"values[7].text",
			"value":"0%"
		 },
		 {
			"key":"values[7].percent",
			"value":"0"
		 }
];
	let	output = {
		"first": "does this work?",
		"title": {
			"text": "Omniscore",
			"icons": [
				null,
				"img/icon/1.png"
			]
		},
		"value": {
			"text": 44,
		},
		"compare": {
			"percent": 10,
			"arrow": "up"
		},
		"chart_data": {
			"test1": {
				"test2": {
					"test3": {
						"hours": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,38,0]
					}
				}
			}
		},
		"values": [
			{
			  "label": "1st",
			  "label_color": "#ffffff",
			  "text": "0%",
			  "percent": 0
			},
			{
			  "label": "2nd",
			  "label_color": "#3aa8d9",
			  "text": "0%",
			  "percent": 0
			},
			{
			  "label": "3rd",
			  "label_color": "#3aa8d9",
			  "text": "0%",
			  "percent": 0
			},
			{
			  "label": "4th",
			  "label_color": "#3aa8d9",
			  "text": "0%",
			  "percent": 0
			},
			{
			  "label": "5th",
			  "label_color": "#e1486d",
			  "text": "0%",
			  "percent": 0
			},
			{
			  "label": "6th",
			  "label_color": "#e1486d",
			  "text": "100%",
			  "percent": 1
			},
			{
			  "label": "7th",
			  "label_color": "#e1486d",
			  "text": "0%",
			  "percent": 0
			},
			{
			  "label": "8th",
			  "label_color": "#e1486d",
			  "text": "0%",
			  "percent": 0
			}
		  ]
	};

	// unflatten the object
	let	result = ObjUtils.Unflatten(dataStr);

	context.assertEquals(result.first, output.first);
	context.assertEquals(result.title.text, output.title.text);
	for(let i=0; i<output.title.icons.length; i++)
		context.assertEquals(result.title.icons[i], output.title.icons[i]);
	context.assertEquals(result.value.text, output.value.text);
	context.assertEquals(result.compare.percent, output.compare.percent);
	context.assertEquals(result.compare.arrow, output.compare.arrow);
	context.assertEquals(result.chart_data.test1.test2.test3.hours[21], output.chart_data.test1.test2.test3.hours[21]);
	for(let i=0; i<output.values.length; i++)
	{
		context.assertEquals(result.values[i].label, output.values[i].label);
		context.assertEquals(result.values[i].label_color, output.values[i].label_color);
		context.assertEquals(result.values[i].text, output.values[i].text);
		context.assertEquals(result.values[i].percent, output.values[i].percent);
	}

});

suite.test("StringUtils.AppendOrdinalSuffix", function (context) {

	let	tests = {
		1: "1st",
		2: "2nd",
		3: "3rd",
		"4": "4th",
		10: "10th",
		111: "111th",
		"91": "91st",
		"99": "99th"
	};

	for(const key in tests)
	{
		// get the value
		let	value = StringUtils.AppendOrdinalSuffix(key);

		// compare
		if (value != tests[key])
		{
			console.error("StringUtils.AppendOrdinalSuffix error: " + key + " => we got: " + value + " instead of " + tests[key]);
		}

		context.assertEquals(tests[key], value);		
	}

});

suite.test("JsonProcessor.process", function (context) {

	let	data = {
		"id":"20211027_231833833571_81_valve_csgo_ce6d4abd",
		"game_id":"csgo",
		"is_session_only":false,
		"is_victory":2,
		"is_ranking":false,
		"game_mode":"Casual",
		"game_mode_internal":"casual",
		"game_mode_data":"Casual",
		"game_match_id":"",
		"game_username":"OccupiedMortal",
		"game_user_id":"76561199067589909",
		"game_region_id":"",
		"match_status":"finished",
		"start_date":"2021-10-27T23:01:13.9877472Z",
		"end_date":"2021-10-27T23:18:33.1713715Z",
		"gameplay_start_date":"2021-10-27T23:01:24.9683190Z",
		"gameplay_end_date":"2021-10-27T23:18:18.4913530Z",
		"length":1039.1836,
		"gameplay_length":1013.523,
		"version":"0.31.4",
		"processor":"csgo",
		"nb_terms":0,
		"list_test": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		"game_data":{
			"game_mode":"Casual",
			"map_name":"de_inferno",
			"player_steamid":"76561199067589909",
			"player_steamname":"OccupiedMortal",
			"player_team":"T",
			"winner":"CT",
			"score_t":2,
			"score_ct":8,
			"current_round":9,
			"round_count_check":9,
			"player_kills":3,
			"player_kills_hs":1,
			"player_assists":0,
			"player_deaths":10,
			"player_mvps":0,
			"player_score":8,
			"rounds":[
				{
					"player_team":"T",
					"duration":70.888,
					"round":0,
					"equip_value":1200,
					"kills":0,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":23.578,
					"mvp":0,
					"score":0,
					"killer_name":"warrior9210",
					"killer_weapon":"weapon_usp_silencer",
					"killer_weapon_paintkit":"default",
					"result":"CtWinElimination",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						}
					]
				},
				{
					"player_team":"T",
					"duration":144.739,
					"round":1,
					"equip_value":4200,
					"kills":1,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":113.429,
					"mvp":0,
					"score":2,
					"killer_name":"Weegee",
					"killer_weapon":"weapon_m4a1_silencer",
					"killer_weapon_paintkit":"cu_m4a1_flashback",
					"result":"CtWinElimination",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_sg556",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":1,
							"kills_hs":0
						}
					],
					"kills_list":[
						{
							"ts":98.534,
							"hs":false,
							"weapon":"weapon_sg556"
						}
					]
				},
				{
					"player_team":"T",
					"duration":276.002,
					"round":2,
					"equip_value":3900,
					"kills":1,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":253.976,
					"mvp":0,
					"score":4,
					"killer_name":"BOT Joseph",
					"killer_weapon":"weapon_xm1014",
					"killer_weapon_paintkit":"default",
					"result":"CtWinDefuse",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_ak47",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":1,
							"kills_hs":0
						},
						{
							"name":"weapon_c4",
							"paint_kit":"default",
							"type":"C4",
							"kills":0,
							"kills_hs":0
						}
					],
					"kills_list":[
						{
							"ts":211.562,
							"hs":false,
							"weapon":"weapon_ak47"
						}
					]
				},
				{
					"player_team":"T",
					"duration":384.475,
					"round":3,
					"equip_value":4200,
					"kills":1,
					"kills_hs":1,
					"assists":0,
					"death":1,
					"death_ts":318.612,
					"mvp":0,
					"score":2,
					"killer_name":"Campap91",
					"killer_weapon":"weapon_incgrenade",
					"killer_weapon_paintkit":"default",
					"result":"CtWinElimination",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_sg556",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":1,
							"kills_hs":1
						}
					],
					"kills_list":[
						{
							"ts":311.169,
							"hs":true,
							"weapon":"weapon_sg556"
						}
					]
				},
				{
					"player_team":"T",
					"duration":460.453,
					"round":4,
					"equip_value":3900,
					"kills":0,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":397.84,
					"mvp":0,
					"score":0,
					"killer_name":"Clipzy",
					"killer_weapon":"weapon_knife",
					"killer_weapon_paintkit":"default",
					"result":"CtWinElimination",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_ak47",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":0,
							"kills_hs":0
						}
					]
				},
				{
					"player_team":"T",
					"duration":520.153,
					"round":5,
					"equip_value":3600,
					"kills":0,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":475.553,
					"mvp":0,
					"score":0,
					"killer_name":"alele_077",
					"killer_weapon":"weapon_aug",
					"killer_weapon_paintkit":"default",
					"result":"CtWinElimination",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_galilar",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_molotov",
							"paint_kit":"default",
							"type":"Grenade",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_flashbang",
							"paint_kit":"default",
							"type":"Grenade",
							"kills":0,
							"kills_hs":0
						}
					]
				},
				{
					"player_team":"T",
					"duration":667.2,
					"round":6,
					"equip_value":3400,
					"kills":0,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":536.205,
					"mvp":0,
					"score":0,
					"killer_name":"Clipzy",
					"killer_weapon":"weapon_awp",
					"killer_weapon_paintkit":"default",
					"result":"CtWinElimination",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_galilar",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_molotov",
							"paint_kit":"default",
							"type":"Grenade",
							"kills":0,
							"kills_hs":0
						}
					]
				},
				{
					"player_team":"T",
					"duration":772.073,
					"round":7,
					"equip_value":3000,
					"kills":0,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":692.817,
					"mvp":0,
					"score":0,
					"killer_name":"BOT Joseph",
					"killer_weapon":"weapon_m4a1_silencer",
					"killer_weapon_paintkit":"default",
					"result":"TWinBomb",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_galilar",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":0,
							"kills_hs":0
						}
					]
				},
				{
					"player_team":"T",
					"duration":879.509,
					"round":8,
					"equip_value":4600,
					"kills":0,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":798.019,
					"mvp":0,
					"score":0,
					"killer_name":"Clipzy",
					"killer_weapon":"weapon_awp",
					"killer_weapon_paintkit":"default",
					"result":"TWinElimination",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_sg556",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_molotov",
							"paint_kit":"default",
							"type":"Grenade",
							"kills":0,
							"kills_hs":0
						}
					]
				},
				{
					"player_team":"T",
					"duration":0,
					"round":9,
					"equip_value":3400,
					"kills":0,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":901.358,
					"mvp":0,
					"score":0,
					"killer_name":"Trex-Ate-Yo-Girl",
					"killer_weapon":"weapon_famas",
					"killer_weapon_paintkit":"cu_famas_nuke_tension",
					"result":"CtWinElimination",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_galilar",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_molotov",
							"paint_kit":"default",
							"type":"Grenade",
							"kills":0,
							"kills_hs":0
						}
					]
				}
			]
		}
	};

	let	processor = JsonProcessor.CreateFromJSON(data);

	let	tests = {
		"game_mode": "Casual",
		"value($, 'game_mode')": "Casual",
		"game_data.winner": "CT",
		"value($, 'game_data.winner')": "CT",
		"value(object($, 'game_data'), 'winner')": "CT",
		"ifEq(is_victory, '1', '1', '0')": 0,
		"game_data.rounds[0].death_ts": 23.578,
		"value(objectAt(list($, 'game_data.rounds'), '0'), 'death_ts')": 23.578,
		"sum(game_data.rounds, 'kills')": parseFloat((3).toString()),
		"value(set($, 'win', ifPlacingLte('1', '1', '0')), 'win')": 0,
		"value(set($, 'win', ifPlacingLte('2', '1', '0')), 'win')": 1,
		"value(objectAt(sort(mergeList(game_data.rounds.weapons, 'name'), 'kills|kill_hs'), '0'), 'kills')": 2,
		"value(objectAt(sort(mergeList(game_data.rounds.weapons, 'name'), 'kills|kill_hs'), '0'), 'name')": "weapon_sg556",
		"value(objectAt(sort(extractObjects($, 'game_data.rounds.weapons', 'is_victory|game_data.player_kills|weapons.name|weapons.kills', 'name'), 'kills|kill_hs'), '0'), 'kills')": 2,
		"value(objectAt(sort(extractObjects(set($, 'win', ifPlacingLte('1', '1', '0')), 'game_data.rounds.weapons', 'win|game_data.player_kills|weapons.name|weapons.kills', 'name'), 'kills|kill_hs'), '0'), 'win')": 0,
		"value(objectAt(sort(extractObjects($, 'game_data.rounds.weapons', 'is_victory|game_data.player_kills|weapons.name|weapons.kills', 'name'), 'kills|kill_hs'), '0'), 'player_kills')": 3,
		"if(eq(game_data.player_team, game_data.winner), 'Winner', 'Loser')": "Loser",
		"count(game_data.rounds)": 10,
		"valueBestMerge(game_data.rounds.weapons, 'name', 'kills|kill_hs', 'kills')": 2,
		"valueBestMerge(game_data.rounds.weapons, 'name', 'kills|kill_hs', 'name')": "weapon_sg556",
		"gameAsset('image', 'csgo.team.image', game_data.player_team)": "game_asset|img:csgo.team.image:T",
		"gameAsset('image', 'csgo.team.image', '')": "",
		"gameImgUrl('csgo.team.image', game_data.player_team)": "game_asset|img:csgo.team.image:T",
		"gameText('csgo.team.name', game_data.player_team)": "game_asset:csgo.team.name:T",
		"iconUrl('omniscore')": "game_asset|img:__common__.icon.image:omniscore",
		"result()": "Defeat",
		"textIsVictory('1', 'true')": "1st Place",
		"concat('v1', '2')": "v12",
		"concat3('v1', 'v2', match_status)": "v1v2finished",
		"gameModeName()": "game_common:game_mode:csgo|casual",
		"concat3(game_data.score_t, ' - ', game_data.score_ct)": "2 - 8",
		"concat3(game_data.score_ct, ' - ', game_data.score_t)": "8 - 2",
		"concatSwapIfEq(game_data.player_team, 'T', game_data.score_t, game_data.score_ct, ' - ')": "2 - 8",
		"gameImgUrl('csgo.weapon.image', valueBestMerge(game_data.rounds.weapons, 'name', 'kills|kill_hs', 'name'))": "game_asset|img:csgo.weapon.image:weapon_sg556",
		"concat('Kills ', valueBestMerge(game_data.rounds.weapons, 'name', 'kills|kill_hs', 'kills'))": "Kills 2",
		"add(game_data.rounds[0].round, '1')": 1,
		"inc(game_data.rounds[0].round)": 1,
		"dec(game_data.rounds[1].round)": 0,
		"sub(game_data.rounds[2].round, '2')": 0,
		"if(gt(game_data.rounds[0].death, '0'), 'Dead', 'Alive')": "Dead",
		"ifGt(game_data.rounds[0].death, '0', 'Dead', 'Alive')": "Dead",
		"iconUrlIfGt(game_data.rounds[0].death, '0', 'skull')": "game_asset|img:__common__.icon.image:skull",
		"gameImgUrlIfGt(game_data.rounds[0].death, '0', 'csgo.team.image', game_data.player_team)": "game_asset|img:csgo.team.image:T",
		"gameTextIfGt(game_data.rounds[0].death, '0', 'csgo.team.name', game_data.player_team)": "game_asset:csgo.team.name:T",
		"gameTextIfGt(game_data.rounds[0].death, '2', 'csgo.team.name', game_data.player_team)": "",
		"ifStartsWith(game_data.rounds[0].result, 'Ct', gameText('csgo.team.color', 'CT'), '')": "game_asset:csgo.team.color:CT",
		"ifStartsWith(game_data.rounds[0].result, 'T', gameText('csgo.team.color', 'T'), '')": "",
		"ifStartsWith(game_data.rounds[0].result, 'Ct', gameImgUrl('csgo.result.image', game_data.rounds[0].result), '')": "game_asset|img:csgo.result.image:CtWinElimination",
		"ifStartsWith(game_data.rounds[0].result, 'T', gameImgUrl('csgo.result.image', game_data.rounds[0].result), '')": "",
		"ifEndsWith('here is a test', 'TeST', 'yes', 'no')": "yes",
		"ifEndsWith('here is a test', 'bla', 'yes', 'no')": "no",
		"ifContains('here is a test', 'IS', 'yes', 'no')": "yes",
		"ifContains('here is a test', 'BLA', 'yes', 'no')": "no",
		"formatPercent('0.12')": "12%",
		"formatPercent('0.121')": "12%",
		"formatRound('12')": "12",
		"formatRound1('12')": "12",
		"formatRound2('12')": "12",
		"formatRound('12.1234')": "12",
		"formatRound1('12.1234')": "12.1",
		"formatRound2('12.1234')": "12.12",
		"formatRound2('12.1294')": "12.13",
		"secToMin('123')": 2,
		"secToHour('3567')": 1,
		"avgSecToAvgMin('10')": 600,
		"normalize('50', '0', '100')": 0.5,
		"sumAnd(game_data.rounds, 'kills', 'kills_hs')": 4,
		"sum(game_data.rounds, 'score')": parseFloat((8).toString()),
		"sumIf(game_data.rounds, 'score', '!=', '4')": 4,
		"sumIfNot(game_data.rounds, 'score', '4')": 4,
		"countIfBelow(game_data.rounds, 'kills', '1')": 7,
		"countIfAbove(game_data.rounds, 'kills', '0')": 3,
		"countIfEq(game_data.rounds, 'kills', '0')": 7,
		"div('5', '2')": 2.5,
		"div('5', '0')": 0,
		"avg(game_data.rounds, 'kills')": 0.3,
		"avg(game_data.rounds.weapons, 'kills')": 0.09,
		"compare('==', '10', '10')": true,
		"compare('!=', '10', 'test')": true,
		"eq('10', '10')": true,
		"neq('10', 'test')": true,
		"sumIfOther(game_data.rounds.weapons, 'kills', 'name', '==', 'weapon_sg556')": 2,
		"min(game_data.rounds, 'death_ts')": 23.578,
		"minIfGt(game_data.rounds, 'death_ts', '500')": 536.205,
		"max(game_data.rounds, 'death_ts')": 901.358,
		"maxIfLt(game_data.rounds, 'duration', '670')": 667.2,
		"first(game_data.rounds.weapons, 'name')": "weapon_knife_t",
		"latestNotEmpty(game_data.rounds.weapons, 'name')": "weapon_molotov",
		"textIsVictory('-1', 'false')": "Tie",
		"formatPlacing('1')": "1st Place",
		"formatPlacing('3')": "3rd Place",
		"formatPlacing('10')": "10th Place",
		"subList(list_test, '0', '2')": [0, 1],
		"subList(list_test, '2', '2')": [2, 3],
		"subList(list_test, '5')": [5, 6, 7, 8, 9, 10],
		"subList(list_test, '9', '5')": [9, 10],
		"firstNotEmpty('', '', '2', '3', '4')": "2",
		"ifNot(eq('10', '10'), 'it is not equal', 'it is equal')": "it is equal",
		"ifNot(eq('10', '9'), 'it is not equal', 'it is equal')": "it is not equal",
		"ifEmpty('', 'it is empty', 'it is not empty')": "it is empty",
		"if('True', 'haha', 'hoho')": "haha",
		"if('FALSE', 'haha', 'hoho')": "hoho",
		"ifEmpty('blabla', 'it is empty', 'it is not empty')": "it is not empty",
		"ifElseIfNotElseIfEmpty('true', 'first', 'false', 'second', 'notempty', 'this is empty', 'not empty')": "first",
		"ifElseIfNotElseIfEmpty('false', 'first', 'false', 'second', 'notempty', 'this is empty', 'not empty')": "second",
		"ifElseIfNotElseIfEmpty('false', 'first', 'true', 'second', '', 'this is empty', 'not empty')": "this is empty",
		"ifElseIfNotElseIfEmpty('false', 'first', 'true', 'second', 'not', 'this is empty', 'not empty')": "not empty",
		"screenshotWith('tags', 'mytag', 'defaultimg')": "~~screenshot_with~~tags~~mytag~~defaultimg~~",
		"screenshotWithCaption('Avatar Cropped', 'defaultfallguysimg')": "~~screenshot_with~~caption~~Avatar Cropped~~defaultfallguysimg~~",
		"userPicture('banner', 'defaultbanner')": "~~user_picture~~banner~~defaultbanner~~",
		"userProfilePicture('defaultprofile')": "~~user_picture~~profile~~defaultprofile~~",
		"ifPlacingEq('2', 'second', 'not second')": "second",
		"ifPlacingNeq('2', 'not second', 'second')": "second",
		"ifPlacingGte('2', 'second and more', 'first')": "second and more",
		"value(set(createObject(), 'field1', set(createObject(), 'field2', 'myvalue')), 'field1.field2')": "myvalue",
		"value(objectAt(push(createList(), set(createObject(), 'field1', 'myvalue')), '0'), 'field1')": "myvalue",
		"value(objectAt(createHighLevelStatsSingle('mykey', 'myfield', 'fieldvalue'), '0'), 'count')": 1,
		"value(objectAt(createHighLevelStatsSingle('mykey', 'myfield', 'fieldvalue'), '0'), 'key')": "mykey",
		"value(objectAt(createHighLevelStatsSingle('mykey', 'myfield', 'fieldvalue'), '0'), 'myfield')": "fieldvalue",
		"hours(start_date)": parseFloat((23).toString())
	};

	// process each test
	for(const key in tests)
	{
		// get the value
		let	value = processor.process(key);

		// compare
		if ( (ObjUtils.IsArray(tests[key]) == true) && (ObjUtils.IsArray(value) == true) )
		{
			if (value.length != tests[key].length)
			{
				console.error("Process error: " + key + " => we got: " + value + " instead of " + tests[key] + " (NOT SAME COUNT)");
				context.assertEquals(tests[key].length, value.length);
			}
			else
			{
				for(let i=0; i<value.length; i++)
				{
					if (value[i] != tests[key][i])
						console.error("Process error: value at index[" + i + "] " + key + " => we got: " + value + " instead of " + tests[key] + " (NOT SAME VALUE)");
					context.assertEquals(tests[key][i], value[i]);
				}
			}
		}
		else
		{
			if (value != tests[key])
				console.error("Process error: " + key + " => we got: " + value + " instead of " + tests[key]);
			context.assertEquals(tests[key], value);
		}
	}

});


suite.test("JsonProcessor.process with matches", function (context) {

	let	data = {
		"matches": [
			{
				"origin": {
					"game_id": "csgo",
				},
				"duration": 25,
				"rank": 2,
				"game_data": {
					"omniscore": 10
				},
				"team": "T",
				"rounds": [
					{
						"kills": 1
					},
					{
						"kills": 2
					},
				]
			},
			{
				"origin": {
					"game_id": "csgo",
				},
				"duration": 50,
				"rank": 1,
				"game_data": {
					"omniscore": 20
				},
				"team": "T",
				"rounds": [
					{
						"kills": 0
					},
					{
						"kills": 5
					},
					{
						"kills": 3
					},
				]
			},		
			{
				"origin": {
					"game_id": "tft",
				},
				"duration": 75,
				"rank": 7,
				"game_data": {
					"omniscore": 75
				},
				"champion": "TOTO",
			},		
			{
				"origin": {
					"game_id": "youriding",
				},
				"duration": 125,
			},		
		]
	};

	let	processor = JsonProcessor.CreateFromJSON(data);

	// define the summary object
	let summaryInstructions = {
		"nb_tries": "count(matches)",
		"total_duration": "sum(matches, 'duration')",
		"avg_omniscore": "avgIfGt(matches, 'game_data.omniscore', '0')",
		"nb_matches": "countIfGt(matches, 'game_data.omniscore', '0')",
		"rate_win": "div(countIfEq(matches, 'rank', '1'), countIfGt(matches, 'game_data.omniscore', '0'))",
	};
	let	summary = processor.defineObject("summary", summaryInstructions);

	// define a new list with summary for each game
	let	listInstruction = "groupBy(matches, 'origin.game_id')";
	let	objInstructions = {
		"game_id": "first($, 'origin.game_id')",
		"nb_tries": "count($)",
		"total_duration": "sum($, 'duration')",
		"avg_omniscore": "avg($, 'game_data.omniscore')",
		"rate_win": "div(countIfEq($, 'rank', '1'), count($))"
	};
	let	perGameSummary = processor.defineList("per_game_summary", listInstruction, objInstructions, "total_duration|nb_tries|avg_omniscore");
//	console.log(perGameSummary);

	// list of tests to process
	let	tests = {
		"count(matches)": 4,
		"_summary.nb_tries": 4,
		"_summary.total_duration": parseFloat((275).toString()),
		"count(_per_game_summary)": 3,
		"sum(_per_game_summary, 'total_duration')": parseFloat((275).toString()),//parseFloat((275).toString()),
		"div(_per_game_summary[0].total_duration, sum(_per_game_summary, 'total_duration'))": 0.45,
		"formatPercent(div(_per_game_summary[0].total_duration, sum(_per_game_summary, 'total_duration')))": "45%",
		"formatDurationSec(_per_game_summary[0].total_duration)": "2m",
		"formatDurationSec(_per_game_summary[0].total_duration, 'false')": "2m 5s",
		"formatDurationSec(_per_game_summary[0].total_duration, 'false', 'true')": "2 minutes 5 seconds",
		"value(objectAt(initMatchesWin(matches, '1', 'win', 'rank'), '0'), 'win')": 0,
		"value(objectAt(initMatchesWin(matches, '2', 'win', 'rank'), '0'), 'win')": 1,
		"value(objectAt(initMatchesWin(matches, '1', 'win', 'rank'), '1'), 'win')": 1,
		"value(objectAt(initMatchesWin(matches, '1', 'win', 'rank'), '2'), 'win')": 0,
	};

	// process each test
	for(const key in tests)
	{
		// get the value
		let	value = processor.process(key);

		// compare
		if (value != tests[key])
		{
			console.error("Process error: " + key + " => we got: " + value + " instead of " + tests[key]);
		}

		context.assertEquals(tests[key], value);
	}

});









suite.test("ObjUtils.GetValueCombineArray", function (context) {

	let	data = {
		"id":"20211027_231833833571_81_valve_csgo_ce6d4abd",
		"game_id":"csgo",
		"is_session_only":false,
		"is_victory":2,
		"is_ranking":false,
		"game_mode":"Casual",
		"game_mode_internal":"casual",
		"game_mode_data":"Casual",
		"game_match_id":"",
		"game_username":"OccupiedMortal",
		"game_user_id":"76561199067589909",
		"game_region_id":"",
		"match_status":"finished",
		"start_date":"2021-10-27T23:01:13.9877472Z",
		"end_date":"2021-10-27T23:18:33.1713715Z",
		"gameplay_start_date":"2021-10-27T23:01:24.9683190Z",
		"gameplay_end_date":"2021-10-27T23:18:18.4913530Z",
		"length":1039.1836,
		"gameplay_length":1013.523,
		"version":"0.31.4",
		"processor":"csgo",
		"nb_terms":0,
		"game_data":{
			"game_mode":"Casual",
			"map_name":"de_inferno",
			"player_steamid":"76561199067589909",
			"player_steamname":"OccupiedMortal",
			"player_team":"T",
			"winner":"CT",
			"score_t":2,
			"score_ct":8,
			"current_round":9,
			"round_count_check":9,
			"player_kills":3,
			"player_kills_hs":1,
			"player_assists":0,
			"player_deaths":10,
			"player_mvps":0,
			"player_score":8,
			"rounds":[
				{
					"player_team":"T",
					"duration":70.888,
					"round":0,
					"equip_value":1200,
					"kills":0,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":23.578,
					"mvp":0,
					"score":0,
					"killer_name":"warrior9210",
					"killer_weapon":"weapon_usp_silencer",
					"killer_weapon_paintkit":"default",
					"result":"CtWinElimination",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						}
					]
				},
				{
					"player_team":"T",
					"duration":144.739,
					"round":1,
					"equip_value":4200,
					"kills":1,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":113.429,
					"mvp":0,
					"score":2,
					"killer_name":"Weegee",
					"killer_weapon":"weapon_m4a1_silencer",
					"killer_weapon_paintkit":"cu_m4a1_flashback",
					"result":"CtWinElimination",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_sg556",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":1,
							"kills_hs":0
						}
					],
					"kills_list":[
						{
							"ts":98.534,
							"hs":false,
							"weapon":"weapon_sg556"
						}
					]
				},
				{
					"player_team":"T",
					"duration":276.002,
					"round":2,
					"equip_value":3900,
					"kills":1,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":253.976,
					"mvp":0,
					"score":4,
					"killer_name":"BOT Joseph",
					"killer_weapon":"weapon_xm1014",
					"killer_weapon_paintkit":"default",
					"result":"CtWinDefuse",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_ak47",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":1,
							"kills_hs":0
						},
						{
							"name":"weapon_c4",
							"paint_kit":"default",
							"type":"C4",
							"kills":0,
							"kills_hs":0
						}
					],
					"kills_list":[
						{
							"ts":211.562,
							"hs":false,
							"weapon":"weapon_ak47"
						}
					]
				},
				{
					"player_team":"T",
					"duration":384.475,
					"round":3,
					"equip_value":4200,
					"kills":1,
					"kills_hs":1,
					"assists":0,
					"death":1,
					"death_ts":318.612,
					"mvp":0,
					"score":2,
					"killer_name":"Campap91",
					"killer_weapon":"weapon_incgrenade",
					"killer_weapon_paintkit":"default",
					"result":"CtWinElimination",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_sg556",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":1,
							"kills_hs":1
						}
					],
					"kills_list":[
						{
							"ts":311.169,
							"hs":true,
							"weapon":"weapon_sg556"
						}
					]
				},
				{
					"player_team":"T",
					"duration":460.453,
					"round":4,
					"equip_value":3900,
					"kills":0,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":397.84,
					"mvp":0,
					"score":0,
					"killer_name":"Clipzy",
					"killer_weapon":"weapon_knife",
					"killer_weapon_paintkit":"default",
					"result":"CtWinElimination",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_ak47",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":0,
							"kills_hs":0
						}
					]
				},
				{
					"player_team":"T",
					"duration":520.153,
					"round":5,
					"equip_value":3600,
					"kills":0,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":475.553,
					"mvp":0,
					"score":0,
					"killer_name":"alele_077",
					"killer_weapon":"weapon_aug",
					"killer_weapon_paintkit":"default",
					"result":"CtWinElimination",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_galilar",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_molotov",
							"paint_kit":"default",
							"type":"Grenade",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_flashbang",
							"paint_kit":"default",
							"type":"Grenade",
							"kills":0,
							"kills_hs":0
						}
					]
				},
				{
					"player_team":"T",
					"duration":667.2,
					"round":6,
					"equip_value":3400,
					"kills":0,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":536.205,
					"mvp":0,
					"score":0,
					"killer_name":"Clipzy",
					"killer_weapon":"weapon_awp",
					"killer_weapon_paintkit":"default",
					"result":"CtWinElimination",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_galilar",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_molotov",
							"paint_kit":"default",
							"type":"Grenade",
							"kills":0,
							"kills_hs":0
						}
					]
				},
				{
					"player_team":"T",
					"duration":772.073,
					"round":7,
					"equip_value":3000,
					"kills":0,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":692.817,
					"mvp":0,
					"score":0,
					"killer_name":"BOT Joseph",
					"killer_weapon":"weapon_m4a1_silencer",
					"killer_weapon_paintkit":"default",
					"result":"TWinBomb",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_galilar",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":0,
							"kills_hs":0
						}
					]
				},
				{
					"player_team":"T",
					"duration":879.509,
					"round":8,
					"equip_value":4600,
					"kills":0,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":798.019,
					"mvp":0,
					"score":0,
					"killer_name":"Clipzy",
					"killer_weapon":"weapon_awp",
					"killer_weapon_paintkit":"default",
					"result":"TWinElimination",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_sg556",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_molotov",
							"paint_kit":"default",
							"type":"Grenade",
							"kills":0,
							"kills_hs":0
						}
					]
				},
				{
					"player_team":"T",
					"duration":0,
					"round":9,
					"equip_value":3400,
					"kills":0,
					"kills_hs":0,
					"assists":0,
					"death":1,
					"death_ts":901.358,
					"mvp":0,
					"score":0,
					"killer_name":"Trex-Ate-Yo-Girl",
					"killer_weapon":"weapon_famas",
					"killer_weapon_paintkit":"cu_famas_nuke_tension",
					"result":"CtWinElimination",
					"weapons":[
						{
							"name":"weapon_knife_t",
							"paint_kit":"default",
							"type":"Knife",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_glock",
							"paint_kit":"default",
							"type":"Pistol",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_galilar",
							"paint_kit":"default",
							"type":"Rifle",
							"kills":0,
							"kills_hs":0
						},
						{
							"name":"weapon_molotov",
							"paint_kit":"default",
							"type":"Grenade",
							"kills":0,
							"kills_hs":0
						}
					]
				}
			]
		}
	};

	let	result = ObjUtils.GetValue(data, "game_data.rounds.weapons");

	context.assertEquals(result.length, 35);

});

suite.test("ObjUtils.GroupBy", function (context) {

	let	data = [
		{
			"game_id": "csgo",
			"duration": 25,
			"team": "T",
			"rounds": [
				{
					"kills": 1
				},
				{
					"kills": 2
				},
			]
		},
		{
			"game_id": "csgo",
			"duration": 50,
			"team": "T",
			"rounds": [
				{
					"kills": 0
				},
				{
					"kills": 5
				},
				{
					"kills": 3
				},
			]
		},		
		{
			"game_id": "tft",
			"duration": 75,
			"champion": "TOTO",
		},		
		{
			"duration": 0,
		},		
	];

	let	result = ObjUtils.GroupBy(data, "game_id");
	context.assertEquals(result.length, 2);
	context.assertEquals(result[0].length, 2);
	context.assertEquals(result[1].length, 1);

});

suite.test("DateUtils.FormatDurationFromSec", function (context) {

	let	tests = [
		{
			"value": 59616000,
			"results": {
				"normal_full": "1 year 11 months",
				"normal_abbr": "1yr 11mo",
				"round_full": "1.9 years",
				"round_abbr": "1.9yr",
			}
		},
		{
			"value": 93312000,
			"results": {
				"normal_full": "3 years",
				"normal_abbr": "3yr",
				"round_full": "3 years",
				"round_abbr": "3yr",
			}
		},
		{
			"value": 28512060,
			"results": {
				"normal_full": "11 months 1 minute",
				"normal_abbr": "11mo 1m",
				"round_full": "11 months",
				"round_abbr": "11mo",
			}
		},				
		{
			"value": 59,
			"results": {
				"normal_full": "59 seconds",
				"normal_abbr": "59s",
				"round_full": "59 seconds",
				"round_abbr": "59s",
			}
		},				
		{
			"value": 60,
			"results": {
				"normal_full": "1 minute",
				"normal_abbr": "1m",
				"round_full": "1 minute",
				"round_abbr": "1m",
			}
		},
		{
			"value": 80,
			"results": {
				"normal_full": "1 minute 20 seconds",
				"normal_abbr": "1m 20s",
				"round_full": "1 minute",
				"round_abbr": "1m",
			}
		},
		{
			"value": 125,
			"results": {
				"normal_full": "2 minutes 5 seconds",
				"normal_abbr": "2m 5s",
				"round_full": "2 minutes",
				"round_abbr": "2m",
			}
		},				
		{
			"value": 3600,
			"results": {
				"normal_full": "1 hour",
				"normal_abbr": "1h",
				"round_full": "1 hour",
				"round_abbr": "1h",
			}
		},				
		{
			"value": 3725,
			"results": {
				"normal_full": "1 hour 2 minutes 5 seconds",
				"normal_abbr": "1h 2m 5s",
				"round_full": "1 hour",
				"round_abbr": "1h",
			}
		},				
		{
			"value": 90000,
			"results": {
				"normal_full": "1 day 1 hour",
				"normal_abbr": "1d 1h",
				"round_full": "1 day",
				"round_abbr": "1d",
			}
		},				
	];
	let	testsToDo = {
		"normal_full": {
			"round": false,
			"full": true
		},
		"normal_abbr": {
			"round": false,
			"full": false
		},
		"round_full": {
			"round": true,
			"full": true
		},
		"round_abbr": {
			"round": true,
			"full": false
		},		
	};

	for(let i=0; i<tests.length; i++)
	{
		// run each test
		for(const key in tests[i].results)
		{
			// do it
			let	result = DateUtils.FormatDurationFromSec(tests[i].value, testsToDo[key].round, testsToDo[key].full);

			// compare
			if (result != tests[i].results[key])
				console.error("DateUtils.FormatDurationFromSec ERROR: test=" + i + ", key=" + key);

			context.assertEquals(result, tests[i].results[key]);
		}
	}

});

suite.test("ObjUtils.CompareArrays", function (context) {

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
		let	result = ObjUtils.CompareArrays(tests[i].array1, tests[i].array2);
		if (result != tests[i].result)
			console.error("Error with test " + i);
	
		context.assertEquals(result, tests[i].result);
	}
});

suite.test("DateUtils.TimestampToDayNumber", function (context) {

	let	tests = [
		{
			"str": null,
			"result": 0
		},
		{
			"str": "1999-12-31T23:59:59.999999Z",
			"result": 0
		},
		{
			"str": "2000-01-01T00:00:00.000000Z",
			"result": 0
		},
		{
			"str": "2000-01-01T01:00:00.000000Z",
			"result": 0
		},
		{
			"str": "2000-01-01T23:59:59.999999Z",
			"result": 0
		},
		{
			"str": "2000-01-02T00:00:00.000000Z",
			"result": 1
		},		
		{
			"str": "2000-02-20T03:34:28.000000Z",
			"result": 50
		},		
		{
			"str": "2021-04-27T21:36:38.984321Z",
			"result": 7787
		},		
		{
			"str": "2022-04-18T15:10:00.000000-0700",
			"result": 8143
		},
		{
			"str": "2022-04-18T22:10:00.000000-0700",
			"result": 8144
		},
		{
			"str": "2022-04-18T02:10:00.000000+0700",
			"result": 8142
		}
	];

	for(let i=0; i<tests.length; i++)
	{
		// convert the date to timestamp
		let	timestamp = DateUtils.ParseToTimestamp(tests[i].str);

		// convert the timestamp to day number since jan 1 2000
		let	result = DateUtils.TimestampToDayNumber(timestamp);

		console.log("Date = " + tests[i].str + ", timestamp = " + timestamp + ", result=" + result + " VS " + tests[i].result);

		context.assertEquals(result, tests[i].result);
	}
});

suite.test("DateUtils.DayNumberToDayOfTheWeek", function (context) {

	let	tests = [
		{
			"str": "1999-12-31T23:59:59.999999Z",
			"result": "saturday"
		},
		{
			"str": "2000-01-01T00:00:00.000000Z",
			"result": "saturday"
		},
		{
			"str": "2000-01-01T01:00:00.000000Z",
			"result": "saturday"
		},
		{
			"str": "2000-01-01T23:59:59.999999Z",
			"result": "saturday"
		},
		{
			"str": "2000-01-02T00:00:00.000000Z",
			"result": "sunday"
		},		
		{
			"str": "2000-02-20T03:34:28.000000Z",
			"result": "sunday"
		},		
		{
			"str": "2021-04-27T21:36:38.984321Z",
			"result": "tuesday"
		},		
	];

	for(let i=0; i<tests.length; i++)
	{
		// convert the date to day number
		let	dayNumber = DateUtils.UTCStringToLocalDayNumber(tests[i].str);

		// convert to day of the week
		let	result = DateUtils.DayNumberToDayOfTheWeek(dayNumber);

		console.log("Date = " + tests[i].str + ", day number = " + dayNumber + ", result=" + result + " VS " + tests[i].result);

		context.assertEquals(result, tests[i].result);
	}
});

suite.test("DateUtils.UTCStringToLocalTimestamp", function (context) {

	let	tests = [
		{
			"str": "2021-04-27T21:36:38.984321Z",
			"diff": 0,
			"result": "2021-04-27 21:36:38",
			"result_day": 7787
		},
		{
			"str": "2021-04-27T21:36:38.984321Z",
			"diff": +1,
			"result": "2021-04-27 22:36:38",
			"result_day": 7787
		},
		{
			"str": "2021-04-27T21:36:38.984321Z",
			"diff": -9,
			"result": "2021-04-27 12:36:38",
			"result_day": 7787
		},
		{
			"str": "2021-04-27T21:36:38.984321Z",
			"diff": +7,
			"result": "2021-04-28 04:36:38",
			"result_day": 7788
		},
		{
			"str": "2021-04-27T01:36:38.984321Z",
			"diff": -5,
			"result": "2021-04-26 20:36:38",
			"result_day": 7786
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// convert it
		let	timestamp = DateUtils.UTCStringToLocalTimestamp(tests[i].str, tests[i].diff);

		// convert the timestamp to aaaa-mm-dd
		let	result = DateUtils.TimestampToDateTimeStr(timestamp);

		// convert the timestamp to day number
		let	resultDay = DateUtils.TimestampToDayNumber(timestamp);

		console.log("Date = " + tests[i].str + ", timestamp local = " + timestamp + ", result=" + result + " VS " + tests[i].result + ", day = " + resultDay + " VS " + tests[i].result_day);

		context.assertEquals(result, tests[i].result);
		context.assertEquals(resultDay, tests[i].result_day);
	}
});

suite.test("ObjUtils.PrepareForAddSub", function (context) {

	let	tests = [
		{
			"obj": {
				"kills": 18,
				"deaths": 8,
				"is_win": 0,
				"rounds": 12,
				"weapon": "weapon_scar20",
				"assists": 0,
				"kills_hs": 2
			},
			"paths": {
				"kills": 18,
				"deaths": 8,
				"is_win": 0,
				"rounds": 12,
				"weapon.weapon_scar20": 1,
				"assists": 0,
				"kills_hs": 2			
			}
		}
	];

	for(let i=0; i<tests.length; i++)
	{
		// convert it
		let	result = ObjUtils.PrepareForAddSub(tests[i].obj);

		// compare them
		for(const path in tests[i].paths)
		{
			let	value = ObjUtils.GetValue(result, path);

			if (value != tests[i].paths[path])
				console.log("ERROR: " + path + " is different: " + value + " VS " + tests[i].paths[path]);
			context.assertEquals(value, tests[i].paths[path]);
		}

	}

});


suite.test("ObjUtils.AddSub", function (context) {

	let	tests = [
		{
			"obj": {
				"kills": 18,
				"deaths": 8,
				"is_win": 0,
				"rounds": 12,
				"weapon": {
					"weapon_scar20": 1
				},
				"assists": 0,
				"kills_hs": 2
			},
			"obj2": {
				"kills": 18,
				"deaths": 8,
				"is_win": 0,
				"rounds": 12,
				"weapon": {
					"weapon_scar20": 1
				},
				"assists": 0,
				"kills_hs": 2
			},	
			"operation": "-",		
			"paths": {
				"kills": 0,
				"deaths": 0,
				"is_win": 0,
				"rounds": 0,
				"weapon.weapon_scar20": 0,
				"assists": 0,
				"kills_hs": 0
			}
		},
		{
			"obj": null,
			"obj2": {
				"kills": 18,
				"deaths": 8,
				"is_win": 0,
				"rounds": 12,
				"weapon": {
					"weapon_scar20": 1
				},
				"assists": 0,
				"kills_hs": 2
			},	
			"operation": "+",		
			"paths": {
				"kills": 18,
				"deaths": 8,
				"is_win": 0,
				"rounds": 12,
				"weapon.weapon_scar20": 1,
				"assists": 0,
				"kills_hs": 2
			}
		},
		{
			"obj": {},
			"obj2": {
				"kills": 18,
				"deaths": 8,
				"is_win": 0,
				"rounds": 12,
				"weapon": {
					"weapon_scar20": 1
				},
				"assists": 0,
				"kills_hs": 2
			},	
			"operation": "+",		
			"paths": {
				"kills": 18,
				"deaths": 8,
				"is_win": 0,
				"rounds": 12,
				"weapon.weapon_scar20": 1,
				"assists": 0,
				"kills_hs": 2
			}
		},		
		{
			"obj": {
				"kills": 18,
				"deaths": 8,
				"is_win": 0,
				"rounds": 12,
				"weapon": {
					"weapon_scar20": 2
				},
				"assists": 0,
				"kills_hs": 2
			},
			"obj2": {
				"kills": 10,
				"deaths": 2,
				"is_win": 1,
				"rounds": 12,
				"weapon": {
					"weapon_scar21": 1
				},
				"assists": 1,
				"kills_hs": 2
			},	
			"operation": "+",		
			"paths": {
				"kills": 28,
				"deaths": 10,
				"is_win": 1,
				"rounds": 24,
				"weapon.weapon_scar20": 2,
				"weapon.weapon_scar21": 1,
				"assists": 1,
				"kills_hs": 4
			}
		},	
		{
			"obj": {
				"count": 90,
				"per_day": {
				  "8124": "[object Object]0000000000000",
				  "8130": 0,
				  "8131": 3815,
				  "8143": 0,
				  "8144": 3922,
				  "8148": 0,
				  "8149": 6326,
				  "8150": 6595,
				  "8151": 2271.1589400000003,
				  "8152": 8684.02612,
				  "8153": 15035
				},
				"duration": "[object Object]000000001521240100000015011693000000000000000000000000000000000",
				"per_game": {
				  "lol": "[object Object]00000000152124010000001501169300000000000000000000000000000000",
				  "lostark": 333.02612,
				  "hearthstone": 826.15894
				},
				"per_weekday": {
				  "monday": 6595,
				  "sunday": 6326,
				  "tuesday": 6193.15894,
				  "saturday": 0,
				  "thursday": 15035,
				  "wednesday": "[object Object]000000000000000000000"
				},
				"timeline_lol": {
				  "8124": "[object Object]0000000000000",
				  "8130": 0,
				  "8131": 3815,
				  "8143": 0,
				  "8144": 3922,
				  "8148": 0,
				  "8149": 6326,
				  "8150": 6595,
				  "8151": 1445,
				  "8152": 8351,
				  "8153": 15035
				},
				"per_gamegroup": {
				  "": 0,
				  "lol|standard": "[object Object]00000000152124010000001501169300000000000000000000000000000000",
				  "hearthstone|standard": 826.15894
				},
				"timeline_lostark": {
				  "8151": 0,
				  "8152": 333.02612
				},
				"count_timeline_lol": {
				  "8124": 20,
				  "8130": 3,
				  "8131": 2,
				  "8143": 3,
				  "8144": 2,
				  "8148": 2,
				  "8149": 4,
				  "8150": 10,
				  "8151": 10,
				  "8152": 19,
				  "8153": 11
				},
				"timeline_hearthstone": {
				  "8151": 826.15894
				},
				"count_timeline_lostark": {
				  "8151": 1,
				  "8152": 2
				},
				"count_timeline_hearthstone": {
				  "8151": 1
				}
			},
			"obj2": {
				"count": 1,
				"duration": 0,
				"per_game": {
				  "lol": 0
				},
				"per_gamegroup": {
				  "lol|standard": 0
				},
				"per_day": {
				  "8124": 0
				},
				"per_weekday": {
				  "wednesday": 0
				},
				"timeline_lol": {
				  "8124": 0
				},
				"count_timeline_lol": {
				  "8124": 1
				}
			},
			"operation": "+",		
			"paths": {
				"per_day.8124": 0,
			}
		}
	];

	for(let i=0; i<tests.length; i++)
	{
		// do the operation
		let	result = ObjUtils.AddSub(tests[i].obj, tests[i].obj2, tests[i].operation);

		// compare them
		for(const path in tests[i].paths)
		{
			let	value = ObjUtils.GetValue(result, path);

			if (value != tests[i].paths[path])
				console.log("ERROR: " + path + " is different: " + value + " VS " + tests[i].paths[path]);
			context.assertEquals(value, tests[i].paths[path]);
		}

	}

});


suite.test("ObjUtils.IsAddSubEmpty", function (context) {

	let	tests = [
		{
			"obj": {
				"kills": 18,
				"deaths": 8,
				"is_win": 0,
				"rounds": 12,
				"weapon": {
					"weapon_scar20": 1
				},
				"assists": 0,
				"kills_hs": 2
			},
			"result": false
		},
		{
			"obj": null,
			"result": true
		},
		{
			"obj": {},
			"result": true
		},		
		{
			"obj": {
				"kills": 0,
				"deaths": 0,
				"is_win": 0,
				"rounds": 0,
				"weapon": {
					"weapon_scar20": 0
				},
				"assists": 0,
				"kills_hs": 0
			},
			"result": true
		},	
		{
			"obj": {
				"kills": 0,
				"deaths": 0,
				"is_win": 0,
				"rounds": 0,
				"weapon": {
					"weapon_scar20": 1
				},
				"assists": 0,
				"kills_hs": 0
			},
			"result": false
		},			
	];

	for(let i=0; i<tests.length; i++)
	{
		// do the operation
		let	result = ObjUtils.IsAddSubEmpty(tests[i].obj);

		context.assertEquals(result, tests[i].result);

	}

});

suite.test("ObjUtils.HighestKey", function (context) {

	let	tests = [
		{
			"obj": {
				"weapon1": 0,
				"weapon2": 0,
				"weapon3": 1,
				"weapon4": 2,
				"weapon5": 3,
				"weapon6": 3,
			},
			"result": "weapon5"
		},
		{
			"obj": {
			},
			"result": ""
		},
		{
			"obj": {
				"weapon1": "0",
				"weapon2": "0",
				"weapon3": "1",
				"weapon4": 2,
				"weapon5": "3",
				"weapon6": "3",
			},
			"result": "weapon4"
		},		
	];

	for(let i=0; i<tests.length; i++)
	{
		// do the operation
		let	result = ObjUtils.HighestKey(tests[i].obj);

		context.assertEquals(result, tests[i].result);
	}

});

suite.test("ObjUtils.LowestKey", function (context) {

	let	tests = [
		{
			"obj": {
				"weapon1": 0,
				"weapon2": 0,
				"weapon3": 1,
				"weapon4": 2,
				"weapon5": 3,
				"weapon6": 3,
			},
			"result": "weapon1"
		},
		{
			"obj": {
			},
			"result": ""
		},
		{
			"obj": {
				"weapon1": "0",
				"weapon2": "0",
				"weapon3": "1",
				"weapon4": 2,
				"weapon5": "3",
				"weapon6": "3",
				"weapon7": 1,
			},
			"result": "weapon7"
		},		
	];

	for(let i=0; i<tests.length; i++)
	{
		// do the operation
		let	result = ObjUtils.LowestKey(tests[i].obj);

		context.assertEquals(result, tests[i].result);
	}

});

suite.test("ObjUtils.AvgValues", function (context) {

	let	tests = [
		{
			"obj": {
				"weapon1": 0,
				"weapon2": 0,
				"weapon3": 1,
				"weapon4": 2,
				"weapon5": 3,
				"weapon6": 3,
			},
			"result": 1.5
		},
		{
			"obj": {
			},
			"result": 0
		},
		{
			"obj": {
				"weapon1": "0",
				"weapon2": "0",
				"weapon3": "1",
				"weapon4": 2,
				"weapon5": "3",
				"weapon6": "3",
				"weapon7": 1,
			},
			"result": 1.5
		},		
	];

	for(let i=0; i<tests.length; i++)
	{
		// do the operation
		let	result = ObjUtils.AvgValues(tests[i].obj);

		context.assertEquals(result, tests[i].result);
	}

});

suite.test("ObjUtils.CountKeys", function (context) {

	let	tests = [
		{
			"obj": null,
			"result": 0,
		},
		{
			"obj": {},
			"result": 0,
		},
		{
			"obj": {
				"key1": 0,
				"key2": 0,
				"key3": 0,
				"key4": 0,
			},
			"result": 4,
		},
		{
			"obj": {
				"key1": 0,
			},
			"result": 1,
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// count the keys
		let	result = ObjUtils.CountKeys(tests[i].obj);

		context.assertEquals(result, tests[i].result);
	}
});

suite.test("ObjUtils.ConvertToFieldValueListAndSort", function (context) {

	let	tests = [
		{
			"obj": null,
			"sort_order": "",
			"result": [],
		},
		{
			"obj": {},
			"sort_order": "",
			"result": [],
		},
		{
			"obj": {
				"key1": 2,
				"key2": 1,
				"key3": 5,
				"key4": 6,
			},
			"sort_order": "-",
			"result": [1, 2, 5, 6],
		},
		{
			"obj": {
				"key1": 2,
				"key2": 1,
				"key3": 5,
				"key4": 6,
			},
			"sort_order": "",
			"result": [6, 5, 2, 1],
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// convert to list of field/value and sort it
		let	result = ObjUtils.ConvertToFieldValueListAndSort(tests[i].obj, tests[i].sort_order);

		context.assertEquals(result.length, tests[i].result.length);
		for(let j=0; j<result.length; j++)
		{
			if (result[j].value != tests[i].result[j])
			{
				console.error("ObjUtils.ConvertToFieldValueListAndSort ERROR at index: " + i + "." + j);
				console.error(result);
			}
			context.assertEquals(parseInt(result[j].value), tests[i].result[j]);
		}

	}
});

suite.test("ObjUtils.SumValuesInArray", function (context) {

	let	tests = [
		{
			"obj": null,
			"result": 0,
		},
		{
			"obj": "test",
			"result": 0,
		},
		{
			"obj": [],
			"result": 0,
		},
		{
			"obj": ["test", "test2"],
			"result": 0,
		},
		{
			"obj": ["test", 1, "test2", 2.67],
			"result": 3.67,
		},
		{
			"obj": ["test", 1, "test2", 2.67, -1],
			"result": 2.67,
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// convert to list of field/value and sort it
		let	result = ObjUtils.SumValuesInArray(tests[i].obj);

		context.assertEquals(result, tests[i].result);

	}
});


suite.test("ObjUtils.SumValuesOfFieldInArray", function (context) {

	let	tests = [
		{
			"obj": null,
			"result": 0,
		},
		{
			"obj": "test",
			"result": 0,
		},
		{
			"obj": [],
			"result": 0,
		},
		{
			"obj": ["test", "test2"],
			"result": 0,
		},
		{
			"obj": ["test", {"field": 1},  {"field": "test2"},  {"field": 2.67}],
			"result": 3.67,
		},
		{
			"obj": ["test", {"field": 1}, {"field": "test2"},  {"field": 2.67}, {"field": -1}],
			"result": 2.67,
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// convert to list of field/value and sort it
		let	result = ObjUtils.SumValuesOfFieldInArray(tests[i].obj, "field");

		context.assertEquals(result, tests[i].result);

	}
});

suite.test("StringUtils.GetArrayIndexFromPath", function (context) {

	let	tests = [
		{
			"path": "chunk1.chunk2",
			"result": null,
		},
		{
			"path": "chunk1.chunk2[]",
			"result": null,
		},
		{
			"path": "chunk1.chunk2[0]",
			"result": {
				"path": "chunk1.chunk2",
				"index": 0
			},
		},
		{
			"path": "chunk1.chunk2[10]",
			"result": {
				"path": "chunk1.chunk2",
				"index": 10
			},
		},
		{
			"path": "chunk1[10]",
			"result": {
				"path": "chunk1",
				"index": 10
			},
		},
		{
			"path": "[10]",
			"result": {
				"path": "",
				"index": 10
			},
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// do it
		let	result = StringUtils.GetArrayIndexFromPath(tests[i].path);

		// test it
		if (tests[i].result == null)
			context.assertEquals(result, null);
		else
		{
			if (result == null)
			{
				console.error("Error with path " + tests[i].path + ", the result is null");
				context.assertNotNull(result);
			}
			else
			{
				context.assertEquals(result.path, tests[i].result.path);
				context.assertEquals(result.index, tests[i].result.index);
			}
		}
	}
});

suite.test("ObjUtils.SetValue", function (context) {

	let	obj = null;

	let	tests = [
		{
			"path": "test",
			"value": "ahu merlu"
		},
		{
			"path": "test",
			"value": "ahu merlu2"
		},
		{
			"path": "test.test",
			"value": null
		},
		{
			"path": "test2.sub1.sub2.sub3.sub4",
			"value": 4
		},
		{
			"path": "arraytest[5]",
			"value": {"subkey": "test"}
		},
		{
			"path": "arraytest[5].subkey",
			"value": "change it"
		},
		{
			"path": "arraytest[1].subkey",
			"value": "change above"
		},
		{
			"path": "arraytest[5].subkey2",
			"value": "add another one"
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// set the value
		obj = ObjUtils.SetValue(obj, tests[i].path, tests[i].value);

		// check
		let	check = ObjUtils.GetValue(obj, tests[i].path);

		context.assertEquals(check, tests[i].value);
	}

	// other test
	obj = {
		"field1": "test",
		"original_post": null
	};

	obj = ObjUtils.SetValue(obj, "original_post.field2", "test", false);
	context.assertEquals(ObjUtils.GetValue(obj, "original_post.field2", "empty"), "empty");

	obj = ObjUtils.SetValue(obj, "original_post.field2", "test", true);
	context.assertEquals(ObjUtils.GetValue(obj, "original_post.field2", "empty"), "test");

});


suite.test("DateUtils.GetStartAndEndDates", function (context) {

	let	tests = [
		{
			"start": "2021-06-07T17:38:53.067803Z",
			"duration": 492.1347,
			"result_start": "2021-06-07T17:38:53",
			"result_end": "2021-06-07T17:47:05",
		},
		{
			"start": "2021-06-07T17:00:00.067803Z",
			"duration": 55,
			"result_start": "2021-06-07T17:00:00",
			"result_end": "2021-06-07T17:00:55",
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		let	result = DateUtils.GetStartAndEndDates(tests[i].start, tests[i].duration);

		context.assertEquals(result.start, tests[i].result_start);
		context.assertEquals(result.end, tests[i].result_end);
	}	
});

suite.test("ObjUtils.BuildListOfObjectsFromIdAndDict", function (context) {

	let	tests = [
		{
			"ids": [],
			"dict": null,
			"length": 0,
			"to_check": {

			}
		},
		{
			"ids": [10, 20, 20],
			"dict": {
				1: "test 1",
				10: "test 10",
				12: "test 12",
				20: "test 20",
			},
			"length": 3,
			"to_check": {
				"[0]": "test 10",
				"[1]": "test 20",
				"[2]": "test 20",
			}
		},
		{
			"ids": [10, 20, 20],
			"dict": {
				1: "test 1",
				10: "test 10",
				12: "test 12",
			},
			"length": 1,
			"to_check": {
				"[0]": "test 10",
			}
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		let	list = ObjUtils.BuildListOfObjectsFromIdAndDict(tests[i].ids, tests[i].dict);

		// check the size
		if (list.length == tests[i].length)
		{
			// test each
			for(const key in tests[i].to_check)
			{
				let	result = ObjUtils.GetValue(list, key, "");
				context.assertEquals(result, tests[i].to_check[key]);
			}
		}
		else
		{
			console.error("Error at index " + i);
			context.assertEquals(list.length, tests[i].length);
		}

	}

});

suite.test("ObjUtils.MergeObjects", function (context) {

	let	tests = [
		{
			obj1: {mybool: true},
			obj2: {test: 1},
			options: {
				to_keep: null,
				bool_to_int: false
			},
			to_check: {
				"mybool": true,
				"test": 1
			}
		},
		{
			obj1: {mybool: true, mybool2: false},
			obj2: {mybool: true, mybool2: true, mybool3: true, test: 1},
			options: {
				to_keep: null,
				bool_to_int: true
			},
			to_check: {
				"mybool": 2,
				"mybool2": 1,
				"mybool3": 1,
				"test": 1
			}
		},
		{
			obj1: {mybool: true, mybool2: false},
			obj2: {mybool: true, mybool2: true, mybool3: true, test: 1},
			options: {
				to_keep: ["mybool3"],
				bool_to_int: true
			},
			to_check: {
				"mybool": null,
				"mybool2": null,
				"mybool3": 1,
				"test": null
			}
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// merge both objects
		let	final = ObjUtils.MergeObjects(tests[i].obj1, tests[i].obj2, tests[i].options.to_keep, tests[i].options.bool_to_int);

		// run the tests
		for(const key in tests[i].to_check)
		{
			let	result = ObjUtils.GetValue(final, key);
			if (result != tests[i].to_check[key])
			{
				console.error("Error with key = " + key + " of test " + i);
			}
			context.assertEquals(result, tests[i].to_check[key]);
		}
	}

});

// ObjUtils.GetValue
suite.test("ObjUtils.GetValue", function (context) {
	let	obj = {
		'id': 1,
		'code': undefined,
		'links': [
			{
				'url': "http",
				'name': "supername",
				'origin': {
					'link': "http2"
				}
			}
		],
		'info': {
			'author': "Mr Dark"
		}
	};
	context.assertEquals(1, ObjUtils.GetValue(obj, 'id'));
	context.assertEquals("", ObjUtils.GetValue(obj, 'code', ""));
	context.assertEquals("supername", ObjUtils.GetValue(obj, 'links[0].name'));
	context.assertEquals("http2", ObjUtils.GetValue(obj, 'links[0].origin.link'));
	context.assertEquals("Mr Dark", ObjUtils.GetValue(obj, 'info.author'));
	context.assertEquals(obj.links, ObjUtils.GetValue(obj, 'links'));

	// test with an array given
	let	list = [
		{
			"game_id": "csgo",
			"total_kills": 12,
			"test": {
				"testkey": 10
			}
		},
		{
			"game_id": "tft",
			"champion": "toto",
			"traits": [
				1, 2, 3, 4
			]
		},
		{
			"game_id": "csgo",
			"total_kills": 3,
			"test": {
				"testkey": 25
			}
		},
		{
			"game_id": "tft",
			"champion": "toto2",
			"traits": [
				5, 6, 7
			]
		},		
	];

	// test it
	let	result1 = ObjUtils.GetValue(list, 'total_kills');
	compareArrays(context, result1, [12, 3]);

	let	result2 = ObjUtils.GetValue(list, 'traits');
	compareArrays(context, result2, [1, 2, 3, 4, 5, 6, 7]);

	let	result3 = ObjUtils.GetValue(list, 'test.testkey');
	compareArrays(context, result3, [10, 25]);

	let	result4 = ObjUtils.GetValue(list, 'champion');
	compareArrays(context, result4, ["toto", "toto2"]);

	// other test
	let	newList = ["test 1", "test 2", "test 3"];
	context.assertEquals(ObjUtils.GetValue(newList, "[0]", ""), "test 1");
	context.assertEquals(ObjUtils.GetValue(newList, "[1]", ""), "test 2");
	context.assertEquals(ObjUtils.GetValue(newList, "[2]", ""), "test 3");

	let	newList2 = [{name: "test 1"}, {name: "test 2"}, {inside: {name: "test 3"}}];
	context.assertEquals(ObjUtils.GetValue(newList2, "[0].name", ""), "test 1");
	context.assertEquals(ObjUtils.GetValue(newList2, "[1].name", ""), "test 2");
	context.assertEquals(ObjUtils.GetValue(newList2, "[2].inside.name", ""), "test 3");


	// test with an array given
	let	list2 = [
		{
			"game_id": "csgo",
			"total_kills": 12,
			"test": {
				"testkey": 10
			}
		},
		{
			"game_id": "tft",
			"total_kills": 5,
			"test": {
				"testkey": 8
			}
		},
		{
			"game_id": "lol",
			"total_kills": 3,
			"test": {
				"testkey": 25
			}
		},
		{
			"game_id": "youriding",
			"waves": [
				{
					"name": "pipeline",
					"difficulty": 5
				},
				{
					"name": "cloud9",
					"difficulty": 3
				},
				{
					"name": "les corsaires",
					"difficulty": 1
				},
			]
		},			
	];

	// test search in array
	context.assertEquals(ObjUtils.GetValue(list2, "[game_id:tft].total_kills", 0), 5);
	context.assertEquals(ObjUtils.GetValue(list2, "[game_id:lol].test.testkey", 0), 25);
	context.assertEquals(ObjUtils.GetValue(list2, "[game_id:unknown].total_kills", 0), 0);
	context.assertEquals(ObjUtils.GetValue(list2, "[game_id:youriding].waves[name:pipeline].difficulty", 0), 5);


});

suite.test("ObjUtils.MergeList", function (context) {

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
		let	final = ObjUtils.MergeList(tests[i].list, "name", tests[i].options.add_key, tests[i].options.add_count, tests[i].options.to_keep, tests[i].options.bool_to_int, tests[i].options.condition.field, tests[i].options.condition.value, tests[i].options.condition.comparison);

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


suite.test("ObjUtils.PrepareForAddSub Fall Guys", function (context) {

	let	tests = [
		{
			"obj": {
				"count": 1,
				"duration": 20.3,
				"is_win": 0,
				"rounds": [
					{
						"user_qualified": 1,
						"user_kudos": 30,
						"user_fame": 30,
						"count": 1,
						"key": "round_gauntlet_08"
					},
					{
						"user_qualified": 0,
						"user_kudos": 20,
						"user_fame": 20,
						"count": 1,
						"key": "round_see_saw_360"
					}
				]
			},
			"paths": {
				"count": 1,
				"duration": 20.3,
				"is_win": 0,
				"rounds[0].key": "round_gauntlet_08",
				"rounds[1].key": "round_see_saw_360",
			}
		}
	];

	for(let i=0; i<tests.length; i++)
	{
		// convert it
		let	result = ObjUtils.PrepareForAddSub(tests[i].obj);

		// compare them
		for(const path in tests[i].paths)
		{
			let	value = ObjUtils.GetValue(result, path);

			if (value != tests[i].paths[path])
				console.log("ERROR: " + path + " is different: " + value + " VS " + tests[i].paths[path]);
			context.assertEquals(value, tests[i].paths[path]);
		}

	}

});


suite.test("ObjUtils.AddSub Fall Guys", function (context) {

	let	tests = [
		{
			"obj": {
				"count": 1,
				"duration": 20.3,
				"is_win": 0,
				"rounds": [
					{
						"user_qualified": 0,
						"user_kudos": 20,
						"user_fame": 20,
						"count": 1,
						"key": "round_see_saw_360"
					},
					{
						"user_qualified": 1,
						"user_kudos": 30,
						"user_fame": 30,
						"count": 1,
						"key": "round_gauntlet_08"
					},
				]
			},
			"obj2": {
				"count": 1,
				"duration": 20.3,
				"is_win": 1,
				"rounds": [
					{
						"user_qualified": 1,
						"user_kudos": 25,
						"user_fame": 5,
						"count": 3,
						"key": "round_gauntlet_08"
					},
					{
						"user_qualified": 0,
						"user_kudos": 20,
						"user_fame": 20,
						"count": 1,
						"key": "round_see_saw_360"
					},
					{
						"user_qualified": 2,
						"user_kudos": 20,
						"user_fame": 20,
						"count": 2,
						"key": "round_see_saw_365"
					}
				]
			},	
			"operation": "+",
			"paths": {
				"count": 2,
				"duration": 40.6,
				"is_win": 1,
				"rounds[0].key": "round_see_saw_360",
				"rounds[0].count": 2,
				"rounds[1].key": "round_gauntlet_08",
				"rounds[1].user_qualified": 2,
				"rounds[1].user_kudos": 55,
				"rounds[1].user_fame": 35,
				"rounds[1].count": 4,
				"rounds[2].key": "round_see_saw_365",
			}
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// do the operation
		let	result = ObjUtils.AddSub(tests[i].obj, tests[i].obj2, tests[i].operation);
		// compare them
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

});



suite.test("JsonProcessor.process merge list", function (context) {

	let	data = {
		"id":"20211202_184649659492_59_devolver_digital_fallguys_3c6b1bf7",
		"game_id":"fallguys",
		"is_session_only":false,
		"is_victory":32,
		"is_ranking":true,
		"game_mode":"",
		"game_mode_internal":"",
		"game_mode_data":"",
		"game_match_id":"",
		"game_username":"Rezeloot",
		"game_user_id":"",
		"game_region_id":"",
		"match_status":"finished",
		"start_date":"2021-12-02T18:23:27.1634833Z",
		"end_date":"2021-12-02T18:46:48.7653971Z",
		"gameplay_start_date":"2021-12-02T18:24:06.8934819Z",
		"gameplay_end_date":"2021-12-02T18:46:48.7485512Z",
		"length":1401.6019,
		"gameplay_length":1361.8551,
		"version":"0.31.11",
		"processor":"fallguys",
		"nb_terms":430,
		"game_data":{
			"round":6,
			"omni_score":18,
			"show_event_name":"",
			"user_name":"Rezeloot",
			"eliminated_round":2,
			"total_kudos":50,
			"total_fame":650,
			"crowns":0,
			"crown_shards":0,
			"ranks": "10,20,30,40,50",
			"rounds":[
				{
					"number":1,
					"mini_game":"round_gauntlet_08",
					"mini_game_detection":"FallGuy_Gauntlet_08 - frame 7662",
					"type":"New Mini Game Detected",
					"qualified":"",
					"eliminated":"dallyrich1,Clever Sprinting Royalty,Awesome Snoozy Goliath,Mad Evil Orange,Tricky Gaming Athlete,Randy_Beardsack,Vict115aleman,InSaNeFooL420,SoyTuCrosh,Chaotic Falling Villain,Dreamy Googly Lionheart,kerrington21,Pingu_daddy,Impfinity1000,KMART_GOTH,vicentevb2007,Real Teal VIP,Rayan24xx,Kabe91,kirby603,Jedi7891011,Dramatic Diving Disco,Juicee_iwnl,chuchito_916,K_monte06,Perfect Playing Animal,Itz_Davidsito_XL,BlissCrossapples,alexbarra9,laloncheraDVD76,Fast Bitter Moon,Grey Beaming Student,Dizzy Boss Star,Super Evil Burger,Grey Puzzling Morning,bubbyzach99,Chatty Dodging Snake,qmcafee22,Crafty Fall Villain,Cheeky Bubbling Flyer,playette93,Infallible Golden Streamer,Demon-_-Ela,Bonkers Yeeted Treasure,Sleepy Chilling Grabber,Wobbly Golden Disco,yael_xpro1,TrapGod_Gurmalll,Friendly Daring Chum,Winter_Tires,ChelRai94,buffdog78,TempestTur,FreeFIopper,erbs503,SONICH2020,RagingMunchies,RequiemTerrapaxt",
					"user_qualified":"True",
					"user_position":40,
					"team_score":0,
					"user_kudos":30,
					"user_fame":30,
					"user_bonus_kudos":0,
					"user_bonus_fame":0,
					"badge_id":"",
					"spectating":"false",
					"duration":91.068,
					"altered":"true",
					"set_changes":"Under Tightropes",
					"change_type":"SeeSaw"
				},
				{
					"number":2,
					"mini_game":"round_see_saw_360",
					"mini_game_detection":"FallGuy_SeeSaw360 - frame 18202",
					"type":"New Mini Game Detected",
					"qualified":"",
					"eliminated":"Tricky Gaming Athlete,kirby603,kerrington21,Randy_Beardsack,Dreamy Googly Lionheart,InSaNeFooL420,Bonkers Yeeted Treasure,Chatty Dodging Snake,playette93,Itz_Davidsito_XL,Real Teal VIP,Impfinity1000,chuchito_916,Dizzy Boss Star,qmcafee22,Crafty Fall Villain,Chaotic Falling Villain,K_monte06,SoyTuCrosh,BlissCrossapples,KMART_GOTH,Perfect Playing Animal,Rayan24xx,vicentevb2007,bubbyzach99,Mad Evil Orange,Cheeky Bubbling Flyer,Super Evil Burger,Pingu_daddy,Grey Puzzling Morning,Infallible Golden Streamer,Wobbly Golden Disco,Dramatic Diving Disco,alexbarra9,Jedi7891011,Demon-_-Ela,Vict115aleman,laloncheraDVD76,Juicee_iwnl,Kabe91",
					"user_qualified":"False",
					"user_position":32,
					"team_score":0,
					"user_kudos":20,
					"user_fame":20,
					"user_bonus_kudos":0,
					"user_bonus_fame":0,
					"badge_id":"",
					"spectating":"false",
					"duration":0,
					"altered":"",
					"set_changes":"",
					"change_type":""
				},
				{
					"number":3,
					"mini_game":"round_airtime",
					"mini_game_detection":"FallGuy_Airtime - frame 31249",
					"type":"",
					"qualified":"",
					"eliminated":"Tricky Gaming Athlete,kerrington21,Mad Evil Orange,Bonkers Yeeted Treasure,Super Evil Burger,Real Teal VIP,Itz_Davidsito_XL,Chaotic Falling Villain,vicentevb2007,Impfinity1000,bubbyzach99,Randy_Beardsack,chuchito_916,Dreamy Googly Lionheart,KMART_GOTH,SoyTuCrosh,Pingu_daddy,Perfect Playing Animal,Crafty Fall Villain,Cheeky Bubbling Flyer,Grey Puzzling Morning,K_monte06,Rayan24xx,qmcafee22,kirby603,playette93,BlissCrossapples",
					"user_qualified":"",
					"user_position":0,
					"team_score":0,
					"user_kudos":0,
					"user_fame":0,
					"user_bonus_kudos":0,
					"user_bonus_fame":0,
					"badge_id":"",
					"spectating":"true",
					"duration":0,
					"altered":"",
					"set_changes":"",
					"change_type":""
				},
				{
					"number":4,
					"mini_game":"round_follow",
					"mini_game_detection":"FallGuy_FollowTheLeader - frame 39069",
					"type":"",
					"qualified":"",
					"eliminated":"Tricky Gaming Athlete,bubbyzach99,kerrington21,Mad Evil Orange,Randy_Beardsack,Impfinity1000,SoyTuCrosh,Pingu_daddy,chuchito_916,Chaotic Falling Villain,Bonkers Yeeted Treasure,Real Teal VIP,KMART_GOTH,Super Evil Burger,vicentevb2007,Dreamy Googly Lionheart,Itz_Davidsito_XL",
					"user_qualified":"",
					"user_position":0,
					"team_score":0,
					"user_kudos":0,
					"user_fame":0,
					"user_bonus_kudos":0,
					"user_bonus_fame":0,
					"badge_id":"",
					"spectating":"true",
					"duration":0,
					"altered":"",
					"set_changes":"",
					"change_type":""
				},
				{
					"number":5,
					"mini_game":"round_pipedup_s6_launch",
					"mini_game_detection":"FallGuy_PipedUp - frame 45773",
					"type":"",
					"qualified":"",
					"eliminated":"SoyTuCrosh,Tricky Gaming Athlete,Mad Evil Orange,Real Teal VIP,kerrington21,KMART_GOTH,Pingu_daddy,Impfinity1000,Bonkers Yeeted Treasure,Chaotic Falling Villain,bubbyzach99,Randy_Beardsack,chuchito_916",
					"user_qualified":"",
					"user_position":0,
					"team_score":0,
					"user_kudos":0,
					"user_fame":0,
					"user_bonus_kudos":0,
					"user_bonus_fame":0,
					"badge_id":"",
					"spectating":"true",
					"duration":0,
					"altered":"true",
					"set_changes":"PipeSet1,PipeSet2,PipeSet3",
					"change_type":"PipeSet1_Config1,PipeSet2_Config1,PipeSet3_Config2"
				},
				{
					"number":6,
					"mini_game":"round_jump_showdown",
					"mini_game_detection":"FallGuy_JumpShowdown_01 - frame 53963",
					"type":"Final",
					"qualified":"",
					"eliminated":"kerrington21,KMART_GOTH,Bonkers Yeeted Treasure,Real Teal VIP,Impfinity1000,Pingu_daddy,Mad Evil Orange,Tricky Gaming Athlete",
					"user_qualified":"",
					"user_position":0,
					"team_score":0,
					"user_kudos":0,
					"user_fame":0,
					"user_bonus_kudos":0,
					"user_bonus_fame":0,
					"badge_id":"",
					"spectating":"true",
					"duration":0,
					"altered":"",
					"set_changes":"",
					"change_type":""
				}
			],
			"players":[
				{
					"player_name":"dallyrich1",
					"player_id":"",
					"eliminated_turn":1,
					"ranks": "10,20,30,40,50",
				},
				{
					"player_name":"Clever Sprinting Royalty",
					"player_id":"",
					"eliminated_turn":1,
					"ranks": "10,20,30,40,50",
				},
				{
					"player_name":"Awesome Snoozy Goliath",
					"player_id":"",
					"eliminated_turn":1
				},
				{
					"player_name":"Mad Evil Orange",
					"player_id":"",
					"eliminated_turn":6
				},
				{
					"player_name":"Tricky Gaming Athlete",
					"player_id":"",
					"eliminated_turn":6
				},
				{
					"player_name":"Randy_Beardsack",
					"player_id":"",
					"eliminated_turn":5
				},
				{
					"player_name":"Vict115aleman",
					"player_id":"",
					"eliminated_turn":2
				},
				{
					"player_name":"InSaNeFooL420",
					"player_id":"",
					"eliminated_turn":2
				},
				{
					"player_name":"SoyTuCrosh",
					"player_id":"",
					"eliminated_turn":5
				},
				{
					"player_name":"Chaotic Falling Villain",
					"player_id":"",
					"eliminated_turn":5
				},
				{
					"player_name":"Dreamy Googly Lionheart",
					"player_id":"",
					"eliminated_turn":4
				},
				{
					"player_name":"kerrington21",
					"player_id":"",
					"eliminated_turn":6
				},
				{
					"player_name":"Pingu_daddy",
					"player_id":"",
					"eliminated_turn":6
				},
				{
					"player_name":"Impfinity1000",
					"player_id":"",
					"eliminated_turn":6
				},
				{
					"player_name":"KMART_GOTH",
					"player_id":"",
					"eliminated_turn":6
				},
				{
					"player_name":"vicentevb2007",
					"player_id":"",
					"eliminated_turn":4
				},
				{
					"player_name":"Real Teal VIP",
					"player_id":"",
					"eliminated_turn":6
				},
				{
					"player_name":"Rayan24xx",
					"player_id":"",
					"eliminated_turn":3
				},
				{
					"player_name":"Kabe91",
					"player_id":"",
					"eliminated_turn":2
				},
				{
					"player_name":"kirby603",
					"player_id":"",
					"eliminated_turn":3
				},
				{
					"player_name":"Jedi7891011",
					"player_id":"",
					"eliminated_turn":2
				},
				{
					"player_name":"Dramatic Diving Disco",
					"player_id":"",
					"eliminated_turn":2
				},
				{
					"player_name":"Juicee_iwnl",
					"player_id":"",
					"eliminated_turn":2
				},
				{
					"player_name":"chuchito_916",
					"player_id":"",
					"eliminated_turn":5
				},
				{
					"player_name":"K_monte06",
					"player_id":"",
					"eliminated_turn":3
				},
				{
					"player_name":"Perfect Playing Animal",
					"player_id":"",
					"eliminated_turn":3
				},
				{
					"player_name":"Itz_Davidsito_XL",
					"player_id":"",
					"eliminated_turn":4
				},
				{
					"player_name":"BlissCrossapples",
					"player_id":"",
					"eliminated_turn":3
				},
				{
					"player_name":"alexbarra9",
					"player_id":"",
					"eliminated_turn":2
				},
				{
					"player_name":"laloncheraDVD76",
					"player_id":"",
					"eliminated_turn":2
				},
				{
					"player_name":"Fast Bitter Moon",
					"player_id":"",
					"eliminated_turn":1
				},
				{
					"player_name":"Grey Beaming Student",
					"player_id":"",
					"eliminated_turn":1
				},
				{
					"player_name":"Dizzy Boss Star",
					"player_id":"",
					"eliminated_turn":2
				},
				{
					"player_name":"Super Evil Burger",
					"player_id":"",
					"eliminated_turn":4
				},
				{
					"player_name":"Grey Puzzling Morning",
					"player_id":"",
					"eliminated_turn":3
				},
				{
					"player_name":"bubbyzach99",
					"player_id":"",
					"eliminated_turn":5
				},
				{
					"player_name":"Chatty Dodging Snake",
					"player_id":"",
					"eliminated_turn":2
				},
				{
					"player_name":"qmcafee22",
					"player_id":"",
					"eliminated_turn":3
				},
				{
					"player_name":"Crafty Fall Villain",
					"player_id":"",
					"eliminated_turn":3
				},
				{
					"player_name":"Cheeky Bubbling Flyer",
					"player_id":"",
					"eliminated_turn":3
				},
				{
					"player_name":"playette93",
					"player_id":"",
					"eliminated_turn":3
				},
				{
					"player_name":"Infallible Golden Streamer",
					"player_id":"",
					"eliminated_turn":2
				},
				{
					"player_name":"Demon-_-Ela",
					"player_id":"",
					"eliminated_turn":2
				},
				{
					"player_name":"Bonkers Yeeted Treasure",
					"player_id":"",
					"eliminated_turn":6
				},
				{
					"player_name":"Sleepy Chilling Grabber",
					"player_id":"",
					"eliminated_turn":1
				},
				{
					"player_name":"Wobbly Golden Disco",
					"player_id":"",
					"eliminated_turn":2
				},
				{
					"player_name":"yael_xpro1",
					"player_id":"",
					"eliminated_turn":1
				},
				{
					"player_name":"TrapGod_Gurmalll",
					"player_id":"",
					"eliminated_turn":1
				},
				{
					"player_name":"Friendly Daring Chum",
					"player_id":"",
					"eliminated_turn":1
				},
				{
					"player_name":"Winter_Tires",
					"player_id":"",
					"eliminated_turn":1
				},
				{
					"player_name":"ChelRai94",
					"player_id":"",
					"eliminated_turn":1
				},
				{
					"player_name":"buffdog78",
					"player_id":"",
					"eliminated_turn":1
				},
				{
					"player_name":"TempestTur",
					"player_id":"",
					"eliminated_turn":1
				},
				{
					"player_name":"FreeFIopper",
					"player_id":"",
					"eliminated_turn":1
				},
				{
					"player_name":"erbs503",
					"player_id":"",
					"eliminated_turn":1
				},
				{
					"player_name":"SONICH2020",
					"player_id":"",
					"eliminated_turn":1
				},
				{
					"player_name":"RagingMunchies",
					"player_id":"",
					"eliminated_turn":1
				},
				{
					"player_name":"RequiemTerrapaxt",
					"player_id":"",
					"eliminated_turn":1
				}
			]
		}
	};

	let	processor = JsonProcessor.CreateFromJSON(data);

	// define our instruction
	let	instruction = "mergeList(game_data.rounds, 'mini_game', 'true', 'true', 'user_qualified|user_kudos|user_fame', 'true', 'spectating', 'false')";

	// process it
	let	result = processor.process(instruction);
	context.assertEquals(result.length, 2);

	// other tests
	let	tests = {
		"countIf(game_data.rounds, 'spectating', '==', 'false')": 2,
		"countIf(game_data.rounds, 'user_qualified', '==', 'true')": 1,
		"value(simplifyObj(game_data, 'round:rd|total_kudos:tlk'), 'rd')": 6,
		"value(simplifyObj(game_data, 'round:rd|total_kudos:tlk'), 'tlk')": 50,
		"value(simplifyObj(game_data, 'round:rd|user_name:name'), 'name')": "Rezeloot",
		"value(objectAt(simplifyList(game_data.players, 'player_name:name|eliminated_turn:turn'), '9'), 'name')": "Chaotic Falling Villain",
		"value(objectAt(simplifyList(game_data.players, 'player_name:name|eliminated_turn'), '9'), 'eliminated_turn')": 5,
		"sumValues(split(game_data.ranks))": 150,
		"minValues(split(game_data.ranks))": 10,
		"maxValues(split(game_data.ranks))": 50,
		"avgValues(split(game_data.ranks))": 30,//parseFloat((30).toString()),
		"value(processObj(game_data, 'user_name', 'concat', 'here is ', '~~value~~'), 'user_name')": "here is Rezeloot",
		"value(processObj(game_data, 'round', 'div', '~~value~~', '2'), 'round')": parseFloat((6/2).toString()),
		"value(objectAt(gameImgUrlList(game_data.rounds, 'mini_game', 'fallguys.minigame.image'), '2'), 'mini_game')": "game_asset|img:fallguys.minigame.image:round_airtime",
		"value(objectAt(gameTextList(game_data.rounds, 'mini_game', 'fallguys.minigame.name'), '2'), 'mini_game')": "game_asset:fallguys.minigame.name:round_airtime",
		"value(objectAt(concatList(game_data.rounds, 'mini_game', 'Round ', '~~value~~'), '2'), 'mini_game')": "Round round_airtime",
		"sumValues(value(objectAt(splitList(game_data.players, 'ranks'), '1'), 'ranks'))": 150,
		"sumValues(fillList('4', '10', '-5'))": parseFloat((10).toString()),
		"objectAt(listToStr(fillList('4', '10', '-5')), '1')": "5",
		"objectAt(invertListValues(fillList('4', '10', '-5'), '10'), '0')": parseFloat((0).toString()),
		"objectAt(invertListValues(fillList('4', '10', '-5'), '10'), '3')": parseFloat((15).toString()),
		"gameImgUrl('hearthstone.tavern_level.image', '5')": "game_asset|img:hearthstone.tavern_level.image:5",
	};
	for(const key in tests)
	{
		let	resultBuf = processor.process(key);

		if (resultBuf != tests[key])
		{
			console.error("error processing: " + key + ", we got " + resultBuf + " instead of " + tests[key]);
			console.error(resultBuf);
		}
		context.assertEquals(resultBuf, tests[key]);
	}
	

});


suite.test("ObjUtils.FilterList", function (context) {

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
		let	result = ObjUtils.FilterList(list, tests[i].field, tests[i].value, tests[i].comparison);

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

suite.test("ObjUtils.FilterList", function (context) {

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

suite.test("ObjUtils.CopyAndRenameFieldsOnly", function (context) {

	let	tests = [
		{
			"obj": {
				"f1": 10,
				"f2": "content",
				"f3": [1, 2, 3]
			},
			"new": {
				"f1": "field1",
				"f3": "",
				"f4": "field4"
			},
			"paths": {
				"field1": 10,
				"f3[0]": 1,
				"field4": null,
			}
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// filter the list
		let	result = ObjUtils.CopyAndRenameFieldsOnly(tests[i].obj, tests[i].new);

		for(const path in tests[i].paths)
		{
			let	value = ObjUtils.GetValue(result, path);

			if (value != tests[i].paths[path])
				console.log("ERROR: " + path + " is different: " + value + " VS " + tests[i].paths[path]);
			context.assertEquals(value, tests[i].paths[path]);
		}
	}

});

suite.test("StringUtils.DeserializeToObject", function (context) {

	let	tests = [
		{
			"str": "f1:10|f2:content|f3:false",
			"paths": {
				"f1": 10,
				"f2": "content",
				"f3": false,
			}
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// filter the list
		let	result = StringUtils.DeserializeToObject(tests[i].str);

		for(const path in tests[i].paths)
		{
			let	value = ObjUtils.GetValue(result, path);

			if (value != tests[i].paths[path])
				console.log("ERROR: " + path + " is different: " + value + " VS " + tests[i].paths[path]);
			context.assertEquals(value, tests[i].paths[path]);
		}
	}

});

suite.test("StringUtils.Split", function (context) {

	let	tests = [
		{
			"str": "10, 20, my content , false , 30,,,,",
			"skipempty": true,
			"length": 5,
			"paths": {
				"[0]": 10,
				"[1]": 20,
				"[2]": "my content",
				"[3]": false,
				"[4]": 30
			}
		},
		{
			"str": "Low,Mid,High",
			"skipempty": false,
			"length": 3,
			"paths": {
				"[0]": "Low",
				"[1]": "Mid",
				"[2]": "High",
			}
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// filter the list
		let	result = StringUtils.Split(tests[i].str, ",", true, tests[i].skipempty);

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

suite.test("ObjUtils.FillList", function (context) {

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
		let	result = ObjUtils.FillList(tests[i].count, tests[i].start, tests[i].step);

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
				context.assertEquals(value, tests[i].paths[path]);
			}
		}
	}

});

suite.test("ObjUtils.ListToString", function (context) {

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
		let	result = ObjUtils.ListToString(tests[i].list);

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


suite.test("ObjUtils.InvertListValues", function (context) {

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
		let	result = ObjUtils.InvertListValues(tests[i].list, tests[i].max);

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


suite.test("ObjUtils.FillListColor", function (context) {

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
		let	result = ObjUtils.FillListColor(tests[i].count, tests[i].color);

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

suite.test("ObjUtils.ReverseList", function (context) {

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
		let	result = ObjUtils.ReverseList(tests[i].list);

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

suite.test("ObjUtils.ExtractFromList", function (context) {

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
		let	result = ObjUtils.ExtractFromList(tests[i].list, tests[i].field);

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


suite.test("ObjUtils.ExtractFromListMulti", function (context) {

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
		let	result = ObjUtils.ExtractFromListMulti(tests[i].list, tests[i].fields, 0);

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

suite.test("ObjUtils.ExtractFromListWithCalculation", function (context) {

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
		let	result = ObjUtils.ExtractFromListWithCalculation(tests[i].list, tests[i].field1, tests[i].field2, tests[i].calc);

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

suite.test("ObjUtils.SetValue2", function (context) {

	let	obj = [
		{

		},
		{

		},
		{

		},
		{

		},
	];

	// do the new object
	let	newObject = ObjUtils.SetValue(obj, "depth1.depth2", "value");

	for(let item of newObject)
	{
		let	value = ObjUtils.GetValue(item, "depth1.depth2", "");

		context.assertEquals(value, "value");
	}

});

suite.test("ObjUtils.ReplaceAllIdsWithObjectInList", function (context) {

	let	items = [
		{
			"tags": {
				"users": []
			}
		},
		{
			"tags": null
		},
		{
			"tags": {
				"users": [
					"mike",
					"cassandra"
				]
			}
		},
		{
			"tags": {
				"users": [
					"mike",
					"solomon"
				]
			}
		},
		{
			"tags": {
				"users": [
					"solomon",
					"cassandra",
				]
			}
		},
	];

	let	obj = {
		"mike": {
			"name": "mike"
		},
		"cassandra": {
			"name": "cassandra"
		},
	}

	// do the new object
	items = ObjUtils.ReplaceAllIdsWithObjectInList(items, "tags.users", obj, false);
	context.assertEquals(ObjUtils.GetValue(items, "[0].tags.users", []).length, 0);
	context.assertEquals(ObjUtils.GetValue(items, "[1].tags.users", []).length, 0);
	context.assertEquals(ObjUtils.GetValue(items, "[2].tags.users", []).length, 2);
	context.assertEquals(ObjUtils.GetValue(items, "[3].tags.users", []).length, 1);
	context.assertEquals(ObjUtils.GetValue(items, "[4].tags.users", []).length, 1);
	context.assertEquals(ObjUtils.GetValue(items, "[2].tags.users[0].name", ""), "mike");
	context.assertEquals(ObjUtils.GetValue(items, "[2].tags.users[1].name", ""), "cassandra");
	context.assertEquals(ObjUtils.GetValue(items, "[3].tags.users[0].name", ""), "mike");
	context.assertEquals(ObjUtils.GetValue(items, "[4].tags.users[0].name", ""), "cassandra");


});


suite.test("JsonProcessor.process", function (context) {

	let	data = {
		"id":"20220311_221815626849_59_riot_lol_c9f1d4ca",
		"game_id":"lol",
		"is_session_only":"0",
		"is_victory":"1",
		"is_ranking":"0",
		"game_mode":830,
		"game_mode_internal":"ai_bot_match",
		"game_mode_data":"",
		"game_match_id":"4244070856",
		"game_username":"Rezeloot",
		"game_user_id":"5cf8ed4d-d12d-56e8-bbb0-a76bb7613ae5",
		"game_region_id":"NA1",
		"match_status":"finished",
		"start_date":"2022-03-11T21:57:31.978670+00:00",
		"end_date":"",
		"gameplay_start_date":"2022-03-11T21:57:31.978670+00:00",
		"gameplay_end_date":"",
		"length":1075.0,
		"gameplay_length":1075.0,
		"version":"0.31.19",
		"processor":"lol",
		"nb_terms":0,
		"game_data":{
		 "player":{
			"summoner_name":"Rezeloot",
			"game_region":"NA1",
			"champion_id":"136",
			"summoner_spell_one_id":"6",
			"summoner_spell_two_id":"7",
			"stats":{
			   "kills":15,
			   "assists":3,
			   "champion_level":13,
			   "deaths":1,
			   "vision_score":3,
			   "control_wards_purchased":0,
			   "creep_score":79,
			   "gold_earned":10366,
			   "win":true,
			   "kill_participation":0.56,
			   "gold_per_minute":578.6,
			   "creeps_per_minute":4.4,
			   "damage_dealt_champions":17850,
			   "damage_taken":12019,
			   "damage_dealt_objectives":4744
			},
			"items":{
			   "item0":3851,
			   "item1":3041,
			   "item2":1004,
			   "item3":4633,
			   "item4":3057,
			   "item5":3145,
			   "item6":3340,
			   "itemsPurchased":8
			},
			"role":{
			   "lane":"NONE",
			   "role":"SUPPORT"
			},
			"runes":{
			   "primary_rune":{
				  "id":8200,
				  "key":8229
			   },
			   "secondary_rune":{
				  "id":8100,
				  "key":8138
			   }
			},
			"team_id":"blue",
			"win":true,
			"omni_score":114,
			"summoner_spell_one":"6",
			"summoner_spell_two":"7"
		 },
		 "teams":{
			"100":{
			   "victory":true,
			   "baron_kills":0,
			   "first_baron":false,
			   "dragon_kills":0,
			   "first_dragon":false,
			   "tower_kills":7,
			   "first_tower":true,
			   "first_blood":true,
			   "total_kills":32,
			   "total_damage_to_obj":15906,
			   "total_damage_to_champs":47266,
			   "gold_earned":38219,
			   "players":[
				  {
					 "summoner_name":"AbigailHood",
					 "game_region":"NA1",
					 "champion_id":"21",
					 "summoner_spell_one_id":"6",
					 "summoner_spell_two_id":"7",
					 "stats":{
						"kills":0,
						"assists":3,
						"champion_level":7,
						"deaths":1,
						"vision_score":0,
						"control_wards_purchased":0,
						"creep_score":16,
						"gold_earned":4572,
						"win":true,
						"kill_participation":0.09,
						"gold_per_minute":255.2,
						"creeps_per_minute":0.9,
						"damage_dealt_champions":1915,
						"damage_taken":6992,
						"damage_dealt_objectives":1435
					 },
					 "items":{
						"item0":3009,
						"item1":3134,
						"item2":1053,
						"item3":1042,
						"item4":0,
						"item5":0,
						"item6":3340,
						"itemsPurchased":5
					 },
					 "role":{
						"lane":"NONE",
						"role":"SUPPORT"
					 },
					 "runes":{
						"primary_rune":{
						   "id":8200,
						   "key":8229
						},
						"secondary_rune":{
						   "id":8100,
						   "key":8138
						}
					 },
					 "team_id":"blue",
					 "win":true,
					 "omni_score":22,
					 "summoner_spell_one":"6",
					 "summoner_spell_two":"7"
				  },
				  {
					 "summoner_name":"NatalieCaro",
					 "game_region":"NA1",
					 "champion_id":"67",
					 "summoner_spell_one_id":"6",
					 "summoner_spell_two_id":"7",
					 "stats":{
						"kills":3,
						"assists":2,
						"champion_level":8,
						"deaths":0,
						"vision_score":0,
						"control_wards_purchased":0,
						"creep_score":12,
						"gold_earned":5290,
						"win":true,
						"kill_participation":0.16,
						"gold_per_minute":295.3,
						"creeps_per_minute":0.7,
						"damage_dealt_champions":3945,
						"damage_taken":6982,
						"damage_dealt_objectives":1666
					 },
					 "items":{
						"item0":3006,
						"item1":3046,
						"item2":0,
						"item3":0,
						"item4":0,
						"item5":0,
						"item6":3340,
						"itemsPurchased":4
					 },
					 "role":{
						"lane":"NONE",
						"role":"SUPPORT"
					 },
					 "runes":{
						"primary_rune":{
						   "id":8000,
						   "key":8005
						},
						"secondary_rune":{
						   "id":8200,
						   "key":8233
						}
					 },
					 "team_id":"blue",
					 "win":true,
					 "omni_score":35,
					 "summoner_spell_one":"6",
					 "summoner_spell_two":"7"
				  },
				  {
					 "summoner_name":"Rezeloot",
					 "game_region":"NA1",
					 "champion_id":"136",
					 "summoner_spell_one_id":"6",
					 "summoner_spell_two_id":"7",
					 "stats":{
						"kills":15,
						"assists":3,
						"champion_level":13,
						"deaths":1,
						"vision_score":3,
						"control_wards_purchased":0,
						"creep_score":79,
						"gold_earned":10366,
						"win":true,
						"kill_participation":0.56,
						"gold_per_minute":578.6,
						"creeps_per_minute":4.4,
						"damage_dealt_champions":17850,
						"damage_taken":12019,
						"damage_dealt_objectives":4744
					 },
					 "items":{
						"item0":3851,
						"item1":3041,
						"item2":1004,
						"item3":4633,
						"item4":3057,
						"item5":3145,
						"item6":3340,
						"itemsPurchased":8
					 },
					 "role":{
						"lane":"NONE",
						"role":"SUPPORT"
					 },
					 "runes":{
						"primary_rune":{
						   "id":8200,
						   "key":8229
						},
						"secondary_rune":{
						   "id":8100,
						   "key":8138
						}
					 },
					 "team_id":"blue",
					 "win":true,
					 "omni_score":114,
					 "summoner_spell_one":"6",
					 "summoner_spell_two":"7"
				  },
				  {
					 "summoner_name":"Onellynay",
					 "game_region":"NA1",
					 "champion_id":"222",
					 "summoner_spell_one_id":"4",
					 "summoner_spell_two_id":"7",
					 "stats":{
						"kills":10,
						"assists":5,
						"champion_level":12,
						"deaths":1,
						"vision_score":1,
						"control_wards_purchased":0,
						"creep_score":105,
						"gold_earned":11160,
						"win":true,
						"kill_participation":0.47,
						"gold_per_minute":622.9,
						"creeps_per_minute":5.9,
						"damage_dealt_champions":17456,
						"damage_taken":6327,
						"damage_dealt_objectives":6728
					 },
					 "items":{
						"item0":1055,
						"item1":6672,
						"item2":3085,
						"item3":3006,
						"item4":1038,
						"item5":1018,
						"item6":3340,
						"itemsPurchased":9
					 },
					 "role":{
						"lane":"NONE",
						"role":"DUO"
					 },
					 "runes":{
						"primary_rune":{
						   "id":8000,
						   "key":8005
						},
						"secondary_rune":{
						   "id":8200,
						   "key":8233
						}
					 },
					 "team_id":"blue",
					 "win":true,
					 "omni_score":112,
					 "summoner_spell_one":"4",
					 "summoner_spell_two":"7"
				  },
				  {
					 "summoner_name":"Amricathor",
					 "game_region":"NA1",
					 "champion_id":"126",
					 "summoner_spell_one_id":"4",
					 "summoner_spell_two_id":"7",
					 "stats":{
						"kills":4,
						"assists":6,
						"champion_level":9,
						"deaths":9,
						"vision_score":0,
						"control_wards_purchased":0,
						"creep_score":25,
						"gold_earned":6831,
						"win":true,
						"kill_participation":0.31,
						"gold_per_minute":381.3,
						"creeps_per_minute":1.4,
						"damage_dealt_champions":6100,
						"damage_taken":12400,
						"damage_dealt_objectives":1333
					 },
					 "items":{
						"item0":1055,
						"item1":6692,
						"item2":3134,
						"item3":3070,
						"item4":3158,
						"item5":0,
						"item6":3340,
						"itemsPurchased":9
					 },
					 "role":{
						"lane":"NONE",
						"role":"SUPPORT"
					 },
					 "runes":{
						"primary_rune":{
						   "id":8000,
						   "key":8005
						},
						"secondary_rune":{
						   "id":8200,
						   "key":8233
						}
					 },
					 "team_id":"blue",
					 "win":true,
					 "omni_score":34,
					 "summoner_spell_one":"4",
					 "summoner_spell_two":"7"
				  }
			   ]
			},
			"200":{
			   "victory":false,
			   "baron_kills":0,
			   "first_baron":false,
			   "dragon_kills":0,
			   "first_dragon":false,
			   "tower_kills":0,
			   "first_tower":false,
			   "first_blood":false,
			   "total_kills":10,
			   "total_damage_to_obj":5331,
			   "total_damage_to_champs":21082,
			   "gold_earned":20666,
			   "players":[
				  {
					 "summoner_name":"Ezreal",
					 "game_region":"NA1",
					 "champion_id":"81",
					 "summoner_spell_one_id":"",
					 "summoner_spell_two_id":"",
					 "stats":{
						"kills":1,
						"assists":1,
						"champion_level":9,
						"deaths":5,
						"vision_score":0,
						"control_wards_purchased":0,
						"creep_score":28,
						"gold_earned":4410,
						"win":false,
						"kill_participation":0.2,
						"gold_per_minute":246.1,
						"creeps_per_minute":1.6,
						"damage_dealt_champions":4662,
						"damage_taken":9107,
						"damage_dealt_objectives":1108
					 },
					 "items":{
						"item0":3070,
						"item1":3508,
						"item2":1001,
						"item3":1029,
						"item4":1036,
						"item5":0,
						"item6":3340,
						"itemsPurchased":13
					 },
					 "role":{
						"lane":"NONE",
						"role":"SUPPORT"
					 },
					 "runes":{
						"primary_rune":{
						   "id":8200,
						   "key":8229
						},
						"secondary_rune":{
						   "id":8100,
						   "key":8138
						}
					 },
					 "team_id":"red",
					 "win":false,
					 "omni_score":42,
					 "summoner_spell_one":"",
					 "summoner_spell_two":""
				  },
				  {
					 "summoner_name":"Nasus",
					 "game_region":"NA1",
					 "champion_id":"75",
					 "summoner_spell_one_id":"",
					 "summoner_spell_two_id":"",
					 "stats":{
						"kills":0,
						"assists":0,
						"champion_level":9,
						"deaths":3,
						"vision_score":0,
						"control_wards_purchased":0,
						"creep_score":29,
						"gold_earned":3291,
						"win":false,
						"kill_participation":0.0,
						"gold_per_minute":183.7,
						"creeps_per_minute":1.6,
						"damage_dealt_champions":2536,
						"damage_taken":10817,
						"damage_dealt_objectives":1495
					 },
					 "items":{
						"item0":1006,
						"item1":3133,
						"item2":3067,
						"item3":1001,
						"item4":1029,
						"item5":0,
						"item6":3340,
						"itemsPurchased":11
					 },
					 "role":{
						"lane":"NONE",
						"role":"SUPPORT"
					 },
					 "runes":{
						"primary_rune":{
						   "id":8400,
						   "key":8437
						},
						"secondary_rune":{
						   "id":8200,
						   "key":8224
						}
					 },
					 "team_id":"red",
					 "win":false,
					 "omni_score":24,
					 "summoner_spell_one":"",
					 "summoner_spell_two":""
				  },
				  {
					 "summoner_name":"Ryze",
					 "game_region":"NA1",
					 "champion_id":"13",
					 "summoner_spell_one_id":"",
					 "summoner_spell_two_id":"",
					 "stats":{
						"kills":6,
						"assists":1,
						"champion_level":10,
						"deaths":10,
						"vision_score":0,
						"control_wards_purchased":0,
						"creep_score":4,
						"gold_earned":4483,
						"win":false,
						"kill_participation":0.7,
						"gold_per_minute":250.2,
						"creeps_per_minute":0.2,
						"damage_dealt_champions":5678,
						"damage_taken":17964,
						"damage_dealt_objectives":0
					 },
					 "items":{
						"item0":2033,
						"item1":4644,
						"item2":1001,
						"item3":3070,
						"item4":1033,
						"item5":0,
						"item6":3340,
						"itemsPurchased":13
					 },
					 "role":{
						"lane":"NONE",
						"role":"SUPPORT"
					 },
					 "runes":{
						"primary_rune":{
						   "id":8200,
						   "key":8229
						},
						"secondary_rune":{
						   "id":8100,
						   "key":8138
						}
					 },
					 "team_id":"red",
					 "win":false,
					 "omni_score":69,
					 "summoner_spell_one":"",
					 "summoner_spell_two":""
				  },
				  {
					 "summoner_name":"Alistar",
					 "game_region":"NA1",
					 "champion_id":"12",
					 "summoner_spell_one_id":"",
					 "summoner_spell_two_id":"",
					 "stats":{
						"kills":1,
						"assists":0,
						"champion_level":7,
						"deaths":10,
						"vision_score":0,
						"control_wards_purchased":0,
						"creep_score":27,
						"gold_earned":3772,
						"win":false,
						"kill_participation":0.1,
						"gold_per_minute":210.5,
						"creeps_per_minute":1.5,
						"damage_dealt_champions":2981,
						"damage_taken":16339,
						"damage_dealt_objectives":1785
					 },
					 "items":{
						"item0":3855,
						"item1":1029,
						"item2":3047,
						"item3":3067,
						"item4":1033,
						"item5":1028,
						"item6":3340,
						"itemsPurchased":13
					 },
					 "role":{
						"lane":"NONE",
						"role":"SUPPORT"
					 },
					 "runes":{
						"primary_rune":{
						   "id":8400,
						   "key":8437
						},
						"secondary_rune":{
						   "id":8200,
						   "key":8224
						}
					 },
					 "team_id":"red",
					 "win":false,
					 "omni_score":25,
					 "summoner_spell_one":"",
					 "summoner_spell_two":""
				  },
				  {
					 "summoner_name":"Galio",
					 "game_region":"NA1",
					 "champion_id":"3",
					 "summoner_spell_one_id":"",
					 "summoner_spell_two_id":"",
					 "stats":{
						"kills":2,
						"assists":0,
						"champion_level":9,
						"deaths":4,
						"vision_score":0,
						"control_wards_purchased":0,
						"creep_score":39,
						"gold_earned":4710,
						"win":false,
						"kill_participation":0.2,
						"gold_per_minute":262.9,
						"creeps_per_minute":2.2,
						"damage_dealt_champions":5225,
						"damage_taken":12275,
						"damage_dealt_objectives":943
					 },
					 "items":{
						"item0":2033,
						"item1":1026,
						"item2":3145,
						"item3":3067,
						"item4":3802,
						"item5":0,
						"item6":3340,
						"itemsPurchased":7
					 },
					 "role":{
						"lane":"NONE",
						"role":"SUPPORT"
					 },
					 "runes":{
						"primary_rune":{
						   "id":8400,
						   "key":8437
						},
						"secondary_rune":{
						   "id":8200,
						   "key":8224
						}
					 },
					 "team_id":"red",
					 "win":false,
					 "omni_score":44,
					 "summoner_spell_one":"",
					 "summoner_spell_two":""
				  }
			   ]
			}
		 },
		 "timeline_stats":[
			{
			   "timestamp":0,
			   "player":{
				  "xp":0,
				  "gold":2500,
				  "total_gold":2500
			   },
			   "opponent":{
				  "xp":0,
				  "gold":2500,
				  "total_gold":2500
			   },
			   "diff":{
				  "xp":0,
				  "gold":0,
				  "total_gold":0
			   }
			},
			{
			   "timestamp":60004,
			   "player":{
				  "xp":0,
				  "gold":1150,
				  "total_gold":2500
			   },
			   "opponent":{
				  "xp":0,
				  "gold":0,
				  "total_gold":2500
			   },
			   "diff":{
				  "xp":0,
				  "gold":1150,
				  "total_gold":0
			   }
			},
			{
			   "timestamp":120017,
			   "player":{
				  "xp":1093,
				  "gold":1494,
				  "total_gold":2844
			   },
			   "opponent":{
				  "xp":0,
				  "gold":107,
				  "total_gold":2607
			   },
			   "diff":{
				  "xp":1093,
				  "gold":1387,
				  "total_gold":237
			   }
			},
			{
			   "timestamp":180027,
			   "player":{
				  "xp":4067,
				  "gold":2822,
				  "total_gold":4182
			   },
			   "opponent":{
				  "xp":0,
				  "gold":529,
				  "total_gold":3229
			   },
			   "diff":{
				  "xp":4067,
				  "gold":2293,
				  "total_gold":953
			   }
			},
			{
			   "timestamp":240042,
			   "player":{
				  "xp":6052,
				  "gold":3950,
				  "total_gold":5910
			   },
			   "opponent":{
				  "xp":1913,
				  "gold":1563,
				  "total_gold":4263
			   },
			   "diff":{
				  "xp":4139,
				  "gold":2387,
				  "total_gold":1647
			   }
			},
			{
			   "timestamp":300054,
			   "player":{
				  "xp":8737,
				  "gold":5964,
				  "total_gold":7924
			   },
			   "opponent":{
				  "xp":3052,
				  "gold":1312,
				  "total_gold":4962
			   },
			   "diff":{
				  "xp":5685,
				  "gold":4652,
				  "total_gold":2962
			   }
			},
			{
			   "timestamp":360062,
			   "player":{
				  "xp":10145,
				  "gold":7332,
				  "total_gold":9292
			   },
			   "opponent":{
				  "xp":5529,
				  "gold":2272,
				  "total_gold":6322
			   },
			   "diff":{
				  "xp":4616,
				  "gold":5060,
				  "total_gold":2970
			   }
			},
			{
			   "timestamp":420077,
			   "player":{
				  "xp":11425,
				  "gold":6741,
				  "total_gold":10901
			   },
			   "opponent":{
				  "xp":7587,
				  "gold":3352,
				  "total_gold":7802
			   },
			   "diff":{
				  "xp":3838,
				  "gold":3389,
				  "total_gold":3099
			   }
			},
			{
			   "timestamp":480087,
			   "player":{
				  "xp":13494,
				  "gold":5911,
				  "total_gold":13081
			   },
			   "opponent":{
				  "xp":9411,
				  "gold":2555,
				  "total_gold":8940
			   },
			   "diff":{
				  "xp":4083,
				  "gold":3356,
				  "total_gold":4141
			   }
			},
			{
			   "timestamp":540101,
			   "player":{
				  "xp":15264,
				  "gold":7423,
				  "total_gold":15403
			   },
			   "opponent":{
				  "xp":11103,
				  "gold":3389,
				  "total_gold":10209
			   },
			   "diff":{
				  "xp":4161,
				  "gold":4034,
				  "total_gold":5194
			   }
			},
			{
			   "timestamp":600113,
			   "player":{
				  "xp":17158,
				  "gold":9390,
				  "total_gold":17371
			   },
			   "opponent":{
				  "xp":12703,
				  "gold":3865,
				  "total_gold":10985
			   },
			   "diff":{
				  "xp":4455,
				  "gold":5525,
				  "total_gold":6386
			   }
			},
			{
			   "timestamp":660126,
			   "player":{
				  "xp":19881,
				  "gold":11412,
				  "total_gold":19392
			   },
			   "opponent":{
				  "xp":14664,
				  "gold":2868,
				  "total_gold":11968
			   },
			   "diff":{
				  "xp":5217,
				  "gold":8544,
				  "total_gold":7424
			   }
			},
			{
			   "timestamp":720139,
			   "player":{
				  "xp":20921,
				  "gold":11435,
				  "total_gold":21315
			   },
			   "opponent":{
				  "xp":16578,
				  "gold":3293,
				  "total_gold":12828
			   },
			   "diff":{
				  "xp":4343,
				  "gold":8142,
				  "total_gold":8487
			   }
			},
			{
			   "timestamp":780154,
			   "player":{
				  "xp":23100,
				  "gold":10731,
				  "total_gold":23361
			   },
			   "opponent":{
				  "xp":17904,
				  "gold":1531,
				  "total_gold":13631
			   },
			   "diff":{
				  "xp":5196,
				  "gold":9200,
				  "total_gold":9730
			   }
			},
			{
			   "timestamp":840176,
			   "player":{
				  "xp":25017,
				  "gold":4544,
				  "total_gold":25784
			   },
			   "opponent":{
				  "xp":20318,
				  "gold":1863,
				  "total_gold":15513
			   },
			   "diff":{
				  "xp":4699,
				  "gold":2681,
				  "total_gold":10271
			   }
			},
			{
			   "timestamp":900189,
			   "player":{
				  "xp":27827,
				  "gold":8349,
				  "total_gold":29588
			   },
			   "opponent":{
				  "xp":22430,
				  "gold":2848,
				  "total_gold":17498
			   },
			   "diff":{
				  "xp":5397,
				  "gold":5501,
				  "total_gold":12090
			   }
			},
			{
			   "timestamp":960203,
			   "player":{
				  "xp":29165,
				  "gold":5774,
				  "total_gold":31664
			   },
			   "opponent":{
				  "xp":24335,
				  "gold":1616,
				  "total_gold":18816
			   },
			   "diff":{
				  "xp":4830,
				  "gold":4158,
				  "total_gold":12848
			   }
			},
			{
			   "timestamp":1020216,
			   "player":{
				  "xp":30982,
				  "gold":4406,
				  "total_gold":34046
			   },
			   "opponent":{
				  "xp":26051,
				  "gold":2284,
				  "total_gold":20084
			   },
			   "diff":{
				  "xp":4931,
				  "gold":2122,
				  "total_gold":13962
			   }
			},
			{
			   "timestamp":1076865,
			   "player":{
				  "xp":34304,
				  "gold":8579,
				  "total_gold":38219
			   },
			   "opponent":{
				  "xp":26370,
				  "gold":716,
				  "total_gold":20666
			   },
			   "diff":{
				  "xp":7934,
				  "gold":7863,
				  "total_gold":17553
			   }
			}
		 ]
		}
		};

	let	processor = JsonProcessor.CreateFromJSON(data);

	let	todo = {
		"count": "'1'",
		"duration": "length",
		"is_win": "ifEq(is_victory, '1', '1', '0')",
		"roles": "game_data.player.role.role",
		"fav_mode": "game_mode_internal",
		"champs2": "createHighLevelStatsSingle(game_data.player.role.role, 'victory', ifEq(is_victory, '1', '1', '0'))",
		"champs": "createHighLevelStatsSingle(game_data.player.champion_id, 'victory', ifEq(is_victory, '1', '1', '0'))",
	};

	let	finalObject = {};
	for(const key in todo)
	{
		let	value = processor.process(todo[key]);

		finalObject[key] = value;
	}

	context.assertEquals(ObjUtils.GetValue(finalObject, "count"), 1);
	context.assertEquals(ObjUtils.GetValue(finalObject, "champs2", []).length, 1);
	context.assertEquals(ObjUtils.GetValue(finalObject, "champs", []).length, 1);

});



suite.test("MathUtils.Min", function (context) {

	context.assertEquals(MathUtils.Min(1, 1), 1);	
	context.assertEquals(MathUtils.Min(1, 0), 0);	
	context.assertEquals(MathUtils.Min(0, 1), 0);	
	context.assertEquals(MathUtils.Min(0, -111), -111);	
	context.assertEquals(MathUtils.Min(1000, -111), -111);	
	context.assertEquals(MathUtils.Min(1000, 2000), 1000);

});	

suite.test("MathUtils.Max", function (context) {

	context.assertEquals(MathUtils.Max(1, 1), 1);	
	context.assertEquals(MathUtils.Max(1, 0), 1);	
	context.assertEquals(MathUtils.Max(0, 1), 1);	
	context.assertEquals(MathUtils.Max(0, -111), 0);	
	context.assertEquals(MathUtils.Max(1000, -111), 1000);	
	context.assertEquals(MathUtils.Max(1000, 2000), 2000);
		
});	

suite.test("MathUtils.MinList", function (context) {

	context.assertEquals(MathUtils.MinList(), 0);	
	context.assertEquals(MathUtils.MinList([]), 0);	
	context.assertEquals(MathUtils.MinList([1, 1]), 1);	
	context.assertEquals(MathUtils.MinList([1, 1, 0, -1]), -1);	
	context.assertEquals(MathUtils.MinList([-6, 1, 0, -1]), -6);	
	context.assertEquals(MathUtils.MinList([-6, 1, 0, 1000, -6, -9]), -9);	
		
});	

suite.test("MathUtils.MaxList", function (context) {

	context.assertEquals(MathUtils.MaxList(), 0);	
	context.assertEquals(MathUtils.MaxList([]), 0);	
	context.assertEquals(MathUtils.MaxList([1, 1]), 1);	
	context.assertEquals(MathUtils.MaxList([1, 1, 0, -1]), 1);	
	context.assertEquals(MathUtils.MaxList([0, 0, 0, -1]), 0);	
	context.assertEquals(MathUtils.MaxList([-6, 1, 0, -1]), 1);	
	context.assertEquals(MathUtils.MaxList([-6, 1, 0, 1000, -6, -9]), 1000);	
	context.assertEquals(MathUtils.MaxList([-6, 1, 0, 1000, -6, -9, 1001]), 1001);	
		
});	

suite.test("MathUtils.MinMaxList", function (context) {

	assertListEquals(context, MathUtils.MinMaxList(), [0, 0]);	
	assertListEquals(context, MathUtils.MinMaxList([]), [0, 0]);	
	assertListEquals(context, MathUtils.MinMaxList([1, 1]), [1, 1]);	
	assertListEquals(context, MathUtils.MinMaxList([1, 1, 0, 2]), [0, 2]);	
	assertListEquals(context, MathUtils.MinMaxList([1, 1, 0, 2], 1), [0, 2]);	
	assertListEquals(context, MathUtils.MinMaxList([2, 2, 2, 2], 1), [1, 3]);	
});	

suite.test("MathUtils.Abs", function (context) {

	context.assertEquals(MathUtils.Abs(1), 1);	
	context.assertEquals(MathUtils.Abs(0), 0);	
	context.assertEquals(MathUtils.Abs(-10), 10);	
		
});	

suite.test("MathUtils.RoundUp", function (context) {

	context.assertEquals(MathUtils.RoundUp(10, 1), 10);	
	context.assertEquals(MathUtils.RoundUp(11, 10), 20);	
	context.assertEquals(MathUtils.RoundUp(11, 100), 100);	
	context.assertEquals(MathUtils.RoundUp(11, 1000), 1000);	
	context.assertEquals(MathUtils.RoundUp(111, 10), 120);	
	context.assertEquals(MathUtils.RoundUp(1000, 10), 1000);	
	context.assertEquals(MathUtils.RoundUp(2084, 10), 2090);	
	context.assertEquals(MathUtils.RoundUp(2084, 100), 2100);	
	context.assertEquals(MathUtils.RoundUp(2084, 1000), 3000);	
	context.assertEquals(MathUtils.RoundUp(2094, 10), 2100);	
	context.assertEquals(MathUtils.RoundUp(4456, 1000), 5000);	
		
});	

suite.test("MathUtils.FormatToK", function (context) {

	context.assertEquals(MathUtils.FormatToK(0), "0");	
	context.assertEquals(MathUtils.FormatToK(10), "1K");	
	context.assertEquals(MathUtils.FormatToK(199), "1K");	
	context.assertEquals(MathUtils.FormatToK(999), "1K");	
	context.assertEquals(MathUtils.FormatToK(1000), "1K");	
	context.assertEquals(MathUtils.FormatToK(2084), "3K");	
	context.assertEquals(MathUtils.FormatToK(2999), "3K");	
	context.assertEquals(MathUtils.FormatToK(3000), "3K");	
	context.assertEquals(MathUtils.FormatToK(-2999), "-3K");	
	context.assertEquals(MathUtils.FormatToK(-3000), "-3K");	
	context.assertEquals(MathUtils.FormatToK(-3000, true), "3K");	

});	

suite.test("MathUtils.FormatToKList", function (context) {

	assertListEquals(context, MathUtils.FormatToKList(), []);	
	assertListEquals(context, MathUtils.FormatToKList([]), []);	
	assertListEquals(context, MathUtils.FormatToKList([0]), ["0"]);	
	assertListEquals(context, MathUtils.FormatToKList([-15000, 0, 15000]), ["-15K", "0", "15K"]);	
	assertListEquals(context, MathUtils.FormatToKList([-15000, 0, 15000], true), ["15K", "0", "15K"]);	
	assertListEquals(context, MathUtils.FormatToKList([-15000, 0, 14900, 1020, 15000], true), ["15K", "0", "15K", "2K", "15K"]);	

});	

suite.test("MathUtils.FindScale", function (context) {

	context.assertEquals(MathUtils.FindScale(), 0);
	context.assertEquals(MathUtils.FindScale([]), 0);
	context.assertEquals(MathUtils.FindScale([0]), 0);
	context.assertEquals(MathUtils.FindScale([0, 10, 25, -10, -26]), 26);
	context.assertEquals(MathUtils.FindScale([0, 10, 25, -10, -26], 100), 100);
	context.assertEquals(MathUtils.FindScale([0, 10, 25, -10, -26, -124, -890, -1025, 204, 256, 999], 1000), 2000);

});	

suite.test("MathUtils.BuildScale", function (context) {

	assertListEquals(context, MathUtils.BuildScale(), [0]);	
	assertListEquals(context, MathUtils.BuildScale([]), [0]);	
	assertListEquals(context, MathUtils.BuildScale([0, 10, 25, -10, -26]), [-26, 0, 26]);	
	assertListEquals(context, MathUtils.BuildScale([0, 10, 25, -10, -26], 0, 10), [-30, 0, 30]);	
	assertListEquals(context, MathUtils.BuildScale([0, 10, 25, -10, -26], 0, 100), [-100, 0, 100]);	
	assertListEquals(context, MathUtils.BuildScale([0, 10, 25, -10, -26], 1, 100), [-100, -50, 0, 50, 100]);	

});	

suite.test("MathUtils.BuildScaleDomain", function (context) {

	assertListEquals(context, MathUtils.BuildScaleDomain(), [-1, 1]);	
	assertListEquals(context, MathUtils.BuildScaleDomain([]), [-1, 1]);	
	assertListEquals(context, MathUtils.BuildScaleDomain([0, 10, 25, -10, -26]), [-26, 26]);	
	assertListEquals(context, MathUtils.BuildScaleDomain([0, 10, 25, -10, -26], 10), [-30, 30]);	
	assertListEquals(context, MathUtils.BuildScaleDomain([0, 10, 25, -10, -26], 100), [-100, 100]);	
	assertListEquals(context, MathUtils.BuildScaleDomain([0, 10, 25, -10, -26], 100), [-100, 100]);	

});	


suite.test("ObjUtils.ReplaceAllIdsWithObjectInList2", function (context) {

	let	items = [
		{
			"code": "0e83a592-0edd-4cac-84cd-65ea93b7c8e4",
			"created_at": "2022-03-11T20:13:31.258710Z",
			"is_read": true,
			"category": "social",
			"payload": {
				"code": "posts.like.post_liked",
				"type": "post_liked",
				"model": "like",
				"payload": {
					"target": {
						"post_id": 3100,
						"user_id": 239,
						"post_info": {
							"id": 3100,
							"created_at": "2022-02-28T16:43:41.065011Z",
							"text": "testing",
							"nb_replies": 2,
							"nb_likes": 1,
							"nb_reposts": 0,
							"nb_shares": 0,
							"user_id": 239,
							"report_id": null,
							"original_post": null,
							"story_info": null,
							"attachment_id": 4,
							"game_match_id": null,
							"media": [],
							"is_liked": false,
							"tags": null,
							"comments": [],
							"user_info": {
								"id": 239,
								"username": "jasmine",
								"name": "📱Jasmine",
								"bio": "this is my bio and more bio and even more bio and the most bio ever just so much bio here the most you've ever seen really and more bio just in case",
								"links": {
									"twitter": "test"
								},
								"images": {
									"profile": {
										"id": "dev/users/239/profile/profile_1645130947045",
										"type": "img_profile",
										"urls": {
											"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/profile_1645130947045",
											"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_thumb,g_face,w_100,h_100/dev/users/239/profile/profile_1645130947045"
										}
									},
									"banner": {
										"id": "dev/users/239/profile/banner_1647878204659",
										"type": "img_banner",
										"urls": {
											"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/banner_1647878204659",
											"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_fill,g_auto:subject,w_772,h_255/dev/users/239/profile/banner_1647878204659"
										}
									}
								},
								"stats_usage": {
									"nb_followers": 10,
									"nb_following": 65,
									"nb_games": 0,
									"nb_matches": 0,
									"nb_mentions": 0,
									"nb_posts": 23
								}
							}
						},
						"user_info": {
							"id": 239,
							"username": "jasmine",
							"name": "📱Jasmine",
							"bio": "this is my bio and more bio and even more bio and the most bio ever just so much bio here the most you've ever seen really and more bio just in case",
							"links": {
								"twitter": "test"
							},
							"images": {
								"profile": {
									"id": "dev/users/239/profile/profile_1645130947045",
									"type": "img_profile",
									"urls": {
										"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/profile_1645130947045",
										"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_thumb,g_face,w_100,h_100/dev/users/239/profile/profile_1645130947045"
									}
								},
								"banner": {
									"id": "dev/users/239/profile/banner_1647878204659",
									"type": "img_banner",
									"urls": {
										"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/banner_1647878204659",
										"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_fill,g_auto:subject,w_772,h_255/dev/users/239/profile/banner_1647878204659"
									}
								}
							},
							"stats_usage": {
								"nb_followers": 10,
								"nb_following": 65,
								"nb_games": 0,
								"nb_matches": 0,
								"nb_mentions": 0,
								"nb_posts": 23
							}
						}
					},
					"user_id": 239,
					"user_info": {
						"id": 239,
						"username": "jasmine",
						"name": "📱Jasmine",
						"bio": "this is my bio and more bio and even more bio and the most bio ever just so much bio here the most you've ever seen really and more bio just in case",
						"links": {
							"twitter": "test"
						},
						"images": {
							"profile": {
								"id": "dev/users/239/profile/profile_1645130947045",
								"type": "img_profile",
								"urls": {
									"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/profile_1645130947045",
									"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_thumb,g_face,w_100,h_100/dev/users/239/profile/profile_1645130947045"
								}
							},
							"banner": {
								"id": "dev/users/239/profile/banner_1647878204659",
								"type": "img_banner",
								"urls": {
									"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/banner_1647878204659",
									"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_fill,g_auto:subject,w_772,h_255/dev/users/239/profile/banner_1647878204659"
								}
							}
						},
						"stats_usage": {
							"nb_followers": 10,
							"nb_following": 65,
							"nb_games": 0,
							"nb_matches": 0,
							"nb_mentions": 0,
							"nb_posts": 23
						}
					}
				},
				"service": "posts",
				"created_at": "2022-03-11T20:12:54.936Z"
			}
		},
		{
			"code": "1493f849-0211-4a8a-9de0-0fa52712245e",
			"created_at": "2022-03-10T20:03:05.165714Z",
			"is_read": true,
			"category": "social",
			"payload": {
				"code": "posts.like.post_liked",
				"type": "post_liked",
				"model": "like",
				"payload": {
					"target": {
						"post_id": 2656,
						"user_id": 239,
						"post_info": {
							"id": 2656,
							"created_at": "2021-12-31T18:57:18.719793Z",
							"text": "not my report omnislash.com @mike3 /tft",
							"nb_replies": 2,
							"nb_likes": 2,
							"nb_reposts": 0,
							"nb_shares": 0,
							"user_id": 239,
							"report_id": "report-ee93d8a4-10ce-4ddd-aa81-1a8da0151a8d",
							"original_post": null,
							"story_info": null,
							"attachment_id": 112,
							"game_match_id": null,
							"media": [
								{
									"id": 950,
									"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/posts/3089f5fc-257f-446a-afed-0457788af572",
									"url_crop": null,
									"type": "image"
								},
								{
									"id": 949,
									"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/posts/4084e790-81d3-4427-a688-4bd0b207cf26",
									"url_crop": null,
									"type": "image"
								}
							],
							"is_liked": false,
							"tags": {
								"users": ["mike3"],
								"games": [
									"tft"
								],
								"hashtags": []
							},
							"comments": [],
							"user_info": {
								"id": 239,
								"username": "jasmine",
								"name": "📱Jasmine",
								"bio": "this is my bio and more bio and even more bio and the most bio ever just so much bio here the most you've ever seen really and more bio just in case",
								"links": {
									"twitter": "test"
								},
								"images": {
									"profile": {
										"id": "dev/users/239/profile/profile_1645130947045",
										"type": "img_profile",
										"urls": {
											"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/profile_1645130947045",
											"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_thumb,g_face,w_100,h_100/dev/users/239/profile/profile_1645130947045"
										}
									},
									"banner": {
										"id": "dev/users/239/profile/banner_1647878204659",
										"type": "img_banner",
										"urls": {
											"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/banner_1647878204659",
											"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_fill,g_auto:subject,w_772,h_255/dev/users/239/profile/banner_1647878204659"
										}
									}
								},
								"stats_usage": {
									"nb_followers": 10,
									"nb_following": 65,
									"nb_games": 0,
									"nb_matches": 0,
									"nb_mentions": 0,
									"nb_posts": 23
								}
							}
						},
						"user_info": {
							"id": 239,
							"username": "jasmine",
							"name": "📱Jasmine",
							"bio": "this is my bio and more bio and even more bio and the most bio ever just so much bio here the most you've ever seen really and more bio just in case",
							"links": {
								"twitter": "test"
							},
							"images": {
								"profile": {
									"id": "dev/users/239/profile/profile_1645130947045",
									"type": "img_profile",
									"urls": {
										"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/profile_1645130947045",
										"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_thumb,g_face,w_100,h_100/dev/users/239/profile/profile_1645130947045"
									}
								},
								"banner": {
									"id": "dev/users/239/profile/banner_1647878204659",
									"type": "img_banner",
									"urls": {
										"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/banner_1647878204659",
										"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_fill,g_auto:subject,w_772,h_255/dev/users/239/profile/banner_1647878204659"
									}
								}
							},
							"stats_usage": {
								"nb_followers": 10,
								"nb_following": 65,
								"nb_games": 0,
								"nb_matches": 0,
								"nb_mentions": 0,
								"nb_posts": 23
							}
						}
					},
					"user_id": 239,
					"user_info": {
						"id": 239,
						"username": "jasmine",
						"name": "📱Jasmine",
						"bio": "this is my bio and more bio and even more bio and the most bio ever just so much bio here the most you've ever seen really and more bio just in case",
						"links": {
							"twitter": "test"
						},
						"images": {
							"profile": {
								"id": "dev/users/239/profile/profile_1645130947045",
								"type": "img_profile",
								"urls": {
									"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/profile_1645130947045",
									"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_thumb,g_face,w_100,h_100/dev/users/239/profile/profile_1645130947045"
								}
							},
							"banner": {
								"id": "dev/users/239/profile/banner_1647878204659",
								"type": "img_banner",
								"urls": {
									"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/banner_1647878204659",
									"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_fill,g_auto:subject,w_772,h_255/dev/users/239/profile/banner_1647878204659"
								}
							}
						},
						"stats_usage": {
							"nb_followers": 10,
							"nb_following": 65,
							"nb_games": 0,
							"nb_matches": 0,
							"nb_mentions": 0,
							"nb_posts": 23
						}
					}
				},
				"service": "posts",
				"created_at": "2022-03-10T20:02:37.492Z"
			}
		},
		{
			"code": "1493f849-0211-4a8a-9de0-0fa52712245e",
			"created_at": "2022-03-10T20:03:05.165714Z",
			"is_read": true,
			"category": "social",
			"payload": {
				"code": "posts.like.post_liked",
				"type": "post_liked",
				"model": "like",
				"payload": {
					"target": {
						"post_id": 2656,
						"user_id": 239,
						"post_info": {
							"id": 2656,
							"created_at": "2021-12-31T18:57:18.719793Z",
							"text": "not my report omnislash.com @mike3 /tft",
							"nb_replies": 2,
							"nb_likes": 2,
							"nb_reposts": 0,
							"nb_shares": 0,
							"user_id": 239,
							"report_id": "report-ee93d8a4-10ce-4ddd-aa81-1a8da0151a8d",
							"original_post": null,
							"story_info": null,
							"attachment_id": 112,
							"game_match_id": null,
							"media": [
								{
									"id": 950,
									"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/posts/3089f5fc-257f-446a-afed-0457788af572",
									"url_crop": null,
									"type": "image"
								},
								{
									"id": 949,
									"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/posts/4084e790-81d3-4427-a688-4bd0b207cf26",
									"url_crop": null,
									"type": "image"
								}
							],
							"is_liked": false,
							"tags": {
								"users": ["mike3"],
								"games": [
									"tft"
								],
								"hashtags": []
							},
							"comments": [],
							"user_info": {
								"id": 239,
								"username": "jasmine",
								"name": "📱Jasmine",
								"bio": "this is my bio and more bio and even more bio and the most bio ever just so much bio here the most you've ever seen really and more bio just in case",
								"links": {
									"twitter": "test"
								},
								"images": {
									"profile": {
										"id": "dev/users/239/profile/profile_1645130947045",
										"type": "img_profile",
										"urls": {
											"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/profile_1645130947045",
											"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_thumb,g_face,w_100,h_100/dev/users/239/profile/profile_1645130947045"
										}
									},
									"banner": {
										"id": "dev/users/239/profile/banner_1647878204659",
										"type": "img_banner",
										"urls": {
											"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/banner_1647878204659",
											"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_fill,g_auto:subject,w_772,h_255/dev/users/239/profile/banner_1647878204659"
										}
									}
								},
								"stats_usage": {
									"nb_followers": 10,
									"nb_following": 65,
									"nb_games": 0,
									"nb_matches": 0,
									"nb_mentions": 0,
									"nb_posts": 23
								}
							}
						},
						"user_info": {
							"id": 239,
							"username": "jasmine",
							"name": "📱Jasmine",
							"bio": "this is my bio and more bio and even more bio and the most bio ever just so much bio here the most you've ever seen really and more bio just in case",
							"links": {
								"twitter": "test"
							},
							"images": {
								"profile": {
									"id": "dev/users/239/profile/profile_1645130947045",
									"type": "img_profile",
									"urls": {
										"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/profile_1645130947045",
										"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_thumb,g_face,w_100,h_100/dev/users/239/profile/profile_1645130947045"
									}
								},
								"banner": {
									"id": "dev/users/239/profile/banner_1647878204659",
									"type": "img_banner",
									"urls": {
										"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/banner_1647878204659",
										"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_fill,g_auto:subject,w_772,h_255/dev/users/239/profile/banner_1647878204659"
									}
								}
							},
							"stats_usage": {
								"nb_followers": 10,
								"nb_following": 65,
								"nb_games": 0,
								"nb_matches": 0,
								"nb_mentions": 0,
								"nb_posts": 23
							}
						}
					},
					"user_id": 239,
					"user_info": {
						"id": 239,
						"username": "jasmine",
						"name": "📱Jasmine",
						"bio": "this is my bio and more bio and even more bio and the most bio ever just so much bio here the most you've ever seen really and more bio just in case",
						"links": {
							"twitter": "test"
						},
						"images": {
							"profile": {
								"id": "dev/users/239/profile/profile_1645130947045",
								"type": "img_profile",
								"urls": {
									"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/profile_1645130947045",
									"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_thumb,g_face,w_100,h_100/dev/users/239/profile/profile_1645130947045"
								}
							},
							"banner": {
								"id": "dev/users/239/profile/banner_1647878204659",
								"type": "img_banner",
								"urls": {
									"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/239/profile/banner_1647878204659",
									"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_fill,g_auto:subject,w_772,h_255/dev/users/239/profile/banner_1647878204659"
								}
							}
						},
						"stats_usage": {
							"nb_followers": 10,
							"nb_following": 65,
							"nb_games": 0,
							"nb_matches": 0,
							"nb_mentions": 0,
							"nb_posts": 23
						}
					}
				},
				"service": "posts",
				"created_at": "2022-03-10T20:02:37.492Z"
			}
		},		
	];

	let	obj =
	{
		"mike3": {
			"id": 22,
			"username": "mike3",
			"name": "SuperMikey11111111111111111111",
			"bio": "super biotest div",
			"links": {
			"instagram": "mike_jegat",
			"facebook": "_test_test_test_test_test_test_test_test_test_test_test_test_test_test11111111111111111111",
			"youtube": "mikosaure"
			},
			"images": {
			"profile": {
				"id": "dev/users/22/profile/profile_1647979606470",
				"type": "img_profile",
				"urls": {
				"url": "https://res.cloudinary.com/omnislashtech/image/upload/dev/users/22/profile/profile_1647979606470",
				"url_thumb": "https://res.cloudinary.com/omnislashtech/image/upload/c_thumb,g_face,w_100,h_100/dev/users/22/profile/profile_1647979606470"
				}
			},
			"banner": {
				"id": "",
				"type": "img_banner",
				"urls": {
				"url": "https://ga.omnislash.com/img/common/default/user_banner.jpg",
				"url_thumb": "https://ga.omnislash.com/img/common/default/user_banner.jpg",
				"url_thumb_big": "https://ga.omnislash.com/img/common/default/user_banner.jpg",
				"url_thumb_medium": "https://ga.omnislash.com/img/common/default/user_banner.jpg"
				}
			}
			},
			"stats_usage": {
			"nb_followers": 22,
			"nb_following": 7,
			"nb_games": 10,
			"nb_matches": 197,
			"nb_mentions": 32,
			"nb_posts": 184
			}
		},
		"jasmine2": {
			"id": 243,
			"username": "jasmine2",
			"name": "jasmine",
			"bio": null,
			"links": {},
			"images": {
			"profile": {
				"id": "",
				"type": "img_profile",
				"urls": {
				"url": "https://ga.omnislash.com/img/common/default/user_profile.png",
				"url_thumb": "https://ga.omnislash.com/img/common/default/user_profile.png",
				"url_thumb_big": "https://ga.omnislash.com/img/common/default/user_profile.png",
				"url_thumb_medium": "https://ga.omnislash.com/img/common/default/user_profile.png"
				}
			},
			"banner": {
				"id": "",
				"type": "img_banner",
				"urls": {
				"url": "https://ga.omnislash.com/img/common/default/user_banner.jpg",
				"url_thumb": "https://ga.omnislash.com/img/common/default/user_banner.jpg",
				"url_thumb_big": "https://ga.omnislash.com/img/common/default/user_banner.jpg",
				"url_thumb_medium": "https://ga.omnislash.com/img/common/default/user_banner.jpg"
				}
			}
			},
			"stats_usage": {
			"nb_followers": 3,
			"nb_following": 2,
			"nb_games": 0,
			"nb_matches": 0,
			"nb_mentions": 2,
			"nb_posts": 3
			}
		}
		};

	// do the new object
	items = ObjUtils.ReplaceAllIdsWithObjectInList(items, "payload.payload.target.post_info.tags.users", obj, false);
	items = ObjUtils.ReplaceAllIdsWithObjectInList(items, "payload.payload.target.post_info.original_post.tags.users", obj, false);
	context.assertEquals(ObjUtils.GetValue(items, "[1].payload.payload.target.post_info.tags.users", []).length, 1);
	context.assertEquals(ObjUtils.GetValue(items, "[2].payload.payload.target.post_info.tags.users", []).length, 1);


});


suite.test("ObjUtils.FindMissingEntriesInArray", function (context) {

	assertListEquals(context, ObjUtils.FindMissingEntriesInArray(null, undefined), []);	
	assertListEquals(context, ObjUtils.FindMissingEntriesInArray([], undefined), []);	
	assertListEquals(context, ObjUtils.FindMissingEntriesInArray([], ["test"]), ["test"]);	
	assertListEquals(context, ObjUtils.FindMissingEntriesInArray(["test"], ["test"]), []);	
	assertListEquals(context, ObjUtils.FindMissingEntriesInArray(["test"], ["test", "Test"]), ["Test"]);	

});	

suite.test("ObjUtils.CompareValues", function (context) {

	context.assertEquals(ObjUtils.CompareValues("==", 10, 10), true);	
	context.assertEquals(ObjUtils.CompareValues("=", 10, 10), true);	
	context.assertEquals(ObjUtils.CompareValues(">=", 10, 10), true);	
	context.assertEquals(ObjUtils.CompareValues("<=", 10, 10), true);	
	context.assertEquals(ObjUtils.CompareValues("<=", "10", 10), true);	
	context.assertEquals(ObjUtils.CompareValues("<>", "100", "test"), true);	
	context.assertEquals(ObjUtils.CompareValues("!=", "aaa", "aab"), true);	
	context.assertEquals(ObjUtils.CompareValues(">", 10, 5), true);	
	context.assertEquals(ObjUtils.CompareValues("<", 10, 5), false);	
	context.assertEquals(ObjUtils.CompareValues("€", "super", "su"), true);	
	context.assertEquals(ObjUtils.CompareValues("[>", "super", "su"), true);	
	context.assertEquals(ObjUtils.CompareValues("<]", "super", "er"), true);	
	context.assertEquals(ObjUtils.CompareValues("€", 1000, '10', true), true);	
	context.assertEquals(ObjUtils.CompareValues("in", 'test', 'blabl|bloblo|test', true), true);	
	context.assertEquals(ObjUtils.CompareValues("in", 'test', 'blabl|bloblo', true), false);	
	context.assertEquals(ObjUtils.CompareValues("in", 'test', '', true), false);	
	context.assertEquals(ObjUtils.CompareValues("nin", 'test', '', true), true);	
	context.assertEquals(ObjUtils.CompareValues("nin", 'test', '', true), true);	
	context.assertEquals(ObjUtils.CompareValues("nin", 'test', 'blabl|bloblo', true), true);	
	context.assertEquals(ObjUtils.CompareValues("nin", 'test', 'blabl|bloblo|test', true), false);	

});	

suite.test("ObjUtils.CopyFieldsOnlyFromList", function (context) {

	let	tests = [
		{
			obj: {
				field1: "field1value",
				field2: 2,
				field3: {
					sub: 10,
				}
			},
			tocopy: [
				"*field1",
				"test",
				"field2:rename",
				"field3"
			],
			tocheck: {
				"field1": "field1value",
				"field2": 2,
				"field3.sub": 10
			}
		}
	];

	for(let i=0; i<tests.length; i++)
	{
		// create the new object
		let	result = ObjUtils.CopyFieldsOnlyFromList(tests[i].obj, tests[i].tocopy);

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

suite.test("ObjUtils.ExtractObjectsWithFields", function (context) {

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
		let	result = ObjUtils.ExtractObjectsWithFields(obj, tests[i].path, tests[i].tocopy);

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



suite.test("ObjUtils.ExtractObjectsWithFields With Merge", function (context) {

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
	let	result = ObjUtils.ExtractObjectsWithFields(data, "matches.player.traits", fieldsToKeep, mergeKey, true, true, true, conditionField, conditionValue, conditionComp);

	context.assertEquals(result.length, 4);	

});	


suite.test("ObjUtils.ExtractObjectsWithFields With Merge2", function (context) {

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
		let	result = ObjUtils.ExtractObjectsWithFields(ObjUtils.GetValue(data, "matches"), "players.traits", tests[i].fieldsToKeep, tests[i].mergeKey, true, true, true, tests[i].conditionField, tests[i].conditionValue, tests[i].conditionComp);

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

suite.test("ObjUtils.MergeList TEST", function (context) {
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

	let	result = ObjUtils.MergeList(data, "id", true, true, null, true);

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


suite.test("ObjUtils.MergeObjects TEST", function (context) {

	let	obj1 = {
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
	};

	let	obj2 = {
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
	};

	let	result = ObjUtils.MergeObjects(obj1, obj2, null, true);

	context.assertEquals(result.is_victory, 1);
	context.assertEquals(result.kills, 24);
	context.assertEquals(result.tier_1, 2);
	context.assertEquals(result.tier_2, 1);
	context.assertEquals(result.tier_3, 0);

});


suite.test("DateUtils.Hours", function (context) {

	let	tests = [
		{
			"date": "2021-06-07T17:38:53.067803Z",
			"result": parseFloat((17).toString()),
		},
		{
			"date": "2021-06-07 17:38:53",
			"result": parseFloat((17).toString()),
		},
		{
			"date": "2021-06-07 00:00:00",
			"result": parseFloat((0).toString()),
		},
		{
			"date": "2021-06-07 23:59:59",
			"result": parseFloat((23).toString()),
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		let	result = DateUtils.Hours(tests[i].date);

		if (result != tests[i].result)
		{
			console.error("Error at test " + i + ": " + result + " != " + tests[i].result + " (" + tests[i].date + ")");
		}
		context.assertEquals(result, tests[i].result);
	}	
});

suite.test("DateUtils.FormatDayNumber", function (context) {

	let	tests = [
		{
			"date": 0,
			"result": "1/1",
		},
		{
			"date": 8144,
			"result": "4/19",
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		let	result = DateUtils.FormatDayNumber(tests[i].date);

		if (result != tests[i].result)
		{
			console.error("Error at test " + i + ": " + result + " != " + tests[i].result + " (" + tests[i].date + ")");
		}
		context.assertEquals(result, tests[i].result);
	}	
});

suite.test("DateUtils.GetClosestMondayToDayNumber", function (context) {

	let	tests = [
		{
			"date": 8142,
			"result": 8143,
		},
		{
			"date": 8143,
			"result": 8143,
		},
		{
			"date": 8144,
			"result": 8143,
		},
		{
			"date": 8145,
			"result": 8143,
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		let	result = DateUtils.GetClosestMondayToDayNumber(tests[i].date);

		if (result != tests[i].result)
		{
			console.error("Error at test " + i + ": " + result + " != " + tests[i].result + " (" + tests[i].date + ")");
		}
		context.assertEquals(result, tests[i].result);
	}	
});

suite.test("DateUtils.GetCurrentWeekDayNumber", function (context) {

	// get today
	let	nowDayNumber = DateUtils.NowToLocalDayNumber();

	// get the week number
	let	weekDayNumber = DateUtils.GetCurrentWeekDayNumber();

	// get the day of the week
	let	dayOfTheWeek = DateUtils.DayNumberToDayOfTheWeek(nowDayNumber);

	console.log("Today = " + nowDayNumber + " (" + dayOfTheWeek + "), week day number = " + weekDayNumber);

	// find the difference to return
	let	differences = {
		"monday": 0,
		"tuesday": -1,
		"wednesday": -2,
		"thursday": -3,
		"friday": -4,
		"saturday": -5,
		"sunday": -6,
	};	

	context.assertTrue(weekDayNumber <= nowDayNumber);
	context.assertEquals(weekDayNumber - nowDayNumber, differences[dayOfTheWeek]);

});

suite.test("DateUtils.NowToUniqString", function (context) {

	// get it
	let	str = DateUtils.NowToUniqString()

	// test
	console.log("Now uniq = " + str);
	context.assertTrue(str.startsWith("2023"));
	context.assertTrue(str.endsWith("000"));
	context.assertEquals(str.length, 21);

});

suite.test("DateUtils.GetPreviousWeekInterval", function (context) {

	// get the interval
	let	interval = DateUtils.GetPreviousWeekInterval();

	// compare day number
	context.assertEquals(interval.day_number, DateUtils.GetCurrentWeekDayNumber() - 7);

	// compare the timestamps
	context.assertEquals(interval.timestamp_end, interval.timestamp_start + 7*24*60*60 - 1);

	// look at the day of the week
	context.assertEquals(DateUtils.DateToDayOfTheWeek(new Date(interval.timestamp_start * 1000)), "monday");
	context.assertEquals(DateUtils.DateToDayOfTheWeek(new Date(interval.timestamp_end * 1000)), "sunday");
});


suite.test("JsonProcessor.process mergeListProcessList", function (context) {



	let	data = {
		matches: [
			{
				"start_date":"2021-10-27T23:01:13.9877472Z",
				"gameplay_length":1013.523,
			},
			{
				"start_date":"2021-10-27T23:01:13.9877472Z",
				"gameplay_length":20000.523,
			},
			{
				"start_date":"2021-10-27T21:01:13.9877472Z",
				"gameplay_length":1230.523,
			},
			{
				"start_date":"2021-10-27T12:01:13.9877472Z",
				"gameplay_length":3902.523,
			},
			{
				"start_date":"2021-10-27T13:01:13.9877472Z",
				"gameplay_length":2039.523,
			},
			{
				"start_date":"2021-10-27T05:01:13.9877472Z",
				"gameplay_length":1890.523,
			},
			{
				"start_date":"2021-10-27T12:01:13.9877472Z",
				"gameplay_length":2004.523,
			},
			{
				"start_date":"2021-10-27T14:01:13.9877472Z",
				"gameplay_length":10298.523,
			},
			{
				"start_date":"2021-10-27T17:01:13.9877472Z",
				"gameplay_length":13.523,
			},
			{
				"start_date":"2021-10-27T22:01:13.9877472Z",
				"gameplay_length":1029.523,
			},
			{
				"start_date":"2021-10-27T12:01:13.9877472Z",
				"gameplay_length":45.523,
			},
			{
				"start_date":"2021-10-27T12:01:13.9877472Z",
				"gameplay_length":2030.523,
			},
		]
	};

	let	processor = JsonProcessor.CreateFromJSON(data);

	let	method = "mergeList(processList(matches, 'start_date', 'hours', '~~value~~'), 'start_date', 'true', 'true', 'gameplay_length:duration')";

	// get the value
	let	value = processor.process(method);

	context.assertEquals(value.length, 8);

});


suite.test("JsonProcessor.process processList with Max", function (context) {

	let	data = {
		matches: [
			{
				game_data: {
					turns: [
						{
							turn: 1
						},
						{
							turn: 2
						},
						{
							turn: 3
						},
						{
							turn: 4
						},
						{
							turn: 5
						},
					]
				},
			},
			{
				game_data: {
					turns: [
						{
							turn: 1
						},
						{
							turn: 2
						},
						{
							turn: 3
						},
					]
				},
			},
			{
				game_data: {
					turns: [
						{
							turn: 1
						},
						{
							turn: 2
						},
						{
							turn: 3
						},
						{
							turn: 4
						},
						{
							turn: 5
						},
						{
							turn: 6
						},
						{
							turn: 7
						},
					]
				},
			},			
		]
	};

	let	processor = JsonProcessor.CreateFromJSON(data);

	let	method = "processListValues('>matches<','max','~~value~~.game_data.turns', 'turn')";

	// get the value
	let	value = processor.process(method);

	context.assertEquals(value.length, 3);
	context.assertEquals(value[0], 5);
	context.assertEquals(value[1], 3);
	context.assertEquals(value[2], 7);

});


suite.test("UrlUtils.ExtractQueryParameters", function (context) {

	let	tests = [
		{
			"url": "https://omnislash.com?p1=source&p2=web&p3=name&p4=campaignid&p5=term&p6=content",
			"params": [
				"p1",
				"p2",
				"p3",
				"p4",
				"p5",
				"p6",
				"p7",
			],
			"tests": {
				"p1": "source",
				"p2": "web",
				"p3": "name",
				"p4": "campaignid",
				"p5": "term",
				"p6": "content",
				"p7": ""
			}
		},
		{
			"url": "",
			"params": [
				"utm_source",
				"utm_medium",
				"utm_campaign",
				"utm_id",
				"utm_term",
				"utm_content",
			],
			"tests": {
				"utm_source": "",
				"utm_medium": "",
				"utm_campaign": "",
				"utm_id": "",
				"utm_term": "",
				"utm_content": "",
			}
		},		
		{
			"url": "https://omnislash.com",
			"params": [
				"utm_source",
				"utm_medium",
				"utm_campaign",
				"utm_id",
				"utm_term",
				"utm_content",
			],
			"tests": {
				"utm_source": "",
				"utm_medium": "",
				"utm_campaign": "",
				"utm_id": "",
				"utm_term": "",
				"utm_content": "",
			}
		},		
		{
			"url": "omnislash.com",
			"params": [
				"utm_source",
				"utm_medium",
				"utm_campaign",
				"utm_id",
				"utm_term",
				"utm_content",
			],			
			"tests": {
				"utm_source": "",
				"utm_medium": "",
				"utm_campaign": "",
				"utm_id": "",
				"utm_term": "",
				"utm_content": "",
			}
		},		
		{
			"url": "https://omnislash.com?test=101010&utm_id=12",
			"params": [
				"test",
				"utm_id",
				"test2",
				"utm_term",
				"utm_content",
			],			
			"tests": {
				"test": "101010",
				"utm_id": "12",
				"test2": "",
				"utm_term": "",
				"utm_content": "",
			}
		},			
	];

	for(let i=0; i<tests.length; i++)
	{
		// get the UTMS
		let	result = UrlUtils.ExtractQueryParameters(tests[i].url, tests[i].params);

		// do the tests
		for(const key in tests[i].tests)
		{
			// get the value
			let	value = ObjUtils.GetValue(result, key, "");

			// different?
			if (value != tests[i].tests[key])
			{
				console.error("Error at test " + i + "." + key + ": " + value + " not expected: " + tests[i].tests[key]);
			}

			context.assertEquals(value, tests[i].tests[key]);
		}
	}

});


suite.test("UrlUtils.ExtractUTMs", function (context) {

	let	tests = [
		{
			"url": "https://omnislash.com?utm_source=source&utm_medium=web&utm_campaign=name&utm_id=campaignid&utm_term=term&utm_content=content",
			"tests": {
				"utm_source": "source",
				"utm_medium": "web",
				"utm_campaign": "name",
				"utm_id": "campaignid",
				"utm_term": "term",
				"utm_content": "content",
			}
		},
		{
			"url": "",
			"tests": {
				"utm_source": "",
				"utm_medium": "",
				"utm_campaign": "",
				"utm_id": "",
				"utm_term": "",
				"utm_content": "",
			}
		},		
		{
			"url": "https://omnislash.com",
			"tests": {
				"utm_source": "",
				"utm_medium": "",
				"utm_campaign": "",
				"utm_id": "",
				"utm_term": "",
				"utm_content": "",
			}
		},		
		{
			"url": "omnislash.com",
			"tests": {
				"utm_source": "",
				"utm_medium": "",
				"utm_campaign": "",
				"utm_id": "",
				"utm_term": "",
				"utm_content": "",
			}
		},		
		{
			"url": "https://omnislash.com?test=101010&utm_id=12",
			"tests": {
				"utm_source": "",
				"utm_medium": "",
				"utm_campaign": "",
				"utm_id": "12",
				"utm_term": "",
				"utm_content": "",
			}
		},			
	];

	for(let i=0; i<tests.length; i++)
	{
		// get the UTMS
		let	result = UrlUtils.ExtractUTMs(tests[i].url);

		// do the tests
		for(const key in tests[i].tests)
		{
			// get the value
			let	value = ObjUtils.GetValue(result, key, "");

			// different?
			if (value != tests[i].tests[key])
			{
				console.error("Error at test " + i + "." + key + ": " + value + " not expected: " + tests[i].tests[key]);
			}

			context.assertEquals(value, tests[i].tests[key]);
		}
	}

});


suite.test("UrlUtils.GetSearchEngineInfo", function (context) {

	let	tests = [
		{
			"domain": "omnislash.com",
			"tests": {
				"name": "",
				"q": ""
			}
		},
		{
			"domain": "answers.yahoo.com",
			"tests": {
				"name": "Yahoo Answers",
				"q": "p"
			}
		},		
		{
			"domain": "google.com.MX",
			"tests": {
				"name": "Google Mexico",
				"q": "q"
			}
		},
		{
			"domain": "www.google.com",
			"tests": {
				"domain": "google.com",
				"name": "Google",
				"q": "q"
			}
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// get the UTMS
		let	result = UrlUtils.GetSearchEngineInfo(tests[i].domain);

		// do the tests
		for(const key in tests[i].tests)
		{
			// get the value
			let	value = ObjUtils.GetValue(result, key, "");

			// different?
			if (value != tests[i].tests[key])
			{
				console.error("Error at test " + i + "." + key + ": " + value + " not expected: " + tests[i].tests[key]);
			}

			context.assertEquals(value, tests[i].tests[key]);
		}
	}

});


suite.test("UrlUtils.ExtractSearchKeywords", function (context) {

	let	tests = [
		{
			"url": "https://www.google.com/search?q=search+with+several+words&source=hp&ei=5kV1Ypa5MPWekPIP4sK88Aw&iflsig=AJiK0e8AAAAAYnVT9mMCnkb1twgsnb7_yThDFkc5ijMJ&ved=0ahUKEwiWxPOOn8v3AhV1D0QIHWIhD84Q4dUDCAk&uact=5&oq=search+with+several+words&gs_lcp=Cgdnd3Mtd2l6EAMyBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIFCAAQhgMyBQgAEIYDMgUIABCGAzIFCAAQhgM6EQguEIAEELEDEIMBEMcBENEDOgsIABCABBCxAxCDAToLCC4QgAQQxwEQ0QM6CwguEIAEEMcBEK8BOgUIABCABDoOCC4QgAQQsQMQxwEQowI6BQguEIAEOggILhCxAxCDAToICC4QgAQQsQM6CwguEIAEEMcBEKMCOgsILhCABBCxAxCDAToICAAQgAQQsQM6CwguEIAEELEDENQCOggIABAWEAoQHjoICAAQDRAFEB46BQghEKABOggIIRAWEB0QHlAAWOoXYN0YaABwAHgAgAGPAYgBnBaSAQQwLjI0mAEAoAEB&sclient=gws-wiz",
			"keywords": [
				"search",
				"with",
				"several",
				"words",
			]
		},
		{
			"url": "https://duckduckgo.com/?q=is+Qanon+real&t=h_&ia=web",
			"keywords": [
				"is",
				"Qanon",
				"real",
			]
		},
		{
			"url": "https://www.bing.com/search?q=is%20windows%2064%20better%20than%20%25test%25%20with%20omnislash&qs=n&form=QBRE&=%25eManage%20Your%20Search%20History%25E&sp=-1&pq=is%20windows%2064%20better%20than%20%25test%25%20with%20omnislash&sc=4-47&sk=&cvid=B870BF34FE3B4C23846A9AEEB47006DB",
			"keywords": [
				"is",
				"windows",
				"64",
				"better",
				"than",
				"%test%",
				"with",
				"omnislash",
			]
		}
	];

	for(let i=0; i<tests.length; i++)
	{
		// get the UTMS
		let	result = UrlUtils.ExtractSearchKeywords(tests[i].url);

		// compare
		assertListEquals(context, tests[i].keywords, result);
	}

});


suite.test("UrlUtils.ExtractReferrerInfo", function (context) {

	let	tests = [
		{
			"url": "https://www.google.com/search?q=search+with+several+words&source=hp&ei=5kV1Ypa5MPWekPIP4sK88Aw&iflsig=AJiK0e8AAAAAYnVT9mMCnkb1twgsnb7_yThDFkc5ijMJ&ved=0ahUKEwiWxPOOn8v3AhV1D0QIHWIhD84Q4dUDCAk&uact=5&oq=search+with+several+words&gs_lcp=Cgdnd3Mtd2l6EAMyBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIFCAAQhgMyBQgAEIYDMgUIABCGAzIFCAAQhgM6EQguEIAEELEDEIMBEMcBENEDOgsIABCABBCxAxCDAToLCC4QgAQQxwEQ0QM6CwguEIAEEMcBEK8BOgUIABCABDoOCC4QgAQQsQMQxwEQowI6BQguEIAEOggILhCxAxCDAToICC4QgAQQsQM6CwguEIAEEMcBEKMCOgsILhCABBCxAxCDAToICAAQgAQQsQM6CwguEIAEELEDENQCOggIABAWEAoQHjoICAAQDRAFEB46BQghEKABOggIIRAWEB0QHlAAWOoXYN0YaABwAHgAgAGPAYgBnBaSAQQwLjI0mAEAoAEB&sclient=gws-wiz",
			"domain": "google.com",
			"is_search": true,
			"keywords": [
				"search",
				"with",
				"several",
				"words",
			]
		},
		{
			"url": "https://www.gmail.com",
			"domain": "www.gmail.com",
			"is_search": false,
			"keywords": [
			]
		},
		{
			"url": "",
			"domain": "",
			"is_search": false,
			"keywords": [
			]
		},		
	];

	for(let i=0; i<tests.length; i++)
	{
		// get the info
		let	result = UrlUtils.ExtractReferrerInfo(tests[i].url);

		// compare domain
		if (result.domain != tests[i].domain)
			console.error("Error at test " + i + ": domain are different: " + result.domain + " VS " + tests[i].domain);
		context.assertEquals(result.domain, tests[i].domain);

		// compare search
		if (result.is_search != tests[i].is_search)
			console.error("Error at test " + i + ": search are different: " + result.is_search + " VS " + tests[i].is_search);
		context.assertEquals(result.is_search, tests[i].is_search);

		// compare keywords
		assertListEquals(context, tests[i].keywords, result.keywords);
	}

});

suite.test("DateUtils.GetTimezoneOffset", async function (context) {

	let	tests = [
		{
			timezone: null,
			offset: 0
		},
		{
			timezone: "",
			offset: 0
		},
		{
			timezone: "GMT",
			offset: 0
		},
		{
			timezone: "America/Los_Angeles",
			offset: -420//-480
		},
	];

	for(let test of tests)
	{
		let	result = JavaUtils.GetTimezoneOffset(test.timezone);
		context.assertEquals(test.offset, result);
	}

});

suite.test("StringUtils.Hash", async function (context) {

	let	tests = {
		"email:mike@omnislash.com": "4167281803320696",
		"push:IOEUJHRUIHRUIGHRIEUNDUIEHJD#*($": "2635404911672216"
	};

	for(const test in tests)
	{
		let	result = StringUtils.Hash(test);

		if (result != tests[test])
			console.error("Error: hash(" + test + "): " + result + " != " + tests[test]);
		context.assertEquals(tests[test], result);

	}

});

suite.test("StringUtils.ParseStreamedJSON", async function (context) {

	let	tests = [
		{
			to_parse: "{\"id\":\"XDSZkuS8\",\"rated\":true,\"variant\":\"standard\",\"speed\":\"bullet\",\"perf\":\"bullet\",\"createdAt\":1658026972235,\"lastMoveAt\":1658027029839,\"status\":\"resign\",\"players\":{\"white\":{\"user\":{\"name\":\"jugandorapidito\",\"id\":\"jugandorapidito\"},\"rating\":2852,\"ratingDiff\":-5},\"black\":{\"user\":{\"name\":\"ChrolloL\",\"title\":\"GM\",\"id\":\"chrollol\"},\"rating\":2916,\"ratingDiff\":5}},\"winner\":\"black\",\"clock\":{\"initial\":60,\"increment\":0,\"totalTime\":60}}\n{\"id\":\"XRae1Gsw\",\"rated\":true,\"variant\":\"standard\",\"speed\":\"bullet\",\"perf\":\"bullet\",\"createdAt\":1658026842888,\"lastMoveAt\":1658026960881,\"status\":\"outoftime\",\"players\":{\"white\":{\"user\":{\"name\":\"ChrolloL\",\"title\":\"GM\",\"id\":\"chrollol\"},\"rating\":2923,\"ratingDiff\":-7},\"black\":{\"user\":{\"name\":\"jugandorapidito\",\"id\":\"jugandorapidito\"},\"rating\":2845,\"ratingDiff\":7}},\"winner\":\"black\",\"clock\":{\"initial\":60,\"increment\":0,\"totalTime\":60}}\n",
			length: 2,
			tests: {
				"[0].id": "XDSZkuS8",
				"[1].id": "XRae1Gsw",
			}
		},
		{
			to_parse: "",
			length: 0,
			tests: {
			}
		},

	];
	
	for(let i=0; i<tests.length; i++)
	{
		// parse the value
		let	json = StringUtils.ParseStreamedJSON(tests[i].to_parse);

		// check the length
		if (tests[i].length != json.length)
		{
			console.error("Error at " + i + ": Length is different: " + tests[i].length + "!=" + json.length);
		}
		context.assertEquals(tests[i].length, json.length);

		// test inside
		for(const test in tests[i].tests)
		{
			let	result = ObjUtils.GetValue(json, test, "");
	
			if (result != tests[i].tests[test])
				console.error("Error: getValue(" + test + "): " + result + " != " + tests[i].tests[test]);
			context.assertEquals(tests[i].tests[test], result);
	
		}
	}
});

suite.test("ObjUtils.EnsureArrayUnique", async function (context) {

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
		let	newArray = ObjUtils.EnsureArrayUnique(tests[i].values);

		// compare the arrays
		assertListEquals(context, newArray, tests[i].result);

	}
});

suite.test("StringUtils.ExtractFilename", async function (context) {

	let	tests = [
		{
			str: "",
			delimiter: "/",
			result: ""
		},
		{
			str: "filename.jpg",
			delimiter: "/",
			result: "filename.jpg"
		},
		{
			str: "/test/path/long//filename.jpg",
			delimiter: "/",
			result: "filename.jpg"
		},
		{
			str: "/test/path-long-filename.jpg",
			delimiter: "-",
			result: "filename.jpg"
		},
	];
	
	for(let i=0; i<tests.length; i++)
	{
		// extract the filename
		let	value = StringUtils.ExtractFilename(tests[i].str, tests[i].delimiter);

		if (value != tests[i].result)
			console.error("Error: StringUtils.ExtractFilename(" + i + "): " + value + " != " + tests[i].result);
		context.assertEquals(tests[i].result, value);

	}
});


suite.test("StringUtils.IsNumber", async function (context) {

	let	tests = [
		{
			value: "csgo",
			result: false
		},		
		{
			value: "",
			result: false
		},		
		{
			value: "1",
			result: true
		},		
		{
			value: "1test",
			result: false
		},		
		{
			value: "1.56",
			result: true
		},		
		{
			value: true,
			result: false
		},		
		{
			value: "true",
			result: false
		},		
		{
			value: 1,
			result: true
		},		
		{
			value: 1.68,
			result: true
		},		
		{
			value: [],
			result: false
		},		
		{
			value: {},
			result: false
		},		
		{
			value: null,
			result: false
		},		
		{
			value: undefined,
			result: false
		},		
	];
	
	for(let i=0; i<tests.length; i++)
	{
		// is number?
		let	value = StringUtils.IsNumber(tests[i].value);

		if (value != tests[i].result)
			console.error("StringUtils.IsNumber(" + i + "): " + value + " != " + tests[i].result);
		context.assertEquals(tests[i].result, value);

	}
});


suite.test("DateUtils.IsDate", async function (context) {

	let	tests = [
		{
			value: "",
			result: false
		},		
		{
			value: "190",
			result: false
		},		
		{
			value: 190,
			result: false
		},		
		{
			value: "a date",
			result: false
		},		
		{
			value: "100%",
			result: false
		},		
		{
			value: "2022-09-13T18:28:16.164Z",
			result: true
		},		
		{
			value: "2022-09-13T18:28:16Z",
			result: true
		},		
		{
			value: "2021-11-04T22:32:47.142354-10:00",
			result: true
		},		
		{
			value: "2022-09-13",
			result: false
		},				
		{
			value: null,
			result: false
		},		
		{
			value: undefined,
			result: false
		},		
	];
	
	for(let i=0; i<tests.length; i++)
	{
		// is date?
		let	value = DateUtils.IsDate(tests[i].value);

		if (value != tests[i].result)
			console.error("DateUtils.IsDate(" + i + "): " + value + " != " + tests[i].result);
		context.assertEquals(tests[i].result, value);

	}
});



suite.test("ObjUtils.SetValue", async function (context) {

	let	obj = null;

	// init
	obj = ObjUtils.SetValue(obj, "matches", null, true, true);
	context.assertEquals(ObjUtils.IsArray(obj.matches), true);
	context.assertEquals(obj.matches.length, 0);

	// set an element text
	obj = ObjUtils.SetValue(obj, "matches", "toto", true, true);
	context.assertEquals(obj.matches.length, 1);
	context.assertEquals(obj.matches[0], "toto");

	// set an object
	obj = ObjUtils.SetValue(obj, "matches", {name: "mike"}, true, true);
	context.assertEquals(obj.matches.length, 2);
	context.assertEquals(obj.matches[0], "toto");
	context.assertEquals(obj.matches[1].name, "mike");

	// set an array
	obj = ObjUtils.SetValue(obj, "matches", [5, "string", true, {name: "mike"}], true, true);
	context.assertEquals(obj.matches.length, 6);
	context.assertEquals(obj.matches[0], "toto");
	context.assertEquals(obj.matches[1].name, "mike");
	context.assertEquals(obj.matches[2], 5);
	context.assertEquals(obj.matches[3], "string");
	context.assertEquals(obj.matches[4], true);
	context.assertEquals(obj.matches[5].name, "mike");

});


suite.test("JsonBuilder", async function (context) {

	// create the builder
	let	builder = new JsonBuilder();

	// 1. prepare the match data
	let	matchDataToSet = {
		"id": "20230123_225906587000_1358_valve_csgo_05f2ab44",
		"game_id": "csgo",
		"version": "0.34.01",
		"game_data.player_kills": 0,
		"game_data.player_score": 0,
		"game_data.player_deaths": 0,
		"game_data.player_assists": 0,
	};

	// -- set them
	for(let field in matchDataToSet)
	{
		// set it
		builder.setValue("out." + field, matchDataToSet[field]);
	}

	// now we read to make sure it's good
	let	output = builder.getOutput();
	console.log("Output from JsonBuilder:");
	console.log(output);
	for(let field in matchDataToSet)
	{
		// check the get value
		let	valueFromGet = builder.getValue("out." + field);
		context.assertEquals(matchDataToSet[field], valueFromGet);

		// check from the JSON itself
		let	valueFromJson = ObjUtils.GetValue(output, field);
		context.assertEquals(matchDataToSet[field], valueFromJson);
	}

	// do some operations
	let	operationsTodo = [
		{
			path: "game_data.player_kills",
			operator: JsonBuilder.OPERATOR_INC,
			value: ""
		},
		{
			path: "game_data.player_score",
			operator: JsonBuilder.OPERATOR_ADD,
			value: "1000"
		},
	];
	for(let operation of operationsTodo)
	{
		// set it
		builder.setValue("out." + operation.path, operation.value, operation.operator);
	}

	// verify
	let	matchDataOutput = {
		"id": "20230123_225906587000_1358_valve_csgo_05f2ab44",
		"game_id": "csgo",
		"version": "0.34.01",
		"game_data.player_kills": 1,
		"game_data.player_score": 1000,
		"game_data.player_deaths": 0,
		"game_data.player_assists": 0,
	};	
	output = builder.getOutput();
	console.log("Output 2 from JsonBuilder:");
	console.log(output);
	for(let field in matchDataOutput)
	{
		// check the get value
		let	valueFromGet = builder.getValue("out." + field);
		context.assertEquals(matchDataOutput[field], valueFromGet);

		// check from the JSON itself
		let	valueFromJson = ObjUtils.GetValue(output, field);
		context.assertEquals(matchDataOutput[field], valueFromJson);
	}

	// test process
	let	processToTest = {
		"add(out.game_data.player_kills, out.game_data.player_score)": 1001
	};
	for(let instruction in processToTest)
	{
		let	value = builder.processInstruction(instruction);
		context.assertEquals(processToTest[instruction], value);
	}

});



suite.test("StringUtils.IsEmpty", async function (context) {

	let	tests = [
		{
			str: undefined,
			result: true
		},
		{
			str: null,
			result: true
		},
		{
			str: 0,
			result: true
		},
		{
			str: true,
			result: true
		},
		{
			str: 1000,
			result: true
		},
		{
			str: [1, 1, 1],
			result: true
		},
		{
			str: {test: 1},
			result: true
		},
		{
			str: "",
			result: true
		},
		{
			str: "true",
			result: false
		},
		{
			str: "0",
			result: false
		},
		{
			str: "my test",
			result: false
		},
	];
	
	for(let i=0; i<tests.length; i++)
	{
		// convert it
		let	value = StringUtils.IsEmpty(tests[i].str);

		if (value != tests[i].result)
		{
			console.error("Error: StringUtils.IsEmpty(" + i + ")");
		}
		context.assertEquals(value, tests[i].result);

	}
});


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
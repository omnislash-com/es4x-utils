/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { CoreUtils } from '../src/utils/CoreUtils';
import { ObjUtils } from '../src/utils/ObjUtils';

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


const suite = TestSuite.create("ES4X Test: ObjUtils");

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

suite.test("ObjUtils.HasKeys", function (context) {

	context.assertEquals(ObjUtils.HasKeys({}), false);
	context.assertEquals(ObjUtils.HasKeys(null), false);
	context.assertEquals(ObjUtils.HasKeys(undefined), false);
	context.assertEquals(ObjUtils.HasKeys({"key": true}), true);

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

suite.test("ObjUtils.SetValue", async function (context) {

	let	obj = null;

	// init
	obj = ObjUtils.SetValue(obj, "matches", null, true, true);
	context.assertEquals(CoreUtils.IsArray(obj.matches), true);
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

suite.test("ObjUtils.SerializeObject", async function (context) {

	let	tests = [
		{
			obj: {
				mode: "payment",
				success_url: "https://example.com/success",
				cancel_url: "https://example.com/cancel",
				client_reference_id: 5,
				currency: "usd",
				customer: 2,
				nullvalue: null,
				customer_email: "mike@omnislash.com",
				metadata: {
					key1: "value1",
					key2: 2
				}
			},
			result: "mode=payment&success_url=https%3A%2F%2Fexample.com%2Fsuccess&cancel_url=https%3A%2F%2Fexample.com%2Fcancel&client_reference_id=5&currency=usd&customer=2&customer_email=mike%40omnislash.com&metadata=%7B%22key1%22%3A%22value1%22%2C%22key2%22%3A2%7D"
		}
	];

	for(let test of tests)
	{
		let	ret = ObjUtils.SerializeObject(test.obj);

		context.assertEquals(ret, test.result);
	}

});

suite.test("ObjUtils.Flatten", async function (context) {

	let	tests = [
		{
			obj: {
				mode: "payment",
				client_reference_id: 5,
				customer: 2,
				nullvalue: null,
				metadata: {
					key1: "value1",
					key2: 2
				},
				list: [
					{
						test: 1,
						sub: {
							subsub: "value"
						}
					}
				]
			},
			result: {
				"mode": "payment",
				"client_reference_id": 5,
				"customer": 2,
				"metadata[key1]": "value1",
				"metadata[key2]": 2,
				"list[0][test]": 1,
				"list[0][sub][subsub]": "value",
			}
		}
	];

	for(let test of tests)
	{
		let	ret = ObjUtils.Flatten(test.obj, false, true, "", false, true, true);

		for(let key in ret)
		{
			context.assertTrue(ObjUtils.HasProperty(test.result, key));
			context.assertEquals(ret[key], test.result[key]);
		}

	}

});


suite.run();

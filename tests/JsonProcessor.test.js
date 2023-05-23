/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { CoreUtils } from '../src/utils/CoreUtils';
import { ObjUtils } from '../src/utils/ObjUtils';
import { JsonProcessor } from '../src/jsonprocessor/JsonProcessor';

const suite = TestSuite.create("ES4X Test: JsonProcessor");

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
		"sum(game_data.rounds, 'kills')": 3,
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
		"sum(game_data.rounds, 'score')": 8,
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
		if ( (CoreUtils.IsArray(tests[key]) == true) && (CoreUtils.IsArray(value) == true) )
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
		"_summary.total_duration": 275,
		"count(_per_game_summary)": 3,
		"sum(_per_game_summary, 'total_duration')": 275,//parseFloat((275).toString()),
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



suite.run();

const { LogUtils } = require("../utils/LogUtils");
const { CoreUtils } = require("../utils/CoreUtils");
const { ObjUtils } = require("../utils/ObjUtils");
const { ArrayUtils } = require("../utils/ArrayUtils");
const { StringUtils } = require("../utils/StringUtils");
const { DateUtils } = require("../utils/DateUtils");
const { MathUtils } = require("../utils/MathUtils");
const { JsonProcessorMethodParam } = require("./JsonProcessorMethodParam");

class	JsonProcessorMethods
{
	static	GetMethods()
	{
		return {
			"buildMatchesStats": {
				"alias": "extractObjects(initMatchesWin(matches, {{2}}), {{0}}, {{1}}, {{3}}, 'true', 'true', 'true', {{4}}, {{5}}, {{6}})"
			},
			"set2": {
				"alias": "set(set({{0}}, {{1}}, {{2}}), {{3}}, {{4}})"
			},
			"set3": {
				"alias": "set(set(set({{0}}, {{1}}, {{2}}), {{3}}, {{4}}), {{5}}, {{6}})"
			},
			"createAndSet2": {
				"alias": "set(set(createObject(), {{0}}, {{1}}), {{2}}, {{3}})"
			},
			"createAndSet3": {
				"alias": "set(set(set(createObject(), {{0}}, {{1}}), {{2}}, {{3}}), {{4}}, {{5}})"
			},
			"createListWithSet2": {
				"alias": "push(createList(), createAndSet2({{0}}, {{1}}, {{2}}, {{3}}))"
			},
			"createListWithSet3": {
				"alias": "push(createList(), createAndSet3({{0}}, {{1}}, {{2}}, {{3}}, {{4}}, {{5}}))"
			},
			"createHighLevelStatsSingle": {
				"alias": "createListWithSet3('count', '1', 'key', {{0}}, {{1}}, {{2}})"
			},
			"valueBestMerge": {
				"alias": "value(objectAt(sort(mergeList({{0}}, {{1}}), {{2}}), '0'), {{3}})"
			},
			"gameImgUrl": {
				"alias": "gameAsset('image', {{0}}, {{1}})"
			},
			"gameImgUrlIfGt": {
				"alias": "ifGt({{0}}, {{1}}, gameImgUrl({{2}}, {{3}}), '')"
			},
			"gameImgUrlIfEq": {
				"alias": "ifEq({{0}}, {{1}}, gameImgUrl({{2}}, {{3}}), '')"
			},
			"gameImg": {
				"alias": "gameImgUrl('game_common|img:image_normal', {{0}})"
			},
			"gameImgSquare": {
				"alias": "gameImgUrl('game_common|img:image_square', {{0}})"
			},
			"gameImgDark": {
				"alias": "gameImgUrl('game_common|img:image_dark', {{0}})"
			},
			"gameName": {
				"alias": "gameText('game_common:name', {{0}})"
			},
			"gameGroupName": {
				"alias": "gameText('game_common:game_group', {{0}})"
			},
			"gameText": {
				"alias": "gameAsset('text', {{0}}, {{1}})"
			},
			"gameTextIfGt": {
				"alias": "ifGt({{0}}, {{1}}, gameText({{2}}, {{3}}), '')"
			},
			"gameTextIfEq": {
				"alias": "ifEq({{0}}, {{1}}, gameText({{2}}, {{3}}), '')"
			},
			"iconUrl": {
				"alias": "gameAsset('image', '__common__.icon.image', {{0}})"
			},
			"iconUrlIfGt": {
				"alias": "ifGt({{0}}, {{1}}, iconUrl({{2}}), '')"
			},
			"iconUrlIfEq": {
				"alias": "ifEq({{0}}, {{1}}, iconUrl({{2}}), '')"
			},
			"result": {
				"alias": "textIsVictory(is_victory, is_ranking)"
			},
			"ifPlacingEq": {
				"alias": "ifEq(is_victory, {{0}}, {{1}}, {{2}})"
			},
			"ifPlacingNeq": {
				"alias": "ifNeq(is_victory, {{0}}, {{1}}, {{2}})"
			},
			"ifPlacingGt": {
				"alias": "ifGt(is_victory, {{0}}, {{1}}, {{2}})"
			},
			"ifPlacingGte": {
				"alias": "ifGte(is_victory, {{0}}, {{1}}, {{2}})"
			},
			"ifPlacingLt": {
				"alias": "ifLt(is_victory, {{0}}, {{1}}, {{2}})"
			},
			"ifPlacingLte": {
				"alias": "ifLte(is_victory, {{0}}, {{1}}, {{2}})"
			},
			"gameModeName": {
				"alias": "gameAsset('text', 'game_common:game_mode', concat3(game_id, '|', game_mode_internal))"
			},
			"ifEq": {
				"alias": "if(eq({{0}}, {{1}}), {{2}}, {{3}})"
			},
			"ifNeq": {
				"alias": "if(neq({{0}}, {{1}}), {{2}}, {{3}})"
			},
			"ifGt": {
				"alias": "if(gt({{0}}, {{1}}), {{2}}, {{3}})"
			},
			"ifGte": {
				"alias": "if(gte({{0}}, {{1}}), {{2}}, {{3}})"
			},
			"ifLt": {
				"alias": "if(lt({{0}}, {{1}}), {{2}}, {{3}})"
			},
			"ifLte": {
				"alias": "if(lte({{0}}, {{1}}), {{2}}, {{3}})"
			},
			"ifStartsWith": {
				"alias": "if(startsWith({{0}}, {{1}}), {{2}}, {{3}})"
			},
			"ifEndsWith": {
				"alias": "if(endsWith({{0}}, {{1}}), {{2}}, {{3}})"
			},
			"ifContains": {
				"alias": "if(contains({{0}}, {{1}}), {{2}}, {{3}})"
			},
			"concatSwapIfEq": {
				"alias": "ifEq({{0}}, {{1}}, concat3({{2}}, {{4}}, {{3}}), concat3({{3}}, {{4}}, {{2}}))"
			},
			"inc": {
				"alias": "add({{0}}, '1')"
			},
			"dec": {
				"alias": "sub({{0}}, '1')"
			},
			"avg": {
				"alias": "div(sum({{0}}, {{1}}), count({{0}}))"
			},
			"neq": {
				"alias": "compare('!=', {{0}}, {{1}})"
			},
			"eq": {
				"alias": "compare('==', {{0}}, {{1}})"
			},
			"gt": {
				"alias": "compare('>', {{0}}, {{1}})"
			},
			"gte": {
				"alias": "compare('>=', {{0}}, {{1}})"
			},
			"lt": {
				"alias": "compare('<', {{0}}, {{1}})"
			},
			"lte": {
				"alias": "compare('<=', {{0}}, {{1}})"
			},
			"sumIfNeq": {
				"alias": "sumIf({{0}}, {{1}}, '!=', {{2}})"
			},			
			"sumIfEq": {
				"alias": "sumIf({{0}}, {{1}}, '==', {{2}})"
			},			
			"sumIfGt": {
				"alias": "sumIf({{0}}, {{1}}, '>', {{2}})"
			},			
			"sumIfGte": {
				"alias": "sumIf({{0}}, {{1}}, '>=', {{2}})"
			},			
			"sumIfLt": {
				"alias": "sumIf({{0}}, {{1}}, '<', {{2}})"
			},			
			"sumIfLte": {
				"alias": "sumIf({{0}}, {{1}}, '<=', {{2}})"
			},			
			"sumIfNot": {
				"alias": "sumIfNeq({{0}}, {{1}}, {{2}})"
			},
			"countIfEq": {
				"alias": "countIf({{0}}, {{1}}, '==', {{2}})"
			},
			"countIfNeq": {
				"alias": "countIf({{0}}, {{1}}, '!=', {{2}})"
			},
			"countIfGt": {
				"alias": "countIf({{0}}, {{1}}, '>', {{2}})"
			},
			"countIfGte": {
				"alias": "countIf({{0}}, {{1}}, '>=', {{2}})"
			},
			"countIfLt": {
				"alias": "countIf({{0}}, {{1}}, '<', {{2}})"
			},
			"countIfLte": {
				"alias": "countIf({{0}}, {{1}}, '<=', {{2}})"
			},
			"countIfBelow": {
				"alias": "countIfLt({{0}}, {{1}}, {{2}})"
			},					
			"countIfAbove": {
				"alias": "countIfGt({{0}}, {{1}}, {{2}})"
			},	
			"avgIfEq": {
				"alias": "avgIf({{0}}, {{1}}, '==', {{2}})"
			},
			"avgIfNeq": {
				"alias": "avgIf({{0}}, {{1}}, '!=', {{2}})"
			},
			"avgIfGt": {
				"alias": "avgIf({{0}}, {{1}}, '>', {{2}})"
			},
			"avgIfGte": {
				"alias": "avgIf({{0}}, {{1}}, '>=', {{2}})"
			},
			"avgIfLt": {
				"alias": "avgIf({{0}}, {{1}}, '<', {{2}})"
			},
			"avgIfLte": {
				"alias": "avgIf({{0}}, {{1}}, '<=', {{2}})"
			},
			"avgIfNot": {
				"alias": "avgIfNeq({{0}}, {{1}}, {{2}})"
			},			
			"avgIfAbove": {
				"alias": "avgIfGt({{0}}, {{1}}, {{2}})"
			},			
			"avgIfOtherEq": {
				"alias": "avgIfOther({{0}}, {{1}}, {{2}}, '==', {{3}})"
			},
			"avgIfOtherNeq": {
				"alias": "avgIfOther({{0}}, {{1}}, {{2}}, '!=', {{3}})"
			},
			"avgIfOtherGt": {
				"alias": "avgIfOther({{0}}, {{1}}, {{2}}, '>', {{3}})"
			},
			"avgIfOtherGte": {
				"alias": "avgIfOther({{0}}, {{1}}, {{2}}, '>=', {{3}})"
			},
			"avgIfOtherLt": {
				"alias": "avgIfOther({{0}}, {{1}}, {{2}}, '<', {{3}})"
			},
			"avgIfOtherLte": {
				"alias": "avgIfOther({{0}}, {{1}}, {{2}}, '<=', {{3}})"
			},
			"avgIfOtherAbove": {
				"alias": "avgIfOtherGt({{0}}, {{1}}, {{2}}, {{3}})"
			},			
			"maxIfEq": {
				"alias": "maxIf({{0}}, {{1}}, '==', {{2}})"
			},
			"maxIfNeq": {
				"alias": "maxIf({{0}}, {{1}}, '!=', {{2}})"
			},
			"maxIfGt": {
				"alias": "maxIf({{0}}, {{1}}, '>', {{2}})"
			},
			"maxIfGte": {
				"alias": "maxIf({{0}}, {{1}}, '>=', {{2}})"
			},
			"maxIfLt": {
				"alias": "maxIf({{0}}, {{1}}, '<', {{2}})"
			},
			"maxIfLte": {
				"alias": "maxIf({{0}}, {{1}}, '<=', {{2}})"
			},
			"minIfEq": {
				"alias": "minIf({{0}}, {{1}}, '==', {{2}})"
			},
			"minIfNeq": {
				"alias": "minIf({{0}}, {{1}}, '!=', {{2}})"
			},
			"minIfGt": {
				"alias": "minIf({{0}}, {{1}}, '>', {{2}})"
			},
			"minIfGte": {
				"alias": "minIf({{0}}, {{1}}, '>=', {{2}})"
			},
			"minIfLt": {
				"alias": "minIf({{0}}, {{1}}, '<', {{2}})"
			},
			"minIfLte": {
				"alias": "minIf({{0}}, {{1}}, '<=', {{2}})"
			},			
			"minIfAbove": {
				"alias": "minIfGt({{0}}, {{1}}, {{2}})"
			},
			"maxIfAbove": {
				"alias": "maxIfGt({{0}}, {{1}}, {{2}})"
			},
			"latestNotEmpty": {
				"alias": "last({{0}}, {{1}})"
			},						
			"ifNot": {
				"alias": "if({{0}}, {{2}}, {{1}})"
			},						
			"ifEmpty": {
				"alias": "if(eq({{0}}, ''), {{1}}, {{2}})"
			},
			"ifElseIfNotElseIfEmpty": {
				"alias": "if({{0}}, {{1}}, ifNot({{2}}, {{3}}, ifEmpty({{4}}, {{5}}, {{6}})))"
			},
			"screenshotWithCaption": {
				"alias": "screenshotWith('caption', {{0}}, {{1}})"
			},
			"username": {
				"alias": "userInfo('username', '')"
			},			
			"userProfilePicture": {
				"alias": "userPicture('profile', {{0}})"
			},
			"gameImgUrlList": {
				"alias": "processList({{0}}, {{1}}, 'gameImgUrl', {{2}}, '~~value~~')"
			},
			"gameTextList": {
				"alias": "processList({{0}}, {{1}}, 'gameText', {{2}}, '~~value~~')"
			},
			"gameImgUrlListValues": {
				"alias": "processListValues({{0}}, 'gameImgUrl', {{1}}, '~~value~~')"
			},
			"gameTextListValues": {
				"alias": "processListValues({{0}}, 'gameText', {{1}}, '~~value~~')"
			},
			"concatList": {
				"alias": "processList({{0}}, {{1}}, 'concat', {{2}}, {{3}})"
			},
			"splitList": {
				"alias": "processList({{0}}, {{1}}, 'split', '~~value~~')"
			},
			"valueOfFirst": {
				"alias": "value(findFirst({{0}}, {{1}}, {{2}}, {{5}}), {{3}}, {{4}})"
			},
			"rankColor": {
				"alias": "objectAt(fillListColors({{1}}), sub({{0}}, '1'))"
			},
			"countIf": {
				"alias": "opeIf({{0}}, {{1}}, {{2}}, {{3}}, 'count')"
			},
			"avgIf": {
				"alias": "opeIf({{0}}, {{1}}, {{2}}, {{3}}, 'avgValues')"
			},
			"sumIf": {
				"alias": "opeIf({{0}}, {{1}}, {{2}}, {{3}}, 'sumValues')"
			},
			"minIf": {
				"alias": "opeIf({{0}}, {{1}}, {{2}}, {{3}}, 'minValues')"
			},
			"maxIf": {
				"alias": "opeIf({{0}}, {{1}}, {{2}}, {{3}}, 'maxValues')"
			},
			"avgIfOther": {
				"alias": "opeIfOther({{0}}, {{1}}, {{2}}, {{3}}, {{4}}, 'avgValues')"
			},
			"sumIfOther": {
				"alias": "opeIfOther({{0}}, {{1}}, {{2}}, {{3}}, {{4}}, 'sumValues')"
			},
			"minIfOther": {
				"alias": "opeIfOther({{0}}, {{1}}, {{2}}, {{3}}, {{4}}, 'minValues')"
			},
			"maxIfOther": {
				"alias": "opeIfOther({{0}}, {{1}}, {{2}}, {{3}}, {{4}}, 'maxValues')"
			},
			"value": {
				"function": JsonProcessorMethods.value,
				"params": [
					JsonProcessorMethodParam.ParamObject("obj"),
					JsonProcessorMethodParam.ParamString("path"),
					JsonProcessorMethodParam.ParamString("default", true),
				],
				"return": JsonProcessorMethodParam.TYPE_VALUE
			},
			"object": {
				"function": JsonProcessorMethods.object,
				"params": [
					JsonProcessorMethodParam.ParamObject("obj"),
					JsonProcessorMethodParam.ParamString("path"),
					JsonProcessorMethodParam.ParamObject("default", true),
				],
				"return": JsonProcessorMethodParam.TYPE_OBJECT
			},			
			"list": {
				"function": JsonProcessorMethods.list,
				"params": [
					JsonProcessorMethodParam.ParamObject("obj"),
					JsonProcessorMethodParam.ParamString("path"),
					JsonProcessorMethodParam.ParamList("default", true),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},
			"findFirst": {
				"function": JsonProcessorMethods.findFirst,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("cond_field"),
					JsonProcessorMethodParam.ParamValue("cond_value"),
					JsonProcessorMethodParam.ParamString("cond_comp", true, "=="),
					JsonProcessorMethodParam.ParamObject("default", true),
				],
				"return": JsonProcessorMethodParam.TYPE_OBJECT
			},			
			"filterList": {
				"function": JsonProcessorMethods.filterList,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("cond_field"),
					JsonProcessorMethodParam.ParamValue("cond_value"),
					JsonProcessorMethodParam.ParamString("cond_comp", true, "=="),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},
			"objectAt": {
				"function": JsonProcessorMethods.objectAt,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamNumber("index"),
					JsonProcessorMethodParam.ParamObject("default", true),
				],
				"return": JsonProcessorMethodParam.TYPE_OBJECT
			},
			"extractObjects": {
				"function": JsonProcessorMethods.extractObjects,
				"params": [
					JsonProcessorMethodParam.ParamAny("obj"),
					JsonProcessorMethodParam.ParamString("path"),
					JsonProcessorMethodParam.ParamString("fields"),
					JsonProcessorMethodParam.ParamString("key", true, ""),
					JsonProcessorMethodParam.ParamBool("add_key", true, false),
					JsonProcessorMethodParam.ParamBool("add_count", true, false),
					JsonProcessorMethodParam.ParamBool("bool_to_int", true, true),
					JsonProcessorMethodParam.ParamString("cond_field", true, ""),
					JsonProcessorMethodParam.ParamValue("cond_value", true, ""),
					JsonProcessorMethodParam.ParamString("cond_comp", true, "=="),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},			
			"mergeList": {
				"function": JsonProcessorMethods.mergeList,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("key"),
					JsonProcessorMethodParam.ParamBool("add_key", true, false),
					JsonProcessorMethodParam.ParamBool("add_count", true, false),
					JsonProcessorMethodParam.ParamString("fields", true, ""),
					JsonProcessorMethodParam.ParamBool("bool_to_int", true, true),
					JsonProcessorMethodParam.ParamString("cond_field", true, ""),
					JsonProcessorMethodParam.ParamValue("cond_value", true, ""),
					JsonProcessorMethodParam.ParamString("cond_comp", true, "=="),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},
			"combineObjects": {
				"function": JsonProcessorMethods.combineObjects,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamBool("add_count", true, false),
					JsonProcessorMethodParam.ParamString("fields", true, ""),
					JsonProcessorMethodParam.ParamBool("bool_to_int", true, true),
					JsonProcessorMethodParam.ParamString("cond_field", true, ""),
					JsonProcessorMethodParam.ParamValue("cond_value", true, ""),
					JsonProcessorMethodParam.ParamString("cond_comp", true, "=="),
				],
				"return": JsonProcessorMethodParam.TYPE_OBJECT
			},			
			"count": {
				"function": JsonProcessorMethods.count,
				"params": [
					JsonProcessorMethodParam.ParamList("list")
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},			
			"sum": {
				"function": JsonProcessorMethods.sum,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("key"),
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},
			"sort": {
				"function": JsonProcessorMethods.sort,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("sort_by"),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST				
			},
			"if": {
				"function": JsonProcessorMethods.condIf,
				"params": [
					JsonProcessorMethodParam.ParamBool("cond"),
					JsonProcessorMethodParam.ParamAny("if_true"),
					JsonProcessorMethodParam.ParamAny("if_false"),
				],
				"return": JsonProcessorMethodParam.TYPE_ANY			
			},
			"compare": {
				"function": JsonProcessorMethods.compare,
				"params": [
					JsonProcessorMethodParam.ParamString("comparison"),
					JsonProcessorMethodParam.ParamAny("value_1"),
					JsonProcessorMethodParam.ParamAny("value_2")
				],
				"return": JsonProcessorMethodParam.TYPE_BOOL	
			},			
			"startsWith": {
				"function": JsonProcessorMethods.startsWith,
				"params": [
					JsonProcessorMethodParam.ParamAny("value"),
					JsonProcessorMethodParam.ParamAny("search")
				],
				"return": JsonProcessorMethodParam.TYPE_BOOL	
			},
			"endsWith": {
				"function": JsonProcessorMethods.endsWith,
				"params": [
					JsonProcessorMethodParam.ParamAny("value"),
					JsonProcessorMethodParam.ParamAny("search")
				],
				"return": JsonProcessorMethodParam.TYPE_BOOL	
			},				
			"contains": {
				"function": JsonProcessorMethods.contains,
				"params": [
					JsonProcessorMethodParam.ParamAny("value"),
					JsonProcessorMethodParam.ParamAny("search")
				],
				"return": JsonProcessorMethodParam.TYPE_BOOL	
			},				
			"gameAsset": {
				"function": JsonProcessorMethods.gameAsset,
				"params": [
					JsonProcessorMethodParam.ParamString("type"),
					JsonProcessorMethodParam.ParamString("path"),
					JsonProcessorMethodParam.ParamString("id"),
				],
				"return": JsonProcessorMethodParam.TYPE_STRING	
			},
			"textIsVictory": {
				"function": JsonProcessorMethods.textIsVictory,
				"params": [
					JsonProcessorMethodParam.ParamNumber("is_victory"),
					JsonProcessorMethodParam.ParamBool("is_ranking")
				],
				"return": JsonProcessorMethodParam.TYPE_STRING	
			},
			"formatPlacing": {
				"function": JsonProcessorMethods.formatPlacing,
				"params": [
					JsonProcessorMethodParam.ParamNumber("placing")
				],
				"return": JsonProcessorMethodParam.TYPE_STRING	
			},			
			"concat": {
				"function": JsonProcessorMethods.concat,
				"params": [
					JsonProcessorMethodParam.ParamValue("str_1"),
					JsonProcessorMethodParam.ParamValue("str_2")
				],
				"return": JsonProcessorMethodParam.TYPE_STRING	
			},
			"concat3": {
				"function": JsonProcessorMethods.concat3,
				"params": [
					JsonProcessorMethodParam.ParamValue("str_1"),
					JsonProcessorMethodParam.ParamValue("str_2"),
					JsonProcessorMethodParam.ParamValue("str_3")
				],
				"return": JsonProcessorMethodParam.TYPE_STRING	
			},
			"add": {
				"function": JsonProcessorMethods.add,
				"params": [
					JsonProcessorMethodParam.ParamNumber("value"),
					JsonProcessorMethodParam.ParamNumber("to_add"),
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},			
			"sub": {
				"function": JsonProcessorMethods.sub,
				"params": [
					JsonProcessorMethodParam.ParamNumber("value"),
					JsonProcessorMethodParam.ParamNumber("to_sub"),
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},	
			"formatPercent": {
				"function": JsonProcessorMethods.formatPercent,
				"params": [
					JsonProcessorMethodParam.ParamNumber("value")
				],
				"return": JsonProcessorMethodParam.TYPE_STRING
			},
			"formatRound": {
				"function": JsonProcessorMethods.formatRound,
				"params": [
					JsonProcessorMethodParam.ParamNumber("value"),
					JsonProcessorMethodParam.ParamNumber("decimals", true, 0),
				],
				"return": JsonProcessorMethodParam.TYPE_STRING
			},
			"formatRound1": {
				"alias": "formatRound({{0}}, '1')"
			},					
			"formatRound2": {
				"alias": "formatRound({{0}}, '2')"
			},					
			"formatDurationSec": {
				"function": JsonProcessorMethods.formatDurationSec,
				"params": [
					JsonProcessorMethodParam.ParamNumber("value"),
					JsonProcessorMethodParam.ParamBool("round", true, true),
					JsonProcessorMethodParam.ParamBool("full", true, false),
					JsonProcessorMethodParam.ParamBool("sec", true, true),
				],
				"return": JsonProcessorMethodParam.TYPE_STRING
			},			
			"secToMin": {
				"function": JsonProcessorMethods.secToMin,
				"params": [
					JsonProcessorMethodParam.ParamNumber("value")
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},	
			"secToHour": {
				"function": JsonProcessorMethods.secToHour,
				"params": [
					JsonProcessorMethodParam.ParamNumber("value")
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},
			"avgSecToAvgMin": {
				"function": JsonProcessorMethods.avgSecToAvgMin,
				"params": [
					JsonProcessorMethodParam.ParamNumber("value")
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},
			"sumAnd": {
				"function": JsonProcessorMethods.sumAnd,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("key1"),
					JsonProcessorMethodParam.ParamString("key2"),
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},
			"opeIf": {
				"function": JsonProcessorMethods.opeIf,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("key"),
					JsonProcessorMethodParam.ParamString("comparison"),
					JsonProcessorMethodParam.ParamValue("value"),
					JsonProcessorMethodParam.ParamString("method"),
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},			
			"opeIfOther": {
				"function": JsonProcessorMethods.opeIfOther,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("key"),
					JsonProcessorMethodParam.ParamString("key2"),
					JsonProcessorMethodParam.ParamString("comparison"),
					JsonProcessorMethodParam.ParamNumber("value"),
					JsonProcessorMethodParam.ParamString("method"),
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},				
			"div": {
				"function": JsonProcessorMethods.div,
				"params": [
					JsonProcessorMethodParam.ParamNumber("value1"),
					JsonProcessorMethodParam.ParamNumber("value2"),
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},							
			"mul": {
				"function": JsonProcessorMethods.mul,
				"params": [
					JsonProcessorMethodParam.ParamNumber("value1"),
					JsonProcessorMethodParam.ParamNumber("value2"),
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},							
			"min": {
				"function": JsonProcessorMethods.min,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("key")
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},
			"max": {
				"function": JsonProcessorMethods.max,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("key")
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},
			"first": {
				"function": JsonProcessorMethods.first,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("key"),
				],
				"return": JsonProcessorMethodParam.TYPE_ANY
			},
			"last": {
				"function": JsonProcessorMethods.last,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("key"),
				],
				"return": JsonProcessorMethodParam.TYPE_ANY
			},
			"groupBy": {
				"function": JsonProcessorMethods.groupBy,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("key"),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},
			"highestKey": {
				"function": JsonProcessorMethods.highestKey,
				"params": [
					JsonProcessorMethodParam.ParamObject("obj")
				],
				"return": JsonProcessorMethodParam.TYPE_STRING
			},				
			"lowestKey": {
				"function": JsonProcessorMethods.lowestKey,
				"params": [
					JsonProcessorMethodParam.ParamObject("obj")
				],
				"return": JsonProcessorMethodParam.TYPE_STRING
			},
			"countKeys": {
				"function": JsonProcessorMethods.countKeys,
				"params": [
					JsonProcessorMethodParam.ParamObject("obj")
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},
			"toSortedList": {
				"function": JsonProcessorMethods.toSortedList,
				"params": [
					JsonProcessorMethodParam.ParamObject("obj"),
					JsonProcessorMethodParam.ParamString("sort_order", true, ""),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},				
			"avgObjValues": {
				"function": JsonProcessorMethods.avgObjValues,
				"params": [
					JsonProcessorMethodParam.ParamObject("obj")
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},	
			"subList": {
				"function": JsonProcessorMethods.subList,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamNumber("start"),
					JsonProcessorMethodParam.ParamNumber("count", true, 0),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},	
			"firstNotEmpty": {
				"function": JsonProcessorMethods.firstNotEmpty,
				"params": [
					JsonProcessorMethodParam.ParamValue("p1"),
					JsonProcessorMethodParam.ParamValue("p2"),
					JsonProcessorMethodParam.ParamValue("p3", true, ""),
					JsonProcessorMethodParam.ParamValue("p4", true, ""),
					JsonProcessorMethodParam.ParamValue("p5", true, ""),
				],
				"return": JsonProcessorMethodParam.TYPE_STRING
			},	
			"screenshotWith": {
				"function": JsonProcessorMethods.screenshotWith,
				"params": [
					JsonProcessorMethodParam.ParamString("field"),
					JsonProcessorMethodParam.ParamValue("value"),
					JsonProcessorMethodParam.ParamString("default", true, ""),
				],
				"return": JsonProcessorMethodParam.TYPE_STRING
			},
			"userPicture": {
				"function": JsonProcessorMethods.userPicture,
				"params": [
					JsonProcessorMethodParam.ParamString("type"),
					JsonProcessorMethodParam.ParamString("default", true, ""),
				],
				"return": JsonProcessorMethodParam.TYPE_STRING
			},
			"userInfo": {
				"function": JsonProcessorMethods.userInfo,
				"params": [
					JsonProcessorMethodParam.ParamString("field"),
					JsonProcessorMethodParam.ParamString("default", true, ""),
				],
				"return": JsonProcessorMethodParam.TYPE_STRING
			},			
			"simplifyObj": {
				"function": JsonProcessorMethods.simplifyObj,
				"params": [
					JsonProcessorMethodParam.ParamObject("obj"),
					JsonProcessorMethodParam.ParamString("fields"),
				],
				"return": JsonProcessorMethodParam.TYPE_OBJECT
			},			
			"simplifyList": {
				"function": JsonProcessorMethods.simplifyList,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("fields"),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},
			"split": {
				"function": JsonProcessorMethods.split,
				"params": [
					JsonProcessorMethodParam.ParamString("str"),
					JsonProcessorMethodParam.ParamString("delimiter", true, ","),
					JsonProcessorMethodParam.ParamBool("cast", true, true),
					JsonProcessorMethodParam.ParamBool("skipempty", true, true),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},
			"sumValues": {
				"function": JsonProcessorMethods.sumValues,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},			
			"avgValues": {
				"function": JsonProcessorMethods.avgValues,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},			
			"minValues": {
				"function": JsonProcessorMethods.minValues,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},			
			"maxValues": {
				"function": JsonProcessorMethods.maxValues,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},
			"processObj": {
				"function": JsonProcessorMethods.processObj,
				"params": [
					JsonProcessorMethodParam.ParamObject("obj"),
					JsonProcessorMethodParam.ParamString("field"),
					JsonProcessorMethodParam.ParamString("method"),
					JsonProcessorMethodParam.ParamAny("p1", true),
					JsonProcessorMethodParam.ParamAny("p2", true),
					JsonProcessorMethodParam.ParamAny("p3", true),
					JsonProcessorMethodParam.ParamAny("p4", true),
					JsonProcessorMethodParam.ParamAny("p5", true),
					JsonProcessorMethodParam.ParamAny("p6", true),
				],
				"return": JsonProcessorMethodParam.TYPE_OBJECT
			},			
			"processList": {
				"function": JsonProcessorMethods.processList,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("field"),
					JsonProcessorMethodParam.ParamString("method"),
					JsonProcessorMethodParam.ParamAny("p1", true),
					JsonProcessorMethodParam.ParamAny("p2", true),
					JsonProcessorMethodParam.ParamAny("p3", true),
					JsonProcessorMethodParam.ParamAny("p4", true),
					JsonProcessorMethodParam.ParamAny("p5", true),
					JsonProcessorMethodParam.ParamAny("p6", true),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},
			"processListValues": {
				"function": JsonProcessorMethods.processListValues,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("method"),
					JsonProcessorMethodParam.ParamAny("p1", true),
					JsonProcessorMethodParam.ParamAny("p2", true),
					JsonProcessorMethodParam.ParamAny("p3", true),
					JsonProcessorMethodParam.ParamAny("p4", true),
					JsonProcessorMethodParam.ParamAny("p5", true),
					JsonProcessorMethodParam.ParamAny("p6", true),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},
			"fillList": {
				"function": JsonProcessorMethods.fillList,
				"params": [
					JsonProcessorMethodParam.ParamNumber("count"),
					JsonProcessorMethodParam.ParamNumber("start", true, 0),
					JsonProcessorMethodParam.ParamNumber("step", true, 1),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST				
			},
			"listToStr": {
				"function": JsonProcessorMethods.listToStr,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST				
			},
			"invertListValues": {
				"function": JsonProcessorMethods.invertListValues,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamNumber("max"),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST				
			},
			"fillListColors": {
				"function": JsonProcessorMethods.fillListColors,
				"params": [
					JsonProcessorMethodParam.ParamNumber("count"),
					JsonProcessorMethodParam.ParamString("color", true, "#FFFFFF"),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST				
			},
			"reverseList": {
				"function": JsonProcessorMethods.reverseList,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST				
			},
			"extractFromList": {
				"function": JsonProcessorMethods.extractFromList,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("field"),
					JsonProcessorMethodParam.ParamBool("add_if_empty", true, false),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST				
			},
			"extractFromListMulti": {
				"function": JsonProcessorMethods.extractFromListMulti,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("fields"),
					JsonProcessorMethodParam.ParamValue("default", true, 0),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST				
			},			
			"extractFromListCalc": {
				"function": JsonProcessorMethods.extractFromListCalc,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("field1"),
					JsonProcessorMethodParam.ParamString("field2"),
					JsonProcessorMethodParam.ParamString("calc"),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST				
			},
			"createObject": {
				"function": JsonProcessorMethods.createObject,
				"params": [
				],
				"return": JsonProcessorMethodParam.TYPE_OBJECT
			},
			"set": {
				"function": JsonProcessorMethods.set,
				"params": [
					JsonProcessorMethodParam.ParamObject("obj"),
					JsonProcessorMethodParam.ParamString("path"),
					JsonProcessorMethodParam.ParamAny("value"),
				],
				"return": JsonProcessorMethodParam.TYPE_OBJECT
			},
			"createList": {
				"function": JsonProcessorMethods.createList,
				"params": [
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},
			"push": {
				"function": JsonProcessorMethods.push,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamAny("value")
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},
			"buildScale": {
				"function": JsonProcessorMethods.buildScale,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamNumber("ticks", true, 0),
					JsonProcessorMethodParam.ParamNumber("multiple", true, 1)
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},
			"buildScaleDomain": {
				"function": JsonProcessorMethods.buildScaleDomain,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamNumber("multiple", true, 1)
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},			
			"formatListToK": {
				"function": JsonProcessorMethods.formatListToK,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamBool("abs", true, false)
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},		
			"formatToK": {
				"function": JsonProcessorMethods.formatToK,
				"params": [
					JsonProcessorMethodParam.ParamNumber("value"),
					JsonProcessorMethodParam.ParamBool("abs", true, false)
				],
				"return": JsonProcessorMethodParam.TYPE_STRING
			},				
			"normalize": {
				"function": JsonProcessorMethods.normalize,
				"params": [
					JsonProcessorMethodParam.ParamNumber("value"),
					JsonProcessorMethodParam.ParamNumber("value0"),
					JsonProcessorMethodParam.ParamNumber("value1"),
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},				
			"initMatchesWin": {
				"function": JsonProcessorMethods.initMatchesWin,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamNumber("rank_to_win", true, 1),
					JsonProcessorMethodParam.ParamString("field_win", true, "win"),
					JsonProcessorMethodParam.ParamString("field_is_victory", true, "is_victory"),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},
			"hours": {
				"function": JsonProcessorMethods.hours,
				"params": [
					JsonProcessorMethodParam.ParamString("date")
				],
				"return": JsonProcessorMethodParam.TYPE_NUMBER
			},		
			"minMax": {
				"function": JsonProcessorMethods.minMax,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamNumber("margin", true, 0),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},				
			"transformSetToObjectList": {
				"function": JsonProcessorMethods.transformSetToObjectList,
				"params": [
					JsonProcessorMethodParam.ParamList("list"),
					JsonProcessorMethodParam.ParamString("key", true, "key"),
				],
				"return": JsonProcessorMethodParam.TYPE_LIST
			},		

		};
	}		

	static	FindMethod(_name)
	{
		let	methods = JsonProcessorMethods.GetMethods();
		if (methods.hasOwnProperty(_name) == true)
			return methods[_name];
		else
			return null;
	}

	static	ExeFromName(_methodName, _parameters)
	{
		// find the method
		let	methodInfo = JsonProcessorMethods.FindMethod(_methodName);
		if (methodInfo == null)
			return null;

		// is it an alias?
		if (methodInfo.hasOwnProperty("alias") == true)
		{
			// extract the alias name and parameters
			let	aliasInfo = JsonProcessorMethods.ExtractAliasAndParameters(methodInfo.alias);

			// substitute the parameters
			for(let i=0; i<aliasInfo.parameters.length; i++)
			{
				// is it dynamic?
				if ( (aliasInfo.parameters[i].startsWith("{{") == true) && (aliasInfo.parameters[i].endsWith("}}") == true) )
				{
					// remove them
					let	index = StringUtils.ToInt(aliasInfo.parameters[i].substr(2, aliasInfo.parameters[i].length - 4));

					// get the value
					let	value = index < _parameters.length ? _parameters[index] : "";

					// set it
					aliasInfo.parameters[i] = value;
				}
				// starts and ends with '?
				else if ( (aliasInfo.parameters[i].startsWith("'") == true) && (aliasInfo.parameters[i].endsWith("'") == true) )
				{
					aliasInfo.parameters[i] = aliasInfo.parameters[i].substr(1, aliasInfo.parameters[i].length - 2);
				}
			}

			// execute it
			return JsonProcessorMethods.ExeFromName(aliasInfo.method, aliasInfo.parameters);

		}
		// no alias, we execute
		else
		{
			return JsonProcessorMethods.Exe(methodInfo, _parameters);
		}
	}

	static	ExtractAliasAndParameters(_str)
	{
		// split with "("
		let	chunks = _str.split("(");

		// the method name is the first one
		let	methodName = chunks[0];

		// then the parameters are in the following
		let	parametersStr = chunks.splice(1).join("(");

		// remove the last ")"
		parametersStr = parametersStr.substr(0, parametersStr.length - 1);

		// split with ","
		let	parameters = StringUtils.Split(parametersStr, ",", false, false);

		// return it
		return {
			method: methodName,
			parameters: parameters
		};
	}

	static	Exe(_methodInfo, _parameters)
	{
		// verify the parameters
		let	finalParams = JsonProcessorMethods.VerifyParameters(_parameters, _methodInfo.params);

		// if the params are good, we call the method
		if (finalParams != null)
		{
			return _methodInfo.function(finalParams);
		}
		else
		{
			LogUtils.LogError("Parameters are incorrect for method: ", {
				"method_info": _methodInfo,
				"parameters": _parameters
			});
	
			return JsonProcessorMethodParam.DefaultValue(_methodInfo.return);
		}
	}

	static	VerifyParameters(_parameters, _paramDefinition)
	{
		// build the final parameters
		let	finalParameters = {};
		let	nbErrors = 0;

		// for each parameter we should have
		for(let i=0; i<_paramDefinition.length; i++)
		{
			let	paramName = _paramDefinition[i].getName();
			let	paramValue = null;
			let	errorMsg = "";

			// do we have it?
			if (i < _parameters.length)
			{
				// verify the type
				paramValue = _parameters[i];

				// null value?
				if (paramValue == null)
				{
					// is it optional?
					if (_paramDefinition[i].isOptional() == true)
						paramValue = _paramDefinition[i].getDefaultValue();
					else
						errorMsg = "No value set and it's not optional";					
				}
				else
				{
					// get the requested type
					let	requestedType = _paramDefinition[i].getType();

					// compare the types
					let	valueType = JsonProcessorMethodParam.GetType(paramValue);

					// if it's string, we're gonna see if we can cast the value
					if ( (requestedType == JsonProcessorMethodParam.TYPE_STRING) && ( (valueType == JsonProcessorMethodParam.TYPE_NUMBER) || (valueType == JsonProcessorMethodParam.TYPE_BOOL) ) )
					{
						valueType = JsonProcessorMethodParam.TYPE_STRING;
						paramValue = paramValue.toString();
					}

					// make sure there are good
					let	typeOk = JsonProcessorMethodParam.IsTypeOk(valueType, requestedType);
					if (typeOk == false)
					{
						// if we need a number and we have a string?
						if ( (valueType == JsonProcessorMethodParam.TYPE_STRING) && ( (requestedType == JsonProcessorMethodParam.TYPE_NUMBER) || (requestedType == JsonProcessorMethodParam.TYPE_BOOL) ) )
						{
							paramValue = StringUtils.ToAny(paramValue);
						}
						else
							errorMsg = "Value is not of the correct type: " + valueType + " VS " + requestedType;
					}
				}
			}
			// we don't have it
			else
			{
				// is it optional?
				if (_paramDefinition[i].isOptional() == true)
					paramValue = _paramDefinition[i].getDefaultValue();
				else
					errorMsg = "No value set and it's not optional";
			}

			// if the param is correct, we add it
			if (errorMsg == "")
			{
				finalParameters[paramName] = paramValue;
			}
			else
			{
				LogUtils.LogError("Parameter '" + paramName + "' is incorrect: " + errorMsg);
				nbErrors++;
			}
		}

		// no errors?
		if (nbErrors == 0)
			return finalParameters;
		else
			return null;
	}







	static	value(_data)
	{
		return ObjUtils.GetValue(_data["obj"], _data["path"], _data["default"]);
	}

	static	object(_data)
	{
		return ObjUtils.GetValue(_data["obj"], _data["path"], _data["default"]);
	}

	static	list(_data)
	{
		return ObjUtils.GetValue(_data["obj"], _data["path"], _data["default"]);
	}	

	static	objectAt(_data)
	{
		// are we within the range?
		if ( (_data["index"] >= 0) && (_data["index"] < _data["list"].length) )
			return _data["list"][_data["index"]];
		else
			return _data["default"];
	}	

	static	extractObjects(_data)
	{
		// extract the list of fields to keep
		let	fieldsToKeep = [];
		if (StringUtils.IsEmpty(_data["fields"]) == false)
			fieldsToKeep = _data["fields"].split("|");

		return ObjUtils.ExtractObjectsWithFields(_data["obj"], _data["path"], fieldsToKeep, _data["key"], _data["add_key"], _data["add_count"], _data["bool_to_int"], _data["cond_field"], _data["cond_value"], _data["cond_comp"]);
	}

	static	mergeList(_data)
	{
		// extract the list of fields to keep
		let	fieldsToKeep = null;
		if (StringUtils.IsEmpty(_data["fields"]) == false)
			fieldsToKeep = _data["fields"].split("|");

		return ObjUtils.MergeList(_data["list"], _data["key"], _data["add_key"], _data["add_count"], fieldsToKeep, _data["bool_to_int"], _data["cond_field"], _data["cond_value"], _data["cond_comp"]);
	}

	static	combineObjects(_data)
	{
		// extract the list of fields to keep
		let	fieldsToKeep = null;
		if (StringUtils.IsEmpty(_data["fields"]) == false)
			fieldsToKeep = _data["fields"].split("|");

		return ObjUtils.CombineObjectsInList(_data["list"], _data["add_count"], fieldsToKeep, _data["bool_to_int"], _data["cond_field"], _data["cond_value"], _data["cond_comp"]);
	}	

	static	groupBy(_data)
	{
		return ObjUtils.GroupBy(_data["list"], _data["key"]);
	}

	static	sum(_data)
	{
		let	value = 0;
		for(let i=0; i<_data["list"].length; i++)
		{
			value += ObjUtils.GetValueToNumber(_data["list"][i], _data["key"], 0);
		}
		return value;
	}

	static	sort(_data)
	{
		let	sortByValues = _data["sort_by"].split("|");
		let	sortedList = ArrayUtils.Sort(_data["list"], sortByValues);

		return sortedList;
	}	

	static	count(_data)
	{
		return _data["list"].length;
	}	

	static	condIf(_data)
	{
		if (_data["cond"] == true)
			return _data["if_true"];
		else
			return _data["if_false"];
	}

	static	gameAsset(_data)
	{
		// id is empty?
		if (StringUtils.IsEmpty(_data["id"]) == true)
			return "";

		let	finalPath = "";

		// if it doesnt start with game_common or game_asset we add game_asset by default
		if ( (_data["path"].startsWith("game_common") == false) && (_data["path"].startsWith("game_asset") == false) )
		{
			finalPath = "game_asset";

			// do we want an image url?
			if (_data["type"] == "image")
				finalPath += "|img";
			
			finalPath += ":" + _data["path"];
		}
		else
			finalPath = _data["path"];

		// are not ending with |?
		if (finalPath.endsWith("|") == false)
			finalPath += ":";

		// add the id
		finalPath += _data["id"];

		return finalPath;		
	}

	static	textIsVictory(_data)
	{
		// if the is victory is -1, it's a tie!
		if (_data["is_victory"] == -1)
			return "Tie";
		// if the is victory is 0 or under, we return N/A
		else if ( (_data["is_victory"] == 0) || (_data["is_victory"] < -1) )
			return "N/A";
		else
		{
			// not ranked based? Victory or Defeat
			if (_data["is_ranking"] == false)
			{
				if (_data["is_victory"] == 1)
					return "Victory";
				else
					return "Defeat";
			}
			// position + ordinal suffix
			else
				return JsonProcessorMethods.formatPlacing({"placing": _data["is_victory"]});
		}
	}

	static	formatPlacing(_data)
	{
		return StringUtils.AppendOrdinalSuffix(_data["placing"]) + " Place";
	}

	static	concat(_data)
	{
		return _data["str_1"].toString() + _data["str_2"].toString();
	}	

	static	concat3(_data)
	{
		return _data["str_1"].toString() + _data["str_2"].toString() + _data["str_3"].toString();
	}	

	static	add(_data)
	{
		return _data["value"] + _data["to_add"];
	}

	static	sub(_data)
	{
		return _data["value"] - _data["to_sub"];
	}

	static	startsWith(_data)
	{
		// convert to strings
		let	value = CoreUtils.ToString(_data["value"]).toLowerCase();
		let	search = CoreUtils.ToString(_data["search"]).toLowerCase();

		return ObjUtils.CompareValues("[>", value, search, true);
	}

	static	endsWith(_data)
	{
		// convert to strings
		let	value = CoreUtils.ToString(_data["value"]).toLowerCase();
		let	search = CoreUtils.ToString(_data["search"]).toLowerCase();

		return ObjUtils.CompareValues("<]", value, search, true);
	}

	static	contains(_data)
	{
		// convert to strings
		let	value = CoreUtils.ToString(_data["value"]).toLowerCase();
		let	search = CoreUtils.ToString(_data["search"]).toLowerCase();

		return ObjUtils.CompareValues("€", value, search, true);
	}

	static	formatPercent(_data)
	{
		if (_data["value"] < 0)
			return "0%";
		return Math.round(_data["value"]*100).toString() + "%";
	}

	static	formatRound(_data)
	{
		return MathUtils.Round(_data["value"], _data["decimals"]).toString();
	}

	static	formatDurationSec(_data)
	{
		return DateUtils.FormatDurationFromSec(_data["value"], _data["round"], _data["full"], _data["sec"]);
	}	

	static	secToMin(_data)
	{
		return Math.round(_data["value"] / 60);
	}

	static	secToHour(_data)
	{
		return Math.round((_data["value"] / 3600) * 10) / 10;
	}

	static	avgSecToAvgMin(_data)
	{
		return Math.round(_data["value"] * 60);
	}

	static	sumAnd(_data)
	{
		let	value = 0;
		for(let i=0; i<_data["list"].length; i++)
		{
			// add the first key
			value += ObjUtils.GetValueToNumber(_data["list"][i], _data["key1"], 0);

			// add the second key
			value += ObjUtils.GetValueToNumber(_data["list"][i], _data["key2"], 0);
		}
		return value;
	}	




	static	opeIf(_data)
	{
		let	list = [];
		for(let i=0; i<_data["list"].length; i++)
		{
			// get the value
			let	valueBuf = ObjUtils.GetValue(_data["list"][i], _data["key"], -999999);

			// value is correct?
			if (valueBuf != -999999)
			{
				// do the comparison?
				let	isOk = JsonProcessorMethods.compare({
					"comparison": _data["comparison"],
					"value_1": valueBuf,
					"value_2": _data["value"],
				});
				if (isOk == true)
				{
					list.push(valueBuf);
				}
			}
		}

		return JsonProcessorMethods.ExeFromName(_data["method"], [list]);
	}	

	static	opeIfOther(_data)
	{
		let	list = [];
		for(let i=0; i<_data["list"].length; i++)
		{
			// get the value
			let	valueBuf = ObjUtils.GetValue(_data["list"][i], _data["key2"], -999999);

			// value is correct?
			if (valueBuf != -999999)
			{
				// do the comparison?
				let	isOk = JsonProcessorMethods.compare({
					"comparison": _data["comparison"],
					"value_1": valueBuf,
					"value_2": _data["value"],
				});
				if (isOk == true)
				{
					let	ourValue = ObjUtils.GetValue(_data["list"][i], _data["key"], -999999);
					if (ourValue != -999999)
						list.push(ourValue);
				}
			}
		}

		return JsonProcessorMethods.ExeFromName(_data["method"], [list]);
	}	

	static	div(_data)
	{
		let	value = 0;
		if ( (_data["value1"] > 0) && (_data["value2"] > 0) )
		{
			// divide
			value = _data["value1"] / _data["value2"];

			// round
			value = Math.round(value*100)/100;
		}
		return value;
	}	

	static	mul(_data)
	{
		let	value = 0;

		// multiply
		value = _data["value1"] * _data["value2"];

		// round
		value = Math.round(value*100)/100;

		return value;
	}	


	static	compare(_data)
	{
		return ObjUtils.CompareValues(_data["comparison"], _data["value_1"], _data["value_2"]);
	}		

	static	min(_data)
	{
		let	value = 0;
		let	set = false;
		for(let i=0; i<_data["list"].length; i++)
		{
			// get the value
			let	valueBuf = ObjUtils.GetValueToNumber(_data["list"][i], _data["key"], -999999);

			// value is correct?
			if (valueBuf != -999999)
			{
				if ( (set == false) || (valueBuf < value) )
				{
					set = true;
					value = valueBuf;
				}
			}
		}

		return value;
	}

	static	max(_data)
	{
		let	value = 0;
		let	set = false;
		for(let i=0; i<_data["list"].length; i++)
		{
			// get the value
			let	valueBuf = ObjUtils.GetValueToNumber(_data["list"][i], _data["key"], -999999);

			// value is correct?
			if (valueBuf != -999999)
			{
				if ( (set == false) || (valueBuf > value) )
				{
					set = true;
					value = valueBuf;
				}
			}
		}

		return value;
	}

	static	findFirst(_data)
	{
		return ObjUtils.FindFirst(_data["list"], _data["cond_field"], _data["cond_value"], _data["cond_comp"], _data["default"]);
	}

	static	filterList(_data)
	{
		return ObjUtils.FilterList(_data["list"], _data["cond_field"], _data["cond_value"], _data["cond_comp"]);
	}

	static	first(_data)
	{
		for(let i=0; i<_data["list"].length; i++)
		{
			// get the value
			let	valueBuf = ObjUtils.GetValue(_data["list"][i], _data["key"], null);
			if (valueBuf != null)
			{
				// if a number, check if different than -1
				if (CoreUtils.IsNumber(valueBuf) == true)
				{
					if (valueBuf != -1)
						return valueBuf;
				}
				// if a string, check if not empty
				else if (CoreUtils.IsString(valueBuf) == true)
				{
					if (StringUtils.IsEmpty(valueBuf) == false)
						return valueBuf;
				}
				else
				{
					return valueBuf;
				}
			}
		}

		return "";
	}

	static	last(_data)
	{
		for(let i=_data["list"].length-1; i>=0; i--)
		{
			// get the value
			let	valueBuf = ObjUtils.GetValue(_data["list"][i], _data["key"], null);
			if (valueBuf != null)
			{
				// if a number, check if different than -1
				if (CoreUtils.IsNumber(valueBuf) == true)
				{
					if (valueBuf != -1)
						return valueBuf;
				}
				// if a string, check if not empty
				else if (CoreUtils.IsString(valueBuf) == true)
				{
					if (StringUtils.IsEmpty(valueBuf) == false)
						return valueBuf;
				}
				else
				{
					return valueBuf;
				}
			}
		}

		return "";
	}	

	static	highestKey(_data)
	{
		return ObjUtils.HighestKey(_data["obj"]);
	}

	static	lowestKey(_data)
	{
		return ObjUtils.LowestKey(_data["obj"]);
	}	

	static	avgObjValues(_data)
	{
		return ObjUtils.AvgValues(_data["obj"]);
	}
	
	static	countKeys(_data)
	{
		return ObjUtils.CountKeys(_data["obj"]);
	}

	static	toSortedList(_data)
	{
		return ObjUtils.ConvertToFieldValueListAndSort(_data["obj"], _data["sort_order"]);
	}

	static	subList(_data)
	{
		let	indexStart = _data["start"];
		let	count = _data["count"];
		if (count <= 0)
			count = _data["list"].length - indexStart;
		
		let	newList = [];
		for(let i=indexStart; i<indexStart+count; i++)
		{
			if (i < _data["list"].length)
				newList.push(_data["list"][i]);
			else
				break;
		}

		return newList;
	}

	static	firstNotEmpty(_data)
	{
		for(let i=1; i<=5; i++)
		{
			// get the value
			let	value = _data["p" + i].toString();

			// is it not empty?
			if (StringUtils.IsEmpty(value) == false)
				return value;
		}

		// nothing found!
		return "";
	}

	static	screenshotWith(_data)
	{
		return JsonProcessorMethods.BuildPostProcessingAction("screenshot_with", [
			_data["field"],
			_data["value"],
			_data["default"],
		]);
	}

	static	userPicture(_data)
	{
		return JsonProcessorMethods.BuildPostProcessingAction("user_picture", [
			_data["type"],
			_data["default"],
		]);
	}

	static	userInfo(_data)
	{
		return JsonProcessorMethods.BuildPostProcessingAction("user_info", [
			_data["field"],
			_data["default"],
		]);
	}

	static	simplifyObj(_data)
	{
		// deserialize the fields to an object
		let	fields = StringUtils.DeserializeToObject(_data["fields"]);

		// transform the object
		return ObjUtils.CopyAndRenameFieldsOnly(_data["obj"], fields);
	}

	static	simplifyList(_data)
	{
		// deserialize the fields to an object
		let	fields = StringUtils.DeserializeToObject(_data["fields"]);

		// transform the simplified list
		return ObjUtils.SimplifyList(_data["list"], fields);
	}

	static	split(_data)
	{
		return StringUtils.Split(_data["str"], _data["delimiter"], _data["cast"], _data["skipempty"]);
	}

	static	sumValues(_data)
	{
		let	total = 0;

		for(let i=0; i<_data["list"].length; i++)
		{
			if (CoreUtils.IsNumber(_data["list"][i]) == true)
				total += _data["list"][i];
		}

		return total;
	}

	static	avgValues(_data)
	{
		if (_data["list"].length == 0)
			return 0;

		let	total = JsonProcessorMethods.sumValues(_data);
		return total / _data["list"].length;
	}

	static	minValues(_data)
	{
		let	min = 0;
		let	minSet = false;

		for(let i=0; i<_data["list"].length; i++)
		{
			if (CoreUtils.IsNumber(_data["list"][i]) == true)
			{
				if ( (minSet == false) || (_data["list"][i] < min) )
				{
					min = _data["list"][i];
					minSet = true;
				}
			}
		}

		return min;
	}

	static	maxValues(_data)
	{
		let	max = 0;
		let	maxSet = false;

		for(let i=0; i<_data["list"].length; i++)
		{
			if (CoreUtils.IsNumber(_data["list"][i]) == true)
			{
				if ( (maxSet == false) || (_data["list"][i] > max) )
				{
					max = _data["list"][i];
					maxSet = true;
				}
			}
		}

		return max;
	}

	static	processObj(_data)
	{
		// make a copy of the object
		let	objCopy = CoreUtils.Copy(_data["obj"]);

		// get the value
		let	value = ObjUtils.GetValue(objCopy, _data["field"], "");

		// process the method
		let	newValue = JsonProcessorMethods.ProcessValue(value, _data);

		// set it
		return ObjUtils.SetValue(objCopy, _data["field"], newValue);
	}

	static	processList(_data)
	{
		// process each object in the list
		let	newList = [];
		for(let i=0; i<_data["list"].length; i++)
		{
			// prepare the parameters
			_data["obj"] = _data["list"][i];

			// process it
			newList.push(JsonProcessorMethods.processObj(_data));
		}

		return newList;
	}

	static	processListValues(_data)
	{
		// process each object in the list
		let	newList = [];
		for(let i=0; i<_data["list"].length; i++)
		{
			// process it
			newList.push(JsonProcessorMethods.ProcessValue(_data["list"][i], _data));
		}

		return newList;
	}

	static	fillList(_data)
	{
		return ArrayUtils.Fill(_data["count"], _data["start"], _data["step"]);
	}

	static	listToStr(_data)
	{
		return ArrayUtils.ConvertElementsToString(_data["list"]);
	}

	static	invertListValues(_data)
	{
		return ArrayUtils.InvertValues(_data["list"], _data["max"]);
	}

	static	fillListColors(_data)
	{
		return ArrayUtils.FillWithColor(_data["count"], _data["color"]);
	}

	static	reverseList(_data)
	{
		return ArrayUtils.Reverse(_data["list"]);
	}

	static	extractFromList(_data)
	{
		return ObjUtils.ExtractFromList(_data["list"], _data["field"], _data["add_if_empty"]);
	}

	static	extractFromListMulti(_data)
	{
		// extract the list of fields to extract
		let	fieldsToKeep = [];
		if (StringUtils.IsEmpty(_data["fields"]) == false)
			fieldsToKeep = _data["fields"].split("|");

		return ObjUtils.ExtractFromListMulti(_data["list"], fieldsToKeep, _data["default"]);
	}

	static	extractFromListCalc(_data)
	{
		return ObjUtils.ExtractFromListWithCalculation(_data["list"], _data["field1"], _data["field2"], _data["calc"]);
	}

	static	createObject(_data)
	{
		return {};
	}

	static	createList(_data)
	{
		return [];
	}

	static	set(_data)
	{
		// set the value to the object
		return ObjUtils.SetValue(_data["obj"], _data["path"], _data["value"]);
	}

	static	push(_data)
	{
		// push to the list
		_data["list"].push(_data["value"]);

		return _data["list"];
	}

	static	buildScale(_data)
	{
		return MathUtils.BuildScale(_data["list"], _data["ticks"], _data["multiple"]);
	}

	static	buildScaleDomain(_data)
	{
		return MathUtils.BuildScaleDomain(_data["list"], _data["multiple"]);
	}	

	static	formatListToK(_data)
	{
		return MathUtils.FormatToKList(_data["list"], _data["abs"]);
	}

	static	formatToK(_data)
	{
		return MathUtils.FormatToK(_data["value"], _data["abs"]);
	}

	static	normalize(_data)
	{
		return MathUtils.Normalize(_data["value"], _data["value0"], _data["value1"]);
	}

	static	initMatchesWin(_data)
	{
		let	newList = [];
		for(let item of _data["list"])
		{
			// get the is victory value
			let	isVictory = ObjUtils.GetValueToInt(item, _data["field_is_victory"]);

			// convert it to 0 or 1
			let	isWin = 0;
			if ( (isVictory >= 1) && (isVictory <= _data["rank_to_win"]) )
				isWin = 1;

			// set it
			item[_data["field_win"]] = isWin;

			// process it
			newList.push(item);
		}
		return newList;
	}

	static	hours(_data)
	{
		return DateUtils.Hours(_data["date"]);
	}

	static	minMax(_data)
	{
		return MathUtils.MinMaxList(_data["list"], _data["margin"]);
	}

	static	transformSetToObjectList(_data)
	{
		let	newList = [];
		for(let value of _data["list"])
		{
			let	newItem = {};
			newItem[_data["key"]] = value;
			newList.push(newItem);
		}
		return newList;
	}




	static	ProcessValue(_value, _data)
	{
		// prepare the parameters to call the function
		let	newParameters = [];
		for(let i=1; i<=6; i++)
		{
			let	pBuf = _data["p" + i];

			// is it a string?
			if (CoreUtils.IsString(pBuf) == true)
			{
				if (pBuf == "~~value~~")
				{
					pBuf = _value;
				}
				else if (pBuf.startsWith("~~value~~.") == true)
				{
					// get the key
					let	keyBuf = pBuf.replace("~~value~~.", "");
					pBuf = ObjUtils.GetValue(_value, keyBuf, "");
				}
			}

			// add that value
			newParameters.push(pBuf);
		}

		// process the method
		return JsonProcessorMethods.ExeFromName(_data["method"], newParameters);
	}


	static	BuildPostProcessingAction(_action, _params)
	{
		// the build processing action is processed on the fly when we get the stats + user + media files
		return "~~" + _action + "~~" + _params.join("~~") + "~~";
	}


}


module.exports = {
	JsonProcessorMethods
};

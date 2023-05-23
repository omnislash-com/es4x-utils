/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { ObjUtils } from '../src/utils/ObjUtils';
import { JsonBuilder } from '../src/jsonprocessor/JsonBuilder';

const suite = TestSuite.create("ES4X Test: JsonBuilder");


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



suite.run();

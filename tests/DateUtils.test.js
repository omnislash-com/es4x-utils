/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { DateUtils } from '../src/utils/DateUtils';

const suite = TestSuite.create("ES4X Test: DateUtils");

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


	let	testToOutput = [
		"2023-08-01",
		"2023-12-31",
		"2024-01-01",
		"2024-07-31",
	];
	for(let date of testToOutput)
	{
		console.log("TEST: " + date + " => " + DateUtils.UTCStringToLocalDayNumber(date));
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
		let	result = DateUtils.GetTimezoneOffset(test.timezone);
		context.assertEquals(test.offset, result);
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




suite.run();

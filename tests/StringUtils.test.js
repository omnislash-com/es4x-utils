/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { ObjUtils } from '../src/utils/ObjUtils';
import { StringUtils } from '../src/utils/StringUtils';

const suite = TestSuite.create("ES4X Test: StringUtils");


suite.test("StringUtils.ReplaceAll", function (context) {

	let	text = "test'1";
	let	expectedResult = "test''1";
	let	result = StringUtils.ReplaceAll(text, "'", "''");

	context.assertEquals(expectedResult, result);
});

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

suite.test("StringUtils.EnsureSize", async function (context) {

	let	tests = [
		{
			str: undefined,
			length: 10,
			result: ""
		},
		{
			str: null,
			length: 10,
			result: ""
		},
		{
			str: "",
			length: 10,
			result: ""
		},
		{
			str: "abcde",
			length: 10,
			result: "abcde"
		},
		{
			str: "abcdeabcde",
			length: 10,
			result: "abcdeabcde"
		},
		{
			str: "abcdeabcdefffffffffffffff",
			length: 10,
			result: "abcdeabcde"
		},
	];
	
	for(let i=0; i<tests.length; i++)
	{
		// convert it
		let	value = StringUtils.EnsureSize(tests[i].str, tests[i].length);

		if (value != tests[i].result)
		{
			console.error("Error: StringUtils.EnsureSize(" + i + ")");
		}
		context.assertEquals(value, tests[i].result);

	}
});

suite.test("StringUtils.FormatPhone", async function (context) {

	let	tests = [
		// Basic US/Canada 10-digit numbers
		{
			phone: "5551234567",
			extension: "",
			result: "+15551234567"
		},
		{
			phone: "555-123-4567",
			extension: "",
			result: "+15551234567"
		},
		{
			phone: "(555) 123-4567",
			extension: "",
			result: "+15551234567"
		},
		{
			phone: "555.123.4567",
			extension: "",
			result: "+15551234567"
		},
		{
			phone: "555 123 4567",
			extension: "",
			result: "+15551234567"
		},

		// US/Canada with country code
		{
			phone: "15551234567",
			extension: "",
			result: "+15551234567"
		},
		{
			phone: "1-555-123-4567",
			extension: "",
			result: "+15551234567"
		},
		{
			phone: "+1 (555) 123-4567",
			extension: "",
			result: "+15551234567"
		},
		{
			phone: "1.555.123.4567",
			extension: "",
			result: "+15551234567"
		},

		// Numbers with letters (phone keypad conversion)
		{
			phone: "1-800-FLOWERS",
			extension: "",
			result: "+18003569377"
		},
		{
			phone: "+1 (555) 123-CALL",
			extension: "",
			result: "+15551232255"
		},
		{
			phone: "1-800-GOT-JUNK",
			extension: "",
			result: "+18004685865"
		},

		// International format with 00 prefix
		{
			phone: "001-555-123-4567",
			extension: "",
			result: "+15551234567"
		},
		{
			phone: "00447700900123",
			extension: "",
			result: "+447700900123"
		},
		{
			phone: "0033123456789",
			extension: "",
			result: "+33123456789"
		},

		// UK numbers
		{
			phone: "+44 20 1234 5678",
			extension: "",
			result: "+442012345678"
		},
		{
			phone: "447700900123",
			extension: "",
			result: "+447700900123"
		},
		{
			phone: "+44-7700-900123",
			extension: "",
			result: "+447700900123"
		},

		// France numbers
		{
			phone: "+33 1 23 45 67 89",
			extension: "",
			result: "+33123456789"
		},
		{
			phone: "33612345678",
			extension: "",
			result: "+33612345678"
		},

		// Germany numbers
		{
			phone: "+49 30 12345678",
			extension: "",
			result: "+493012345678"
		},
		{
			phone: "+49-176-12345678",
			extension: "",
			result: "+4917612345678"
		},

		// Brazil numbers (11 digits)
		{
			phone: "+55 11 98765 4321",
			extension: "",
			result: "+5511987654321"
		},
		{
			phone: "5511987654321",
			extension: "",
			result: "+5511987654321"
		},

		// China numbers (11 digits)
		{
			phone: "+86 138 1234 5678",
			extension: "",
			result: "+8613812345678"
		},
		{
			phone: "8613812345678",
			extension: "",
			result: "+8613812345678"
		},

		// India numbers
		{
			phone: "+91-98765-43210",
			extension: "",
			result: "+919876543210"
		},
		{
			phone: "+91 98765 43210",
			extension: "",
			result: "+919876543210"
		},

		// Numbers with explicit country code parameter
		{
			phone: "5551234567",
			extension: "44",
			result: "+445551234567"
		},
		{
			phone: "7700900123",
			extension: "44",
			result: "+447700900123"
		},
		{
			phone: "123456789",
			extension: "33",
			result: "+33123456789"
		},
		{
			phone: "9876543210",
			extension: "91",
			result: "+919876543210"
		},

		// Edge cases - empty and invalid inputs
		{
			phone: "",
			extension: "1",
			result: ""
		},
		{
			phone: "   ",
			extension: "1",
			result: ""
		},
		{
			phone: "not-a-phone",
			extension: "1",
			result: ""
		},

		// Short numbers
		{
			phone: "123",
			extension: "",
			result: "+1123"
		},
		{
			phone: "12345",
			extension: "44",
			result: "+4412345"
		},
		{
			phone: "911",
			extension: "1",
			result: "+1911"
		},

		// E.164 length validation (max 15 digits)
		{
			phone: "12345678901234",  // 14 digits - will be treated as 1 + 13 digits
			extension: "",
			result: "+12345678901234"  // Country code 1 + 13 digits
		},
		{
			phone: "123456789012345",  // 15 digits exactly - valid E.164 length
			extension: "",
			result: "+123456789012345"  // Keeps all 15 digits as valid E.164
		},
		{
			phone: "+1234567890123456",  // 16 digits with +, should truncate
			extension: "",
			result: "+123456789012345"  // Max 15 digits total
		},
		{
			phone: "+999123456789012",  // 3-digit country code + 12 digits = 15 total
			extension: "",
			result: "+999123456789012"
		},

		// Phone with extension text (should be removed)
		{
			phone: "+1-555-123-4567 ext. 999",
			extension: "",
			result: "+15551234567"  // Extension is removed for E.164 format
		},
		{
			phone: "555-123-4567 x123",
			extension: "",
			result: "+15551234567"  // Extension is removed for E.164 format
		},

		// Mixed formatting
		{
			phone: "+44 (0) 20 1234 5678",
			extension: "",
			result: "+4402012345678"  // UK number with trunk code
		},
		{
			phone: "📞 +33 6 12 34 56 78",
			extension: "",
			result: "+33612345678"
		},

		// Country code priority testing
		{
			phone: "+44 555 123 4567",  // Has country code 44
			extension: "1",               // But extension 1 is provided
			result: "+445551234567"       // Should use phone's country code
		},
		{
			phone: "5551234567",          // No country code
			extension: "44",              // Extension provided
			result: "+445551234567"       // Should use extension
		},

		// Three-digit country codes
		{
			phone: "+351 912 345 678",
			extension: "",
			result: "+351912345678"
		},
		{
			phone: "+358 40 1234567",
			extension: "",
			result: "+358401234567"
		},
		{
			phone: "+353 87 123 4567",
			extension: "",
			result: "+353871234567"
		}
	];

	for(let i=0; i<tests.length; i++)
	{
		// convert it
		let	value = StringUtils.FormatPhone(tests[i].phone, tests[i].extension);

		if (value != tests[i].result)
		{
			console.error(`Error: StringUtils.FormatPhone(${i}): input="${tests[i].phone}", extension="${tests[i].extension}", expected="${tests[i].result}", got="${value}"`);
		}
		context.assertEquals(value, tests[i].result);

	}
});

suite.test("StringUtils.ExtractPhone", async function (context) {
	let	tests = [
		// Empty and edge cases
		{
			input: "",
			defaultExtension: "1",
			result: {"phone": "", "extension": ""}
		},
		{
			input: "   ",
			defaultExtension: "1",
			result: {"phone": "", "extension": ""}
		},
		{
			input: "not-a-phone",
			defaultExtension: "1",
			result: {"phone": "", "extension": ""}
		},

		// US/Canada numbers (10 digits)
		{
			input: "5551234567",
			defaultExtension: "1",
			result: {"phone": "5551234567", "extension": "1"}
		},
		{
			input: "(555) 123-4567",
			defaultExtension: "1",
			result: {"phone": "5551234567", "extension": "1"}
		},
		{
			input: "555-123-4567",
			defaultExtension: "",
			result: {"phone": "5551234567", "extension": ""}
		},
		{
			input: "555.123.4567",
			defaultExtension: "1",
			result: {"phone": "5551234567", "extension": "1"}
		},
		{
			input: "555 123 4567",
			defaultExtension: "1",
			result: {"phone": "5551234567", "extension": "1"}
		},

		// US/Canada with country code
		{
			input: "+1-555-123-4567",
			defaultExtension: "",
			result: {"phone": "5551234567", "extension": "1"}
		},
		{
			input: "1-555-123-4567",
			defaultExtension: "",
			result: {"phone": "5551234567", "extension": "1"}
		},
		{
			input: "+1 (555) 123-4567",
			defaultExtension: "",
			result: {"phone": "5551234567", "extension": "1"}
		},
		{
			input: "15551234567",
			defaultExtension: "",
			result: {"phone": "5551234567", "extension": "1"}
		},

		// International format with 00 prefix
		{
			input: "001-555-123-4567",
			defaultExtension: "",
			result: {"phone": "5551234567", "extension": "1"}
		},
		{
			input: "00447700900123",
			defaultExtension: "",
			result: {"phone": "7700900123", "extension": "44"}
		},
		{
			input: "0033123456789",
			defaultExtension: "",
			result: {"phone": "123456789", "extension": "33"}
		},

		// UK numbers
		{
			input: "+44 20 1234 5678",
			defaultExtension: "",
			result: {"phone": "2012345678", "extension": "44"}
		},
		{
			input: "+44-7700-900123",
			defaultExtension: "",
			result: {"phone": "7700900123", "extension": "44"}
		},
		{
			input: "447700900123",
			defaultExtension: "",
			result: {"phone": "7700900123", "extension": "44"}
		},

		// France numbers
		{
			input: "+33 1 23 45 67 89",
			defaultExtension: "",
			result: {"phone": "123456789", "extension": "33"}
		},
		{
			input: "+33-6-12-34-56-78",
			defaultExtension: "",
			result: {"phone": "612345678", "extension": "33"}
		},
		{
			input: "33612345678",
			defaultExtension: "",
			result: {"phone": "612345678", "extension": "33"}
		},

		// Germany numbers
		{
			input: "+49 30 12345678",
			defaultExtension: "",
			result: {"phone": "3012345678", "extension": "49"}
		},
		{
			input: "+49-176-12345678",
			defaultExtension: "",
			result: {"phone": "17612345678", "extension": "49"}
		},

		// Brazil numbers (11 digits)
		{
			input: "+55 11 98765 4321",
			defaultExtension: "",
			result: {"phone": "11987654321", "extension": "55"}
		},
		{
			input: "5511987654321",
			defaultExtension: "",
			result: {"phone": "11987654321", "extension": "55"}
		},

		// China numbers (11 digits)
		{
			input: "+86 138 1234 5678",
			defaultExtension: "",
			result: {"phone": "13812345678", "extension": "86"}
		},
		{
			input: "8613812345678",
			defaultExtension: "",
			result: {"phone": "13812345678", "extension": "86"}
		},

		// India numbers
		{
			input: "+91-98765-43210",
			defaultExtension: "",
			result: {"phone": "9876543210", "extension": "91"}
		},
		{
			input: "+91 98765 43210",
			defaultExtension: "",
			result: {"phone": "9876543210", "extension": "91"}
		},

		// UAE numbers
		{
			input: "+971 50 779 2746",
			defaultExtension: "",
			result: {"phone": "507792746", "extension": "971"}
		},
		{
			input: "+971507792746",
			defaultExtension: "",
			result: {"phone": "507792746", "extension": "971"}
		},

		// Three-digit country codes
		{
			input: "+351 912 345 678",
			defaultExtension: "",
			result: {"phone": "912345678", "extension": "351"}
		},
		{
			input: "+358 40 1234567",
			defaultExtension: "",
			result: {"phone": "401234567", "extension": "358"}
		},
		{
			input: "+353 87 123 4567",
			defaultExtension: "",
			result: {"phone": "871234567", "extension": "353"}
		},

		// Short numbers (less than 10 digits)
		{
			input: "123",
			defaultExtension: "1",
			result: {"phone": "123", "extension": "1"}
		},
		{
			input: "12345",
			defaultExtension: "44",
			result: {"phone": "12345", "extension": "44"}
		},

		// Numbers without country code but longer than 10 digits
		{
			input: "12345678901",
			defaultExtension: "",
			result: {"phone": "2345678901", "extension": "1"}
		},
		{
			input: "441234567890",
			defaultExtension: "",
			result: {"phone": "1234567890", "extension": "44"}
		},

		// Unrecognized country codes with + prefix
		{
			input: "+999 123 456 789",
			defaultExtension: "",
			result: {"phone": "123456789", "extension": "999"}
		},
		{
			input: "+8 123 456 789",
			defaultExtension: "",
			result: {"phone": "23456789", "extension": "81"}  // 81 is Japan's code, algorithm finds it
		},

		// Mixed formatting
		{
			input: "+1 (555) 123-CALL",
			defaultExtension: "",
			result: {"phone": "5551232255", "extension": "1"}
		},
		{
			input: "+44 (0) 20 1234 5678",
			defaultExtension: "",
			result: {"phone": "02012345678", "extension": "44"}
		},

		// Special characters
		{
			input: "+1-555-123-4567 ext. 999",
			defaultExtension: "",
			result: {"phone": "5551234567", "extension": "1"}  // PBX extensions are removed
		},
		{
			input: "📞 +33 6 12 34 56 78",
			defaultExtension: "",
			result: {"phone": "612345678", "extension": "33"}
		},

		// Default extension behavior
		{
			input: "5551234567",
			defaultExtension: "",
			result: {"phone": "5551234567", "extension": ""}
		},
		{
			input: "5551234567",
			defaultExtension: null,
			result: {"phone": "5551234567", "extension": ""}
		},
		{
			input: "5551234567",
			defaultExtension: undefined,
			result: {"phone": "5551234567", "extension": ""}
		}
	];

	for(let i=0; i<tests.length; i++)
	{
		// convert it
		let	value = StringUtils.ExtractPhone(tests[i].input, tests[i].defaultExtension);

		if (value.phone != tests[i].result.phone || value.extension != tests[i].result.extension)
		{
			console.error(`Error: StringUtils.ExtractPhone(${i}): input="${tests[i].input}", defaultExtension="${tests[i].defaultExtension}", expected={phone:"${tests[i].result.phone}",extension:"${tests[i].result.extension}"}, got={phone:"${value.phone}",extension:"${value.extension}"}`);
		}
		context.assertEquals(value.phone, tests[i].result.phone);
		context.assertEquals(value.extension, tests[i].result.extension);

	}
});

suite.run();

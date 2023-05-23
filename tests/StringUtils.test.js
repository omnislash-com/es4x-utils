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

suite.run();

/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { ObjUtils } from '../src/utils/ObjUtils';
import { UrlUtils } from '../src/utils/UrlUtils';

const suite = TestSuite.create("ES4X Test: UrlUtils");

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


suite.test("UrlUtils.AppendQueryParametersToUrl", function (context) {

	let	tests = [
		{
			"url": "https://www.google.com",
			"parameters": {

			},
			"result" : "https://www.google.com"
		},
		{
			"url": "https://www.google.com",
			"parameters": {
				"p1": "test"
			},
			"result" : "https://www.google.com?p1=test"
		},
		{
			"url": "https://www.google.com",
			"parameters": {
				"p1": "test",
				"p2": 120
			},
			"result" : "https://www.google.com?p1=test&p2=120"
		},
	];

	for(let i=0; i<tests.length; i++)
	{
		// get the info
		let	result = UrlUtils.AppendQueryParametersToUrl(tests[i].url, tests[i].parameters);

		if (result != tests[i].result)
			console.error("Error at test " + i + ": " + result + " VS " + tests[i].result);
		context.assertEquals(result, tests[i].result);
	}

});



suite.run();

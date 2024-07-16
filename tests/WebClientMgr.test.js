/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { ObjUtils } from '../src/utils/ObjUtils';
import { WebClientMgr } from '../src/network/WebClientMgr';
import { QueryUtils } from '../src/network/QueryUtils';
import { StringUtils } from '../src/utils/StringUtils';

const suite = TestSuite.create("ES4X Test: WebClientMgr");

suite.test("WebClientMgr.postForm", async function (context) {

	let async = context.async();

	let	webClient = new WebClientMgr(vertx);

	// GET
	let	host = "test.salesforce.com";
	let path = "/services/oauth2/token";
	let	method = QueryUtils.HTTP_METHOD_POST;
	let	data = {
		grant_type: "password",
		client_id: "3MVG9fdJGowvdgN3LGHs9IIC7ejLelwAb9PiP6r7BPdyz91W6oCHHoWq5GAGX22Oal6av3Rv.Xa1yNWuaCTdb",
		client_secret: "843EF781DF41396EA7DF6A441C118CB1D2189BD34A804B5FD9CA56B7756A2393",
		username: "michael@omnislash.com.chapdemo",
		password: "SaleCneirM!Omn30831BmrpzNhCx7r7fKab36glKC"
	};

	let	response = await webClient.query(method, host, path, data, {}, true, false, 443, true, true);

	context.assertEquals(ObjUtils.GetValueToInt(response, "statusCode"), 200);
	async.complete();
});

suite.test("WebClientMgr.query", async function (context) {

	let async = context.async();

	let	webClient = new WebClientMgr(vertx);

	// GET
	let	host = "music.youtube.com";
	let path = "/watch?v=fn-4RbxXThE";
	let	method = QueryUtils.HTTP_METHOD_GET;

	let	response = await webClient.query(method, host, path);

	context.assertEquals(ObjUtils.GetValueToInt(response, "statusCode"), 200);
	async.complete();
});

suite.test("WebClientMgr.retrieveRedirectUrl", async function (context) {

	let async = context.async();

	let	webClient = new WebClientMgr(vertx);

	// Get redirection url
	let	url = "https://u298828.ct.sendgrid.net/ss/c/KeecV0-eUYdPWIcLaNcQIk8KHRb5oSkirDE8JL2zHb43giRdffV4A9P-M2zuA5z8yn9k718SwxXLtsouqB_R0O55ERXeLn0ds7a6ThnkVIhw5R4CdUnuKmbjjJGs4N_u-Y_q1d42X8m2X86YFqjRx5OTiDvKvQFMwBiX2vZIv0u-Od-we0xwDqTb8WFSQKv8_teiWcZNOJc2xnTVUxruXT65tspY-nE9awn_Xy8Cn_0Ktog5q4E678T6EuVuCv9DdzenxCoY0ncsx9HAUMZohZ8pG_k8CD7GoAPKxTsIsbPCHASomRcDviuhluGqohU66nmkRso0YaI7U-3i-URrFxjAdSE8hP8QyEJxZBnmNy18yzudN8aQDmsXdWRP3jXcRP_94jay3-M9Yko4WyC9Zow8gsNXxmVFmKQFEhsbVAclawEq3XiPhp6v9PPIQGoyd85lRByH4LKafqZmWq685nYiIKF-z8QNi67tsbW6lBE/3yr/-hXtnp6vQYijkOPr38OyDw/h9/Itd-_deiQpGDPuuGSBzlAPwq7Xw9FByxaFEMHxlBW7E";

	let	redirectUrl = await webClient.retrieveRedirectUrl(url);
	console.log("Redirect URL = ");
	console.log(redirectUrl);

	context.assertFalse(StringUtils.IsEmpty(redirectUrl));
	async.complete();
});


suite.run();

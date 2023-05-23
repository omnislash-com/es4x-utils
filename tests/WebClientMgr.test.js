/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { ObjUtils } from '../src/utils/ObjUtils';
import { WebClientMgr } from '../src/network/WebClientMgr';
import { QueryUtils } from '../src/network/QueryUtils';

const suite = TestSuite.create("ES4X Test: WebClientMgr");


suite.test("appContext.postFormFromHostToJson", async function (context) {

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


suite.run();

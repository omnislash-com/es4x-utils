/// <reference types="@vertx/core" />
// @ts-check
import { TestSuite } from '@vertx/unit';
import { MathUtils } from '../src/utils/MathUtils';

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

const suite = TestSuite.create("ES4X Test: MathUtils");

suite.test("MathUtils.Min", function (context) {

	context.assertEquals(MathUtils.Min(1, 1), 1);	
	context.assertEquals(MathUtils.Min(1, 0), 0);	
	context.assertEquals(MathUtils.Min(0, 1), 0);	
	context.assertEquals(MathUtils.Min(0, -111), -111);	
	context.assertEquals(MathUtils.Min(1000, -111), -111);	
	context.assertEquals(MathUtils.Min(1000, 2000), 1000);

});	

suite.test("MathUtils.Max", function (context) {

	context.assertEquals(MathUtils.Max(1, 1), 1);	
	context.assertEquals(MathUtils.Max(1, 0), 1);	
	context.assertEquals(MathUtils.Max(0, 1), 1);	
	context.assertEquals(MathUtils.Max(0, -111), 0);	
	context.assertEquals(MathUtils.Max(1000, -111), 1000);	
	context.assertEquals(MathUtils.Max(1000, 2000), 2000);
		
});	

suite.test("MathUtils.MinList", function (context) {

	context.assertEquals(MathUtils.MinList(), 0);	
	context.assertEquals(MathUtils.MinList([]), 0);	
	context.assertEquals(MathUtils.MinList([1, 1]), 1);	
	context.assertEquals(MathUtils.MinList([1, 1, 0, -1]), -1);	
	context.assertEquals(MathUtils.MinList([-6, 1, 0, -1]), -6);	
	context.assertEquals(MathUtils.MinList([-6, 1, 0, 1000, -6, -9]), -9);	
		
});	

suite.test("MathUtils.MaxList", function (context) {

	context.assertEquals(MathUtils.MaxList(), 0);	
	context.assertEquals(MathUtils.MaxList([]), 0);	
	context.assertEquals(MathUtils.MaxList([1, 1]), 1);	
	context.assertEquals(MathUtils.MaxList([1, 1, 0, -1]), 1);	
	context.assertEquals(MathUtils.MaxList([0, 0, 0, -1]), 0);	
	context.assertEquals(MathUtils.MaxList([-6, 1, 0, -1]), 1);	
	context.assertEquals(MathUtils.MaxList([-6, 1, 0, 1000, -6, -9]), 1000);	
	context.assertEquals(MathUtils.MaxList([-6, 1, 0, 1000, -6, -9, 1001]), 1001);	
		
});	

suite.test("MathUtils.MinMaxList", function (context) {

	assertListEquals(context, MathUtils.MinMaxList(), [0, 0]);	
	assertListEquals(context, MathUtils.MinMaxList([]), [0, 0]);	
	assertListEquals(context, MathUtils.MinMaxList([1, 1]), [1, 1]);	
	assertListEquals(context, MathUtils.MinMaxList([1, 1, 0, 2]), [0, 2]);	
	assertListEquals(context, MathUtils.MinMaxList([1, 1, 0, 2], 1), [0, 2]);	
	assertListEquals(context, MathUtils.MinMaxList([2, 2, 2, 2], 1), [1, 3]);	
});	

suite.test("MathUtils.Abs", function (context) {

	context.assertEquals(MathUtils.Abs(1), 1);	
	context.assertEquals(MathUtils.Abs(0), 0);	
	context.assertEquals(MathUtils.Abs(-10), 10);	
		
});	

suite.test("MathUtils.RoundUp", function (context) {

	context.assertEquals(MathUtils.RoundUp(10, 1), 10);	
	context.assertEquals(MathUtils.RoundUp(11, 10), 20);	
	context.assertEquals(MathUtils.RoundUp(11, 100), 100);	
	context.assertEquals(MathUtils.RoundUp(11, 1000), 1000);	
	context.assertEquals(MathUtils.RoundUp(111, 10), 120);	
	context.assertEquals(MathUtils.RoundUp(1000, 10), 1000);	
	context.assertEquals(MathUtils.RoundUp(2084, 10), 2090);	
	context.assertEquals(MathUtils.RoundUp(2084, 100), 2100);	
	context.assertEquals(MathUtils.RoundUp(2084, 1000), 3000);	
	context.assertEquals(MathUtils.RoundUp(2094, 10), 2100);	
	context.assertEquals(MathUtils.RoundUp(4456, 1000), 5000);	
		
});	

suite.test("MathUtils.FormatToK", function (context) {

	context.assertEquals(MathUtils.FormatToK(0), "0");	
	context.assertEquals(MathUtils.FormatToK(10), "1K");	
	context.assertEquals(MathUtils.FormatToK(199), "1K");	
	context.assertEquals(MathUtils.FormatToK(999), "1K");	
	context.assertEquals(MathUtils.FormatToK(1000), "1K");	
	context.assertEquals(MathUtils.FormatToK(2084), "3K");	
	context.assertEquals(MathUtils.FormatToK(2999), "3K");	
	context.assertEquals(MathUtils.FormatToK(3000), "3K");	
	context.assertEquals(MathUtils.FormatToK(-2999), "-3K");	
	context.assertEquals(MathUtils.FormatToK(-3000), "-3K");	
	context.assertEquals(MathUtils.FormatToK(-3000, true), "3K");	

});	

suite.test("MathUtils.FormatToKList", function (context) {

	assertListEquals(context, MathUtils.FormatToKList(), []);	
	assertListEquals(context, MathUtils.FormatToKList([]), []);	
	assertListEquals(context, MathUtils.FormatToKList([0]), ["0"]);	
	assertListEquals(context, MathUtils.FormatToKList([-15000, 0, 15000]), ["-15K", "0", "15K"]);	
	assertListEquals(context, MathUtils.FormatToKList([-15000, 0, 15000], true), ["15K", "0", "15K"]);	
	assertListEquals(context, MathUtils.FormatToKList([-15000, 0, 14900, 1020, 15000], true), ["15K", "0", "15K", "2K", "15K"]);	

});	

suite.test("MathUtils.FindScale", function (context) {

	context.assertEquals(MathUtils.FindScale(), 0);
	context.assertEquals(MathUtils.FindScale([]), 0);
	context.assertEquals(MathUtils.FindScale([0]), 0);
	context.assertEquals(MathUtils.FindScale([0, 10, 25, -10, -26]), 26);
	context.assertEquals(MathUtils.FindScale([0, 10, 25, -10, -26], 100), 100);
	context.assertEquals(MathUtils.FindScale([0, 10, 25, -10, -26, -124, -890, -1025, 204, 256, 999], 1000), 2000);

});	

suite.test("MathUtils.BuildScale", function (context) {

	assertListEquals(context, MathUtils.BuildScale(), [0]);	
	assertListEquals(context, MathUtils.BuildScale([]), [0]);	
	assertListEquals(context, MathUtils.BuildScale([0, 10, 25, -10, -26]), [-26, 0, 26]);	
	assertListEquals(context, MathUtils.BuildScale([0, 10, 25, -10, -26], 0, 10), [-30, 0, 30]);	
	assertListEquals(context, MathUtils.BuildScale([0, 10, 25, -10, -26], 0, 100), [-100, 0, 100]);	
	assertListEquals(context, MathUtils.BuildScale([0, 10, 25, -10, -26], 1, 100), [-100, -50, 0, 50, 100]);	

});	

suite.test("MathUtils.BuildScaleDomain", function (context) {

	assertListEquals(context, MathUtils.BuildScaleDomain(), [-1, 1]);	
	assertListEquals(context, MathUtils.BuildScaleDomain([]), [-1, 1]);	
	assertListEquals(context, MathUtils.BuildScaleDomain([0, 10, 25, -10, -26]), [-26, 26]);	
	assertListEquals(context, MathUtils.BuildScaleDomain([0, 10, 25, -10, -26], 10), [-30, 30]);	
	assertListEquals(context, MathUtils.BuildScaleDomain([0, 10, 25, -10, -26], 100), [-100, 100]);	
	assertListEquals(context, MathUtils.BuildScaleDomain([0, 10, 25, -10, -26], 100), [-100, 100]);	

});	





suite.run();

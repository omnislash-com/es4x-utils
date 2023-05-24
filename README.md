
# Introduction
This library offers some basic helper classes for the [ES4X Runtime](https://github.com/reactiverse/es4x).

It contains 3 different modules:
- **utils**: basic helpers to manipulate Javascript objects, arrays, string, dates or math.
- **network**: classes to manage the incoming query, and to do queries.
- **jsonprocessor**: these classes offer methods to do operations (filtering, maths...) on JSON objects.

# Usage
## Add dependency
For now just add the Github url to your dependencies in the **package.json** file:
```
"dependencies": {
	"@vertx/core": "4.1.0",
	"@vertx/web": "4.2.5",
	"@vertx/web-client": "4.2.5",
	"es4x-utils": "git+https://github.com/omnislash-com/es4x-utils.git#main"
}
```

## Import a class to your code
Import the class you want to use directly from the package like this:
```
import { ObjUtils } from 'es4x-utils/src/utils/ObjUtils';
```

## Call the methods
This example shows the method **ObjUtils.GetValue** which is going to go through an object to get a value for you:
```
let	obj = {
	"field": 10,
	"nested": {
		"inside": "here"
	},
	"list": [
		{
			"index": 0
		},
		{
			"index": 1
		}
	]
};
console.log(ObjUtils.GetValue(obj, "field"));	// output: 10
console.log(ObjUtils.GetValue(obj, "nested.inside"));	// output: "here"
console.log(ObjUtils.GetValue(obj, "list[1].index"));	// output: 1
```

import { HttpMethod } from '@vertx/core/options';


const { ObjUtils } = require("../utils/ObjUtils");
const { StringUtils } = require("../utils/StringUtils");
const { LogUtils } = require("../utils/LogUtils");

class	QueryUtils
{
	static	get	HTTP_METHOD_GET()		{	return "get"; }
	static	get	HTTP_METHOD_POST()		{	return "post"; }
	static	get	HTTP_METHOD_PUT()		{	return "put"; }
	static	get	HTTP_METHOD_DEL()		{	return "delete"; }
	static	get	HTTP_METHOD_PATCH()		{	return "patch"; }

	static	get	PARAM_PATH()		{	return "param_path"; }
	static	get	PARAM_QUERY()		{	return "param_query"; }
	static	get	PARAM_POST()		{	return "param_post"; }

	constructor(_ctx)
	{
		this.__ctx = _ctx;
		this.__queryParams = null;
		this.__postParams = null;
	}

	getFullURI()
	{
		return this.__ctx.request().uri();
	}

	getPath()
	{
		return this.__ctx.normalizedPath();
	}

	responseJSON(_obj)
	{
		this.__ctx.response()
			.putHeader("Content-Type", "application/json; charset=utf-8")
			.end(JSON.stringify(_obj));		
	}

	responseException(_e)
	{
		// output log
		LogUtils.LogError("Uncaught exception in: " + this.getFullURI());
		if (_e)
			console.trace(_e);

		// output response error
		this.__ctx.fail(500);
	}

	responseNotFound()
	{
		LogUtils.LogError("Not found: " + this.getFullURI());

		// output response error
		this.__ctx.fail(404);
	} 

	responseFail(_code, _msg="")
	{
		LogUtils.LogError("Error " + _code + ": " + this.getFullURI(), {"error_msg": _msg});

		// output response error
		this.__ctx.fail(_code);
	}

	responseSuccessOrError(_result, _errorCode=400, _msg="Verify the data sent")
	{
		// null?
		if (_result == null)
			this.responseFail(_errorCode, _msg);
		// response
		else
			this.responseJSON(_result);		
	}

	responseFromServiceResult(_result)
	{
		// nothing?
		if (_result == null)
			this.responseException(null);
		else
		{
			// all good?
			let	statusCode = _result.statusCode();
			if ( (statusCode >= 200) && (statusCode < 300) )
			{
				// extract the json from the body
				let	jsonData = JSON.parse(_result.bodyAsString());

				this.responseJSON(jsonData);
			}
			else
			{
				LogUtils.LogError("Error forwarding (" + statusCode + "): " + this.getFullURI());

				// output response error
				this.__ctx.fail(statusCode);			
			}
		}
	}

	getPathAndQueryParams()
	{
		// build the final params
		let	finalParams = {};

		// get the path params
		let	pathParams = this.__ctx.pathParams();
		if (pathParams != null)
		{
			let	keys = pathParams.keySet().toArray();
			for(let i=0; i<keys.length; i++)
			{
				let	key = keys[i];
				finalParams[key] = pathParams.get(key);
			}
		}

		// add each query param
		let	queryParams = this.getQueryParams();
		if (queryParams != null)
		{
			let	names = queryParams.names().toArray();
			for(let i=0; i<names.length; i++)
			{
				finalParams[names[i]] = queryParams.get(names[i]);
			}
		}
		
		return finalParams;
	}

	pathParam(_key, _default="")
	{
		return QueryUtils.GetPathParam(this.__ctx, _key, _default);
	}

	postParams()
	{
		// init them?
		if (this.__postParams == null)
		{
			this.__postParams = QueryUtils.GetPostParams(this.__ctx);
		}

		return this.__postParams;
	}

	postParam(_key, _default="")
	{
		// get the post params
		let	postParams = this.postParams();

		// find the value
		return ObjUtils.GetValue(postParams, _key, _default);
	}

	getQueryParams()
	{
		if (this.__queryParams == null)
		{
			this.__queryParams = this.__ctx.queryParams();
		}
		return this.__queryParams;
	}

	queryParam(_key, _default="")
	{
		// init the query params?
		if (this.__queryParams == null)
		{
			this.__queryParams = this.__ctx.queryParams();
			if (this.__queryParams == null)
				return _default;
		}
		
		// do we have the key?
		let	value = null;
		if (this.__queryParams.contains(_key) == true)
			value = this.__queryParams.get(_key);
		
		// default value?
		if (value == null)
			value = _default;
		
		return value;
	}

	queryParamToInt(_key, _default=0)
	{
		let	valueStr = this.queryParam(_key);
		
		return parseInt(valueStr);
	}

	getMethod()
	{
		let	method = this.__ctx.currentRoute().methods();
		if (method.contains(HttpMethod.GET))
			return QueryUtils.HTTP_METHOD_GET;
		else if (method.contains(HttpMethod.POST))
			return QueryUtils.HTTP_METHOD_POST;
		else if (method.contains(HttpMethod.PUT))
			return QueryUtils.HTTP_METHOD_PUT;
		else if (method.contains(HttpMethod.DELETE))
			return QueryUtils.HTTP_METHOD_DEL;
		else if (method.contains(HttpMethod.PATCH))
			return QueryUtils.HTTP_METHOD_PATCH;
		else
		{
			LogUtils.LogError("Unknown method!");
			return QueryUtils.HTTP_METHOD_GET;
		}
	}

	static	StringToHttpMethod(_methodStr)
	{
		if (_methodStr == QueryUtils.HTTP_METHOD_POST)
			return HttpMethod.POST;
		else if (_methodStr == QueryUtils.HTTP_METHOD_DEL)
			return HttpMethod.DELETE;
		else if (_methodStr == QueryUtils.HTTP_METHOD_PUT)
			return HttpMethod.PUT;
		else if (_methodStr == QueryUtils.HTTP_METHOD_PATCH)
			return HttpMethod.PATCH;
		else
			return HttpMethod.GET;
	}

	static	create(_ctx)
	{
		return new QueryUtils(_ctx);
	}

	static	GetBearerToken(_ctx)
	{
		let	authHeaderContent = _ctx.request().getHeader("Authorization");
		let	authToken = "";
		if (StringUtils.IsEmpty(authHeaderContent) == false)
		{
			// starts with Bearer?
			if (authHeaderContent.startsWith("Bearer ") == true)
				authToken = authHeaderContent.replace("Bearer ", "");
		}
		
		return authToken;
	}

	static	GetParam(_ctx, _key, _location, _default="")
	{
		if ( (StringUtils.IsEmpty(_key) == true) || (StringUtils.IsEmpty(_location) == true) )
			return _default;

		// depending on the location
		// - PATH?
		if (_location == QueryUtils.PARAM_PATH)
		{
			return QueryUtils.GetPathParam(_ctx, _key, _default);
		}
		// - POST?
		else if (_location == QueryUtils.PARAM_POST)
		{
			// get the post params
			let	postParams = QueryUtils.GetPostParams(_ctx);

			// find the value
			return ObjUtils.GetValue(postParams, _key, _default);
		}
		// - QUERY
		else
		{
			// get the query params
			let	queryParams = _ctx.queryParams();
			if (queryParams == null)
				return _default;
		
			// do we have the key?
			let	value = null;
			if (queryParams.contains(_key) == true)
				value = queryParams.get(_key);

			if (value == null)
				return _default;
			
			return value;
		}
	}

	static	GetPathParam(_ctx, _key, _default="")
	{
		let	value = _ctx.pathParam(_key);
		if (value == null)
			value = _default;
		return value;
	}	

	static	GetPostParams(_ctx)
	{
		let	body = _ctx.getBodyAsString();
		try
		{
			return JSON.parse(body);
		}
		catch
		{
			LogUtils.LogError("Error reading body:", {"body": body});
			return {};
		}		
	}
}

module.exports = {
	QueryUtils
};

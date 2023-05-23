import { WebClientOptions } from '@vertx/web-client/options';
import { WebClient } from '@vertx/web-client';
import { Buffer } from '@vertx/core';
import { ObjUtils } from '../utils/ObjUtils';


class	WebClientMgr
{
	constructor(_vertx)
	{
		let	opt = new WebClientOptions();
		opt.setSsl(true);
		opt.setTrustAll(true);				 

		this.__webClient = WebClient.create(_vertx, opt);
	}	

	async	get(_host, _path, _headers = {}, _toJson = false, _port = 443, _ssl = true)
	{
		// save the param object
		let	query = {
			host: _host,
			path: _path,
			port: _port,
			headers: _headers,
			toJson: _toJson
		};

		// create the request
		let	request = this.__webClient.get(_port, _host, _path);

		// set SSL
		request = request.ssl(_ssl);

		// send it
		return await this.sendRequest(query, request, _headers, _toJson);
	}

	async	delete(_host, _path, _headers = {}, _toJson = false, _port = 443, _ssl = true)
	{
		// save the param object
		let	query = {
			host: _host,
			path: _path,
			port: _port,
			headers: _headers,
			toJson: _toJson
		};

		// create the request
		let	request = this.__webClient.delete(_port, _host, _path);

		// set SSL
		request = request.ssl(_ssl);

		// send it
		return await this.sendRequest(query, request, _headers, _toJson);
	}

	async	post(_host, _path, _data, _headers = {}, _toJson = false, _dataIsJson = true, _port = 443, _ssl = true)
	{
		// save the param object
		let	query = {
			host: _host,
			path: _path,
			port: _port,
			data: _data,
			headers: _headers,
			toJson: _toJson,
			dataIsJson: _dataIsJson
		};

		// create the request
		let	request = this.__webClient.post(_port, _host, _path);

		// set SSL
		request = request.ssl(_ssl);

		// send it
		return await this.sendRequest(query, request, _headers, _toJson, _data, _dataIsJson);
	}	

	async	patch(_host, _path, _data, _headers = {}, _toJson = false, _dataIsJson = true, _port = 443, _ssl = true)
	{
		// save the param object
		let	query = {
			host: _host,
			path: _path,
			port: _port,
			data: _data,
			headers: _headers,
			toJson: _toJson,
			dataIsJson: _dataIsJson
		};

		// create the request
		let	request = this.__webClient.patch(_port, _host, _path);

		// set SSL
		request = request.ssl(_ssl);

		// send it
		return await this.sendRequest(query, request, _headers, _toJson, _data, _dataIsJson);
	}		

	async	sendRequest(_query, _request, _headers, _toJson, _data = null, _dataIsJson = true)
	{
		// set the headers
		for(const key in _headers)
		{
			_request = _request.putHeader(key, _headers[key]);
		}

		// send it
		try
		{
			// send the query
			let	result = null;
			
			// do we have data?
			if (_data != null)
			{
				// is the data JSON?
				if (_dataIsJson == true)
					result = await _request.sendJson(_data);
				// Buffer
				else
					result = await _request.sendBuffer(Buffer.buffer(_data));
			}
			else
				result = await _request.send();

			// process the content
			return this.processResult(result, _query, _toJson);		
		}
		catch(e)
		{
			ObjUtils.LogException(e);
			return this.processResultException(e, _query, _toJson);
		}
	}

	processResultException(_exception, _query, _toJson)
	{
		ObjUtils.LogError("WEB Exception raised", _query);
		console.trace(_exception);		
		
		return {
			statusCode: 500,
			statusMessage: "Exception raised",
			content: _toJson ? null : ""
		};
	}

	processResult(_result, _query, _toJson)
	{
		let	retCode = 0;
		let	retMsg = "";
		let	retContent = _toJson ? null : "";

		// do we have something?
		if (_result != null)
		{
			// all good?
			let	statusCode = _result.statusCode();
			if (statusCode == 200)
			{
				retCode = 200;
				retMsg = "success";

				// extract the content
				retContent = _result.bodyAsString();

				// do we need to convert to JSON?
				if (_toJson == true)
				{
					try
					{
						retContent = JSON.parse(retContent);
					}
					catch
					{
						ObjUtils.LogError("WEB error converting to JSON", {
							query: _query,
							result: retContent
						});
						retContent = null;
					}
				}
			}
			else
			{
				retCode = statusCode;
				retMsg = _result.statusMessage();
				ObjUtils.LogError("WEB error " + statusCode + ", msg=" + _result.statusMessage(), _query);
			}
		}
		else
		{
			retCode = 500;
			retMsg = "Error getting the data";
			ObjUtils.LogError("WEB error getting the data", _query);
		}	

		return {
			statusCode: retCode,
			statusMessage: retMsg,
			content: retContent
		};
	}
}

module.exports = {
	WebClientMgr
};
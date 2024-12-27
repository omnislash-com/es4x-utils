import { WebClientOptions } from '@vertx/web-client/options';
import { WebClient } from '@vertx/web-client';
import { MultiMap } from '@vertx/core';
import { Buffer } from '@vertx/core';
import { StringUtils } from '../utils/StringUtils';

const { LogUtils } = require("../utils/LogUtils");
const { QueryUtils } = require("./QueryUtils");

class	WebClientMgr
{
	constructor(_vertx)
	{
		let	opt = new WebClientOptions();
		opt.setSsl(true);
		opt.setTrustAll(true);				 

		this.__webClient = WebClient.create(_vertx, opt);
	}

	async	query(_method, _host, _path, _data = null, _headers = {}, _toJson = false, _dataIsJson = true, _port = 443, _ssl = true, _dataIsForm = false)
	{
		// depending on the method
		let	result = null;

		// GET
		if (_method == QueryUtils.HTTP_METHOD_GET)
		{
			result = await this.get(_host, _path, _headers, _toJson, _port, _ssl, _data, _dataIsJson, _dataIsForm);
		}
		// DELETE
		else if (_method == QueryUtils.HTTP_METHOD_DEL)
		{
			result = await this.delete(_host, _path, _headers, _toJson, _port, _ssl);
		}				
		// POST
		else if (_method == QueryUtils.HTTP_METHOD_POST)
		{
			result = await this.post(_host, _path, _data, _headers, _toJson, _dataIsJson, _port, _ssl, _dataIsForm);
		}				
		// PATCH
		else if (_method == QueryUtils.HTTP_METHOD_PATCH)
		{
			result = await this.patch(_host, _path, _data, _headers, _toJson, _dataIsJson, _port, _ssl);
		}				
		// PUT
		else if (_method == QueryUtils.HTTP_METHOD_PUT)
		{
			result = await this.put(_host, _path, _data, _headers, _toJson, _dataIsJson, _port, _ssl);
		}
		else 
		{
			LogUtils.LogError("Error: unknown method: " + _method);
		}

		return result;
	}

	static	BufferToBase64(_buffer)
	{
		const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

		const byteLength = _buffer.length();
		const remainingBytesCount = byteLength % 3;
		const mainLength = byteLength - remainingBytesCount;

		let string = "";
		let i = 0;

		for (; i < mainLength; i += 3) {
			const chunk = (_buffer.getUnsignedByte(i) << 16) | (_buffer.getUnsignedByte(i+1) << 8) | _buffer.getUnsignedByte(i+2);
			string += base64Chars[(chunk & 0b111111000000000000000000) >> 18];
			string += base64Chars[(chunk & 0b000000111111000000000000) >> 12];
			string += base64Chars[(chunk & 0b000000000000111111000000) >> 6];
			string += base64Chars[(chunk & 0b000000000000000000111111)];
		}

		if (remainingBytesCount === 2) {
			const chunk = (_buffer.getUnsignedByte(i) << 16) | (_buffer.getUnsignedByte(i+1) << 8);
			string += base64Chars[(chunk & 0b111111000000000000000000) >> 18];
			string += base64Chars[(chunk & 0b000000111111000000000000) >> 12];
			string += base64Chars[(chunk & 0b000000000000111111000000) >> 6];
			string += "=";

		} else if (remainingBytesCount === 1) {
			const chunk = (_buffer.getUnsignedByte(i) << 16);
			string += base64Chars[(chunk & 0b111111000000000000000000) >> 18];
			string += base64Chars[(chunk & 0b000000111111000000000000) >> 12];
			string += "==";
		}

		return string;
	}

	async	downloadFileToBase64(_url)
	{
		// download the file
		let	file = await this.downloadFile(_url);

		// if we have it, we convert it to base64
		if (file != null)
		{
			return WebClientMgr.BufferToBase64(file);
		}
		else
		{
			LogUtils.LogError("Error downloading the file: ", _url);
			return null;
		}
	}

	async	downloadFile(_url)
	{
		// create the request
		let	request = this.__webClient.getAbs(_url);

		// send it
		try
		{
			// send the query
			let	result = await request.send();

			// extract the redirection URL
			if (result != null)
			{
				return result.bodyAsBuffer();
			}
			else
			{
				LogUtils.LogError("WEB error getting the data from: ", _url);
				return null;
			}
		}
		catch(e)
		{
			LogUtils.LogException(e);
			LogUtils.LogError("WEB error getting the redirect url from: ", _url);
			return null;
		}				
	}

	async	get(_host, _path, _headers = {}, _toJson = false, _port = 443, _ssl = true, _data = null, _dataIsJson = true, _dataIsForm = false)
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
		return await this.sendRequest(query, request, _headers, _toJson, _data, _dataIsJson, _dataIsForm);
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

	async	post(_host, _path, _data, _headers = {}, _toJson = false, _dataIsJson = true, _port = 443, _ssl = true, _dataIsForm = false)
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
		return await this.sendRequest(query, request, _headers, _toJson, _data, _dataIsJson, _dataIsForm);
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

	async	put(_host, _path, _data, _headers = {}, _toJson = false, _dataIsJson = true, _port = 443, _ssl = true)
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
		let	request = this.__webClient.put(_port, _host, _path);

		// set SSL
		request = request.ssl(_ssl);

		// send it
		return await this.sendRequest(query, request, _headers, _toJson, _data, _dataIsJson);
	}		

	async	sendRequest(_query, _request, _headers, _toJson, _data = null, _dataIsJson = true, _dataIsForm = false)
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
				// form?
				else if (_dataIsForm == true)
				{
					// prepare the form
					let	formData = MultiMap.caseInsensitiveMultiMap();
					for(let key in _data)
					{
						formData.set(key, _data[key]);
					}

					// send it
					result = await _request.sendForm(formData);
				}
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
			LogUtils.LogException(e);
			return this.processResultException(e, _query, _toJson);
		}
	}

	processResultException(_exception, _query, _toJson)
	{
		LogUtils.LogError("WEB Exception raised", _query);
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
			if ( (statusCode >= 200) && (statusCode < 300) )
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
						LogUtils.LogError("WEB error converting to JSON", {
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
				LogUtils.LogError("WEB error " + statusCode + ", msg=" + _result.statusMessage(), _query);
			}
		}
		else
		{
			retCode = 500;
			retMsg = "Error getting the data";
			LogUtils.LogError("WEB error getting the data", _query);
		}	

		return {
			statusCode: retCode,
			statusMessage: retMsg,
			content: retContent
		};
	}

	async	retrieveRedirectUrl(_absoluteUrl)
	{
		// create the request
		let	request = this.__webClient.getAbs(_absoluteUrl);

		// make sure to not follow the redirections
		request = request.followRedirects(false);

		// send it
		try
		{
			// send the query
			let	result = await request.send();

			// extract the redirection URL
			if (result != null)
			{
				let	redirectUrl = result.getHeader("Location");
				if (StringUtils.IsEmpty(redirectUrl) == true)
				{
					LogUtils.LogError("WEB error no redirect url from: ", _absoluteUrl);
					return "";
				}
				else
				{
					return redirectUrl;
				}
			}
		}
		catch(e)
		{
			LogUtils.LogException(e);
			LogUtils.LogError("WEB error getting the redirect url from: ", _absoluteUrl);
			return "";
		}				
	}
}

module.exports = {
	WebClientMgr
};
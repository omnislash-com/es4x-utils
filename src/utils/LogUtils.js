const { CoreUtils } = require("../utils/CoreUtils");

class	LogUtils
{	
	static	ConsoleInspect(_obj)
	{
		LogUtils.Log("Inspect object", {"obj": Object.entries(_obj)});
	}
	
	static	ExtractException(_e)
	{
		if (_e)
		{
			return {
				error: "exception",
				error_message: _e.toString()
			};
		}
		else
		{
			return {
				error: "exception",
				error_message: "unknown"
			};
		}
	}	

	static	Log(_message, _payload = null)
	{
		console.log(LogUtils.CreateLog(_message, _payload));
	}

	static	LogWarning(_message, _payload = null, _model = "")
	{
		_message = "[WARNING] " + _message;
		console.log(LogUtils.CreateLog(_message, _payload));
//		console.warn(LogUtils.CreateLog(_message, _payload));
	}

	static	LogError(_message, _payload = null, _model = "")
	{
		_message = "[ERROR] " + _message;
		console.log(LogUtils.CreateLog(_message, _payload));
//		console.error(LogUtils.CreateLog(_message, _payload));
	}

	static	LogException(_e)
	{
		let	ourException = LogUtils.ExtractException(_e);
		LogUtils.LogError("Exception: " + ourException.error_message, ourException);
		if (_e)
			console.trace(_e);
	}

	static	CreateLog(_message, _payload = null)
	{
		// if the payload is empty, we create one
		let	finalPayload = {};
		if (CoreUtils.IsValid(_payload) == false)
			finalPayload = {};
		else
			finalPayload = CoreUtils.Copy(_payload);
		
		// if it's not an object, we create an object
		if (CoreUtils.IsObject(_payload) == false)
		{
			finalPayload = {
				data: _payload
			};
		}
		// if it already has a "message" key, we wrapped with an object
		else if (_payload.hasOwnProperty("message") == true)
		{
			finalPayload = {
				data: _payload,
			};
		}

		// add the message
		finalPayload["message"] = _message;

		return JSON.stringify(finalPayload);
	}	
};

module.exports = {
	LogUtils
};

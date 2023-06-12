const	rs = require('jsrsasign');

const { CoreUtils } = require("../utils/CoreUtils");

class	StringUtils
{
	static	get	ARRAY_ACTION_NEW()			{ return "new"; }	
	static	get	ARRAY_ACTION_FIRST()		{ return "first"; }	
	static	get	ARRAY_ACTION_LAST()			{ return "last"; }	

	static	EnsureNotNull(_str, _default = "")
	{
		if (StringUtils.IsEmpty(_str) == true)
			return _default;
		else
			return _str;
	}

	static	IsEmpty(_str)
	{
		// null
		if (typeof _str === 'undefined')
			return true;		
		if (_str == null)
			return true;
		
		// if we have a string
		if (typeof _str === 'string' || _str instanceof String)
		{
			return _str == "";
		}

		return true;
	}

	static	ExtractBetween(_str, _first, _end)
	{
		// extract the array index
		let indexFirst = _str.indexOf(_first);
		let indexEnd = _str.lastIndexOf(_end);
		if ( (indexFirst >= 0) && (indexEnd >= 0) && (indexFirst < indexEnd) )
			return _str.substr(indexFirst+1, indexEnd - indexFirst - 1);
		else
			return "";
	}

	static	ExtractFilename(_str, _delimiter = "/")
	{
		if (StringUtils.IsEmpty(_str) == true)
			return "";

		// split with /
		let	chunks = _str.split(_delimiter);

		// return the last one
		return chunks[chunks.length-1];
	}
	
	static	ExtractParameters(_str)
	{
		// extract between the ()
		let paramStr = StringUtils.ExtractBetween(_str, "(", ")");
	
		// extract the list of parameters
		let params = [];
	
		// split with ','
		let values = paramStr.split(",");
		let mergingCount = 0;
		let mergingValue = "";
		for(let i=0; i<values.length; i++)
		{
			// trim it
			values[i] = values[i].trim();
	
			// do we have something?
			if (values[i] != "")
			{
				// if we are currently merging, we add it now matter what
				if (mergingCount > 0)
					mergingValue += ', ' + values[i];
	
				// count how many ( and )
				let countOpen = StringUtils.Count(values[i], '(');
				let countClose = StringUtils.Count(values[i], ')');
	
				// what's the difference?
				let diff = countOpen - countClose;
	
				// same count?
				if (diff == 0)
				{
					// if we are not currently merging, we just add it
					if (mergingCount == 0)
						params.push(values[i]);
				}
				// are we opening new ones?
				else if (diff > 0)
				{
					// are we just starting?
					if (mergingCount == 0)
						mergingValue = values[i];
	
					// just add the count
					mergingCount += diff;
				}
				// are we closing some?
				else if (diff < 0)
				{
					// were we looking?
					if (mergingCount > 0)
					{
						// remove the count
						mergingCount += diff;
	
						// are we done?
						if (mergingCount <= 0)
						{
							params.push(mergingValue);
							mergingCount = 0;
							mergingValue = "";
						}
					}
				}
			}
		}
	
		return params;
	}
	
	static	Count(_str, _toSearch)
	{
		return _str.split(_toSearch).length - 1;
	}

	static	GenerateToken(_length=32, _onlyUpperCase=false)
	{
		//edit the token allowed characters
		let a = _onlyUpperCase ? "ABCDEFGHIJKLMNPQRSTUVWXYZ1234567890".split("") : "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
		let b = [];
		for (let i=0; i<_length; i++)
		{
			let j = (Math.random() * (a.length-1)).toFixed(0);
			b.push(a[j]);
		}
		return b.join("");
	}

	static	GenerateUUID()
	{
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	static	EscapeRegex(_str)
	{
		if (StringUtils.IsEmpty(_str) == true)
			return "";
		return _str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}

	static	ReplaceAll(_str, _toSearch, _toReplace)
	{
		if (CoreUtils.IsString(_str) == false)
			return _str;

		// escape the search
		_toSearch = StringUtils.EscapeRegex(_toSearch);

		// replace it
		return _str.replace(new RegExp(_toSearch, 'g'), _toReplace);
	}

	static	ReplaceAllMulti(_str, _replace)
	{
		for(const key in _replace)
		{
			_str = StringUtils.ReplaceAll(_str, key, _replace[key]);
		}

		return _str;
	}

	static	ToInt(_str)
	{
		let	value = 0;
		if (CoreUtils.IsString(_str) == true)
			value = Math.round(parseFloat(_str));
		else
			value = Math.round(CoreUtils.ToNumber(_str));

		if (isNaN(value) == true)
			value = 0;
		return value;
	}

	static	ToFloat(_str)
	{
		let	value = 0;
		if (CoreUtils.IsString(_str) == true)
			value = parseFloat(_str);
		else
			value = CoreUtils.ToNumber(_str);

		if (isNaN(value) == true)
			value = 0;
		return value;
	}

	static	ToJSON(_str, _returnNullIfError = false, _doReplace = true, _escapeLineBreaks = false)
	{
		// not a string?
		if (CoreUtils.IsString(_str) == false)
			return _returnNullIfError ? null : _str;

		// replace the \\\" by \"
		if (_doReplace == true)
			_str = StringUtils.ReplaceAll(_str, "\\\"", "\"");

		// escape the line breaks?
		if (_escapeLineBreaks == true)
			_str = _str.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");

		// try to parse the string to JSON
		try
		{
			return JSON.parse(_str);
		}
		catch
		{
			return _returnNullIfError ? null : _str;
		}		
	}

	static	ToBool(_str)
	{
		if (typeof _str === 'undefined')
			return false;
		if (_str == null)
			return false;

		if (CoreUtils.IsString(_str) == true)
		{
			if (StringUtils.IsEmpty(_str) == true)	
				return false;
			else
			{
				if (_str.toLowerCase() == "true")
					return true;
				else if (_str.toLowerCase() == "false")
					return false;
				else
				{
					let	intValue = StringUtils.ToInt(_str);
					return intValue == 1;
				}
			}
		}
		else
			return _str;
	}

	static	IsNumber(_str)
	{
		if (typeof _str === 'number')
			return true;
		else if (typeof _str === 'string' || _str instanceof String)
		{
			// empty?
			if (_str == "")
				return false;

			// NUMBER
			let	numberValue = Number(_str);
			if (isNaN(numberValue) == false)
				return true;
			else
				return false;
		}
		else
			return false;
	}

	static	ToAny(_str, _tryJson = false)
	{
		if (typeof _str === 'string' || _str instanceof String)
		{
			// empty?
			if (_str == "")
				return "";

			// try json?
			if ( (_str.startsWith("{") && _str.endsWith("}")) || (_str.startsWith("[") && _str.endsWith("]")) )
			{
				let	json = StringUtils.ToJSON(_str, true, false);
				if (json != null)
					return json;
			}

			// NUMBER
			let	numberValue = Number(_str);
			if (isNaN(numberValue) == false)
				return numberValue;

			// BOOLEAN
			if (_str.toLowerCase() == "true")
				return true;
			else if (_str.toLowerCase() == "false")
				return false;

			// return the string
			return _str;
		}
		else
			return _str;
	}

	static	ExtractHashtags(_str, _separator = "#")
	{
		let	regexStr = "(?:^|\\s)(?:" + _separator + ")([a-zA-Z_\\d]+)";
		let	regex = new RegExp(regexStr, "gm");
		let	matches = [];
		let	match;
		
		while ((match = regex.exec(_str)))
		{
			// put it to lower case
			let	value = match[1].toLowerCase();

			// if we dont have it already
			if (matches.includes(value) == false)
				matches.push(value);
		}
		
		return matches;
	}

	static	ExtractYouTubeVideoID(_url)
	{
		let	regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		let	match = _url.match(regExp);

		// is it good?
		if (match && match[7].length==11)
			return match[7];

		// if not, we check something else. The regex has an error if the video starts with the letter v
		let	chunks = _url.split("?")[0].split("/");
		if (chunks[chunks.length-1].length == 11)
			return chunks[chunks.length-1];

		return "";
	}

	static	IsUrl(_url)
	{
		if (StringUtils.IsEmpty(_url) == true)
			return false;

		return /(^http(s?):\/\/[^\s$.?#].[^\s]*)/i.test(_url);
	}

	static	ExtractURLs(_text, _prependHttps = true)
	{
		// find the urls
		let	regex = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
//		let	regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})/gi;
		var urls =_text.match(regex);

		if (urls == null)
			urls = [];

		// are we setting the https in front and look for duplicates?
		if (_prependHttps == true)
		{
			let	finalList = [];
			for(let i=0; i<urls.length; i++)
			{
				// does it start with http?
				if (urls[i].toLowerCase().startsWith("http") == false)
					urls[i] = "https://" + urls[i];
			
				// do we have it?
				if (finalList.includes(urls[i]) == false)
					finalList.push(urls[i]);
			}
			return finalList;
		}
		else
			return urls;
	}

	static	ExtractFirstURL(_text)
	{
		let	urls = StringUtils.ExtractURLs(_text);

		if (urls.length > 0)
			return urls[0];
		else
			return "";
	}

	static	GetOrdinalSuffix(_number)
	{
		let	j = _number % 10;
		let k = _number % 100;
		if (j == 1 && k != 11)
			return "st";
		if (j == 2 && k != 12)
			return "nd";
		if (j == 3 && k != 13)
			return "rd";
		return "th";
	}

	static	AppendOrdinalSuffix(_number)
	{
		// make sure our number is an int
		let	numberReal = StringUtils.ToInt(_number);

		return String(_number) + StringUtils.GetOrdinalSuffix(numberReal);
	}	

	static	GetArrayIndexFromPath(_path)
	{
		if (StringUtils.IsEmpty(_path) == true)
			return null;

		if ( (_path.indexOf("[") >= 0) && (_path.endsWith("]") == true) )
		{
			// extract the array index
			let indexFirst = _path.indexOf("[");
			let indexEnd = _path.indexOf("]");
			let	array_index = _path.substr(indexFirst+1, indexEnd - indexFirst - 1);
			if (StringUtils.IsEmpty(array_index) == true)
				return null;

			// remove it from the key
			let	first_key = _path.substr(0, indexFirst);

			// make sure the index is an index and not a search pattern?
			let	searchField = "";
			let	searchValue = "";
			let	action = "";
			let	finalIndex = -1;
			if (array_index.includes(":") == true)
			{
				let	chunks = array_index.split(":");
				searchField = chunks[0];
				searchValue = chunks.splice(1).join(":");
			}
			else
			{
				// a specific action?
				let	actions = [StringUtils.ARRAY_ACTION_NEW, StringUtils.ARRAY_ACTION_FIRST, StringUtils.ARRAY_ACTION_LAST];
				if (actions.includes(array_index.toLowerCase()) == true)
				{
					finalIndex = 0;
					action = array_index.toLowerCase();
				}
				else
					finalIndex = StringUtils.ToInt(array_index);
			}

			return {
				"path": first_key,
				"index": finalIndex,
				"action": action,
				"search": {
					"field": searchField,
					"value": searchValue					
				}
			};
		}
		else
			return null;
	}

	static	DeserializeToObject(_str, _delimiterField = "|", _delimiterValue = ":", _castToAny = true)
	{
		if (StringUtils.IsEmpty(_str) == true)
			return {};
		
		// split with the field
		let	newObj = {};
		let	fields = _str.split(_delimiterField);
		for(let i=0; i<fields.length; i++)
		{
			// trim
			fields[i] = fields[i].trim();

			// not empty
			if (StringUtils.IsEmpty(fields[i]) == false)
			{
				// now we split the field in two
				let	chunks = fields[i].split(_delimiterValue);

				// the key is the first one
				let	key = chunks[0].trim();

				// determine the value
				let	value = "";

				// do we have more chunks?
				if (chunks.length > 1)
					value = chunks.splice(1).join(_delimiterValue).trim();

				// set it
				if (_castToAny == true)
					newObj[key] = StringUtils.ToAny(value);
				else
					newObj[key] = value;
			}
		}

		return newObj;
	}

	static	Split(_str, _delimiter = ",", _castToAny = true, _skipEmpty = false, _returnEmpty = false)
	{
		if (CoreUtils.IsString(_str) == false)
			return [_str];
		
		if (StringUtils.IsEmpty(_str) == true)
		{
			if (_returnEmpty == true)
				return [""];
			else
				return [];
		}

		// split
		let	chunks = _str.split(_delimiter);

		// process each value
		let	newList = [];
		for(let i=0; i<chunks.length; i++)
		{
			// trim it
			let	value = chunks[i].trim();

			// do we add it?
			if ( (StringUtils.IsEmpty(value) == false) || (_skipEmpty == false) )
			{
				// do we cast it?
				if (_castToAny == true)
					value = StringUtils.ToAny(value);

				// add it
				newList.push(value);
			}
		}

		return newList;
	}

	static	Hash(_str, _seed = 0)
	{
		let h1 = 0xdeadbeef ^ _seed, h2 = 0x41c6ce57 ^ _seed;
		for (let i = 0, ch; i < _str.length; i++)
		{
			ch = _str.charCodeAt(i);
			h1 = Math.imul(h1 ^ ch, 2654435761);
			h2 = Math.imul(h2 ^ ch, 1597334677);
		}
		h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
		h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
		return (4294967296 * (2097151 & h2) + (h1>>>0)).toString();
	}

	static	StringToBase64(_str)
	{
		return rs.utf8tob64(_str);
	}

	static	Base64ToString(_str)
	{
		return rs.b64toutf8(_str);
	}

	static	HexToBase64URL(_str)
	{
		return rs.hextob64u(_str);
	}

	static	SHA256(_str)
	{
		return rs.KJUR.crypto.Util.sha256(_str);
	}

	static	ParseStreamedJSON(_jsonStr)
	{
		// empty?
		if (StringUtils.IsEmpty(_jsonStr) == true)
			return [];

		// we reconstructe the array with \n as separator
		let	items = [];

		// split with \n
		let	chunks = _jsonStr.split("\n");

		// process each chunk
		for(let chunk of chunks)
		{
			// empty string?
			if (StringUtils.IsEmpty(chunk) == false)
			{
				// try to parse it
				try
				{
					let	jsonData = JSON.parse(chunk);
					if (jsonData)
						items.push(jsonData);
				}
				catch
				{
				}
			}
		}

		return items;
	}

	static	EnsureSize(_txt, _length)
	{
		if (StringUtils.IsEmpty(_txt) == true)
			return "";
		else if (_txt.length > _length)
			return _txt.substr(0, _length);
		else
			return _txt;
	}

}

module.exports = {
	StringUtils
};

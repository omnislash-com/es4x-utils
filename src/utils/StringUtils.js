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

	static	HMACSHA256(_key, _message)
	{
		let	mac = new rs.KJUR.crypto.Mac({alg: "HmacSHA256", "pass": _key});
		return mac.doFinalString(_message);
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

	static	CSVToJSON(_text, _delimiter = ',', _header = 0)
	{
		// convert to array
		let	lines = this.CSVToArray(_text, _delimiter);

		// do we have enough lines?
		if (lines.length <= (_header + 1))
			return [];

		// get the headers
		let	headers = lines[_header];

		// build the final objects
		let	objects = [];
		for(let i = _header + 1; i < lines.length; i++)
		{
			let	line = lines[i];
			// make sure we have the same number of values and headers
			if (line.length != headers.length)
				continue;

			// create the object
			let	object = {};
			for(let j = 0; j < headers.length; j++)
			{
				object[headers[j]] = line[j];
			}
			objects.push(object);
		}

		return objects;
	  }

	static	CSVToArray (_text, _delimiter = ",")
	{
		_delimiter = (_delimiter || ","); // user-supplied delimeter or default comma
		
		var pattern = new RegExp( // regular expression to parse the CSV values.
			( // Delimiters:
			"(\\" + _delimiter + "|\\r?\\n|\\r|^)" +
			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
			// Standard fields.
			"([^\"\\" + _delimiter + "\\r\\n]*))"
			), "gi"
		);
		
		var rows = [[]];  // array to hold our data. First row is column headers.
		// array to hold our individual pattern matching groups:
		var matches = false; // false if we don't find any matches
		// Loop until we no longer find a regular expression match
		while (matches = pattern.exec( _text ))
		{
			var matched_delimiter = matches[1]; // Get the matched delimiter
			// Check if the delimiter has a length (and is not the start of string)
			// and if it matches field delimiter. If not, it is a row delimiter.
			if (matched_delimiter.length && matched_delimiter !== _delimiter)
			{
				// Since this is a new row of data, add an empty row to the array.
				rows.push( [] );
			}
			var matched_value;
			// Once we have eliminated the delimiter, check to see
			// what kind of value was captured (quoted or unquoted):
			if (matches[2])
			{ // found quoted value. unescape any double quotes.
				matched_value = matches[2].replace(
				new RegExp( "\"\"", "g" ), "\""
				);
			}
			else
			{ // found a non-quoted value
				matched_value = matches[3];
			}
			// Now that we have our value string, let's add
			// it to the data array.
			rows[rows.length - 1].push(matched_value);
		}
		return rows; // Return the parsed data Array
	}

	static	ToTitleCase(_str)
	{
		return _str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}

	// format a phone number to E.164 format
	// _phone: the phone number to format
	// _extension: the country code to use if the phone number doesn't have one
	// _defaultExtension: the default country code to use if neither phone nor extension have one
	static	FormatPhone(_phone, _extension = "", _defaultExtension = "1")
	{
		// empty?
		if (StringUtils.IsEmpty(_phone) == true)
			return "";

		// Use ExtractPhone to intelligently parse the input
		const extracted = StringUtils.ExtractPhone(_phone, "");

		// If no phone number was extracted, return empty
		if (!extracted.phone || extracted.phone === "")
			return "";

		// Determine the country code to use
		let countryCode = "";

		// Priority order for country code:
		// 1. Country code extracted from the phone number itself
		// 2. Explicitly provided extension parameter
		// 3. Default extension parameter
		if (extracted.extension && extracted.extension !== "") {
			countryCode = extracted.extension;
		} else if (!StringUtils.IsEmpty(_extension)) {
			countryCode = _extension;
		} else if (!StringUtils.IsEmpty(_defaultExtension)) {
			countryCode = _defaultExtension;
		}

		// Clean the country code (remove any non-digits)
		countryCode = countryCode.replace(/[^\d]/g, "");

		// Get the phone number
		let phoneNumber = extracted.phone;

		// Validate E.164 format requirements
		// E.164 numbers can have a maximum of 15 digits (not including the +)
		const totalDigits = countryCode.length + phoneNumber.length;

		if (totalDigits > 15) {
			// Try to trim the phone number if it's too long
			// This might happen if there's an extension appended
			const maxPhoneLength = 15 - countryCode.length;
			phoneNumber = phoneNumber.substring(0, maxPhoneLength);
		}

		// Validate country code (must be 1-3 digits)
		if (countryCode.length < 1 || countryCode.length > 3) {
			// If country code is invalid, try to use default
			if (!StringUtils.IsEmpty(_defaultExtension)) {
				countryCode = _defaultExtension.replace(/[^\d]/g, "");
			}
			// If still invalid, default to "1" (North America)
			if (countryCode.length < 1 || countryCode.length > 3) {
				countryCode = "1";
			}
		}

		// Validate that we have a phone number
		if (phoneNumber.length === 0) {
			return "";
		}

		// Special handling for specific country formats
		// Some countries have specific requirements
		// Note: We should be careful not to be too strict as phone number formats can vary
		const countryCodeInfo = {
			"1": { minLength: 10, maxLength: 10 },    // US/Canada - strict 10 digits
			"44": { minLength: 10, maxLength: 11 },   // UK - can be 10 or 11 with trunk code
			"86": { minLength: 11, maxLength: 11 },   // China
			"91": { minLength: 10, maxLength: 10 },   // India
			"55": { minLength: 10, maxLength: 11 },   // Brazil
		};

		// Check if we have specific requirements for this country code
		// Only apply strict formatting if we're confident about the country
		if (countryCodeInfo[countryCode] && phoneNumber.length <= countryCodeInfo[countryCode].maxLength + 1) {
			const info = countryCodeInfo[countryCode];
			// Only apply country-specific limits if the number is close to expected length
			// This avoids incorrectly truncating numbers that might be from different regions
			if (phoneNumber.length > info.maxLength && phoneNumber.length <= info.maxLength + 1) {
				// Slightly over limit, likely has an extra digit - trim
				phoneNumber = phoneNumber.substring(0, info.maxLength);
			}
			// If way over the limit, don't trim - might be a different format entirely
		}

		// Final validation: ensure total length doesn't exceed 15 digits
		const finalTotal = countryCode.length + phoneNumber.length;
		if (finalTotal > 15) {
			// This shouldn't happen if our logic above is correct, but just in case
			const maxPhoneLength = 15 - countryCode.length;
			phoneNumber = phoneNumber.substring(0, maxPhoneLength);
		}

		// Return the formatted E.164 number
		return "+" + countryCode + phoneNumber;
	}

	// extract the phone number without any non digit characters, and extract the extension if any
	// it takes in parameter the phone as a string, and a default extension, and return the cleaned phone and extension as two different strings
	static	ExtractPhone(_phone, _defaultExtension)
	{
		// empty?
		if (StringUtils.IsEmpty(_phone) == true)
			return {"phone": "", "extension": ""};

		// Handle default extension - only use "1" if truly undefined
		// Also handle the string "undefined" which might come from test frameworks
		if (typeof _defaultExtension === 'undefined' ||
		    _defaultExtension === undefined ||
		    _defaultExtension === "undefined") {
			_defaultExtension = "";  // Don't use default if explicitly passed as undefined
		} else if (_defaultExtension === null || _defaultExtension === "null") {
			_defaultExtension = "";  // Don't use default if explicitly passed as null
		}

		// Common country codes with their expected phone lengths (without country code)
		const countryCodeInfo = {
			"1": { length: 10, name: "US/Canada" },           // US, Canada
			"7": { length: 10, name: "Russia" },              // Russia
			"20": { length: 10, name: "Egypt" },              // Egypt
			"27": { length: 9, name: "South Africa" },        // South Africa
			"30": { length: 10, name: "Greece" },             // Greece
			"31": { length: 9, name: "Netherlands" },         // Netherlands
			"32": { length: 9, name: "Belgium" },             // Belgium
			"33": { length: 9, name: "France" },              // France
			"34": { length: 9, name: "Spain" },               // Spain
			"36": { length: 9, name: "Hungary" },             // Hungary
			"39": { length: 10, name: "Italy" },              // Italy
			"40": { length: 9, name: "Romania" },             // Romania
			"41": { length: 9, name: "Switzerland" },         // Switzerland
			"43": { length: 10, name: "Austria" },            // Austria
			"44": { length: 10, name: "UK" },                 // UK
			"45": { length: 8, name: "Denmark" },             // Denmark
			"46": { length: 9, name: "Sweden" },              // Sweden
			"47": { length: 8, name: "Norway" },              // Norway
			"48": { length: 9, name: "Poland" },              // Poland
			"49": { length: 10, name: "Germany" },            // Germany
			"51": { length: 9, name: "Peru" },                // Peru
			"52": { length: 10, name: "Mexico" },             // Mexico
			"53": { length: 8, name: "Cuba" },                // Cuba
			"54": { length: 10, name: "Argentina" },          // Argentina
			"55": { length: 11, name: "Brazil" },             // Brazil
			"56": { length: 9, name: "Chile" },               // Chile
			"57": { length: 10, name: "Colombia" },           // Colombia
			"58": { length: 10, name: "Venezuela" },          // Venezuela
			"60": { length: 9, name: "Malaysia" },            // Malaysia
			"61": { length: 9, name: "Australia" },           // Australia
			"62": { length: 10, name: "Indonesia" },          // Indonesia
			"63": { length: 10, name: "Philippines" },        // Philippines
			"64": { length: 9, name: "New Zealand" },         // New Zealand
			"65": { length: 8, name: "Singapore" },           // Singapore
			"66": { length: 9, name: "Thailand" },            // Thailand
			"81": { length: 10, name: "Japan" },              // Japan
			"82": { length: 10, name: "South Korea" },        // South Korea
			"84": { length: 9, name: "Vietnam" },             // Vietnam
			"86": { length: 11, name: "China" },              // China
			"90": { length: 10, name: "Turkey" },             // Turkey
			"91": { length: 10, name: "India" },              // India
			"92": { length: 10, name: "Pakistan" },           // Pakistan
			"93": { length: 9, name: "Afghanistan" },         // Afghanistan
			"94": { length: 9, name: "Sri Lanka" },           // Sri Lanka
			"95": { length: 9, name: "Myanmar" },             // Myanmar
			"98": { length: 10, name: "Iran" },               // Iran
			"212": { length: 9, name: "Morocco" },            // Morocco
			"213": { length: 9, name: "Algeria" },            // Algeria
			"216": { length: 8, name: "Tunisia" },            // Tunisia
			"218": { length: 9, name: "Libya" },              // Libya
			"220": { length: 7, name: "Gambia" },             // Gambia
			"221": { length: 9, name: "Senegal" },            // Senegal
			"222": { length: 8, name: "Mauritania" },         // Mauritania
			"223": { length: 8, name: "Mali" },               // Mali
			"224": { length: 9, name: "Guinea" },             // Guinea
			"225": { length: 10, name: "Ivory Coast" },       // Ivory Coast
			"226": { length: 8, name: "Burkina Faso" },       // Burkina Faso
			"227": { length: 8, name: "Niger" },              // Niger
			"228": { length: 8, name: "Togo" },               // Togo
			"229": { length: 8, name: "Benin" },              // Benin
			"230": { length: 8, name: "Mauritius" },          // Mauritius
			"231": { length: 8, name: "Liberia" },            // Liberia
			"232": { length: 8, name: "Sierra Leone" },       // Sierra Leone
			"233": { length: 9, name: "Ghana" },              // Ghana
			"234": { length: 10, name: "Nigeria" },           // Nigeria
			"235": { length: 8, name: "Chad" },               // Chad
			"236": { length: 8, name: "Central African Republic" }, // Central African Republic
			"237": { length: 9, name: "Cameroon" },           // Cameroon
			"238": { length: 7, name: "Cape Verde" },         // Cape Verde
			"239": { length: 7, name: "Sao Tome" },           // Sao Tome and Principe
			"240": { length: 9, name: "Equatorial Guinea" },  // Equatorial Guinea
			"241": { length: 7, name: "Gabon" },              // Gabon
			"242": { length: 9, name: "Congo" },              // Republic of Congo
			"243": { length: 9, name: "DR Congo" },           // Democratic Republic of Congo
			"244": { length: 9, name: "Angola" },             // Angola
			"245": { length: 9, name: "Guinea-Bissau" },      // Guinea-Bissau
			"248": { length: 6, name: "Seychelles" },         // Seychelles
			"249": { length: 9, name: "Sudan" },              // Sudan
			"250": { length: 9, name: "Rwanda" },             // Rwanda
			"251": { length: 9, name: "Ethiopia" },           // Ethiopia
			"252": { length: 8, name: "Somalia" },            // Somalia
			"253": { length: 8, name: "Djibouti" },           // Djibouti
			"254": { length: 10, name: "Kenya" },             // Kenya
			"255": { length: 9, name: "Tanzania" },           // Tanzania
			"256": { length: 9, name: "Uganda" },             // Uganda
			"257": { length: 8, name: "Burundi" },            // Burundi
			"258": { length: 9, name: "Mozambique" },         // Mozambique
			"260": { length: 9, name: "Zambia" },             // Zambia
			"261": { length: 9, name: "Madagascar" },         // Madagascar
			"262": { length: 9, name: "Reunion" },            // Reunion
			"263": { length: 9, name: "Zimbabwe" },           // Zimbabwe
			"264": { length: 9, name: "Namibia" },            // Namibia
			"265": { length: 9, name: "Malawi" },             // Malawi
			"266": { length: 8, name: "Lesotho" },            // Lesotho
			"267": { length: 8, name: "Botswana" },           // Botswana
			"268": { length: 8, name: "Swaziland" },          // Swaziland
			"269": { length: 7, name: "Comoros" },            // Comoros
			"297": { length: 7, name: "Aruba" },              // Aruba
			"298": { length: 6, name: "Faroe Islands" },      // Faroe Islands
			"299": { length: 6, name: "Greenland" },          // Greenland
			"350": { length: 8, name: "Gibraltar" },          // Gibraltar
			"351": { length: 9, name: "Portugal" },           // Portugal
			"352": { length: 9, name: "Luxembourg" },         // Luxembourg
			"353": { length: 9, name: "Ireland" },            // Ireland
			"354": { length: 7, name: "Iceland" },            // Iceland
			"355": { length: 9, name: "Albania" },            // Albania
			"356": { length: 8, name: "Malta" },              // Malta
			"357": { length: 8, name: "Cyprus" },             // Cyprus
			"358": { length: 9, name: "Finland" },            // Finland
			"359": { length: 9, name: "Bulgaria" },           // Bulgaria
			"370": { length: 8, name: "Lithuania" },          // Lithuania
			"371": { length: 8, name: "Latvia" },             // Latvia
			"372": { length: 8, name: "Estonia" },            // Estonia
			"373": { length: 8, name: "Moldova" },            // Moldova
			"374": { length: 8, name: "Armenia" },            // Armenia
			"375": { length: 9, name: "Belarus" },            // Belarus
			"376": { length: 6, name: "Andorra" },            // Andorra
			"377": { length: 8, name: "Monaco" },             // Monaco
			"378": { length: 10, name: "San Marino" },        // San Marino
			"380": { length: 9, name: "Ukraine" },            // Ukraine
			"381": { length: 9, name: "Serbia" },             // Serbia
			"382": { length: 8, name: "Montenegro" },         // Montenegro
			"383": { length: 9, name: "Kosovo" },             // Kosovo
			"385": { length: 9, name: "Croatia" },            // Croatia
			"386": { length: 8, name: "Slovenia" },           // Slovenia
			"387": { length: 8, name: "Bosnia" },             // Bosnia and Herzegovina
			"389": { length: 8, name: "Macedonia" },          // North Macedonia
			"420": { length: 9, name: "Czech Republic" },     // Czech Republic
			"421": { length: 9, name: "Slovakia" },           // Slovakia
			"423": { length: 7, name: "Liechtenstein" },      // Liechtenstein
			"500": { length: 5, name: "Falkland Islands" },   // Falkland Islands
			"501": { length: 7, name: "Belize" },             // Belize
			"502": { length: 8, name: "Guatemala" },          // Guatemala
			"503": { length: 8, name: "El Salvador" },        // El Salvador
			"504": { length: 8, name: "Honduras" },           // Honduras
			"505": { length: 8, name: "Nicaragua" },          // Nicaragua
			"506": { length: 8, name: "Costa Rica" },         // Costa Rica
			"507": { length: 8, name: "Panama" },             // Panama
			"508": { length: 6, name: "St Pierre" },          // St Pierre and Miquelon
			"509": { length: 8, name: "Haiti" },              // Haiti
			"590": { length: 9, name: "Guadeloupe" },         // Guadeloupe
			"591": { length: 8, name: "Bolivia" },            // Bolivia
			"592": { length: 7, name: "Guyana" },             // Guyana
			"593": { length: 9, name: "Ecuador" },            // Ecuador
			"594": { length: 9, name: "French Guiana" },      // French Guiana
			"595": { length: 9, name: "Paraguay" },           // Paraguay
			"596": { length: 9, name: "Martinique" },         // Martinique
			"597": { length: 7, name: "Suriname" },           // Suriname
			"598": { length: 8, name: "Uruguay" },            // Uruguay
			"599": { length: 7, name: "Netherlands Antilles" }, // Netherlands Antilles
			"670": { length: 8, name: "East Timor" },         // East Timor
			"672": { length: 6, name: "Norfolk Island" },     // Norfolk Island
			"673": { length: 7, name: "Brunei" },             // Brunei
			"674": { length: 7, name: "Nauru" },              // Nauru
			"675": { length: 8, name: "Papua New Guinea" },   // Papua New Guinea
			"676": { length: 5, name: "Tonga" },              // Tonga
			"677": { length: 7, name: "Solomon Islands" },    // Solomon Islands
			"678": { length: 7, name: "Vanuatu" },            // Vanuatu
			"679": { length: 7, name: "Fiji" },               // Fiji
			"680": { length: 7, name: "Palau" },              // Palau
			"681": { length: 6, name: "Wallis and Futuna" },  // Wallis and Futuna
			"682": { length: 5, name: "Cook Islands" },       // Cook Islands
			"683": { length: 4, name: "Niue" },               // Niue
			"685": { length: 7, name: "Samoa" },              // Samoa
			"686": { length: 5, name: "Kiribati" },           // Kiribati
			"687": { length: 6, name: "New Caledonia" },      // New Caledonia
			"688": { length: 5, name: "Tuvalu" },             // Tuvalu
			"689": { length: 6, name: "French Polynesia" },   // French Polynesia
			"690": { length: 4, name: "Tokelau" },            // Tokelau
			"691": { length: 7, name: "Micronesia" },         // Micronesia
			"692": { length: 7, name: "Marshall Islands" },   // Marshall Islands
			"850": { length: 10, name: "North Korea" },       // North Korea
			"852": { length: 8, name: "Hong Kong" },          // Hong Kong
			"853": { length: 8, name: "Macau" },              // Macau
			"855": { length: 9, name: "Cambodia" },           // Cambodia
			"856": { length: 9, name: "Laos" },               // Laos
			"880": { length: 10, name: "Bangladesh" },        // Bangladesh
			"886": { length: 9, name: "Taiwan" },             // Taiwan
			"960": { length: 7, name: "Maldives" },           // Maldives
			"961": { length: 8, name: "Lebanon" },            // Lebanon
			"962": { length: 9, name: "Jordan" },             // Jordan
			"963": { length: 9, name: "Syria" },              // Syria
			"964": { length: 10, name: "Iraq" },              // Iraq
			"965": { length: 8, name: "Kuwait" },             // Kuwait
			"966": { length: 9, name: "Saudi Arabia" },       // Saudi Arabia
			"967": { length: 9, name: "Yemen" },              // Yemen
			"968": { length: 8, name: "Oman" },               // Oman
			"970": { length: 9, name: "Palestine" },          // Palestine
			"971": { length: 9, name: "UAE" },                // United Arab Emirates
			"972": { length: 9, name: "Israel" },             // Israel
			"973": { length: 8, name: "Bahrain" },            // Bahrain
			"974": { length: 8, name: "Qatar" },              // Qatar
			"975": { length: 8, name: "Bhutan" },             // Bhutan
			"976": { length: 8, name: "Mongolia" },           // Mongolia
			"977": { length: 10, name: "Nepal" },             // Nepal
			"992": { length: 9, name: "Tajikistan" },         // Tajikistan
			"993": { length: 8, name: "Turkmenistan" },       // Turkmenistan
			"994": { length: 9, name: "Azerbaijan" },         // Azerbaijan
			"995": { length: 9, name: "Georgia" },            // Georgia
			"996": { length: 9, name: "Kyrgyzstan" },         // Kyrgyzstan
			"998": { length: 9, name: "Uzbekistan" }          // Uzbekistan
		};

		// First, check if it starts with 00 and convert to +
		_phone = _phone.replace(/^00/, '+');

		// Check if the phone has a + at the beginning
		const hasPlus = _phone.startsWith('+');

		// Check if it looks like a phone number (has digits or common phone patterns)
		const hasDigits = /\d/.test(_phone);
		const looksLikePhone = hasDigits || hasPlus || /^[\s\(\)\-\+\.]+$/.test(_phone);

		// Only convert letters to numbers if it looks like a phone number
		if (looksLikePhone && hasDigits) {
			// Remove common extension indicators and everything after them
			// This handles formats like "555-123-4567 x123" or "555-123-4567 ext. 999"
			_phone = _phone.replace(/\s*(ext\.?|extension|x)\s*\d+/gi, '');

			// Convert letters to numbers (phone keypad mapping) - only in phone-like contexts
			// But only for the main phone number part, not after clear separators
			const parts = _phone.split(/[\s\-\.\(\)]+/);
			_phone = parts.map(part => {
				// If part is all letters and looks like a word (like CALL), convert it
				if (/^[A-Za-z]+$/.test(part) && part.length <= 10) {
					return part.toUpperCase()
						.replace(/[ABC]/g, '2')
						.replace(/[DEF]/g, '3')
						.replace(/[GHI]/g, '4')
						.replace(/[JKL]/g, '5')
						.replace(/[MNO]/g, '6')
						.replace(/[PQRS]/g, '7')
						.replace(/[TUV]/g, '8')
						.replace(/[WXYZ]/g, '9');
				}
				return part;
			}).join(' ');
		}

		// Remove all non-numeric characters except the leading +
		let cleaned = _phone.replace(/[^\d+]/g, '');
		// Ensure only one + at the beginning
		if (hasPlus) {
			cleaned = '+' + cleaned.replace(/\+/g, '');
		} else {
			cleaned = cleaned.replace(/\+/g, '');
		}

		// If no digits at all, return empty
		const digitsOnly = cleaned.replace(/\+/g, '');
		if (digitsOnly.length === 0) {
			return {"phone": "", "extension": ""};
		}

		let extension = "";
		let phoneNumber = digitsOnly;

		// Try to detect country code
		if (hasPlus || digitsOnly.length > 10) {
			// Try to match country code (check 1-3 digit prefixes)
			let matchedCode = null;

			// Start with the longest possible match (3 digits), then 2, then 1
			for (let len = 3; len >= 1; len--) {
				const potentialCode = digitsOnly.substring(0, len);
				if (countryCodeInfo[potentialCode]) {
					matchedCode = potentialCode;
					break;
				}
			}

			if (matchedCode) {
				extension = matchedCode;
				phoneNumber = digitsOnly.substring(matchedCode.length);

				// If the phone number is longer than expected for this country,
				// it might contain an extension or additional digits
				// For now, we'll just keep all the digits as the phone number
				// (You could add logic here to extract extensions based on country-specific rules)
			} else if (hasPlus) {
				// Has + but no recognized country code
				// For unrecognized codes, we need to make educated guesses
				// Check if it starts with 9 (which could be 9xx codes)
				if (digitsOnly.startsWith('9') && digitsOnly.length >= 12) {
					// Could be a 3-digit code starting with 9 (like 999)
					// Check if treating as 3-digit code leaves reasonable phone length
					const remainingAfter3 = digitsOnly.length - 3;
					if (remainingAfter3 >= 7 && remainingAfter3 <= 15) {
						extension = digitsOnly.substring(0, 3);
						phoneNumber = digitsOnly.substring(3);
					} else if (digitsOnly.length >= 12) {
						// Try 2-digit code
						extension = digitsOnly.substring(0, 2);
						phoneNumber = digitsOnly.substring(2);
					} else {
						// Fall back to 1-digit
						extension = digitsOnly.substring(0, 1);
						phoneNumber = digitsOnly.substring(1);
					}
				} else if (digitsOnly.length > 10) {
					// Try to guess: if total length > 11, probably has country code
					if (digitsOnly.length >= 13) {
						// Likely a 3-digit country code
						extension = digitsOnly.substring(0, 3);
						phoneNumber = digitsOnly.substring(3);
					} else if (digitsOnly.length >= 12) {
						// Likely a 2-digit country code
						extension = digitsOnly.substring(0, 2);
						phoneNumber = digitsOnly.substring(2);
					} else {
						// Likely a 1-digit country code
						extension = digitsOnly.substring(0, 1);
						phoneNumber = digitsOnly.substring(1);
					}
				} else {
					// Short number with +, treat first digit as country code
					extension = digitsOnly.substring(0, 1);
					phoneNumber = digitsOnly.substring(1);
				}
			} else if (digitsOnly.length > 10) {
				// No + but more than 10 digits, try to detect country code
				// Check if it starts with a known country code
				let found = false;
				for (let len = 3; len >= 1; len--) {
					const potentialCode = digitsOnly.substring(0, len);
					if (countryCodeInfo[potentialCode]) {
						extension = potentialCode;
						phoneNumber = digitsOnly.substring(len);
						found = true;
						break;
					}
				}

				// If no known country code found, use the old logic
				// (everything before the last 10 digits is the extension)
				if (!found) {
					extension = digitsOnly.substring(0, digitsOnly.length - 10);
					phoneNumber = digitsOnly.substring(extension.length);
				}
			}
		}

		// If no extension was detected and default is provided, use it
		// Only use default extension if it's explicitly provided and non-empty
		// Also check for "undefined" and "null" strings which might come from test frameworks
		if (extension === "" &&
		    typeof _defaultExtension === 'string' &&
		    _defaultExtension !== "" &&
		    _defaultExtension !== "undefined" &&
		    _defaultExtension !== "null") {
			extension = _defaultExtension;
		}

		// Return the result
		return {
			"phone": phoneNumber,
			"extension": extension
		};
	}
}

module.exports = {
	StringUtils
};

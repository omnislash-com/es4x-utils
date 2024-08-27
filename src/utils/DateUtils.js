const { ObjUtils } = require("./ObjUtils");
const { ArrayUtils } = require("./ArrayUtils");
const { MathUtils } = require("./MathUtils");
const { StringUtils } = require("./StringUtils");
const { intarystrtohex } = require("jsrsasign");

class	DateUtils
{
	static	get	PERIOD_MONTH()			{ return "month"; }	


	/**
	 * @param {number} _dateSince2000: number of days since 01/01/2000
	 */
	static	DayToDate(_dateSince2000)
	{
		// get the timestamp
		let	timestamp = DateUtils.DayToTimestamp(_dateSince2000);

		// convert to date
		return new Date(timestamp * 1000);
	}

	static	DayToTimestamp(_dateSince2000)
	{
		// create the timestamp from Jan 1st 2000
		let	timestamp = Date.UTC(2000, 0, 1, 0, 0, 0, 0) / 1000;

		// add the days
		timestamp += _dateSince2000 * 24*60*60;

		return timestamp;
	}


	/**
	 * @param {number} _dateSince2000: number of days since 01/01/2000
	 */
	static	DayToDateStr(_dateSince2000)
	{	
		let	date = DateUtils.DayToDate(_dateSince2000);
		return date.toISOString();
	}

	/**
	 * @param {number} _dateSince2000: number of days since 01/01/2000
	 */
	static	FormatDayNumber(_dateSince2000)
	{
		let	date = DateUtils.DayToDate(_dateSince2000);

		let month = date.getUTCMonth() + 1;
		let day = date.getUTCDate();
		return month.toString() + "/" + day.toString();
	}	 

	static	TimestampToDateStr(_timestamp, _sep = "-")
	{
		let	date = new Date(_timestamp * 1000);
		return DateUtils.DateToDateStr(date, _sep);
	}

	static	TimestampToTimeStr(_timestamp, _addSeconds = true, _sep = ":")
	{
		let	date = new Date(_timestamp * 1000);
		return DateUtils.DateToTimeStr(date, _addSeconds, _sep);
	}	

	static	TimestampToDateTimeStr(_timestamp, _addSeconds = true, _dateSep = "-", _dateTimeSep = " ", _timeSep = ":")
	{
		let	date = new Date(_timestamp * 1000);
		return DateUtils.DateToDateTimeStr(date, _addSeconds, _dateSep, _dateTimeSep, _timeSep);
	}	

	static	NowToUniqString()
	{
		let	date = new Date();
		let	dateStr = DateUtils.DateToDateStr(date, "") + "_" + DateUtils.DateToTimeStr(date, true, "", true) + "000";

		return dateStr;
	}

	static	DateToDateStr(_date, _sep = "-")
	{
		let	mm = _date.getUTCMonth() + 1; // getMonth() is zero-based
  		let	dd = _date.getUTCDate();

		return [_date.getUTCFullYear(),
				(mm>9 ? '' : '0') + mm,
				(dd>9 ? '' : '0') + dd
				].join(_sep);		
	}

	static	DateToTimeStr(_date, _addSeconds = true, _sep = ":", _addMSec = false)
	{
		let	hh = _date.getUTCHours();
  		let	mm = _date.getUTCMinutes();

		let	values = [
			(hh>9 ? '' : '0') + hh,
			(mm>9 ? '' : '0') + mm
		]

		if (_addSeconds == true)
		{
			let	ss = _date.getUTCSeconds();
			values.push((ss>9 ? '' : '0') + ss);
		}

		if (_addMSec == true)
		{
			let	mSec = _date.getUTCMilliseconds();
			let	mSecStr = mSec.toString().padStart(3, '0');
			values.push(mSecStr);
		}

		return values.join(_sep);
	}

	static	DateToDateTimeStr(_date, _addSeconds = true, _dateSep = "-", _dateTimeSep = " ", _timeSep = ":")
	{
		return DateUtils.DateToDateStr(_date, _dateSep) + _dateTimeSep + DateUtils.DateToTimeStr(_date, _addSeconds, _timeSep);
	}	

	static	DateToZuluStr(_date, _addMSec = true, _dateSep = "-", _dateTimeSep = "T", _timeSep = ":")
	{
		let	str = DateUtils.DateToDateTimeStr(_date, true, _dateSep, _dateTimeSep, _timeSep);

		// add the milliseconds
		if (_addMSec == true)
			str += "." + _date.getUTCMilliseconds();

		// add timezone
		str += "Z";

		return str;
	}

	static	NowToString()
	{
		return new Date(Date.now()).toISOString();
	}

	static	GetTimestampToString()
	{
		return Date.now().toString();
	}

	static	FormatDurationFromSec(_sec, _round = false, _full = false, _addSeconds = true)
	{
		// are we just doing the round?
		if (_round == true)
		{
			let	units = {
				"year": 31536000,
				"month": 2592000,
				"week": 604800,
				"day": 86400,
				"hour": 3600,
				"min": 60,
				"sec": 1
			};

			for(const currentUnit in units)
			{
				// is it the right unit?
				if (_sec >= units[currentUnit])
				{
					// calculate the value
					let	value = _sec / units[currentUnit];

					// if the unit is the minutes, we just round
					if (currentUnit == "min")
						value = Math.round(value);

					// return it
					return DateUtils.FormatTime(value, currentUnit, _full)
				}
			}

			return "n/a";
		}
		else
		{
			// list of units to test
			let	units = {
				"sec": 60,
				"min": 60,
				"hour": 24,
				"day": 30,
				"month": 12
			};

			let	currentValue = _sec;
			let	allValues = [];
			for(const currentUnit in units)
			{
				// calculate the remaining
				let	remaining = currentValue % units[currentUnit];

				// update the new value remaining after it
				currentValue = (currentValue - remaining) / units[currentUnit];

				// if we have something, we add it to our values
				let	addIt = false;
				if (remaining > 0)
				{
					// is it seconds?
					if (currentUnit == "sec")
					{
						// we add it if it specifically asked or if we don't have anything else
						if ( (_addSeconds == true) || (currentValue == 0) )
							addIt = true;
					}
					else
						addIt = true;
				}
				if (addIt == true)
					allValues.push(DateUtils.FormatTime(remaining, currentUnit, _full));

				// are we done?
				if (currentValue == 0)
					break;
			}

			// year?
			if (currentValue > 0)
				allValues.push(DateUtils.FormatTime(currentValue, "year", _full));

			// reverse the array
			allValues = allValues.reverse();

			// join with space
			return allValues.join(" ");
		}
	}
	
	static	FormatTime(_value, _type, _full = false)
	{
		// COPY FROM: https://docs.google.com/spreadsheets/d/1oYCIXY4_N_2uyhd7aUCa1YbgApL41bGqKoftkTSLWws/edit?pli=1#gid=287680498
		let	extensions = {
			"sec": { "abbr": { "single": "s", "multiple": "s" }, "full": { "single": "second", "multiple": "seconds" } },
			"min": { "abbr": { "single": "m", "multiple": "m" }, "full": { "single": "minute", "multiple": "minutes" } },
			"hour": { "abbr": { "single": "h", "multiple": "h" }, "full": { "single": "hour", "multiple": "hours" } },
			"day": { "abbr": { "single": "d", "multiple": "d" }, "full": { "single": "day", "multiple": "days" } },
			"week": { "abbr": { "single": "wk", "multiple": "wk" }, "full": { "single": "week", "multiple": "weeks" } },
			"month": { "abbr": { "single": "mo", "multiple": "mo" }, "full": { "single": "month", "multiple": "months" } },
			"year": { "abbr": { "single": "yr", "multiple": "yr" }, "full": { "single": "year", "multiple": "years" } },
		};

		// round the value
		_value = MathUtils.Round(_value, 1);

		// build the path
		let	path = _type;
		
		// abbreviation or full?
		if (_full == true)
		 	path += ".full.";
		else
			path += ".abbr.";

		// single or plural?
		if (_value > 1)
			path += "multiple";
		else
		 	path += "single";
		
		// make it as a string
		let	formattedValue = _value.toString();

		// get the extension
		let	extensionFound = ObjUtils.GetValue(extensions, path, "");
		if (extensionFound != "")
		{
			// add a space if full
			if ( _full == true)
				formattedValue += " ";

			// add the extension
			formattedValue += extensionFound;
		}

		return formattedValue;
	}

	static	DateStrHasTimezone(_dateStr)
	{
		// ends with Z?
		if (_dateStr.endsWith("Z") == true)
			return true;

		// do we have a T?
		if (_dateStr.includes("T") == true)
		{
			// split with T
			let	chunks = _dateStr.split("T");
			if (chunks[chunks.length-1].includes("-") == true)
				return true;
			if (chunks[chunks.length-1].includes("+") == true)
				return true;
		}

		return false;		
	}

	static	IsDate(_dateStr)
	{
		if (typeof _dateStr === 'string' || _dateStr instanceof String)
		{
			// empty?
			if (_dateStr == "")
				return false;

			// basic number?
			let	numberValue = Number(_dateStr);
			if (isNaN(numberValue) == false)
				return false;

			// ok now we're going to try to parse it
			let	date = new Date(_dateStr);
			if (date === "Invalid Date")
				return false;
			if (isNaN(date) == true)
				return false;

			// check regex
			var ISOregex = /^(?:\d{4})-(?:\d{2})-(?:\d{2})T(?:\d{2}):(?:\d{2}):(?:\d{2}(?:\.\d*)?)(?:(?:-(?:\d{2}):(?:\d{2})|Z)?)$/;
			if (ISOregex.test(_dateStr) == false)
				return false;
				
			return true;
		}
		else
		{
			return false;
		}
	}

	static	ParseToTimestamp(_dateStr)
	{
		if (typeof _dateStr === 'string' || _dateStr instanceof String)
		{
			_dateStr = DateUtils.EnsureDateStrHasTimezone(_dateStr);

			try
			{
				return Date.parse(_dateStr)/1000;
			}
			catch
			{
				return 0;
			}
		}
		else
			return 0;
	}

	static	EnsureDateStrHasTimezone(_dateStr)
	{
		if (typeof _dateStr === 'string' || _dateStr instanceof String)
		{
			if (DateUtils.DateStrHasTimezone(_dateStr) == false)
				_dateStr += "Z";
		}
		return _dateStr;
	}

	static	ParseToDate(_dateStr)
	{
		let	timestamp = DateUtils.ParseToTimestamp(_dateStr);
		return new Date(timestamp * 1000);
	}

	static	IsLeapYear(_year)
	{
		return (((_year % 4 === 0) && (_year % 100 !== 0)) || (_year % 400 === 0));
	}

	static	GetDaysInMonth(_year, _month)
	{
		return [31, (DateUtils.IsLeapYear(_year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][_month];
	}

	static	DateStrToMonthYearString(_dateStr)
	{
		// parse it
		let	date = DateUtils.ParseToDate(_dateStr);

		// get the month
		let	monthStr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date.getUTCMonth()];

		// get the year
		let	yearStr = date.getUTCFullYear().toString();

		return monthStr + " " + yearStr;
	}

	static	AddMonth(_dateStr, _increment = 1, _returnStr = true, _keepHours = true)
	{
		// parse the date
		let	date = DateUtils.ParseToDate(_dateStr);

		// save the current hour and minutes
		let	hours = date.getUTCHours();
		let	minutes = date.getUTCMinutes();

		// save the current day then reset the day
		let	n = date.getUTCDate();
		date.setUTCDate(1);

		// add month
		date.setUTCMonth(date.getUTCMonth() + _increment);

		// make sure we have a valid date
		date.setUTCDate(Math.min(n, DateUtils.GetDaysInMonth(date.getUTCFullYear(), date.getUTCMonth())));

		// keep the hours?
		if (_keepHours == true)
		{
			date.setUTCHours(hours);
			date.setUTCMinutes(minutes);
		}

		if (_returnStr == true)
			return DateUtils.DateToZuluStr(date);
		else
			return date;
	}

	static	AddPeriod(_dateStr, _period, _increment = 1, _returnStr = true, _keepHours = true)
	{
		// How many months to add?
		let	nbMonths = 0;

		// - month
		if (_period == DateUtils.PERIOD_MONTH)
			nbMonths = _increment;

		return DateUtils.AddMonth(_dateStr, nbMonths, _returnStr, _keepHours);
	}

	static	AddTimezoneToTimestamp(_ts, _timezone)
	{
		// 0?
		if (_timezone == 0)
			return _ts;

		// is it a number of hours?
		if ( (_timezone >= -12 ) && (_timezone <= 12 ) )
			return _ts + _timezone * 60 * 60;
		// minutes?
		else
			return _ts + _timezone * 60;
	}

	static	UTCStringToLocalTimestamp(_utcStr, _timezone=0)
	{
		// get the timestamp from the date
		let	timestamp = DateUtils.ParseToTimestamp(_utcStr);

		// add the time from the timezone
		timestamp = DateUtils.AddTimezoneToTimestamp(timestamp, _timezone);

		// return
		return timestamp;
	}

	static	NowToLocalTimestamp(_timezone=0)
	{
		// get the now timestamp
		let	timestamp = new Date().getTime() / 1000;

		// add the time from the timezone
		timestamp = DateUtils.AddTimezoneToTimestamp(timestamp, _timezone);

		// return
		return timestamp;
	}

	static	TimestampToDayNumber(_timestamp)
	{
		// calculate the difference between that timestamp and Jan 1 2000 (946684800)
		let	timestampDiff = _timestamp - 946684800;
		if (timestampDiff < 0)
			return 0;

		// count how many days (86400 sec in a day)
		let	nbDays = Math.floor(timestampDiff / 86400);

		return parseInt(nbDays);
	}

	static	UTCStringToLocalDayNumber(_utcStr, _timezone=0)
	{
		// get the timestamp
		let	ts = DateUtils.UTCStringToLocalTimestamp(_utcStr, _timezone);

		// return the day number
		return DateUtils.TimestampToDayNumber(ts);
	}

	static	NowToLocalDayNumber(_timezone=0)
	{
		// get the timestamp
		let	ts = DateUtils.NowToLocalTimestamp(_timezone);

		// return the day number
		return DateUtils.TimestampToDayNumber(ts);
	}

	static	NowToLocalDayNumberAndTime(_timezone=0)
	{
		// get the timestamp
		let	ts = DateUtils.NowToLocalTimestamp(_timezone);

		// get the day number
		let	day = DateUtils.TimestampToDayNumber(ts);

		// calculate the hours / minutes
		let	date = new Date(ts*1000);
		let	time = date.getHours() * 100 + date.getMinutes();

		return {
			day: day,
			time: time
		};
	}

	static	YearMonthToDayNumber(_yearMonth, _sep = "-")
	{
		// split it
		let	[year, month] = _yearMonth.split(_sep);

		// create the timestamp for it
		let timestampMonth = Date.UTC(year, month-1, 1, 0, 0, 0, 0) / 1000;

		return DateUtils.TimestampToDayNumber(timestampMonth);
	}

	static	AddToYearMonth(_yearMonth, _add = 1, _sep = "-")
	{
		// split it
		let	[year, month] = _yearMonth.split(_sep);

		// create a new date
		let	date = new Date(Date.UTC(year, month-1+_add, 1, 0, 0, 0));

		// export it
		let	mm = date.getUTCMonth() + 1; // getMonth() is zero-based

		return [date.getUTCFullYear(),
				(mm>9 ? '' : '0') + mm
				].join(_sep);
	}

	static	DayNumberToYearMonth(_dayNumber, _sep = "-")
	{
		// convert the day number to a date
		let	date = DateUtils.DayToDate(_dayNumber);

		let	mm = date.getUTCMonth() + 1; // getMonth() is zero-based
		return [date.getUTCFullYear(),
				(mm>9 ? '' : '0') + mm
				].join(_sep);
	}

	static	DayNumberToDayOfTheWeek(_dayNumber)
	{
		// convert the day number to a date
		let	date = DateUtils.DayToDate(_dayNumber);

		// return the day of the week
		return DateUtils.DateToDayOfTheWeek(date);
	}

	static	DateToDayOfTheWeek(_date, _abbr = false)
	{
		// array with list of days
		let	days = _abbr ? [
			"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
		] : [
			"sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
		];

		// return it
		return days[_date.getUTCDay()];		
	}

	static	DateToMonth(_date, _abbr = false)
	{
		// array with list of days
		let	days = _abbr ? [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		] : [
			"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
		];

		// return it
		return days[_date.getUTCMonth()];		
	}

	static	GetClosestMondayToDayNumber(_dayNumber)
	{
		// get the day of the week
		let	dayOfTheWeek = DateUtils.DayNumberToDayOfTheWeek(_dayNumber);

		// find the difference to return
		let	differences = {
			"friday": 3,
			"saturday": 2,
			"sunday": 1,
			"monday": 0,
			"tuesday": -1,
			"wednesday": -2,
			"thursday": -3,
		};

		let	differenceToUser = differences.hasOwnProperty(dayOfTheWeek) ? differences[dayOfTheWeek] : 0;

		return _dayNumber + differenceToUser;
	}

	static	GetCurrentWeekDayNumber()
	{
		// get NOW to day number
		let	nowDayNumber = DateUtils.NowToLocalDayNumber();

		// get the closest monday
		let	closestMondayDayNumber = DateUtils.GetClosestMondayToDayNumber(nowDayNumber);

		// is it in the future?
		if (closestMondayDayNumber > nowDayNumber)
			closestMondayDayNumber -= 7;

		return closestMondayDayNumber;
	}

	static	GetPreviousWeekDayNumber()
	{
		// get the current week day number
		let	currentWeekDayNumber = DateUtils.GetCurrentWeekDayNumber();

		// substract 7
		return currentWeekDayNumber - 7;
	}

	static	GetPreviousWeekInterval()
	{
		// get last week day number
		let	lastWeek = DateUtils.GetPreviousWeekDayNumber();

		// create the timestamp for the start
		let	timestampStart = DateUtils.DayToTimestamp(lastWeek);

		// calculate the end of the week
		let	timestampEnd = DateUtils.DayToTimestamp(lastWeek + 7) - 1;

		// return it
		return {
			day_number: lastWeek,
			timestamp_start: timestampStart,
			timestamp_end: timestampEnd,
		};
	}

	static	GetStartAndEndDates(_startDateStr, _durationSec)
	{
		// get the timestamp from the date
		let	timestampStart = DateUtils.ParseToTimestamp(_startDateStr);

		// add the duration to get the end
		let	timestampEnd = timestampStart + _durationSec;

		// export both dates
		return {
			"start": DateUtils.TimestampToDateTimeStr(timestampStart, true, "-", "T", ":"),
			"end": DateUtils.TimestampToDateTimeStr(timestampEnd, true, "-", "T", ":"),
		};
	}

	static	NowToZulu(_deltaSec = 0)
	{
		// get the now timestamp in msec
		let	timestamp = new Date().getTime();

		// add the delta seconds
		timestamp += parseInt(_deltaSec * 1000);

		// convert to zulu
		return DateUtils.TimestampToZulu(timestamp);
	}

	static	TimestampToZulu(_timestamp)
	{
		// create the date from the time stamp
		let	newDate = new Date(_timestamp);

		// format the output
		return DateUtils.DateToZuluStr(newDate);		
	}

	static	Hours(_dateStr)
	{
		// parse the date
		let	date = DateUtils.ParseToDate(_dateStr);

		return date.getUTCHours();
	}

	static	CreateTimer(_title)
	{
		return [
			{
				"description": _title,
				"time": DateUtils.Time(),
				"dt_from_start": 0,
				"dt": 0
			}
		];
	}

	static	AddTimer(_timers, _title)
	{
		// nothing in the array?
		if (ArrayUtils.IsEmpty(_timers) == true)
			return DateUtils.CreateTimer(_title);

		// add a new timer in the array
		_timers.push({
			"description": _title,
			"time": DateUtils.Time(),
			"dt_from_start": DateUtils.TimeDT(_timers[0].time),
			"dt": DateUtils.TimeDT(_timers[_timers.length-1].time)
		});

		return _timers;
	}

	static	Time()
	{
		return Date.now();
	}

	static	TimeDT(_time)
	{
		return (Date.now() - _time) / 1000;
	}

	static	TimeDTFromString(_str)
	{
		let	ts = DateUtils.ParseToTimestamp(_str) * 1000;
		return DateUtils.TimeDT(ts);
	}

	static	async	Sleep(_timeSeconds)
	{
		await new Promise(r => setTimeout(r, _timeSeconds * 1000));
	}

	static	ParseDayToOffsetDateTime(_str)
	{
		const	DateTimeFormatter = Java.type('java.time.format.DateTimeFormatter');
		const	OffsetDateTime = Java.type('java.time.OffsetDateTime');

		return OffsetDateTime.parse(_str + "T00:00:00+00:00", DateTimeFormatter.ISO_DATE_TIME);
	}
	
	static	ParseDateToOffsetDateTime(_str)
	{
		const	DateTimeFormatter = Java.type('java.time.format.DateTimeFormatter');
		const	OffsetDateTime = Java.type('java.time.OffsetDateTime');

		try
		{
			return OffsetDateTime.parse(_str, DateTimeFormatter.ISO_DATE_TIME);
		}
		catch
		{
			if (_str.includes("+") == false)
				_str += "+00:00";
			
			return DateUtils.ParseDateToOffsetDateTime(_str);
		}
	}	

	static	GetTimezoneOffset(_id, _timestamp = 0)
	{
		const	TimeZone = Java.type('java.util.TimeZone');
		const	Date = Java.type('java.util.Date');

		try
		{
			// If we don't have a timestamp we get right now?
			if (_timestamp <= 0)
				_timestamp = new Date().getTime();

			let	tz = TimeZone.getTimeZone(_id);
			return tz.getOffset(_timestamp) / 1000 / 60;
		}
		catch
		{
			return 0;
		}
	}

	static	FormatAmPm(_hours, _minutes)
	{
		var ampm = _hours >= 12 ? 'pm' : 'am';
		_hours = _hours % 12;
		_hours = _hours ? _hours : 12; // the hour '0' should be '12'
		_minutes = _minutes < 10 ? '0'+_minutes : _minutes;
		return _hours + ':' + _minutes + ampm;
	}

	static	FormatDayTimeTZ(_day, _time, _tz)
	{
		// Wed Jul 31, 2024 6:30pm (GMT+2)
		// get the timestamp for the day
		let	timestamp = DateUtils.DayToTimestamp(_day);

		// convert it to a date
		let	date = new Date(timestamp * 1000);

		// build the string
		let	str = "";

		// - day of the week abbreviation
		str += DateUtils.DateToDayOfTheWeek(date, true) + " ";

		// - month abbreviation
		str += DateUtils.DateToMonth(date, true) + " ";

		// - day number
		str += date.getUTCDate() + ", ";

		// - year
		str += date.getUTCFullYear() + " ";

		// extract the hours and minutes
		let	hours = Math.floor(_time / 100);
		let	minutes = _time - hours*100;

		// - time
		str += DateUtils.FormatAmPm(hours, minutes);

		// - timezone
		if (StringUtils.IsEmpty(_tz) == false)
		{
			str += " (GMT";
			let	offset = DateUtils.GetTimezoneOffset(_tz, timestamp * 1000);
			if (offset != 0)
			{
				// add the + or -
				str += offset < 0 ? "-" : "+";

				// format the time
				offset = Math.abs(offset);
				let	offsetHours = Math.floor(offset / 60);
				let	offsetMinutes = offset - offsetHours * 60;
				str += offsetHours;
				if (offsetMinutes > 0)
					str += ":" + offsetMinutes;
			}
			str += ")";
		}

		return str;
	}
}

module.exports = {
	DateUtils
};

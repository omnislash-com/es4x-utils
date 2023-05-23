
class	JavaUtils
{
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
			
			return JavaUtils.ParseDateToOffsetDateTime(_str);
		}
	}

	static	GetTimezoneOffset(_id)
	{
		const	TimeZone = Java.type('java.util.TimeZone');
		const	Date = Java.type('java.util.Date');

		try
		{
			let	tz = TimeZone.getTimeZone(_id);
			return tz.getOffset(new Date().getTime()) / 1000 / 60;
		}
		catch
		{
			return 0;
		}
	}

}

module.exports = {
	JavaUtils
};

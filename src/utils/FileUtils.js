import { ObjUtils } from './ObjUtils';
import { StringUtils } from './StringUtils';


class	FileUtils
{
	static	async	ReadFileToString(_vertx, _filePath)
	{
		// empty file?
		if (StringUtils.IsEmpty(_filePath) == true)
			return "";

		let	htmlFileOk = await _vertx.fileSystem().exists(_filePath);
		if (htmlFileOk == true)
		{
			// read the content
			let	buffer = await _vertx.fileSystem().readFile(_filePath);

			// extract the content
			if (buffer != null)
				return buffer.toString();
			else
			{
				ObjUtils.LogError("Error reading file at '" + _filePath + "'");
				return "";
			}
		}
		else
		{
			ObjUtils.LogError("File '" + _filePath + "' doesn't exist");
			return "";
		}
	}	
}

module.exports = {
	FileUtils
};
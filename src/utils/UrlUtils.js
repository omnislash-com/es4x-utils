const { CoreUtils } = require("../utils/CoreUtils");
const { ObjUtils } = require("./ObjUtils");
const { StringUtils } = require("./StringUtils");

const	parse = require('url-parse');

class	UrlUtils
{

	static	ExtractQueryParameters(_url, _parameters, _default = "", _returnOnlyIfExist = false)
	{
		// init the parameter values
		let	values = {};

		// do we need to return all?
		if (_returnOnlyIfExist == false)
		{
			for(let key of _parameters)
				values[key] = _default;
		}

		// is the url good?
		if (StringUtils.IsEmpty(_url) == false)
		{
			// create the URL
			let	currentUrl = parse(_url, true);

			// do we have the query?
			if (CoreUtils.IsObject(currentUrl.query) == true)
			{
				for(let key of _parameters)
				{
					if (currentUrl.query.hasOwnProperty(key) == true)
						values[key] = currentUrl.query[key];
				}
			}
		}

		return values;
	}

	static	ExtractUTMs(_url, _default = "", _returnOnlyIfExist = false)
	{
		let	utms = [
			"utm_id",
			"utm_source",
			"utm_medium",
			"utm_campaign",
			"utm_term",
			"utm_content",
		];
		return UrlUtils.ExtractQueryParameters(_url, utms, _default, _returnOnlyIfExist);
	}

	static	ExtractReferrerInfo(_url)
	{
		// prepare the info
		let	info = {
			"domain": "",
			"is_search": false,
			"keywords": []
		};

		// do we have something?
		if (StringUtils.IsEmpty(_url) == false)
		{
			// create the URL
			let	currentUrl = parse(_url, true);

			// get the domain
			if (StringUtils.IsEmpty(currentUrl.hostname) == false)
			{
				// is it a search?
				let	searchInfo = UrlUtils.ExtractSearchInfo(currentUrl.hostname, currentUrl.query);
				if (searchInfo != null)
				{
					info.domain = searchInfo.domain.toLowerCase();
					info.is_search = true;
					info.keywords = searchInfo.keywords;
				}
				else
				{
					info.domain = currentUrl.hostname.toLowerCase();
				}
			}
		}

		return info;		
	}

	static	ExtractSearchKeywords(_url)
	{
		// do we have something?
		if (StringUtils.IsEmpty(_url) == false)
		{
			// create the URL
			let	currentUrl = parse(_url, true);

			// get the domain
			if (StringUtils.IsEmpty(currentUrl.hostname) == false)
			{
				// detect if it's a search engine
				let	searchInfo = UrlUtils.ExtractSearchInfo(currentUrl.hostname, currentUrl.query);
				if (searchInfo != null)
					return searchInfo.keywords;
			}
		}

		return [];
	}

	static	ExtractSearchInfo(_domain, _queryParams)
	{
		// is the domain a search domain?
		let	searchEngineInfo = UrlUtils.GetSearchEngineInfo(_domain);

		// do we have it?
		if (searchEngineInfo != null)
		{
			// now we get the search value
			let	searchValue = ObjUtils.GetValue(_queryParams, searchEngineInfo.q, "");

			// do we have it?
			if (StringUtils.IsEmpty(searchValue) == false)
			{
				// extract the words
				let	keywords = StringUtils.Split(searchValue, " ", false, true);

				// do we have keywords?
				if (keywords.length > 0)
				{
					return {
						"domain": searchEngineInfo.domain,
						"name": searchEngineInfo.name,
						"keywords": keywords
					};
				}
			}
		}

		return null;
	}

	static	GetSearchEngineInfo(_domain)
	{
		if (StringUtils.IsEmpty(_domain) == true)
			return null;

		// source: https://gist.github.com/daseme/3036735
		const	searchEngines = {

			'answers.yahoo.com'     : { 'name': 'Yahoo Answers', 'q':'p' },
		
			'sapo.pt'                : { 'name': 'Pesquisa SAPO', 'q': 'q'},
			'iol.pt'                 : { 'name': 'Pesquisa Iol',  'q': 'q'},
			'pesquisa.clix.pt'       : { 'name': 'Pesquisa Clix', 'q': 'question'},
			'aeiou.pt'               : { 'name': 'Aeiou',         'q': 'q'},
			'cuil.pt'                : { 'name': 'Cuil PT',       'q': 'q' },
		
		
			'fotos.sapo.pt'          : { 'name': 'SAPO fotos',    'q': 'word'},
			'videos.sapo.pt'         : { 'name': 'SAPO videos',   'q': 'word'},
			'sabores.sapo.pt'        : { 'name': 'SAPO sabores',  'q': 'cxSearch'},
			'jn.sapo.pt'             : { 'name': 'Jornal Noticias', 'q': 'Pesquisa'},
			'dn.sapo.pt'             : { 'name': 'Diario Noticias', 'q': 'Pesquisa'},
		
		
			'rtp.pt'                 : { 'name': 'Rtp',           'q': 'search'},
			'record.pt'              : { 'name': 'Jornal Record', 'q': 'q'},
			'correiodamanha.pt'      : { 'name': 'Correio da Manha',        'q': 'pesquisa'},
			'correiomanha.pt'        : { 'name': 'Correio Manha',        'q': 'pesquisa'},
			'publico.clix.pt'        : { 'name': 'Publico',       'q': 'q'},
			'xl.pt'                  : { 'name': 'XL',            'q': 'pesquisa'},
		
			'abacho.com'             : { 'name': 'Abacho',        'q': 'q'},
			'alice.it'               : { 'name': 'Alice.it',      'q': 'qs' },
			'altavista.com'          : { 'name': 'Altavista',     'q': 'q' },
			'aolsearch.aol.com'      : { 'name': 'AOL Search',    'q': 'query' },
			'as.starware.com'        : { 'name': 'Starware',      'q': 'qry' },
			'blogs.icerocket.com'    : { 'name': 'IceRocket',     'q': 'q' },
			 //now google.com/blogsearch, but referer doesnt inc blogsearch but rather parameter gs_l=blog
			'blogsearch.google.com'  : { 'name': 'Google Blogsearch', 'q': 'q' },
			'busca.orange.es'        : { 'name': 'Orange ES',     'q': 'buscar' },
			'buscador.lycos.es'      : { 'name': 'Lycos ES',      'q': 'query' },
			'buscador.terra.es'      : { 'name': 'Terra ES',      'q': 'query' },
			'buscar.ozu.es'          : { 'name': 'Ozu ES',        'q': 'q' },
			'categorico.it'          : { 'name': 'Categorico IT', 'q': 'q' },
			'cuil.com'               : { 'name': 'Cuil',          'q': 'q' },
			'clusty.com'             : { 'name': 'Clusty',        'q': 'query' },
			'excite.com'             : { 'name': 'Excite',        'q': 'q' },
			'excite.it'              : { 'name': 'Excite IT',     'q': 'q' },
			'fastweb.it'             : { 'name': 'Fastweb IT',    'q': 'q' },
			'fastbrowsersearch.com'  : { 'name': 'Fastbrowsersearch', 'q': 'q' },
			'godado.com'             : { 'name': 'Godado',        'q': 'key' },
			'godado.it'              : { 'name': 'Godado (IT)',   'q': 'key' },
			'gps.virgin.net'         : { 'name': 'Virgin Search', 'q': 'q' },
			'ilmotore.com'           : { 'name': 'ilMotore',      'q': 'query' },
			'ithaki.net'             : { 'name': 'Ithaki',        'q': 'query' },
			'kataweb.it'             : { 'name': 'Kataweb IT',    'q': 'q' },
			'libero.it'              : { 'name': 'Libero IT',     'q': 'query' },
			'lycos.it'               : { 'name': 'Lycos IT',      'q': 'query' },
			'search.aol.co.uk'       : { 'name': 'AOL UK',        'q': 'q' },//query->q (5/20/12)
			'search.arabia.msn.com'  : { 'name': 'MSN Arabia',    'q': 'q' },
			'search.bbc.co.uk'       : { 'name': 'BBC Search',    'q': 'q' },
			'search.conduit.com'     : { 'name': 'Conduit',       'q': 'q' },
			'search.icq.com'         : { 'name': 'ICQ dot com',   'q': 'q' },
			'search.live.com'        : { 'name': 'Live.com',      'q': 'q' },
			'search.lycos.co.uk'     : { 'name': 'Lycos UK',      'q': 'query' },
			'search.lycos.com'       : { 'name': 'Lycos',         'q': 'query' },
			'search.msn.co.uk'       : { 'name': 'MSN UK',        'q': 'q' },
			'search.msn.com'         : { 'name': 'MSN',           'q': 'q' },
			'search.myway.com'       : { 'name': 'MyWay',         'q': 'searchfor' },
			'search.mywebsearch.com' : { 'name': 'My Web Search', 'q': 'searchfor' },
			'search.ntlworld.com'    : { 'name': 'NTLWorld',      'q': 'q' },
			'search.orange.co.uk'    : { 'name': 'Orange Search', 'q': 'q' },
			'search.prodigy.msn.com' : { 'name': 'MSN Prodigy',   'q': 'q' },
			'search.sweetim.com'     : { 'name': 'Sweetim',       'q': 'q' },
			'search.virginmedia.com' : { 'name': 'VirginMedia',   'q': 'q' },
			'search.yahoo.co.jp'     : { 'name': 'Yahoo Japan',   'q': 'p' },
			'search.yahoo.com'       : { 'name': 'Yahoo!',        'q': 'p' },
			'search.yahoo.jp'        : { 'name': 'Yahoo! Japan',  'q': 'p' },
			'simpatico.ws'           : { 'name': 'Simpatico IT',  'q': 'query' },
			'soso.com'               : { 'name': 'Soso',          'q': 'w' },
			'suche.fireball.de'      : { 'name': 'Fireball DE',   'q': 'query' },
			'suche.web.de'           : { 'name': 'Suche DE',      'q': 'su' },
			'suche.t-online.de'      : { 'name': 'T-Online',      'q': 'q' },
			'thespider.it'           : { 'name': 'TheSpider IT',  'q': 'q' },
			'uk.altavista.com'       : { 'name': 'Altavista UK',  'q': 'q' },
			'uk.ask.com'             : { 'name': 'Ask UK',        'q': 'q' },
			'uk.search.yahoo.com'    : { 'name': 'Yahoo! UK',     'q': 'p' },
			'alltheweb.com'          : { 'name': 'AllTheWeb',     'q': 'q' },
			'ask.com'                : { 'name': 'Ask dot com',   'q': 'q' },
			'blueyonder.co.uk'       : { 'name': 'Blueyonder',    'q': 'q' },
			'feedster.com'           : { 'name': 'Feedster',      'q': 'q' },
			'google.ad'              : { 'name': 'Google Andorra','q': 'q' },
			'google.ae'              : { 'name': 'Google United Arab Emirates', 'q': 'q' },
			'google.af'              : { 'name': 'Google Afghanistan',          'q': 'q' },
			'google.ag'              : { 'name': 'Google Antiqua and Barbuda',  'q': 'q' },
			'google.am'              : { 'name': 'Google Armenia',              'q': 'q' },
			'google.as'              : { 'name': 'Google American Samoa',       'q': 'q' },
			'google.at'              : { 'name': 'Google Austria',    'q': 'q' },
			'google.az'              : { 'name': 'Google Azerbaijan', 'q': 'q' },
			'google.ba'              : { 'name': 'Google Bosnia and Herzegovina', 'q': 'q' },
			'google.be'              : { 'name': 'Google Belgium', 'q': 'q' },
			'google.bg'              : { 'name': 'Google Bulgaria','q': 'q' },
			'google.bi'              : { 'name': 'Google Burundi', 'q': 'q' },
			'google.biz'             : { 'name': 'Google dot biz', 'q': 'q' },
			'google.bo'              : { 'name': 'Google Bolivia', 'q': 'q' },
			'google.bs'              : { 'name': 'Google Bahamas', 'q': 'q' },
			'google.bz'              : { 'name': 'Google Belize',  'q': 'q' },
			'google.ca'              : { 'name': 'Google Canada',  'q': 'q' },
			'google.cc'              : { 'name': 'Google Cocos Islands',    'q': 'q' },
			'google.cd'              : { 'name': 'Google Dem Rep of Congo', 'q': 'q' },
			'google.cg'              : { 'name': 'Google Rep of Congo',     'q': 'q' },
			'google.ch'              : { 'name': 'Google Switzerland',      'q': 'q' },
			'google.ci'              : { 'name': 'Google Cote dIvoire',     'q': 'q' },
			'google.cl'              : { 'name': 'Google Chile',    'q': 'q' },
			'google.cn'              : { 'name': 'Google China',    'q': 'q' },
			'google.co.at'           : { 'name': 'Google Austria',  'q': 'q' },
			'google.co.bi'           : { 'name': 'Google Burundi',  'q': 'q' },
			'google.co.bw'           : { 'name': 'Google Botswana', 'q': 'q' },
			'google.co.ci'           : { 'name': 'Google Ivory Coast',  'q': 'q' },
			'google.co.ck'           : { 'name': 'Google Cook Islands', 'q': 'q' },
			'google.co.cr'           : { 'name': 'Google Costa Rica',   'q': 'q' },
			'google.co.gg'           : { 'name': 'Google Guernsey',     'q': 'q' },
			'google.co.gl'           : { 'name': 'Google Greenland',    'q': 'q' },
			'google.co.gy'           : { 'name': 'Google Guyana',       'q': 'q' },
			'google.co.hu'           : { 'name': 'Google Hungary',      'q': 'q' },
			'google.co.id'           : { 'name': 'Google Indonesia',    'q': 'q' },
			'google.co.il'           : { 'name': 'Google Israel',       'q': 'q' },
			'google.co.im'           : { 'name': 'Google Isle of Man',  'q': 'q' },
			'google.co.in'           : { 'name': 'Google India',        'q': 'q' },
			'google.co.it'           : { 'name': 'Google Italy',        'q': 'q' },
			'google.co.je'           : { 'name': 'Google Jersey',       'q': 'q' },
			'google.co.jp'           : { 'name': 'Google Japan',        'q': 'q' },
			'google.co.ke'           : { 'name': 'Google Kenya',        'q': 'q' },
			'google.co.kr'           : { 'name': 'Google South Korea',  'q': 'q' },
			'google.co.ls'           : { 'name': 'Google Lesotho',      'q': 'q' },
			'google.co.ma'           : { 'name': 'Google Morocco',      'q': 'q' },
			'google.co.mu'           : { 'name': 'Google Mauritius',    'q': 'q' },
			'google.co.mw'           : { 'name': 'Google Malawi',       'q': 'q' },
			'google.co.nz'           : { 'name': 'Google New Zeland',   'q': 'q' },
			'google.co.pn'           : { 'name': 'Google Pitcairn Islands',    'q': 'q' },
			'google.co.th'           : { 'name': 'Google Thailand',            'q': 'q' },
			'google.co.tt'           : { 'name': 'Google Trinidad and Tobago', 'q': 'q' },
			'google.co.ug'           : { 'name': 'Google Uganda',       'q': 'q' },
			'google.co.uk'           : { 'name': 'Google UK',           'q': 'q' },
			'google.co.uz'           : { 'name': 'Google Uzbekistan',   'q': 'q' },
			'google.co.ve'           : { 'name': 'Google Venezuela',    'q': 'q' },
			'google.co.vi'           : { 'name': 'Google US Virgin Islands', 'q': 'q' },
			'google.co.za'           : { 'name': 'Google  South Africa','q': 'q' },
			'google.co.zm'           : { 'name': 'Google Zambia',       'q': 'q' },
			'google.co.zw'           : { 'name': 'Google Zimbabwe',     'q': 'q' },
			'google.com'             : { 'name': 'Google',              'q': 'q' },
			'google.com.af'          : { 'name': 'Google Afghanistan',  'q': 'q' },
			'google.com.ag'          : { 'name': 'Google Antiqua and Barbuda', 'q': 'q' },
			'google.com.ai'          : { 'name': 'Google Anguilla',    'q': 'q' },
			'google.com.ar'          : { 'name': 'Google Argentina',   'q': 'q' },
			'google.com.au'          : { 'name': 'Google Australia',   'q': 'q' },
			'google.com.az'          : { 'name': 'Google Azerbaijan',  'q': 'q' },
			'google.com.bd'          : { 'name': 'Google Bangladesh',  'q': 'q' },
			'google.com.bh'          : { 'name': 'Google Bahrain',     'q': 'q' },
			'google.com.bi'          : { 'name': 'Google Burundi',     'q': 'q' },
			'google.com.bn'          : { 'name': 'Google Brunei Darussalam', 'q': 'q' },
			'google.com.bo'          : { 'name': 'Google Bolivia',     'q': 'q' },
			'google.com.br'          : { 'name': 'Google Brazil',      'q': 'q' },
			'google.com.bs'          : { 'name': 'Google Bahamas',     'q': 'q' },
			'google.com.bz'          : { 'name': 'Google Belize',      'q': 'q' },
			'google.com.cn'          : { 'name': 'Google China',       'q': 'q' },
			'google.com.co'          : { 'name': 'Google',             'q': 'q' },
			'google.com.cu'          : { 'name': 'Google Cuba',        'q': 'q' },
			'google.com.do'          : { 'name': 'Google Dominican Rep', 'q': 'q' },
			'google.com.ec'          : { 'name': 'Google Ecuador',     'q': 'q' },
			'google.com.eg'          : { 'name': 'Google Egypt',       'q': 'q' },
			'google.com.et'          : { 'name': 'Google Ethiopia',    'q': 'q' },
			'google.com.fj'          : { 'name': 'Google Fiji',        'q': 'q' },
			'google.com.ge'          : { 'name': 'Google Georgia',     'q': 'q' },
			'google.com.gh'          : { 'name': 'Google Ghana',       'q': 'q' },
			'google.com.gi'          : { 'name': 'Google Gibraltar',   'q': 'q' },
			'google.com.gl'          : { 'name': 'Google Greenland',   'q': 'q' },
			'google.com.gp'          : { 'name': 'Google Guadeloupe',  'q': 'q' },
			'google.com.gr'          : { 'name': 'Google Greece',      'q': 'q' },
			'google.com.gt'          : { 'name': 'Google Guatemala',   'q': 'q' },
			'google.com.gy'          : { 'name': 'Google Guyana',      'q': 'q' },
			'google.com.hk'          : { 'name': 'Google Hong Kong',   'q': 'q' },
			'google.com.hn'          : { 'name': 'Google Honduras',    'q': 'q' },
			'google.com.hr'          : { 'name': 'Google Croatia',     'q': 'q' },
			'google.com.jm'          : { 'name': 'Google Jamaica',     'q': 'q' },
			'google.com.jo'          : { 'name': 'Google Jordan',      'q': 'q' },
			'google.com.kg'          : { 'name': 'Google Kyrgyzstan',  'q': 'q' },
			'google.com.kh'          : { 'name': 'Google Cambodia',    'q': 'q' },
			'google.com.ki'          : { 'name': 'Google Kiribati',    'q': 'q' },
			'google.com.kz'          : { 'name': 'Google Kazakhstan',  'q': 'q' },
			'google.com.lk'          : { 'name': 'Google Sri Lanka',   'q': 'q' },
			'google.com.lv'          : { 'name': 'Google Latvia',      'q': 'q' },
			'google.com.ly'          : { 'name': 'Google Libya',       'q': 'q' },
			'google.com.mt'          : { 'name': 'Google Malta',       'q': 'q' },
			'google.com.mu'          : { 'name': 'Google Mauritius',   'q': 'q' },
			'google.com.mw'          : { 'name': 'Google Malawi',      'q': 'q' },
			'google.com.mx'          : { 'name': 'Google Mexico',      'q': 'q' },
			'google.com.my'          : { 'name': 'Google Malaysia',    'q': 'q' },
			'google.com.na'          : { 'name': 'Google Namibia',     'q': 'q' },
			'google.com.nf'          : { 'name': 'Google Norfolk Island', 'q': 'q' },
			'google.com.ng'          : { 'name': 'Google Nigeria',        'q': 'q' },
			'google.com.ni'          : { 'name': 'Google Nicaragua',   'q': 'q' },
			'google.com.np'          : { 'name': 'Google Nepal',       'q': 'q' },
			'google.com.nr'          : { 'name': 'Google Nauru',       'q': 'q' },
			'google.com.om'          : { 'name': 'Google Oman',        'q': 'q' },
			'google.com.pa'          : { 'name': 'Google Panama',      'q': 'q' },
			'google.com.pe'          : { 'name': 'Google Peru',        'q': 'q' },
			'google.com.ph'          : { 'name': 'Google Philipines',  'q': 'q' },
			'google.com.pk'          : { 'name': 'Google Pakistan',    'q': 'q' },
			'google.com.pl'          : { 'name': 'Google Poland',      'q': 'q' },
			'google.com.pr'          : { 'name': 'Google Puerto Rico', 'q': 'q' },
			'google.com.pt'          : { 'name': 'Google Portugal',    'q': 'q' },
			'google.com.py'          : { 'name': 'Google Paraguay',    'q': 'q' },
			'google.com.qa'          : { 'name': 'Google',             'q': 'q' },
			'google.com.ru'          : { 'name': 'Google Russia',      'q': 'q' },
			'google.com.sa'          : { 'name': 'Google Saudi Arabia',    'q': 'q' },
			'google.com.sb'          : { 'name': 'Google Solomon Islands', 'q': 'q' },
			'google.com.sc'          : { 'name': 'Google Seychelles',      'q': 'q' },
			'google.com.sg'          : { 'name': 'Google Singapore',   'q': 'q' },
			'google.com.sv'          : { 'name': 'Google El Savador',  'q': 'q' },
			'google.com.tj'          : { 'name': 'Google Tajikistan',  'q': 'q' },
			'google.com.tr'          : { 'name': 'Google Turkey',      'q': 'q' },
			'google.com.tt'          : { 'name': 'Google Trinidad and Tobago', 'q': 'q' },
			'google.com.tw'          : { 'name': 'Google Taiwan',      'q': 'q' },
			'google.com.ua'          : { 'name': 'Google Ukraine',      'q': 'q' },
			'google.com.uy'          : { 'name': 'Google Uruguay',     'q': 'q' },
			'google.com.uz'          : { 'name': 'Google Uzbekistan',  'q': 'q' },
			'google.com.ve'          : { 'name': 'Google Venezuela',   'q': 'q' },
			'google.com.vi'          : { 'name': 'Google US Virgin Islands', 'q': 'q' },
			'google.com.vn'          : { 'name': 'Google Vietnam',     'q': 'q' },
			'google.com.ws'          : { 'name': 'Google Samoa',       'q': 'q' },
			'google.cz'              : { 'name': 'Google Czech Rep',   'q': 'q' },
			'google.de'              : { 'name': 'Google Germany',     'q': 'q' },
			'google.dj'              : { 'name': 'Google Djubouti',    'q': 'q' },
			'google.dk'              : { 'name': 'Google Denmark',     'q': 'q' },
			'google.dm'              : { 'name': 'Google Dominica',    'q': 'q' },
			'google.ec'              : { 'name': 'Google Ecuador',     'q': 'q' },
			'google.ee'              : { 'name': 'Google Estonia',     'q': 'q' },
			'google.es'              : { 'name': 'Google Spain',       'q': 'q' },
			'google.fi'              : { 'name': 'Google Finland',     'q': 'q' },
			'google.fm'              : { 'name': 'Google Micronesia',  'q': 'q' },
			'google.fr'              : { 'name': 'Google France',      'q': 'q' },
			'google.gd'              : { 'name': 'Google Grenada',     'q': 'q' },
			'google.ge'              : { 'name': 'Google Georgia',     'q': 'q' },
			'google.gf'              : { 'name': 'Google French Guiana', 'q': 'q' },
			'google.gg'              : { 'name': 'Google Guernsey',      'q': 'q' },
			'google.gl'              : { 'name': 'Google Greenland',     'q': 'q' },
			'google.gm'              : { 'name': 'Google Gambia',        'q': 'q' },
			'google.gp'              : { 'name': 'Google Guadeloupe',    'q': 'q' },
			'google.gr'              : { 'name': 'Google Greece',        'q': 'q' },
			'google.gy'              : { 'name': 'Google Guyana',        'q': 'q' },
			'google.hk'              : { 'name': 'Google Hong Kong',     'q': 'q' },
			'google.hn'              : { 'name': 'Google Honduras',      'q': 'q' },
			'google.hr'              : { 'name': 'Google Croatia',       'q': 'q' },
			'google.ht'              : { 'name': 'Google Haiti',         'q': 'q' },
			'google.hu'              : { 'name': 'Google Hungary',       'q': 'q' },
			'google.ie'              : { 'name': 'Google Ireland',       'q': 'q' },
			'google.im'              : { 'name': 'Google Isle of Man',   'q': 'q' },
			'google.in'              : { 'name': 'Google India',         'q': 'q' },
			'google.info'            : { 'name': 'Google dot info',      'q': 'q' },
			'google.is'              : { 'name': 'Google Iceland',       'q': 'q' },
			'google.it'              : { 'name': 'Google Italy',         'q': 'q' },
			'google.je'              : { 'name': 'Google Jersey',        'q': 'q' },
			'google.jo'              : { 'name': 'Google Jordan',        'q': 'q' },
			'google.jobs'            : { 'name': 'Google dot jobs',      'q': 'q' },
			'google.jp'              : { 'name': 'Google Japan',         'q': 'q' },
			'google.kg'              : { 'name': 'Google Kyrgyzstan',    'q': 'q' },
			'google.ki'              : { 'name': 'Google Kiribati',      'q': 'q' },
			'google.kz'              : { 'name': 'Google Kazakhstan',    'q': 'q' },
			'google.la'              : { 'name': 'Google Laos',          'q': 'q' },
			'google.li'              : { 'name': 'Google Liechtenstein', 'q': 'q' },
			'google.lk'              : { 'name': 'Google Sri Lanka',     'q': 'q' },
			'google.lt'              : { 'name': 'Google Lithuania',     'q': 'q' },
			'google.lu'              : { 'name': 'Google Luxembourg',    'q': 'q' },
			'google.lv'              : { 'name': 'Google Latvia',        'q': 'q' },
			'google.ma'              : { 'name': 'Google Morocco',       'q': 'q' },
			'google.md'              : { 'name': 'Google Moldova',       'q': 'q' },
			'google.mn'              : { 'name': 'Google Mongolia',      'q': 'q' },
			'google.mobi'            : { 'name': 'Google dot mobi',      'q': 'q' },
			'google.ms'              : { 'name': 'Google Montserrat',    'q': 'q' },
			'google.mu'              : { 'name': 'Google Mauritius',     'q': 'q' },
			'google.mv'              : { 'name': 'Google Maldives',      'q': 'q' },
			'google.mw'              : { 'name': 'Google Malawi',        'q': 'q' },
			'google.net'             : { 'name': 'Google dot net',       'q': 'q' },
			'google.nf'              : { 'name': 'Google Norfolk Island', 'q': 'q' },
			'google.nl'              : { 'name': 'Google Netherlands',    'q': 'q' },
			'google.no'              : { 'name': 'Google Norway',        'q': 'q' },
			'google.nr'              : { 'name': 'Google Nauru',         'q': 'q' },
			'google.nu'              : { 'name': 'Google Niue',          'q': 'q' },
			'google.off.ai'          : { 'name': 'Google Anguilla',      'q': 'q' },
			'google.ph'              : { 'name': 'Google Philipines',    'q': 'q' },
			'google.pk'              : { 'name': 'Google Pakistan',      'q': 'q' },
			'google.pl'              : { 'name': 'Google Poland',        'q': 'q' },
			'google.pn'              : { 'name': 'Google Pitcairn Islands', 'q': 'q' },
			'google.pr'              : { 'name': 'Google Puerto Rico',   'q': 'q' },
			'google.pt'              : { 'name': 'Google Portugal',      'q': 'q' },
			'google.ro'              : { 'name': 'Google Romania',       'q': 'q' },
			'google.ru'              : { 'name': 'Google Russia',        'q': 'q' },
			'google.rw'              : { 'name': 'Google Rwanda',        'q': 'q' },
			'google.sc'              : { 'name': 'Google Seychelles',    'q': 'q' },
			'google.se'              : { 'name': 'Google Sweden',        'q': 'q' },
			'google.sg'              : { 'name': 'Google Singapore',     'q': 'q' },
			'google.sh'              : { 'name': 'Google Saint Helena',  'q': 'q' },
			'google.si'              : { 'name': 'Google Slovenia',      'q': 'q' },
			'google.sk'              : { 'name': 'Google Slovakia',      'q': 'q' },
			'google.sm'              : { 'name': 'Google San Marino',    'q': 'q' },
			'google.sn'              : { 'name': 'Google Senegal',       'q': 'q' },
			'google.sr'              : { 'name': 'Google Suriname',      'q': 'q' },
			'google.st'              : { 'name': 'Google Sao Tome',      'q': 'q' },
			'google.tk'              : { 'name': 'Google Tokelau',       'q': 'q' },
			'google.tm'              : { 'name': 'Google Turkmenistan',  'q': 'q' },
			'google.to'              : { 'name': 'Google Tonga',        'q': 'q' },
			'google.tp'              : { 'name': 'Google East Timor',   'q': 'q' },
			'google.tt'              : { 'name': 'Google Trinidad and Tobago', 'q': 'q' },
			'google.tv'              : { 'name': 'Google Tuvalu', 'q': 'q' },
			'google.tw'              : { 'name': 'Google Taiwan', 'q': 'q' },
			'google.ug'              : { 'name': 'Google Uganda', 'q': 'q' },
			'google.us'              : { 'name': 'Google US',     'q': 'q' },
			'google.uz'              : { 'name': 'Google Uzbekistan',             'q': 'q' },
			'google.vg'              : { 'name': 'Google British Virgin Islands', 'q': 'q' },
			'google.vn'              : { 'name': 'Google Vietnam', 'q': 'q' },
			'google.vu'              : { 'name': 'Google Vanuatu', 'q': 'q' },
			'google.ws'              : { 'name': 'Google Samoa',  'q': 'q' },
			'hotbot.com'             : { 'name': 'HotBot',        'q': 'keyword' }, //query->keyword (5/20/12)
			'in.gr'                  : { 'name': 'In GR',         'q': 'q' },
			'mamma.com'              : { 'name': 'Mamma',         'q': 'q' }, //query -> q (5/20/12)
			'mahalo.com'             : { 'name': 'Mahalo',        'q': 'q' }, //search -> q (5/20/12)
			'megasearching.net'      : { 'name': 'Megasearching', 'q': 's' },
			'mirago.co.uk'           : { 'name': 'Mirago UK',     'q': 'qry' },
			'netscape.com'           : { 'name': 'Netscape',      'q': 's' },
			'community.paglo.com'    : { 'name': 'Paglo',         'q': 'q' },
			'pathfinder.gr'          : { 'name': 'Pathfinder GR', 'q': 'q' },
			'phantis.com'            : { 'name': 'Phantis GR' ,   'q': 'q'},
			'robby.gr'               : { 'name': 'Robby GR'     , 'q': 'searchstr' },
			'sproose.com'            : { 'name': 'Sproose',       'q': 'query' },
			'technorati.com'         : { 'name': 'Technorati',    'q': 'q' },
			'tesco.net'              : { 'name': 'Tesco Search',  'q': 'q' },
			'tiscali.co.uk'          : { 'name': 'Tiscali UK',    'q': 'query' },
			'bing.com'               : { 'name': 'Bing',          'q': 'q' },
		
			'acbusca.com'            : { 'name': 'ACBusca',          'q': 'query' },
			'atalhocerto.com.br'     : { 'name': 'Atalho Certo',     'q': 'keyword' },
			'bastaclicar.com.br'     : { 'name': 'Basta Clicar',     'q': 'search' },
			'bemrapido.com.br'       : { 'name': 'Bem Rapido',       'q': 'chave' },
			'br.altavista.com'       : { 'name': 'AltaVista Brasil', 'q': 'q' },
			'br.search.yahoo.com'    : { 'name': 'Yahoo Brazil',     'q': 'p' },
			'busca.uol.com.br'       : { 'name': 'Radar UOL',        'q': 'q' },
			'buscaaqui.com.br'       : { 'name': 'Busca Aqui',       'q': 'q' },
			'buscador.terra.com.br'  : { 'name': 'Terra Busca',      'q': 'query' },
			'cade.search.yahoo.com'  : { 'name': 'Cade',             'q': 'p' },
			'clickgratis.com.br'     : { 'name': 'Click Gratis',     'q': 'query' },
			'entrada.com.br'         : { 'name': 'Entrada',          'q': 'q' },
			'gigabusca.com.br'       : { 'name': 'Giga Busca',       'q': 'what' },
			'internetica.com.br'     : { 'name': 'Internetica',      'q': 'busca' },
			'katatudo.com.br'        : { 'name': 'KataTudo',         'q': 'q' },
			'minasplanet.com.br'     : { 'name': 'Minas Planet',     'q': 'term' },
			'speedybusca.com.br'     : { 'name': 'SpeedyBusca',      'q': 'q' },
			'vaibuscar.com.br'       : { 'name': 'Vai Busca',        'q': 'q' },
		
			'search.conduit.com'     : { 'name': 'Conduit',          'q':'q'   },
			'in.search.yahoo.com'    : { 'name': 'Yahoo India',      'q': 'p'  },
			'rediff.com'             : { 'name': 'Rediff',           'q': 'MT' },
			'guruji.com'             : { 'name': 'Guruji',           'q': 'q'  },
			'duckduckgo.com'         : { 'name': 'DuckDuckGo',       'q': 'q'  },
		};

		_domain = _domain.toLowerCase();
		for(const key in searchEngines)
		{
			if (_domain.endsWith(key) == true)
			{
				return {
					"domain": key,
					"name": searchEngines[key].name,
					"q": searchEngines[key].q,
				};
			}
		}

		return null;
	}

	static	ExtractInfo(_url)
	{
		if (StringUtils.IsEmpty(_url) == false)
		{
			// create the URL
			let	currentUrl = parse(_url, true);		

			return {
				host: currentUrl.hostname,
				path: currentUrl.pathname
			}
		}
		else
		{
			return {
				host: "",
				path: ""
			}
		}
	}

	static	UrlEncodeQueryParameters(_parametersStr)
	{
		if (StringUtils.IsEmpty(_parametersStr) == true)
			return "";
			
		let	chunks = _parametersStr.split("&");
		let	finalChunks = [];
		for(let i=0; i<chunks.length; i++)
		{
			// split with =
			let	keyValue = chunks[i].split("=");
			if (keyValue.length == 2)
			{
				let	newValue = keyValue[0] + "=" + encodeURIComponent(keyValue[1]);
				finalChunks.push(newValue);
			}
		}
		return finalChunks.join("&");
	}

	static	AppendQueryParametersToUrl(_url, _parameters)
	{
		// build the query string with the parameters
		let	parametersEncoded = [];
		for(let key in _parameters)
		{
			parametersEncoded.push(key + "=" + encodeURIComponent(_parameters[key]));
		}

		// nothing?
		if (parametersEncoded.length == 0)
			return _url;
		
		return _url + "?" + parametersEncoded.join("&");
	}	
}

module.exports = {
	UrlUtils
};


﻿/**
Провайдер AnyBalance (http://any-balance-providers.googlecode.com)
*/

var g_headers = {
	'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	'Accept-Charset':'windows-1251,utf-8;q=0.7,*;q=0.3',
	'Accept-Language':'ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4',
	'Connection':'keep-alive',
	'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36;',
};

function main(){
    var prefs = AnyBalance.getPreferences();
    var baseurl = 'https://lk.kmv.ru/';
    AnyBalance.setDefaultCharset('utf-8'); 
	
    var html = AnyBalance.requestGet(baseurl + 'login', g_headers);
	
	var params = createFormParams(html, function(params, str, name, value){
		if(name == 'user[login]')
			return prefs.login;
		else if(name == 'user[password]')
			return prefs.password;			
		return value;
	});
	
	html = AnyBalance.requestPost(baseurl + 'login', params, addHeaders({Referer: baseurl + 'login'})); 
	
    if(!/new HupoApp\(\{/i.test(html)){
        throw new AnyBalance.Error('Не удалось зайти в личный кабинет. Сайт изменен?');
    }
	
    var result = {success: true};
    getParam(html, result, 'balance', /"n_sum_bal":"([^"]*)/i, replaceTagsAndSpaces, parseBalance);
	getParam(html, result, 'acc_num', /"vc_account":"([^"]*)/i, replaceTagsAndSpaces, html_entity_decode);
	//getParam(html, result, '__tariff', />Тариф([^<]*)/i, replaceTagsAndSpaces, html_entity_decode);
	
    AnyBalance.setResult(result);
}
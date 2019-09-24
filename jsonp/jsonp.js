webix.jsonp.timer = 3000;
webix.jsonp.timers = {};

webix.jsonp = function(url, params, callback, master){
	var defer = webix.promise.defer();

	var id = "webix_jsonp_"+webix.uid();
	var script = document.createElement("script");
	script.id = id;
	script.type = "text/javascript";

	var head = document.getElementsByTagName("head")[0];

	if (typeof params == "function"){
		master = callback;
		callback = params;
		params = {};
	}

	if (!params)
		params = {};

	params.jsonp = id;
	window[id]=function(){
		if (callback)
			callback.apply(master||window, arguments);
		defer.resolve(arguments[0]);

		window.clearTimeout(timers[id]);
		delete webix.jsonp.timers[id];

		script.parentNode.removeChild(script);
		callback = head = master = script = null;
		delete window[id];
	};

	//timeout timer
	webix.jsonp.timers[id] = window.setTimeout(function(){
		defer.reject();
		delete window[id];
	}, webix.jsonp.timer);
	
	var vals = [];
	for (var key in params) vals.push(key+"="+encodeURIComponent(params[key]));
	
	url += (url.indexOf("?") == -1 ? "?" : "&")+vals.join("&");

	script.src = url;
	head.appendChild(script);

	return defer;
};

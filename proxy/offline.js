webix.proxy.offline = {
	$proxy:true,

	storage: webix.storage.local,
	cache:false,
	local:false,
	data:"",

	_is_offline : function(){
		if (!this.cache && !webix.env.offline){
			webix.callEvent("onOfflineMode",[]);
			webix.env.offline = true;
		}
	},
	_is_online : function(){
		if (!this.cache && webix.env.offline){
			webix.env.offline = false;
			webix.callEvent("onOnlineMode", []);
		}
	},
	_on_success:function(text){
		this._is_online();
		this.setCache(text);
	},
	_on_error:function(view){
		//assuming offline mode
		this._is_offline();
		
		var text = this.getCache() || this.data;
		view.parse(text);
	},
	load:function(view){
		//in cache mode - always load data from cache
		if (this.cache && this.getCache()){
			this._on_error(view);
		}
		//else try to load actual data first
		else {
			var result;
			if (this.source.$proxy)
				result =  this.source.load(view);
			else
				result = webix.ajax().get(this.source);

			if(result && result.then){
				result.then(webix.bind(function(data){
					this._on_success(data.text());
				}, this), webix.bind(function(){
					this._on_error(view);
				}, this));
			}
			return result;
		}
	},
	getCache:function(){
		return this.storage.get(this._data_name());
	},
	clearCache:function(){
		this.storage.remove(this._data_name());
	},
	setCache:function(text){
		this.storage.put(this._data_name(), text);
	},
	_data_name:function(){
		if (this.source.$proxy)
			return this.source.source + "_$proxy$_data";
		else 
			return this.source + "_$proxy$_data";
	},
	save:function(master, data, view){
		if (!webix.env.offline && !this.cache){
			if (this.source.$proxy){
				return this.source.save(master, data, view);
			} else {
				return webix.ajax().post(this.source, data.data);
			}
		}
	},
	saveAll:function(view, update){
		this.setCache(view.serialize());
		update = this.cache || webix.env.offline ? update : [];
		for (var i = 0; i < update.length; i++){
			update[i] = { id: update[i].id, status: update[i].operation };
		}
		return webix.promise.resolve(update);
	}
};

webix.proxy.local = {
	init:function(){
		webix.extend(this, webix.proxy.offline);
	},
	cache:true,
	local:true,
	data:[]
};

webix.proxy.cache = {
	init:function(){
		webix.extend(this, webix.proxy.offline);
	},
	cache:true
};
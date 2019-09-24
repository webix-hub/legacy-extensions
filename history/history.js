webix.history = {
	track:function(id, url){
		this._init_state(id, url);
		
		if (this._aHandler)
			webix.$$(this._aViewId).detachEvent(this._aHandler);

		if (id){
			this._aViewId = id;
			var view = webix.$$(id);
			
			var handler = function(){
				if (history._ignored) return;

				if (view.getValue)
					history.push(id, view.getValue());
			};

			if (view.getActiveId)
				this._aHandler = view.attachEvent("onViewChange", handler);
			else
				this._aHandler = view.attachEvent("onChange", handler);
		}
	},
	_set_state:function(view, state){
		history._ignored = 1;

		view = webix.$$(view);
		if (view.callEvent("onBeforeHistoryNav", [state]))
			if (view.setValue)
				view.setValue(state);

		history._ignored = 0;
	},
	push:function(view, url, value){
		view = webix.$$(view);
		var new_url = "";
		if (url)
			new_url = "#!/"+url;
		if (webix.isUndefined(value)){
			if (view.getValue)
				value = view.getValue();
			else
				value = url;
		}

		window.history.pushState({ webix:true, id:view.config.id, value:value }, "", new_url);
	},
	_init_state:function(view, url){
		webix.event(window, "popstate", function(ev){
			if (ev.state && ev.state.webix){
				history._set_state(ev.state.id, ev.state.value);
			}
		});

		
		var isSupported = webix.animate.isSupported;
		webix.animate.isSupported = function(){ return false; };
		var hash = window.location.hash;

		if (hash && hash.indexOf("#!/") === 0)
			history._set_state(view, hash.replace("#!/",""));
		else if (url){
			history.push(view, url);
			history._set_state(view, url);
		}
		webix.animate.isSupported = isSupported;
		
		this._init_state = function(){};
	}
};
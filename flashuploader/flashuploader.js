webix.UploadDriver.flash = {
	$render: function() {

		if (!window.swfobject)
			webix.require(webix.env.codebase+"legacy/swfobject.js", true); // sync loading

		var config = this.config;
		config.swfId = (config.swfId||"webix_swf_"+webix.uid());

		var box = this.$view.querySelector(".webix_el_box");
		box.innerHTML += "<div class='webix_upload_flash'><div id='"+config.swfId+"'></div></div>";

		// add swf object
		/* global swfobject */
		swfobject.embedSWF(webix.env.codebase+"/legacy/uploader.swf", config.swfId, "100%", "100%", "9", null, {
			uploaderId: config.id,
			ID: config.swfId,
			enableLogs:(config.enableLogs?"1":""),
			paramName:(config.inputName),
			multiple:(config.multiple?"Y":"")
		}, {wmode:"transparent"});

		webix.event(this.$view, "click", webix.bind(function() {
			var now_date = new Date();
			if (now_date  > 250){
				this.fileDialog();
			}
		}, this));

		this.files.attachEvent("onBeforeDelete", webix.bind(this._stop_file,this));
	},
	$applyFlash: function(name,params){
		return this[name].apply(this,params);
	},
	getSwfObject: function(){
		/* global swfobject */
		return swfobject.getObjectById(this.config.swfId);
	},
	fileDialog:function(){
		if(this.getSwfObject())
			this.getSwfObject().showDialog();
	},
	send: function(id){
		if (typeof id == "function"){
			this._last_assigned_upload_callback = id;
			id = 0;
		}

		if (!id){
			var order = this.files.data.order;
			var complete = true;
			if (order.length)
				for (var i=0; i<order.length; i++){
					complete = this.send(order[i])&&complete;
				}

			if (complete)
				this._upload_complete();

			return;
		}
		var item = this.files.getItem(id);
		if (item.status !== "client")
			return false;
		item.status = "transfer";

		if(this.getSwfObject()){
			var url = this._get_active_url(item);

			var globalData = this.config.formData || {};
			if (typeof globalData === "function")
				globalData = globalData.call(this);
			var details = webix.extend(item.formData||{} , globalData);

			this.getSwfObject().upload(id, url, details);
		}
		return true;

	},
	_get_active_url:function(item){
		var url = this.config.upload;
		var urldata = webix.extend(item.urlData||{},this.config.urlData||{});
		if (url && urldata){
			var subline = [];
			for (var key in urldata)
				subline.push(encodeURIComponent(key)+"="+encodeURIComponent(urldata[key]));

			if (subline.length)
				url += ((url.indexOf("?") ==-1) ? "?" : "&") + subline.join("&");
		}
		return url;
	},
	_format_size: function(size) {
		var index = 0;
		while (size > 1024){
			index++;
			size = size/1024;
		}
		return Math.round(size*100)/100+" "+webix.i18n.fileSize[index];
	},
	$beforeAddFileToQueue: function( id, name, size ){

		var type = name.split(".").pop();
		var format = this._format_size(size);
		return this.callEvent("onBeforeFileAdd", [{
			id: id,
			name:name,
			size:size,
			sizetext:format,
			type:type
		}]);
	},
	$addFileToQueue: function(id, name, size){
		if(this.files.exists(id))
			return false;
		if (!this.config.multiple)
			this.files.clearAll();
		var type = name.split(".").pop();
		var format = this._format_size(size);
		var file_struct = {
			name:name,
			id: id,
			size:size,
			sizetext:format,
			type:type,
			status:"client"
		};
		this.files.add(file_struct);
		this.callEvent("onAfterFileAdd", [file_struct]);

		if (id && this.config.autosend)
			this.send(id);
	},
	stopUpload: function(id){
		this._stop_file(id);
	},
	_stop_file: function(id) {
		var item = this.files.getItem(id);
		if(item.status == "transfer"){
			this.getSwfObject().uploadStop(id);
			item.status = "client";
		}
	},
	$drop:function(){}, //drop of files is not supported in IE9
	$onUploadComplete: function(){
		if(this.config.autosend){
			this._upload_complete();
		}
	},
	_upload_complete:function(response){
		this.callEvent("onUploadComplete", [response]);
		if (this._last_assigned_upload_callback){
			this._last_assigned_upload_callback.call(this, response);
			this._last_assigned_upload_callback = 0;
		}
	},
	$onUploadSuccess: function(id,name,response){
		var item = this.files.getItem(id);
		if(item){
			item.status = "server";
			item.progress = 100;
			if(response.text && (typeof response.text == "string")){
				webix.DataDriver.json.toObject(response.text);
				webix.extend(item,response,true);
			}
			this.callEvent("onFileUpload", [item,response]);
			this.callEvent("onChange", []);
			this.files.updateItem(id);
		}
	},
	$onUploadFail: function(id){
		var item = this.files.getItem(id);
		item.status = "error";
		delete item.percent;
		this.files.updateItem(id);
		this.callEvent("onFileUploadError", [item, ""]);
	}
};
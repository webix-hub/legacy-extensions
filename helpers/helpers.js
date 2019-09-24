webix.ui.each = function(parent, logic, master, include){
	if (parent){
		var children = include ? [parent] : parent.getChildViews();
		for (var i = 0; i < children.length; i++){
			if (logic.call((master), children[i]) !== false)
				webix.ui.each(children[i], logic, master);
		}
	}
};

webix.ui.hasMethod = function(view, name){
	var obj = webix.ui[view];
	if (!obj) return false;

	if (obj.$protoWait)
		obj = obj.call(-1);

	return !!webix.ui[view].prototype[name];
};

webix.ui.delay = function(){

};
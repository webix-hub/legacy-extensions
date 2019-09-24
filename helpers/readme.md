Helpers
===================

##webix.ui.each

- parent (object) start view
- logic  (function) function to execute with each found view
- master (any) context for the function
- include (boolean) iterate child views

~~~js
webix.ui.each($$("layout"), function(view){
	console.log(view);
});
~~~

##webix.ui.hasMethod

checks whether the abstract view class in question has the method

- name	(string)	name of view
- method_name	(string)	name of method

~~~js
var result = webix.ui.hasMethod("popup", "setPosition");
~~~
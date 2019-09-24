Adding Active Elements to Components
==========================

ActiveContent module lets developers get rid of drawing interactive elements themselves and makes it possible to use existing Webix controls for it. 
In other words, it allows inserting controls into views. (Normally, it goes only for layouts). 

First of all, the **ActiveContent** module should be added to the needed component by extending its default functionality:

~~~js
webix.protoUI({
    name:"activeList" //give it some name you like
},webix.ui.list, webix.ActiveContent);
~~~

Now, you can use it. Note that the **name** of the newly created component is used as **view** property value: 

~~~js
webix.ui({
	view: "activeList",
	id:"mylist",
	activeContent:{
		deleteButton:{
			id:"deleteButtonId",
			view:"button",
			label:"Delete",
			width:120
		},
		editButton:{
			id:"editButtonId",
			view:"button",
			label:"Edit",
			width:80
		},
		markCheckbox:{
			view:"checkbox"
		}
	},
	template: "<div class='rank'>#rank#.</div>"+
	"<div class='title'>#title#<br>#year# year</div>"+
	"<div class='buttons'>{common.deleteButton()}</div>"+
	"<div class='buttons'>{common.editButton()}</div>"+
	"<div class='checkbox'>{common.markCheckbox()}</div>"
});
~~~

"Active" template can be also defined via a function:

~~~js
view:"activelist",
template: function (obj, common) {
	return obj.title+"<div>"+common.deleteButton(obj, common)+"</div>";
}
~~~

- the **activeContent** property contains an array of key-value pairs where: 
	- *key* is a used-defined **name** of an active area (here *deleteButton*, *editButton*);
    - *value* is its **configuration**. 
- config of the active element is stored in the **common** property of the housing component and can be derived by its *name*;
- template for each list item includes these configurations as {common.*name*};

If an active content element can have a **variable value** (like text field, or checkbox) it can be passed to it within data item properties: 

~~~js
view:"activeList",
data:[
	{ id:5, title:"My Fair Lady", markCheckbox:1 }
]
~~~

**Click** and other **events** are attached to the buttons according to Webix Event handling pattern:

~~~js
view:"button", click:function(){...}
//or
button.attachEvent("onItemClick", function(){...});
~~~

###Getting master of an active content element

Using locate function:

- in any mouse event handler  of the active element (e.g. *onItemClick* event, or *click* property).

~~~js
$$("deleteButtonId").attachEvent("onItemClick", function(id, e){
	var item_id = $$('"mylist").locate(e);
    //returns id of a list item
});
~~~

Through the active element configuration:

- if  a handler is attached to non-mouse event (all component-specific Webix events);
- if an active element is redrawn on a mouse event (like toggle, checkbox).

~~~js
on:{
	onChange:function(newv, oldv){
		var item_id = this.config.$masterId;
	}
}
~~~

**Datatable and treetable specificity**

With datatabl and treetable you can get a row object by **$masterId** property that includes: 

- **row** - row id;
- **rind** - row index;
- **column** - column id;
- **cind** - column index.

~~~js
on:{
	onChange:function(newv, oldv){
		var item_id = this.config.$masterId.row;
	}
}
~~~
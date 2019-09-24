Tracking the Latest Opened Tab
===================================

The technique is designed to work with Multiview layout. 

With multiview application design you can create as many cells as you wish and switch between them with the help of dedicated buttons, namely 
tabbar and segmented, or resort to tabview functionality. 

Tab values coincide with IDs of the views you place into multiview cells. 

Initially, either the first tab is visible, or the one you've set to be "selected" during initialization. Normally, when you refresh the page, the application is redrawn according to this initialization pattern.

~~~js
webix.ui({
	rows:[
		{ view:"segmented", id:'tabbar', selected:"listView", multiview:true, options:[
			{ value: "List",  id:"listView"},
			{ value: "Form",  id:"formView"},
			{ value: "About", id:"aboutView"}
		]},
		{ cells:[
			{id:"listView",  view:"list"},
			{id:"formView",  view:"form"},
			{id:"aboutView", view:"template"}
		]}
	]               
});
~~~

Nevertheless, the library offers **history API** to store the current application state, or simply put, to memorize the latest opened tab. 

History api/history_track.md method allows remembering the currently opened tab and showing it after page loading. It takes two parameters: 

- **id** - the **ID** of the  segmented, tabbar and tabview that is used for switching between multiview views. 
- **url** - **ID** of a multiview **cell** that forms the hashbang url that is loaded after page refresh. By default it's the ID of the currently opened cell. 

~~~js
webix.history.track("tabbar");
~~~

There's also the **onBeforeHistoryNav** event which allows adding some actions while working with history. The event is called before history is applied.

~~~js
$$("tabbar").attachEvent("onBeforeHistoryNav", function(){
    //some code here
});
~~~

The event is cancelable: returning false will cancel changes in the view.

Each time you click the tab to switch for another cell, a **hashbang URL** is generated on the base of **cell ID** (under *http://current_url.html#!/cellID* pattern) and memorized. You'll see it in the url bar of your browser. 

If for the **track()** function you define the url parameter as cell ID, this cell will always be shown after refresh. If you don't specify this parameter, the **last opened cell** will be displayed. 


Now, each time, you refresh the page, the url will be formed according to the info stored in the state object and the latest opened tab will be shown. 

##Pushing New State to History

In addition, there exists a possibility to add a new state to history with the dedicated **push()** method. Its arguments are: 

- **view** - ID of related switching control;
- **url** -	ID of the cell that will form in-page url for new state (if you pass *cellID*, the url will be formed as *#!/cellID*);
- **value** - any related data in the form of a JSON object. If will be stored in the **state** object. 

The method is applied to **history** object:

~~~js
webix.history.push("tabbar", "detailView" "details");
~~~

..where details are:

~~~js
var details = {
	view:"template", 
	template:"Some very long text"
};
~~~

However, this will cause the URL bar to display *http://current_url.html#!/detailView*, but won't cause the browser to look for *detailView* anchor or even check whether it exists. It just adds this info to window history object.

##Disabling history tracking

You can disable current history tracking process by calling the method again in some moment of the application flow: 

~~~js
webix.history.track("tabbar");

//disables history tracking for tabbar
webix.history.track();
~~~

In addition, you can set another view as a history tracking master: 

~~~js
webix.history.track("tabbar1");

//disables history tracking for tabbar1 and starts tracking tabbar2
webix.history.track("tabbar2");
~~~

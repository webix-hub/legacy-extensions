Offline Support
==============================

Offline support allows storing server-side data locally in your browser cache, which helps you proceed working with data components 
after refresh even if connection to the server fails.

##Webix Proxies for Caching Component Data

For Webix components offline support can implemented in three modes:

- **offline** and **cache**, both working with server-side data that is additionally stored locally; 
- **local** that works with local storage data only. 

In all these modes Webix caches the data to browser local storage via **webix.storage.local** interface. See the description of caching logic.

The implementation is provided by Webix offline and cache proxy objects that are described separately.

###Offline Mode

The offline mode ensures that server-side data is stored in a browser local storage upon loading. Later on the component first try to reach server 
to get or save data, BUT in case of failure, the data will be loaded from the cache and stored in the cache, accordingly.

When you are connected again, all the changed data should be derived from the cache and sent to the server (otherwise on next page refresh it will be replaced 
by outdated server-side data). 

To enable this, enable the **offline** proxy for loading and saving scripts by prefixing the url with its name:

~~~js
{
	view:"datatable",
	id:"datatable1",
	save: "offline->server/datatable.php",
	url: "offline->server/datatable.php"
}
~~~

If you load data after the component initialization, you can either use a prefix notation or 
provide the proxy explicitely for the api/link/dataloader_load.md function together with the loading script:

~~~js
// the two methods are equal
$$("datatable1").load(offline->server/datatable_load.php);
$$("datatable1").load(webix.proxy("offline", "server/datatable_load.php"));

// or, if you want to load data in the POST request:
$$("datatable1").load(webix.proxy("offline", "post->url.php"));
~~~

###Cache Mode

When you enter the cache mode, data is first loaded to the component and put to the browser local storage, and then you work ONLY with this cached data: 
it's loaded from cache and stored to it without trying to connect to the server.

To enable this, enable the **cache** proxy for loading and saving scripts by prefixing the url with its name:

~~~js
{
	view:"datatable",
	id:"datatable1",
	save: "cache->server/datatable.php",
	url: "cache->server/datatable.php"
}
~~~


If you load data after the component initialization, you can either use a prefix notation or 
provide the proxy explicitely for the api/link/dataloader_load.md function together with the loading script:

~~~js
// the two methods are equal
$$("datatable1").load(cache->server/datatable_load.php);
$$("datatable1").load(webix.proxy("cache", "server/datatable_load.php"));

// or, if you want to load data in the POST request:
$$("datatable1").load( webix.proxy("cache", "post->url.php"));
~~~


###Local Mode

If you want to work with **localStorage** objects only, you can load data from them by providing their names to the cache proxy. 

Note that the objects should be named accoring to *{name}_$proxy$_data* pattern:

~~~js
{
	view:"datatable",
	id:"datatable1",
	// data will be retrieved from "mydata_$proxy$_data" localStorage object
	url: "cache->mydata",
	save: "cache->mydata"
}
~~~


##Working with Component Cached Data 

Both of **offline** and **cache** proxy objects offer API for working with currently cached data. Methods are applied to the component's **url**:

~~~js
$$("datatable1").config.url.setCache();
~~~

- **clearCache()** - removes the data cached for this component;
- **setCache**(data) - pushes any data to cache. Data should be passed as a JSON object or JSON string;
- **saveAll()** - serializes the current component data and pushes it to cache;
- **getCache()** - gets the latest copy of cached data for this component in the form of a JSON object. 
It can be used to populate the component with the help of the api/link/dataloader_parse.md method. 

###Setting Static Cache

You can manually set the data that will be parsed to the component if the initial loading fails due to the connection loss. 

Firstly, you should initialize **cache proxy** with a server script for loading the initial data:

~~~js
var static_proxy = webix.proxy("cache", "server/datatable.php");
~~~

This object will be used for data loading (**url**) and saving (**save**):

~~~js
var grid = {
	view:"datatable",
	save: static_proxy,
	url: static_proxy
};
~~~

Then you can cache the necessary data via the **setCache()** method. If the initial loading fails, this data will be parsed to the component. 

~~~js
if (!static_proxy.getCache()){
	static_proxy.setCache([
		{"id":1,"title":"The Shawshank Redemption ", 
			"year":"1998","votes":194865,"rating":"7.5","rank":1},
		{"id":2,"title":"The Godfather",
			"year":"1974","votes":511495,"rating":"9.2","rank":2}
	]);
}
~~~


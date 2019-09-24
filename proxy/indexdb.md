Working with IndexedDB
======================

Webix offers a simple way for efficient work with [IndexedDB](https://developer.mozilla.org/en-US/docs/IndexedDB/Using_IndexedDB) in-browser storage. 

Complying with the Webix concept of server-side proxy objects, IndexedDB support is implemented via the **indexdb** proxy object, that contains necessary logic for 
creating databases as well as working with existing ones.

Webix **indexdb** proxy object is used for: 

- creating an IndexedDB database in the current browser and populating it with data;
- getting IndexedDB data and loading it into Webix **data components** (datatable, dataview, list, chart);
- saving changes you perform over component data into the corresponding database. Each time you refresh the page an up-to-date data is loaded. 

The **indexdb** proxy object features three built-in **methods**:

- **load** - loads data from the chosen database into the component;
- **save** - saves component changes into the chosen database;
- **create** - creates an IndexedDB database with objectstore(s) and loads data to it (them). 

###Loading data from IndexedDB Store to Webix Component

To load data from an existing IndexedDB database, provide its name together with the the name of objectstore according to the following pattern: **indexdb->db_name/store_name**. 

The names of database and objectstore are **must-have** parameters:

~~~js
{
	view:"datatable",
	id:"datatable",
	url:"indexdb->mydb/mycollection"
}

//or, for loading data after component initialization
$$("datatable").load("indexdb->mydb/mycollection");
~~~

Component's url property as well as load method define data source. 
In case of IndexedDB, they call **load** method of an **indexdb** proxy object and pass database and objectstore names into it.

###Saving Component Data to IndexedDB Database

To save changes performed over component data, you need to pass the names of the database and objectstore into the component's **save** property according to the following pattern: **indexdb->db_name/store_name**:

~~~js
{
	view:"datatable",
	url:"indexdb->mydb/mycollection",
	save:"indexdb->mydb/mycollection"
}
~~~

Component's save property calls the **save** method of an **indexdb** proxy object.

###Creating IndexedDB Database and Populating it with Data 

The **indexdb** proxy allows using its methods directly. For instance, you can call the **create** method with the following code:

~~~js
webix.proxy.indexdb.create(dbname, collection_data, dbversion, callback);
~~~

Where: 

- **dbname** - name of a database which is being created;
- **collection_data** - JSON object that contains **collection names** as keys and **collection data** as values;
- **dbversion** - version of the database being created. It you prefer not to bother about versions, pass *null*;
- **callback** - callback function. 

Here's an example of a function call, where *mydb* database with *mycollection* objectstore is created and data is loaded to the objectstore. 

~~~js
webix.proxy.indexdb.create("mydb", {
	mycollection:[
		{"id":1,"title":"The Shawshank Redemption ","year":"1998" },
		{"id":2,"title":"The Godfather","year":"1975" },
		{"id":3,"title":"The Godfather: Part II","year":"1974" },
		{"id":4,"title":"The Good, the Bad and the Ugly","year":"1966" },
		{"id":5,"title":"My Fair Lady","year":"1994" },
		{"id":6,"title":"12 Angry Men","year":"1957" }
	],
	//mycollection2:[data], //as many stores as you like
	//mycollection2:[data]
}, null, init_demo);
~~~
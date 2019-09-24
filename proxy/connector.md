Data Connector
=======================

The Server Side Connectors belong a third-party library, but can be used for Webix components for saving their data to server. They come in **PHP, Java, .Net, ColdFusion** versions.

Connectors interpret requests sent by Webix components during CRUD operations and server sorting and filtering and generate queries to update database tables accordingly. 

As a rule, one and the same connector is used for loading and saving data.

##Connector Documentation {#docu}

- [PHP connectors](https://docs.dhtmlx.com/connector__php__index.html);
- [Java Connectors](https://docs.dhtmlx.com/connector__java__index.html);
- [.Net Connectors](https://docs.dhtmlx.com/connector__net__index.html);
- [ColdFusion Connectors](https://docs.dhtmlx.com/connector__cf__index.html).

There you should search for standard **DataConnector** and **JSONDataConnector**. 

##Data Loading {#loading}

Connectors perform database queries and return data in **XML** format (standard DataConnector) or in **JSON** (JSONDataConnector). 

To load data with the help of the necessary connector, you should: 

- write a **connector-based script** that connects to the necessary database AND contains **path to the necessary connector**. In addition, it may contain extra data rendering logic (described below).
- specify this script as **url** for the Webix component you work with.

~~~js
webix.ui({
	view: "datatable",
	url: "server/data.php" 
	datatype:"xml"
});

//or, in case you load data after component initialization:
$$("grid").load("server/data.php");
~~~

Data type can be omitted in case of JSONDataConnector since it returns data in default JSON format;

##Connector Based Script (PHP Solution)

Below is the guide how to write the **script** that will link a data component and **Data Connector**:

###1 . Connect to the database and select to the necessary connector. 

Specify path to desired Data Connector, and connect to your database: 

~~~php
require_once("../../data_connector.php"); //!connector
$dbtype = 'MySQLi';
$conn = mysqli_connect(localhost, "login","password");
~~~

###2 . Initialize Data Connector: 

~~~php
$data = new JSONDataConnector($conn, $dbtype); 
~~~

Here you can enable protection against CSRF and XSS attacks: 

CSRF Protection

~~~js
ConnectorSecurity::$security_key = true;
~~~

XSS Protection

~~~js
//safehtml
ConnectorSecurity::$xss = DHX_SECURITY_SAFEHTML;

//trusted
ConnectorSecurity::$xss = DHX_SECURITY_TRUSTED;
~~~

By default, SECURITY_SAFETEXT protection is used, so you needn't specify it directly.

###3 . Render data from the needed table/ tables: 

In case of a **single table** you should specify its name, the primary key field and field names you'd like to render:

~~~php
$data->render_table("users","id","user, email, status"); 
~~~

In case of **hierarchical data**, you also specify **relation id**, which is the name of the field that stores ID of the parent branch for this record:

~~~js
$data->render_table("users", "id", "user, email, status", "", "relation_id" );
~~~

In case of **several tables** you need to write a SQL-query, specify the primary key field and fields to render. 

~~~php
$data->render_sql("SELECT user, email, status, project FROM users, projects", "id", "user, email, status, project");
~~~

Here you can enable dynamic loading, which is useful in case of long datasets. The argument states the number of records loaded initially while the others will be loaded as you scroll 
or page through the data in the component: 

~~~php
$data->dynamic_loading(30);
~~~

**Comments:**

**Render_table** and **render_sql** have common parameters: 

 - table name / SQL-query;
 - name of primary key (ID) field;
 - names of fields to take data from;
 
###4 . Customize rendered data
 
Apart from these two basic functions, you can add extra functionality by using the following methods:
 
 - **configure**  - configuring a temporary table for further usage the same way you do it with **render_table**.  
 - **limit** - customizing the amount of rendered data. Takes for parameters: start line, the number of lines to be rendered, column name to take data from, and sorting direction in this column;

~~~php
$last_value -> configure("wages", "id", "values, start_date"); 

$last_value -> limit(0, 1, "date_start", "desc"); 
~~~
 
Here values from the "wages" table are sorted by date while the descending direction means that the highest line will be the latest value. The result of the query will be the first line of the sorted table. 
 
 - **mix** - defining data for a field/column in the UI component. The data comes from the table different from that you use to render data for this component. 
 
~~~php
$data -> mix("wage", $last_value, array("empl_id" => "id")); 
~~~

Here the method works with a column/field name of the component, the value, you'd like to render there and ID correspondence between the tables. 
 
 - **filter** - filtering data on the server side. Takes column name and desired value as arguments
 
~~~php
$data -> filter("field_name = ''"); 
~~~

Here the data is filtered by a "field_name" field and shows all records where it is empty. 
  
Connectors have big possibilities of customization, so consult their documentation.

##Saving Data with Connectors {#saving}

To enable saving data with the chosen connector, you should specify it as value of the component **save** property:

~~~js
webix.ui({
	view: "datatable", 
	url: "server/data.php" 
	save:"connector->server/data.php"
	datatype:"xml"
});
~~~

Now when a save script is provided, the component's DataProcessor reacts on each update, insert, delete operation performed in the component. 
It sends requests to the connector script and passes the changed data to the server side. 

The must-have detail here is a **connector** prefix before the path. It enables Webix connector proxy to adjust requests to the need to Data Connectors. 


###Save Protocol

- on each data change, a POST request is issued automatically. It receives *?editing=true* postfix for the query string. 
- the request holds the data of the changed record with the **!nativeeditor_status** (update, insert, delete) field that is defined automatically on the base of user actions;
- server response from Data Connector comes as XML that includes type of performed action, original item ID and item ID after processing.

ServerSide Response

~~~xml
<?xml version='1.0' ?><data><action type='update' sid='1' tid='1' ></action></data>
~~~

For newly added records client-side ID (sid) and ID generated by a database (tid) may differ. Data Processor ensures that that the created record is updated with the server-side ID on the client.
WebSockets (Faye)
=================

Faye proxy object is used to ensure **live data updates** on all the clients currently using the application with this feature. 
It is based on Faye](http://faye.jcoglan.com) publish-subscribe messaging system, which in its turn is based on the [Bayeux](http://svn.cometd.com/trunk/bayeux/bayeux.html) protocol. 

The **Faye** proxy object is useful for creating corporate chats clients. It can be used with any Webix **data component**, while a list is the most suitable one for a chat.  

The proxy object is defined within the component constructor with the help of the url and save properties:

~~~js
{
	view: "list", 
	id:"chat", 
	url: "faye->/data", 
	save: "faye->/data"
}
//or, to load data after component initialization
$$("chat").load("faye->/data");
~~~

- The **url** property, as well as the load method are used to define the data source for the component. 
Here it includes the **proxy name** (Faye) and the **storage name** on your Faye server (any server will do);
- The **save** property enables data saving to the chosen storage. On page refresh, the up-to-date data is loaded into the component.

The storage name must contain a **slash** at the beginning.

**Starting Faye server**

Besides, you need to provide a standard logic for starting a **Faye server**:

~~~js
var http = require('http'),
faye = require('faye');

var server = http.createServer(),
bayeux = new faye.NodeAdapter({mount: '/'});

bayeux.attach(server);
server.listen(8000);
~~~

**Initializing Faye client**

You also need to define a **Faye client** and its **ID**, that are required for the **faye** proxy:

~~~js
webix.proxy.faye.client = new Faye.Client('//localhost:8000/');
webix.proxy.faye.clientId = webix.uid(); //or any custom pattern
~~~
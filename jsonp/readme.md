## JSON with Padding or JSONP

In the context of Webix, the JSONP technique requires changes in the client-side code, namely you should get data with a special **webix.jsonp()** method, 
that hides all technical details of JSONP handling, but at the same time you need to add a few lines of code:

~~~js
//client-side pattern
webix.jsonp("http://data.mydomain.com/data.php", {}, function(data){
	table.parse(data);
});
~~~

Note that in comparison to **Ajax**, **JSONP** always provides **structured data**, not raw response text. That's why the server script must return encoded data:

~~~js
//server-side pattern
$data = get_data_in_some_way();
$json_data = json_encode($data);

$jsonpname = $_GET["jsonp"];

header('content-type: application/json; charset=utf-8');
echo $jsonpname."(".$json_data.")";
~~~

As you can see, the response data is wrapped, encoded as JSON and is sent back combined with the "jsonp" parameter. 

[Wikipedia article about JSONP](http://en.wikipedia.org/wiki/JSONP).

**Advantages**:

JSONP works in all browsers and doesn’t require server reconfiguration.

**Drawbacks**:

JSONP requires extra coding, but is limited to work only with structured data, as well as suitable only for GET requests. At the same time, it is prone to XSS attacks. 
It's recommended to resort to JSONP only if you need to support IE8 and IE9 browsers. 
	
## API

Parameters:

- url    	(string)   	server-side feed
- params    (object)    hash of parameters which will be included in jsonp url
- callback  (function)  callback method
- master    (object)    value of "this" in callback

Only the url parameter is compulsory. 

The callback function takes one parameter:

- data - (object) the value returned by a server.

~~~js
// minimal call
webix.jsonp("http://some.com/some.php", function(data){
... do something...
});

// call with extra parameters
webix.jsonp("http://some.com/some.php", {
	user:12,
	action:"fetch"
}, function(data){
	//do something
});
~~~


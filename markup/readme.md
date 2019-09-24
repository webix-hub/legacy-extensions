Initialization from Markup
============

Library components can be initialized within HTML and XML markup. 

**Bonuses of markup initialization**

- you needn't define a template to enable data rendering. Still, you should use property names in hash signs;
- the data source can be defined in frames of unordered lists or HTML tables.

##Initializing from Markup

XML and HTML markup initialization can totally replace JSON configuration for people who are more used to working with markup languages. It has simpler syntax, so you are less likely to get lost among brackets and commas. Such functionality can be useful when you code the page with the help of server scripts since it's easier to get XML (HTML) data from them than JSON. 

In general, the markup can be taken from:

- any **node** of this document including **body**;
- **separate file** with HTML or XML markup;
- response of **server script**;

HTML and XML markup get **peculiar tags** to serve the needs of Webix object initializing (described later). 

Webix HTMLform component is more likely to be initialized from HTML and XML, though any component is subject to this technique. 

##Working with Webix Markup Class

To init Webix components from HTML or XML, you should work with **webix.markup** class that offers a pattern for markup processing. 

The main methods here are **init**(node, target) and **parse**(node) where arguments mean: 

- **node** - which data to use for initialization. By default data is taken from **document.body**.
- **target** - where should the newly created component be placed. By default it's placed into the HTML node defines by **node** (document.body, if it's not defined as well).

Initializing and parsing serve different purposes: 

- The **init()** method initializes Webix object in HTML layout.
- The **parse()** method initializes the component in Webix layout. 

The simplest initialization script looks as follows: 

~~~js
// data is taken from document body and component is initialized there
webix.ready(function(){ 
	webix.markup.init(); 
});
~~~

**External-file** or **server-side data** is loaded to the page by **Ajax**. Here you should specify path to the file(script) and set initialization pattern in a callback. 

In the code below, the data comes from an external XML file, the **node** is the incoming data, while the **target** is the body of the current document. 


~~~js
webix.ajax("data/config.xml?!", function(text, data){
	var config = webix.markup.parse(text, "xml");
	webix.ui(config);
});
~~~


You can use markup initialization by **parsing markup** to the necessary part of the Webix script thus creating a Webix object.

~~~js
webix.ui({
	rows:[{}, {id:"placeholder", template:"html->dummy"}]
});

function load_grid(){
	webix.ajax("data/gridconfig.xml", function(text, data){
		webix.ui(
			webix.markup.parse(text, "xml"), //source 
			$$("placeholder")
		); //target 
	});
};
~~~

The target is not defined within the **parse()** function, yet it is specified in the **webix.ui()** constructor as *$$('placeholder')*. 

##Initialization from HTML

Initialization from HTML is a nice feature for those who work in HTML mainly. By the way, a similar technology is used within JQuery Mobile framework. 

##Basic principles

###1. DIV blocks as components

The page is divided into **div** blocks that house Webix components defined by their **data-view** attribute:

- *data-view="component_name"* to initialize most of Webix components;
- *data-view="cols" or data-view="rows"* to initialize Webix layout;

~~~html
<div data-view="rows"> <!--layout-->
	<div data-view="template" data-height="35"> My header</div> <!--template-->
</div>    
~~~

{{note
To parse your markup correctly, remember that you should provide all HTML elements in **one line**. Do not separate them with newlines.
}}

###2. "Data" attributes as component properties

DIV "data" attributes set other properties of the component: 

~~~html
<div data-view="text" data-name="email" data-label="Email"></div>
~~~

In other words, you use the same properties as in JSON configuration, but prefix them with "data-".

Pay attention that while parsing from HTML, camelCase attributes must be replaced with dashed ones: "minWidth" => "data-min-width":

~~~html
<div data-view="list" data-width="320" data-max-width="500" data-min-width="100">
	#id#: #value#
	<ul data-view="data">
		<li data-id="9998">Item 1</li>
		<li data-id="9999" class='myitem'>Item 2</li>
	</ul>
</div>
~~~

###3. Inner HTML matters

Inner HTML of a DIV block defines visible text: 

- text of a button, template, text, textarea, etc.: 

~~~html
<div data-view="button" data-width="150">Button</div>
<div data-view="text" data-label="Phone">123456789</div>
<div data-view="template" data-height="35"> My header</div>
~~~

- text of a window head: 

~~~html
<div data-view="window" data-id="win1">
	<div data-view="head">Test header</div>
	...
</div>    
~~~

- data template for data management components: 

~~~html
<div data-view="list" data-url="data/data.json" data-select="true">
	Package: #Package# (#Version#)
</div>
~~~


###4. Specific tags and attributes

- **data-stack** - defines array or sub items such as rows or cols for layout and the like, and headerlayout (accordion) components: 

~~~html
<div data-view="layout" data-stack="cols">
	<div data-view="template">Cell 1.1</div>
	<div data-view="template">Cell 1.2</div>
</div>
~~~

~~~html
<div data-view="headerlayout" data-stack="cols">
	<div data-view="body" data-header="Section A">
		<div data-view="list" data-url="data/data.json"> #id#: #Package# </div>
	</div>
	<div data-view="body" data-header="Section B">
		<div data-view="list" data-url="data/data.json"> #id#: #Package# </div>
	</div>
</div>
~~~

By default, the sub items will be treated as **rows** for layouts and form and **cols** for toolbar.

~~~html
<div data-view="toolbar"> <!--data-stack="cols"-->
	<div data-view="button" data-width="150">Button</div>
	<div data-view="label" data-label="Press the button to run App"></div>
</div>
~~~

- **config** - defines configuration for a complex property that contains several settings in itself: 

~~~html
<div data-view="list">
	<config name="type" height="50" width="200"></config>
	#id#: #value#
	<ul data-view="data">
		<li data-id="9998">Item 1</li>
		<li data-id="9999" class='myitem'>Item 2</li>
  </ul>
</div>
~~~


###5. Standard HTML 

Standard HTML is used for: 

- form and its elements: 

~~~html
<form>
	<input type="text" name="title" value="" placeholder="Book title" /><br/>
	<textarea name="annotation" id="annotation" rows="4">some book annotation is here
	</textarea><br/>
</form>
~~~

Such code can be easily turned into Webix HTMLForm component:

~~~html
<form data-view="htmlform" data-id="formView">..
~~~

- inline data within data presenting components: 

~~~html
<div data-view="list" data-width="320">
	#id#: #value#
	<ul data-view="data">
		<li data-id="9998">Item 1</li>
		<li data-id="9999" class='myitem'>Item 2</li>
	</ul>
</div>
~~~

Note that inline **data source** is marked by *data-view* attribute with *data* value. 

##Datatable

Datatable and Treetable columns are built from child DIVs of the main component container: 

~~~html
<div data-view="datatable" data-autoheight="true" data-width="400">
	<div data-view="column" data-width="150" data-id="firstname">
		First Name
	</div>
	<div data-view="column" data-width="150" data-id="lastname">
		Last Name
	</div>
	...
</div>
~~~

- "data" attributes are used to set column properties;
- inner HTML of column DIVs is turned into their headers. 


##Pager

When initialized from markup Webix pager should be placed into a separate DIV block while the master component should refer to it by its ID:

~~~html
<div data-view="datatable" data-pager="mypager">
...
</div>
<div data-view="pager" data-id="mypager" group="10" size="3"></div>
~~~

Note that pager properties are not prefixed with "data-".


##TabView and Accordion

Webix TabView and Accordion are made of separate blocks, each of which featuring **header** with title and **body** with content inside.

In markup you need to place each block into a separate DIV with the attributes: 

- **data-view** with **"body"** value;
- **data-header** with header text.

####TabView

~~~html
<div data-view="tabview">
	<div data-view="body" data-header="List 1">
		<div data-view="list" data-url="data/data.json"> #id#: #Package# </div>
	</div>
	<div data-view="body" data-header="Text 2">
		<div data-view="template">Just some text here</div>
	</div>
</div>    
~~~


####Accordion

~~~html
<div data-view="accordion">
	<div data-view="body" data-header="Section A">
		<div data-view="list" data-width="320" data-url="data/data.json"> 
		    #id#: #Package# 
		</div>
	</div>
	<div data-view="body" data-header="Section B">
		<div data-view="list" data-width="320" data-url="data/data.json">
		    #id#: #Package#
		</div>
	</div>
</div>
~~~

##Chart

Chart axes are defined by **config** tags in HTML markup: 

~~~html
<div data-view="chart" data-type="stackedArea" data-color="#58dccd"
	data-value="#sales#" data-alpha="0.7" data-url="data/chart.json">
	<config name="xAxis" template="#year#"></config>
	<config name="yAxis"></config>   
</div>    
~~~

Axis names are defined by **name** attributes while other attributes are not prefixed by "data-" and are the same as in JSON configuration. 

####chart Series

If **series** are needed for the chart they are initialized via a separate **config** object: 

~~~html
<div data-view="chart" data-type="stackedArea" alpha="0.7"
  eventRadius="5" data-url="data/chart.json">
	<config name="xAxis" template="#year#"></config>
	<config name="yAxis"></config>
	<config stack='series'>
		<config  value="#sales#" color="#58dccd">
			<config name="tooltip" template="#bottom#"></config>
		</config>
		<config  value="#sales2#" color="#dc58cd">
			<config name="tooltip" template="#bottom#"></config>
		</config>
		...
	</config>
</div>
~~~

The attributes of series are not prefixed by "data-" and are the same as in JSON configuration. 

##Windows and Menus

####Window peculiarities

When initializing Webix window from markup, you need to remember the following things:

- window should be set on the same level as other layout components;
- window is comprised of two parts - **head** and **body** that should be defined via separate DIV blocks. 

~~~html
<div data-view="rows">
	<!--layout config>-->
</div>
...
<div data-view="window" data-id="win1">
	<div data-view="head">Test header</div>
	<div data-view="body">
		<div data-view="template">Cell 1.2</div>
	</div>
</div>
~~~

- in addition, window api/link/ui.window_show.md method should be called as it won't appear by itself:

~~~js
webix.markup.init();
$$("win1").show();
~~~

####Menu and submenu peculiarities

If menu is initialized from markup it's vital to remember that its sub-menus should be as well initialized the same way as windows: 

~~~html
<div data-view="submenu" data-id="submenu1">
	<ul data-view="data">
		<li data-id="1.1" data-submenu="submenu3">Item 1.1</li>
		<li data-id="1.2">Item 1.2</li>
	</ul>
</div>
~~~

And then they should be included into the main menu (or other sub-menus) with the help of their **submenu** property (submenu ID should be specified):

~~~html
<div data-view="menu" data-height="50">
	<ul data-view="data">
		<div data-view="menu">
			<ul data-view="data">
				<li data-id="1" data-submenu="submenu1">Item 1</li>
				<li data-id="2" data-submenu="submenu2">Item 2</li>
			</ul>
		</div>
		<li data-id="3">Item 3</li>
	</ul>
</div>
~~~

Any level of nesting is possible. 

## Selection widgets

You can also initialize Combo and other selection widgets from HTML markup. The list of options should be provided without IDs in the **config** HTML element. IDs are automatically generated on the base of values.

~~~html
<div data-view="combo">
	<config stack="options">
		<li>Item 1</li>
		<li>Item 2</li>
	</config>
</div>
~~~

##Initialization from XML

Initialization from XML is simpler in terms of syntax while at the same time tags feature greater semantic value than HTML, yet XML is not that popular due to its "strict" nature. 

To integrate this functionality with IE8, set the initial page tag as **< html xmlns:x >** instead of < html >.  

Below the peculiarities of initialization for different Webix components are listed. 

##Layout with different components

XML Toolbar, List and Form

~~~xml
<x:ui>
	<x:rows>
		<x:template>My header</x:template>
		<x:toolbar>
			<x:button width="150">Button</x:button>
			<x:label>Press the button to run App</x:label>
		</x:toolbar>
		<x:cols>
			<x:list url="data/data.json" select="true">
				<x:template>Package: #Package# (#Version#)</x:template>
			</x:list>
			<x:htmlform>
				<input type="submit" />
			</x:htmlform>
			<x:list width="320">
				<x:template>#id#: #value#</x:template>
			   <x:data>
					<li id="9998">Item 1</li>
					<li>Item 2</li>
			   </x:data>
			</x:list>
		</x:cols>
		<x:template>My footer</x:template>
	</x:rows>
</x:ui>
~~~

####Comments: 

- semantically rich tags coincide with component names. The pattern such for tags is as follows: **< x:name >**;
- **x:** namespace for tags that form Webix component including Webix **ui** constructor(**< x:ui >**);
- component properties come as tag attributes;
- standard HTML tags perform their function in the way they do it in HTML (< li >);
- Form in layout comes in standard HTML tags while **form** not placed in layout requires specific tags as well. 

##Accordion

Accordion features an array of **accordionitems**, each of which has a **header** and **body** where any Webix component can be placed.

**JS initialization** 

~~~js
{ view:"accordion", rows:[
	{
		header:"Section A", 
		body:{
			view:"list", 
			url:"data/data.json", 
			template:"#id#: #Package#"
		} 
	}
]}
~~~

**XML initialization**

Remember that anything you initialize from XML, should be among **< x:ui >** tags!

~~~xml
<x:accordion>
	<x:body header="Section A">
		<x:list width="320" url="data/data.json"> #id#: #Package# </x:list>
	</x:body>
</x:accordion>
~~~

Or:

~~~xml
<x:headerlayout stack="cols">
	<x:body header="Section A">
		<x:list url="data/data.json"> #id#: #Package# </x:list>
	</x:body>
</x:headerlayout>
~~~

##Datatable

Datatable features an array of columns each of which has a set of configuration options: 

**JS Initialization**

~~~js
{
	view:"datatable", 
	autowidth:true, autoheight:true,
	columns:[
		{id:"rank", header:"", width:250, sort:"int"},
		{id:"title", header:"Film title", width:200, sort:"string"}
	]
}
~~~

**XML Initialization**

~~~xml
<x:datatable autowidth="true" autoheight="true">
	<x:column id="rank"  header="" 			 width="50"  sort="int"></x:column>
	<x:column id="title" header="Film title" width="200" sort="string"></x:column>
</x:datatable>
~~~

##Form {#XMLform}

If placed in layout rows or cols, form can be initialized with standard HTML tags. **Standalone form** not placed in layout requires tags with **x:** prefix.

~~~xml
<x:form id="log_form" width="300">
	<x:text label="Email"></x:text>
	<x:button value="Login" type="form"></x:button>
</x:form>
~~~

HTMLform has its own initializing patterns including via webix markup class.

##TabView

TabView is a hybrid layout that features several view cells and dedicated tabs to switch between these cells. 

**XML Initialization**

During XML initialization you needn't define IDs - just place necessary components within **body tags** that substitute **cells**. At the same time, **header attribute** of this tag defined **text value** for a **tab**. 

~~~xml
<x:tabview>
	<x:body header="List 1">
		<x:list url="data/data.json"> #id#: #Package# </x:list>
	</x:body>
	<x:body header="Text 2">
		<x:template>Just some text here</x:template>
	</x:body>
</x:tabview>
~~~

##Altering Namespace

You can change the default **x:** namespace as well as completely get rid of it. You need to define the new namespace before initialization from markup:

~~~js
webix.markup.namespace = ""; //empty namespace
webix.markup.namespace = "wx"; //new namespace

webix.markup.init();
~~~

From now on, you can use initialize Webix components using standard tags, or tag with your custom namespace:

Empty Namespace

~~~xml
<ui>
	<form id="log_form" width="300">
		<text label="Email"></text>
	</form>
</ui>
~~~

Custom Namespace

~~~xml
<wx:ui>
	<wx:form id="log_form" width="300">
		<wx:text label="Email"></wx:text>
	</wx:form>
</wx:ui>
~~~


##HTMLForm and Markup 


**HTML**

Form elements are created according to standard HTML.

- **form** tag receives new attributes;
- **data-view** to indicate the component (here it is an *htmlform*);
- standard htmlform properties with 'data' prefix (*data-id, data-height*, etc.);

~~~html
<form data-view="htmlform" data-id="htmlform1" data-height="350">
	<input type="text" name="title" value="" placeholder="Book title" /><br/>
	...
</form>
~~~

**XML**

There are special tags with 'x:' prefix: 
- **< x:ui >** to indicate a webix UI constructor;
- **< x:htmlform** > to indicate a component you want to initialize.

~~~html
<html xmlns:x>
	<x:ui>
		<x:htmlform id="htmlform1" height="350">
			<input type="text" name="title" value="" placeholder="Book title" /><br/>
		</x:htmlform>
	</x:ui>
</html>
~~~

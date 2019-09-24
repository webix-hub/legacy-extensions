Flash uploader
=====================

The module extends the API of Webix UploadDriver with methods compatible with IE8 - IE10 browsers.

To use it, extend the standard webix.UploadDriver with its functionality:

~~~js
webix.extend(webix.UploadDriver, webix.UploadDriver.flash, true);
~~~
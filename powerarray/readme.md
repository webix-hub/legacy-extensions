PowerArray
=================

Polyfills for arrays.

~~~js
var data = webix.toArray([ .. ]);
~~~

##each

executes a defined function for each element of an array

- functor	(function)	the function that needs executing
- master	(object)	optional, the value to be passed as the this parameter

~~~js
data.each(function(obj){
  console.log(obj);
});
~~~

##filter	

filters the array and returns the initial but filtered array


- functor	(function)	the filtering function
- master	(object)	the object that the function should be applied to

##find	

returns the index of an element in the array, or -1 if it doesn't exist

- data	(any) the element value

##insertAt	

adds an element to a collection at the specific position

- data	(any)	the element to add
- pos	(number)	the element position in the array

##map	

transforms the initial calling array according to the functor and returns the transformed initial array

- functor	(function)	the method which needs executing
- master	(object)	the object that the method should be applied

##remove	

removes an element from the array

- value	(any)	the element value

##removeAt	

removes one or more elements from the specified position

- pos	(number)	the element(s) position
- len	(number)	the number of elements to remove

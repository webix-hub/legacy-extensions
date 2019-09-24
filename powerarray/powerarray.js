webix.toArray = function(array){ 
	return webix.extend((array||[]),webix.PowerArray, true);
};


webix.PowerArray = {
	//remove element at specified position
	removeAt:function(pos,len){
		if (pos>=0) this.splice(pos,(len||1));
	},
	//find element in collection and remove it 
	remove:function(value){
		this.removeAt(this.find(value));
	},	
	//add element to collection at specific position
	insertAt:function(data,pos){
		if (!pos && pos!==0)	//add to the end by default
			this.push(data);
		else {
			this.splice(pos, 0, data); 
		}
	},
	//return index of element, -1 if it doesn't exists
	find:function(data){ 
		for (var i=0; i<this.length; i++) 
			if (data==this[i]) return i;
		return -1; 
	},
	//execute some method for each element of array
	each:function(functor,master){
		for (var i=0; i < this.length; i++)
			functor.call((master||this),this[i]);
	},
	//create new array from source, by using results of functor 
	map:function(functor,master){
		for (var i=0; i < this.length; i++)
			this[i]=functor.call((master||this),this[i]);
		return this;
	}, 
	filter:function(functor, master){
		for (var i=0; i < this.length; i++)
			if (!functor.call((master||this),this[i])){
				this.splice(i,1);
				i--;
			}
		return this;
	}
};
'use strict';

window.utilities = {

	init: function() {

	},

	// Partition an array into columns
	arrayPartition: function(arr, size) {
		var newArr = [];
		for (var i=0; i<arr.length; i+=size) {
			newArr.push(arr.slice(i, i+size));
		}
		return newArr;
	},

	arrayGetUnique: function(arr){
		var u = {}, a = [];
		for(var i = 0, l = arr.length; i < l; ++i){
			if(u.hasOwnProperty(arr[i])) {
				continue;
			}
			a.push(arr[i]);
			u[arr[i]] = 1;
		}
		return a;
	},

	arrayRemoveDuplicates: function(a,prop) {
		var seen = {};
		var out = [];
		var len = a.length;
		var j = 0;
		for(var i = 0; i < len; i++) {
			var item = a[i];
			if(prop) {
				if(seen[item[prop]] !== 1) {
					seen[item[prop]] = 1;
					out[j++] = item;
				}
			} else {
				if(seen[item] !== 1) {
					seen[item] = 1;
					out[j++] = item;
				}
			}
		}
		return out;
	},

	arrayObjectIndexOf: function(myArray, searchTerm, property, returnUndefinedProperty) {
		for(var i = 0, len = myArray.length; i < len; i++) {
			if(myArray[i]) {
				if (myArray[i][property] === searchTerm) {
					return i;
				}
			} else if (returnUndefinedProperty) {
				return i;
			}
		}
		return -1;
	},

	arrayRemoveValue: function(arr, val) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === val) {
				arr.splice(i, 1);
				i--;
			}
		}
		return arr;
	},

	arrayHasProperty: function(haystack, needles, property, uniqueProperty) {
		var arr = [];
		for(var h = 0; h < haystack.length; h++) {
			if(haystack[h].hasOwnProperty(property)) {
				var needs = [];
				if(needles.constructor !== Array) {
					needs.push(needles);
				} else {
					needs = needles;
				}


				for(var n = 0; n < needs.length; n++) {
					var props = [];
					if(haystack[h][property].constructor !== Array) {
						props.push(haystack[h][property]);
					} else {
						props = haystack[h][property];
					}

					for(var p = 0; p < props.length; p++) {
						if(props[p] === needs[n]) {
							if(uniqueProperty) {
								arr[ haystack[h][uniqueProperty] ] = haystack[h];
							} else {
								arr.push(haystack[h]);
							}
						}
					}
				}
			}
		}

		this.arrayRemoveValue(arr, undefined);

		return arr;
	},

	randomHash: function(maxLength) {
		var hash = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		maxLength = maxLength || 5;

		for( var i=0; i < maxLength; i++ )
		hash += possible.charAt(Math.floor(Math.random() * possible.length));

		return hash;
	},
	
	stringToBoolean: function(string){
		switch(string.toLowerCase()){
			case "true": case "yes": case "1": return true;
			case "false": case "no": case "0": case null: return false;
			default: return Boolean(string);
		}
	}

};


$(document).ready(function(){
	window.utilities.init();
});

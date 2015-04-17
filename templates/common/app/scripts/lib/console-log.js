/**
* Console Log
* (c) 2014 by Marcus Heath Showalter. All rights reserved.
*
* Adds console.log functionality to browsers that don't support console
*
* Author: Marcus Heath Showalter
* Web: heathshowalter.com
* Email: marcus.h.showalter@lmco.com
* Date: 2014-09-15 01:56 AM
*/

'use strict';
/*jshint indent:4 */

window.log = function(){
	var log;
	log.history = log.history || [];
	log.history.push(arguments);
	if(this.console){
		console.log( Array.prototype.slice.call(arguments) );
	}
};

'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');


var Generator = module.exports = function Generator() {
	ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createPageFiles = function createPageFiles() {
	this.generatePage(
	'page/page',
	'spec/controller',
	'pages',
	this.options['skip-add'] || false
	);
};

'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createComponentFiles = function createComponentFiles() {
  this.generateComponent(
    'component/component',
    'spec/directive',
    'components',
    this.options['skip-add'] || false
  );
};

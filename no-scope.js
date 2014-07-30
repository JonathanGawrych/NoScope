/**
* @license NoScope v0.1.0
* Copyright (c) 2014 Jonathan Gawrych
* License: MIT
*/

/* jshint evil:true */

(function (window, document, undefined) {
	'use strict';

	if (typeof angular === 'undefined') {
		throw new Error('Angular is not defined');
	}

	var NoScope = angular.module('NoScope', []);
	NoScope.constant('NoScope-version', {
		full: '0.1.0',
		major: 0,
		minor: 1,
		dot:   0,
		codeName: 'cold-bore'
	});

	function descriptor(varName) {
		return '", {' +
		       '  get: function getter() { return ' + varName + '; }, ' +
		       '  set: function setter(val) { return ' + varName + ' = val; }, ' +
		       '  configurable: true, ' +
		       '  enumerable: true, ' +
		       '});';
	}

	NoScope.constant('NoScope', function NoScope(scopeName, varNames) {
		var binders = '';
		var defineFor = 'Object.defineProperty(' + scopeName + ', "';

		for (var i = 0; i < varNames.length; i++) {
			binders += defineFor + varNames[i] + descriptor(varNames[i]);
		}
		return binders;
	});


})(window, document);

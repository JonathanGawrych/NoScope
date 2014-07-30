/**
* @license NoScope v0.1.1
* Copyright (c) 2014 Jonathan Gawrych
* License: MIT
*/

/* jshint evil:true */

(function (window, document, undefined) {
	'use strict';

	function descriptor(varName) {
		return '", {' +
		       '  get: function getter() { return ' + varName + '; }, ' +
		       '  set: function setter(val) { return ' + varName + ' = val; }, ' +
		       '  configurable: true, ' +
		       '  enumerable: true, ' +
		       '});';
	}

	window.noScope = function noScope(scopeName, varNames) {
		var defineFor = 'Object.defineProperty(' + scopeName + ', "';

		var binders = '';
		for (var i = 0; i < varNames.length; i++) {
			binders += defineFor + varNames[i] + descriptor(varNames[i]);
		}
		return binders;
	};

	window.noScope.version = {
		full: '0.1.1',
		major: 0,
		minor: 1,
		dot:   1,
		codeName: 'unlimited-targets'
	};

	if (angular) {
		// if angular is defined, define an optional module if they rather not use global variables
		var NoScope = angular.module('NoScope', []);
		NoScope.constant('noScope-version', window.noScope.version);
		NoScope.constant('noScope', window.noScope);
	}


})(window, document);

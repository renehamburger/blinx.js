/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* Umbrella JS 2.10.0 umbrellajs.com */
function ajax(a,b,c,d){c=c||function(){},b=b||{},b.body=b.body||{},b.method=(b.method||"GET").toUpperCase(),b.headers=b.headers||{},b.headers["X-Requested-With"]=b.headers["X-Requested-With"]||"XMLHttpRequest","undefined"!=typeof window.FormData&&b.body instanceof window.FormData||(b.headers["Content-Type"]=b.headers["Content-Type"]||"application/x-www-form-urlencoded"),/json/.test(b.headers["Content-Type"])&&(b.body=JSON.stringify(b.body)),"object"!=typeof b.body||b.body instanceof window.FormData||(b.body=u().param(b.body));var e=new window.XMLHttpRequest;u(e).on("error timeout abort",function(){c(new Error,null,e)}).on("load",function(){var a=/^(4|5)/.test(e.status)?new Error(e.status):null,b=parseJson(e.response)||e.response;return c(a,b,e)}),e.open(b.method,a),e.withCredentials=!0;for(var f in b.headers)e.setRequestHeader(f,b.headers[f]);return d&&d(e),e.send(b.body),e}function parseJson(a){try{var b=JSON.parse(a);if(b&&"object"==typeof b)return b}catch(c){}return!1}var u=function(a,b){return this instanceof u?a instanceof u?a:("string"==typeof a&&(a=this.select(a,b)),a&&a.nodeName&&(a=[a]),void(this.nodes=this.slice(a))):new u(a,b)};u.prototype={get length(){return this.nodes.length}},u.prototype.nodes=[],u.prototype.addClass=function(){return this.eacharg(arguments,function(a,b){a.classList.add(b)})},u.prototype.adjacent=function(a,b,c){return"number"==typeof b&&(b=0===b?[]:new Array(b).join().split(",").map(Number.call,Number)),this.each(function(d,e){var f=document.createDocumentFragment();u(b||{}).map(function(b,c){var f="function"==typeof a?a.call(this,b,c,d,e):a;return"string"==typeof f?this.generate(f):u(f)}).each(function(a){this.isInPage(a)?f.appendChild(u(a).clone().first()):f.appendChild(a)}),c.call(this,d,f)})},u.prototype.after=function(a,b){return this.adjacent(a,b,function(a,b){a.parentNode.insertBefore(b,a.nextSibling)})},u.prototype.ajax=function(a,b){return this.handle("submit",function(c){ajax(u(this).attr("action"),{body:u(this).serialize(),method:u(this).attr("method")},a&&a.bind(this),b&&b.bind(this))})},u.prototype.append=function(a,b){return this.adjacent(a,b,function(a,b){a.appendChild(b)})},u.prototype.args=function(a,b,c){return"function"==typeof a&&(a=a(b,c)),"string"!=typeof a&&(a=this.slice(a).map(this.str(b,c))),a.toString().split(/[\s,]+/).filter(function(a){return a.length})},u.prototype.array=function(a){a=a;var b=this;return this.nodes.reduce(function(c,d,e){var f;return a?(f=a.call(b,d,e),f||(f=!1),"string"==typeof f&&(f=u(f)),f instanceof u&&(f=f.nodes)):f=d.innerHTML,c.concat(f!==!1?f:[])},[])},u.prototype.attr=function(a,b,c){return c=c?"data-":"",this.pairs(a,b,function(a,b){return a.getAttribute(c+b)},function(a,b,d){a.setAttribute(c+b,d)})},u.prototype.before=function(a,b){return this.adjacent(a,b,function(a,b){a.parentNode.insertBefore(b,a)})},u.prototype.children=function(a){return this.map(function(a){return this.slice(a.children)}).filter(a)},u.prototype.clone=function(){return this.map(function(a,b){var c=a.cloneNode(!0),d=this.getAll(c);return this.getAll(a).each(function(a,b){for(var c in this.mirror)this.mirror[c](a,d.nodes[b])}),c})},u.prototype.getAll=function(a){return u([a].concat(u("*",a).nodes))},u.prototype.mirror={},u.prototype.mirror.events=function(a,b){if(a._e)for(var c in a._e)a._e[c].forEach(function(a){u(b).on(c,a)})},u.prototype.mirror.select=function(a,b){u(a).is("select")&&(b.value=a.value)},u.prototype.mirror.textarea=function(a,b){u(a).is("textarea")&&(b.value=a.value)},u.prototype.closest=function(a){return this.map(function(b){do if(u(b).is(a))return b;while((b=b.parentNode)&&b!==document)})},u.prototype.data=function(a,b){return this.attr(a,b,!0)},u.prototype.each=function(a){return this.nodes.forEach(a.bind(this)),this},u.prototype.eacharg=function(a,b){return this.each(function(c,d){this.args(a,c,d).forEach(function(a){b.call(this,c,a)},this)})},u.prototype.empty=function(){return this.each(function(a){for(;a.firstChild;)a.removeChild(a.firstChild)})},u.prototype.filter=function(a){var b=function(b){return b.matches=b.matches||b.msMatchesSelector||b.webkitMatchesSelector,b.matches(a||"*")};return"function"==typeof a&&(b=a),a instanceof u&&(b=function(b){return a.nodes.indexOf(b)!==-1}),u(this.nodes.filter(b))},u.prototype.find=function(a){return this.map(function(b){return u(a||"*",b)})},u.prototype.first=function(){return this.nodes[0]||!1},u.prototype.generate=function(a){return/^\s*<t(h|r|d)/.test(a)?u(document.createElement("table")).html(a).children().nodes:/^\s*</.test(a)?u(document.createElement("div")).html(a).children().nodes:document.createTextNode(a)},u.prototype.handle=function(){var a=this.slice(arguments).map(function(a){return"function"==typeof a?function(b){b.preventDefault(),a.apply(this,arguments)}:a},this);return this.on.apply(this,a)},u.prototype.hasClass=function(){return this.is("."+this.args(arguments).join("."))},u.prototype.html=function(a){return void 0===a?this.first().innerHTML||"":this.each(function(b){b.innerHTML=a})},u.prototype.is=function(a){return this.filter(a).length>0},u.prototype.isInPage=function(a){return a!==document.body&&document.body.contains(a)},u.prototype.last=function(){return this.nodes[this.length-1]||!1},u.prototype.map=function(a){return a?u(this.array(a)).unique():this},u.prototype.not=function(a){return this.filter(function(b){return!u(b).is(a||!0)})},u.prototype.off=function(a){return this.eacharg(a,function(a,b){u(a._e?a._e[b]:[]).each(function(c){a.removeEventListener(b,c)})})},u.prototype.on=function(a,b,c){if("string"==typeof b){var d=b;b=function(a){var b=arguments;u(a.currentTarget).find(d).each(function(d){if(d===a.target||d.contains(a.target)){try{Object.defineProperty(a,"currentTarget",{get:function(){return d}})}catch(e){}c.apply(d,b)}})}}var e=function(a){return b.apply(this,[a].concat(a.detail||[]))};return this.eacharg(a,function(a,b){a.addEventListener(b,e),a._e=a._e||{},a._e[b]=a._e[b]||[],a._e[b].push(e)})},u.prototype.pairs=function(a,b,c,d){if("undefined"!=typeof b){var e=a;a={},a[e]=b}return"object"==typeof a?this.each(function(b){for(var c in a)d(b,c,a[c])}):this.length?c(this.first(),a):""},u.prototype.param=function(a){return Object.keys(a).map(function(b){return this.uri(b)+"="+this.uri(a[b])}.bind(this)).join("&")},u.prototype.parent=function(a){return this.map(function(a){return a.parentNode}).filter(a)},u.prototype.prepend=function(a,b){return this.adjacent(a,b,function(a,b){a.insertBefore(b,a.firstChild)})},u.prototype.remove=function(){return this.each(function(a){a.parentNode&&a.parentNode.removeChild(a)})},u.prototype.removeClass=function(){return this.eacharg(arguments,function(a,b){a.classList.remove(b)})},u.prototype.replace=function(a,b){var c=[];return this.adjacent(a,b,function(a,b){c=c.concat(this.slice(b.children)),a.parentNode.replaceChild(b,a)}),u(c)},u.prototype.scroll=function(){return this.first().scrollIntoView({behavior:"smooth"}),this},u.prototype.select=function(a,b){if(a=a.replace(/^\s*/,"").replace(/\s*$/,""),b)return this.select.byCss(a,b);for(var c in this.selectors)if(b=c.split("/"),new RegExp(b[1],b[2]).test(a))return this.selectors[c](a);return this.select.byCss(a)},u.prototype.select.byCss=function(a,b){return(b||document).querySelectorAll(a)},u.prototype.selectors={},u.prototype.selectors[/^\.[\w\-]+$/]=function(a){return document.getElementsByClassName(a.substring(1))},u.prototype.selectors[/^\w+$/]=function(a){return document.getElementsByTagName(a)},u.prototype.selectors[/^\#[\w\-]+$/]=function(a){return document.getElementById(a.substring(1))},u.prototype.selectors[/^</]=function(a){return u().generate(a)},u.prototype.serialize=function(){var a=this;return this.slice(this.first().elements).reduce(function(b,c){return!c.name||c.disabled||"file"===c.type?b:/(checkbox|radio)/.test(c.type)&&!c.checked?b:"select-multiple"===c.type?(u(c.options).each(function(d){d.selected&&(b+="&"+a.uri(c.name)+"="+a.uri(d.value))}),b):b+"&"+a.uri(c.name)+"="+a.uri(c.value)},"").slice(1)},u.prototype.siblings=function(a){return this.parent().children(a).not(this)},u.prototype.size=function(){return this.first().getBoundingClientRect()},u.prototype.slice=function(a){return a&&0!==a.length&&"string"!=typeof a&&"[object Function]"!==a.toString()?a.length?[].slice.call(a.nodes||a):[a]:[]},u.prototype.str=function(a,b){return function(c){return"function"==typeof c?c.call(this,a,b):c.toString()}},u.prototype.text=function(a){return void 0===a?this.first().textContent||"":this.each(function(b){b.textContent=a})},u.prototype.toggleClass=function(a,b){return!!b===b?this[b?"addClass":"removeClass"](a):this.eacharg(a,function(a,b){a.classList.toggle(b)})},u.prototype.trigger=function(a){var b=this.slice(arguments).slice(1);return this.eacharg(a,function(a,c){var d,e={bubbles:!0,cancelable:!0,detail:b};try{d=new window.CustomEvent(c,e)}catch(f){d=document.createEvent("CustomEvent"),d.initCustomEvent(c,!0,!0,b)}a.dispatchEvent(d)})},u.prototype.unique=function(){return u(this.nodes.reduce(function(a,b){var c=null!==b&&void 0!==b&&b!==!1;return c&&a.indexOf(b)===-1?a.concat(b):a},[]))},u.prototype.uri=function(a){return encodeURIComponent(a).replace(/!/g,"%21").replace(/'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29").replace(/\*/g,"%2A").replace(/%20/g,"+")},u.prototype.wrap=function(a){function b(a){for(;a.firstElementChild;)a=a.firstElementChild;return u(a)}return this.map(function(c){return u(a).each(function(a){b(a).append(c.cloneNode(!0)),c.parentNode.replaceChild(a,c)})})},"object"==typeof module&&module.exports&&(module.exports={u:u,ajax:ajax});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(2);
var Parser = /** @class */ (function () {
    function Parser() {
    }
    Object.defineProperty(Parser.prototype, "bcv", {
        get: function () {
            if (this._bcv) {
                return this._bcv;
            }
            throw new Error('The bcv_parser script has not been loaded successfully yet.');
        },
        enumerable: true,
        configurable: true
    });
    Parser.getCurrentParserLanguage = function () {
        if (window.bcv_parser) {
            var parser = new window.bcv_parser();
            if (parser['languages'] && parser['languages'].length === 1) {
                return parser['languages'][0];
            }
        }
        return false;
    };
    /** Load bcv parser script for the given language */
    Parser.prototype.load = function (options, callback) {
        var _this = this;
        if (Parser.getCurrentParserLanguage() === options.language) {
            this.initBcvParser(options);
            this._bcv = this._bcv || new window.bcv_parser();
            if (callback) {
                callback(true);
            }
        }
        else {
            dom_1.loadScript("https://rawgit.com/openbibleinfo/Bible-Passage-Reference-Parser/master/js/" + options.language + "_bcv_parser.js", function (successful) {
                if (successful) {
                    _this.initBcvParser(options);
                }
                if (callback) {
                    callback(successful);
                }
            });
        }
    };
    Parser.prototype.initBcvParser = function (options) {
        this._bcv = this._bcv || new window.bcv_parser();
        options.parserOptions = options.parserOptions || {};
        if (Parser.getCurrentParserLanguage() === 'de') {
            if (!('punctuation_strategy' in options.parserOptions)) {
                options.parserOptions.punctuation_strategy = 'eu';
            }
        }
        if (!('sequence_combination_strategy' in options.parserOptions)) {
            options.parserOptions.sequence_combination_strategy = 'separate';
        }
        if (options.parserOptions) {
            this._bcv.set_options(options.parserOptions);
        }
    };
    return Parser;
}());
exports.Parser = Parser;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/** Load script for the given src dynamicaly & asynchronously */
function loadScript(src, callback) {
    var script = document.createElement('script');
    script.src = src;
    if (callback) {
        script.onload = function () { return callback(true); };
        script.onerror = function () { return callback(false); };
    }
    document.body.appendChild(script);
}
exports.loadScript = loadScript;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(10);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var blinx_class_1 = __webpack_require__(5);
window.blinx = new blinx_class_1.Blinx();


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var options_1 = __webpack_require__(6);
var polyfills_1 = __webpack_require__(7);
var parser_class_1 = __webpack_require__(1);
var umbrellajs_1 = __webpack_require__(0);
var isString = __webpack_require__(8);
var online_bible_overview_1 = __webpack_require__(17);
var Blinx = /** @class */ (function () {
    /** Initialise blinx. */
    function Blinx() {
        var _this = this;
        this.options = new options_1.Options();
        this.parser = new parser_class_1.Parser();
        options_1.applyScriptTagOptions(this.options);
        this.onlineBible = online_bible_overview_1.getOnlineBible(this.options.onlineBible);
        var pending = 2;
        var callback = function (successful) {
            if (successful) {
                pending--;
                if (pending === 0) {
                    _this.initComplete();
                }
            }
        };
        this.parser.load(this.options, callback);
        polyfills_1.loadPolyfills(callback);
        this.initComplete();
    }
    /** Execute a parse for the given options. */
    Blinx.prototype.execute = function () {
        var _this = this;
        // Search within all whitelisted selectors
        umbrellajs_1.u(this.options.whitelist.length ? this.options.whitelist.join(' *, ') + " *" : 'body')
            .not(this.options.blacklist.join(', '))
            .not(this.options.blacklist.length ? this.options.blacklist.join(' *, ') + " *" : '')
            .each(function (node) { return _this.parseReferencesInNode(node); });
    };
    /** Second step of initialisation after parser & polyfills loaded. */
    Blinx.prototype.initComplete = function () {
        var _this = this;
        if (this.options.parseAutomatically) {
            var handler_1 = function () {
                umbrellajs_1.u(document).off('DOMContentLoaded', handler_1);
                _this.execute();
            };
            umbrellajs_1.u(document).on('DOMContentLoaded', handler_1);
        }
    };
    /**
     * Look for and link all references found in the text node children of the given node.
     * @param node Any
     */
    Blinx.prototype.parseReferencesInNode = function (node) {
        var childNodes = Array.prototype.slice.call(node.childNodes);
        for (var _i = 0, childNodes_1 = childNodes; _i < childNodes_1.length; _i++) {
            var childNode = childNodes_1[_i];
            if (this.isTextNode(childNode)) {
                // Look for all complete Bible references
                this.parser.bcv.parse(childNode.textContent || '');
                var refs = this.parser.bcv.osis_and_indices();
                this.handleReferencesFoundInText(childNode, refs);
            }
        }
    };
    /**
     * Link the given reference and continue looking for further (partial) references in the remaining text.
     * @param node Text node the given reference was found in
     * @param ref bcv_parser reference object
     */
    Blinx.prototype.handleReferencesFoundInText = function (node, refs) {
        for (var i = refs.length - 1; i >= 0; i--) {
            var ref = refs[i];
            var remainder = node.splitText(ref.indices[1]);
            var passage = node.splitText(ref.indices[0]);
            if (passage) {
                this.addLink(passage, ref);
            }
            this.parsePartialReferencesInText(remainder, this.convertOsisToContext(ref.osis));
        }
    };
    Blinx.prototype.convertOsisToContext = function (osis) {
        var separator = this.options.parserOptions && this.options.parserOptions.punctuation_strategy === 'eu' ? ',' : ':';
        return osis.replace(/(\d)\.(\d)/, "$1" + separator + "$2").replace('.', ' ');
    };
    /**
     * Look for and link partial references in the given text node.
     * Unfortunately, bcv.parse_with_context() only works, if the string
     * *starts* with the partial passage, so the beginning needs to be
     * determined by searching for chapter/verse numbers.
     * @param node Text node
     * @param previousPassage Previous recognized passage as parser context
     */
    Blinx.prototype.parsePartialReferencesInText = function (node, previousPassage) {
        var text = node.textContent || '';
        // Search for first number
        var match = text.match(/\d/);
        // TODO: Check support of match.index
        if (match && typeof match.index !== 'undefined') {
            var possibleReferenceWithPrefix = '';
            var possibleReferenceWithoutPrefix = text.slice(match.index);
            var offset = 0;
            if (match.index > 0) {
                // Check if it is preceded by a prefix (which could be 'chapter ' or 'vs.' etc.)
                var preceding = text.slice(0, match.index);
                var matchPrefix = preceding.match(/\w+\.?\s*$/);
                if (matchPrefix) {
                    possibleReferenceWithPrefix = matchPrefix[0] + possibleReferenceWithoutPrefix;
                    offset = match.index - matchPrefix[0].length;
                }
            }
            // Check for possible reference with prefix first
            if (possibleReferenceWithPrefix) {
                this.parser.bcv.parse_with_context(possibleReferenceWithPrefix, previousPassage);
            }
            // If none available or unsuccessful, check for possible reference starting with number(s)
            if (!possibleReferenceWithPrefix || !this.parser.bcv.osis()) {
                this.parser.bcv.parse_with_context(possibleReferenceWithoutPrefix, previousPassage);
                offset = match.index;
            }
            // If either successful, adjust the indices due to the slice above and handle the reference
            var refs = this.parser.bcv.osis_and_indices();
            if (refs.length) {
                for (var _i = 0, refs_1 = refs; _i < refs_1.length; _i++) {
                    var ref = refs_1[_i];
                    ref.indices[0] += offset;
                    ref.indices[1] += offset;
                }
                this.handleReferencesFoundInText(node, refs);
            }
        }
    };
    Blinx.prototype.isTextNode = function (node) {
        return node.nodeType === node.TEXT_NODE;
    };
    Blinx.prototype.addLink = function (node, ref) {
        var versionCode = isString(this.options.bibleVersion) ? this.options.bibleVersion : this.options.bibleVersion.bibleText;
        umbrellajs_1.u(node)
            .wrap("<a></a>")
            .attr('href', this.onlineBible.getPassageLink(ref.osis, versionCode))
            .data('osis', ref.osis);
    };
    return Blinx;
}());
exports.Blinx = Blinx;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var umbrellajs_1 = __webpack_require__(0);
var parser_class_1 = __webpack_require__(1);
var Options = /** @class */ (function () {
    function Options() {
        /** Language code of the language to be used for the parser. */
        this.language = 'en';
        /** Code of the bible version to be used, for the displayed Bible text and the online Bible being linked to. */
        this.bibleVersion = 'en.ESV';
        /** Online Bible to be linked to. */
        this.onlineBible = 'BibleServer';
        /** By default, the parse will start automatically once the page is loaded. If false, it needs to be triggered manually. */
        this.parseAutomatically = true;
        /** Automatic parsing will happen within the elements with the following whitelisted selectors. */
        this.whitelist = ['body'];
        /** Automatic parsing can be disabled with the following whitelisted selectors. */
        this.blacklist = ['a'];
    }
    return Options;
}());
exports.Options = Options;
function applyScriptTagOptions(options) {
    // Parse options object from data-blinx attribute on script tag
    var tagOptionsString = umbrellajs_1.u('script[data-blinx]').data('blinx');
    var opts = {};
    try {
        // tslint:disable-next-line:no-eval
        var evalOpts = eval("(" + tagOptionsString + ")");
        if (evalOpts instanceof Object) {
            opts = evalOpts;
        }
        else {
            throw new Error();
        }
    }
    catch (e) {
        console.error("Blinx: Invalid options: '" + tagOptionsString + "'");
    }
    // If user does not specify language in script tag, check whether he has inlcude a bcv_parser with a single language already
    if (!(opts.language)) {
        var language = parser_class_1.Parser.getCurrentParserLanguage();
        if (language) {
            opts.language = language;
        }
    }
    for (var key in opts) {
        options[key] = opts[key];
    }
}
exports.applyScriptTagOptions = applyScriptTagOptions;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(2);
/** Load polyfills if required */
function loadPolyfills(callback) {
    if ('Promise' in window && classListSupported()) {
        if (callback) {
            callback(true);
        }
    }
    else {
        dom_1.loadScript("https://cdn.polyfill.io/v2/polyfill.js?features=Element.prototype.classList|gated,Promise|gated", callback);
    }
}
exports.loadPolyfills = loadPolyfills;
// Taken from polyfill.io guards
function classListSupported() {
    return 'DOMTokenList' in window &&
        (function (x) { return 'classList' in x ? !x.classList.toggle('x', false) && !x.className : true; })(document.createElement('x')) &&
        'document' in window &&
        'classList' in document.documentElement &&
        'Element' in window &&
        'classList' in Element.prototype &&
        (function () {
            var e = document.createElement('span');
            e.classList.add('a', 'b');
            return e.classList.contains('b');
        })();
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(9),
    isArray = __webpack_require__(15),
    isObjectLike = __webpack_require__(16);

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
}

module.exports = isString;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(3),
    getRawTag = __webpack_require__(13),
    objectToString = __webpack_require__(14);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(11);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ }),
/* 12 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(3);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 16 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var bible_server_online_bible_class_1 = __webpack_require__(18);
function getOnlineBible(name) {
    return name === 'BibleServer' ? new bible_server_online_bible_class_1.BibleServerOnlineBible() : new bible_server_online_bible_class_1.BibleServerOnlineBible();
}
exports.getOnlineBible = getOnlineBible;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var online_bible_class_1 = __webpack_require__(19);
var BibleServerOnlineBible = /** @class */ (function (_super) {
    __extends(BibleServerOnlineBible, _super);
    function BibleServerOnlineBible() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.availableVersionCodes = [
            'ar.ALAB', 'bg.BGV', 'bg.CBT', 'cs.B21', 'cs.BKR', 'cs.CEP', 'cs.SNC', 'da.DK', 'de.ELB', 'de.EU', 'de.GNB', 'de.HFA', 'de.LUT', 'de.MENG', 'de.NeÜ', 'de.NGÜ', 'de.NLB', 'de.SLT', 'de.ZB', 'en.ESV', 'en.KJV', 'en.NIRV', 'en.NIV', 'es.BTX', 'es.CST', 'es.NVI', 'fa.FCB', 'fr.BDS', 'fr.LSG', 'fr.S21', 'he.OT', 'hr.CKK', 'hu.HUN', 'hu.KAR', 'it.ITA', 'it.NRS', 'la.LXX', 'la.VUL', 'nl.HTB', 'no.NOR', 'pl.PSZ', 'pt.PRT', 'ro.NTR', 'ru.CARS', 'ru.RSZ', 'sk.NPK', 'sv.BSV', 'tr.TR', 'za.CCBT', 'za.CUVS'
        ];
        return _this;
    }
    BibleServerOnlineBible.prototype.getPassageLink = function (osis, bibleVersion) {
        // Fixes for sequences
        var sequenceIndex = osis.indexOf('-');
        if (sequenceIndex > 0) {
            // Remove duplicate book from sequences
            var book = osis.split('.')[0];
            osis = osis.replace(new RegExp("-" + book + ".", 'i'), '-');
        }
        return "https://www.bibleserver.com/text/" + bibleVersion.split('.')[1] + "/" + osis;
    };
    return BibleServerOnlineBible;
}(online_bible_class_1.OnlineBible));
exports.BibleServerOnlineBible = BibleServerOnlineBible;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var bible_versions_const_1 = __webpack_require__(20);
var OnlineBible = /** @class */ (function () {
    function OnlineBible() {
    }
    OnlineBible.prototype.getAvailableVersions = function () {
        var allVersions = new bible_versions_const_1.BibleVersions();
        return this.availableVersionCodes.map(function (code) { return allVersions[code]; });
    };
    return OnlineBible;
}());
exports.OnlineBible = OnlineBible;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BibleVersions = /** @class */ (function () {
    function BibleVersions() {
        this['ar.ALAB'] = { title: 'التفسير التطبيقي للكتاب المقدس', languageCode: 'ar', availableSections: ['OT', 'NT'] };
        this['bg.BGV'] = { title: 'Veren', languageCode: 'bg', availableSections: ['OT', 'NT'] };
        this['bg.CBT'] = { title: 'Библия, нов превод от оригиналните езици', languageCode: 'bg', availableSections: ['OT', 'NT', 'Apocrypha'] };
        this['cs.B21'] = { title: 'Bible, překlad 21. století', languageCode: 'cs', availableSections: ['OT', 'NT', 'Apocrypha'] };
        this['cs.BKR'] = { title: 'Bible Kralická', languageCode: 'cs', availableSections: ['OT', 'NT'] };
        this['cs.CEP'] = { title: 'Český ekumenický překlad', languageCode: 'cs', availableSections: ['OT', 'NT', 'Apocrypha'] };
        this['cs.SNC'] = { title: 'Slovo na cestu', languageCode: 'cs', availableSections: ['OT', 'NT'] };
        this['da.DK'] = { title: 'Bibelen på hverdagsdansk', languageCode: 'da', availableSections: ['OT', 'NT'] };
        this['de.ELB'] = { title: 'Elberfelder Bibel', languageCode: 'de', availableSections: ['OT', 'NT'] };
        this['de.EU'] = { title: 'Einheitsübersetzung 2016', languageCode: 'de', availableSections: ['OT', 'NT', 'Apocrypha'] };
        this['de.GNB'] = { title: 'Gute Nachricht Bibel', languageCode: 'de', availableSections: ['OT', 'NT', 'Apocrypha'] };
        this['de.HFA'] = { title: 'Hoffnung für Alle', languageCode: 'de', availableSections: ['OT', 'NT'] };
        this['de.LUT'] = { title: 'Lutherbibel 2017', languageCode: 'de', availableSections: ['OT', 'NT', 'Apocrypha'] };
        this['de.MENG'] = { title: 'Menge Bibel', languageCode: 'de', availableSections: ['OT', 'NT', 'Apocrypha'] };
        this['de.NeÜ'] = { title: 'Neue evangelistische Übersetzung', languageCode: 'de', availableSections: ['OT', 'NT'] };
        this['de.NGÜ'] = { title: 'Neue Genfer Übersetzung', languageCode: 'de', availableSections: ['Psalms', 'NT'] };
        this['de.NLB'] = { title: 'Neues Leben. Die Bibel', languageCode: 'de', availableSections: ['OT', 'NT'] };
        this['de.SLT'] = { title: 'Schlachter 2000', languageCode: 'de', availableSections: ['OT', 'NT'] };
        this['de.ZB'] = { title: 'Zürcher Bibel', languageCode: 'de', availableSections: ['OT', 'NT'] };
        this['en.ESV'] = { title: 'English Standard Version', languageCode: 'en', availableSections: ['OT', 'NT'] };
        this['en.KJV'] = { title: 'King James Version', languageCode: 'en', availableSections: ['OT', 'NT'] };
        this['en.NIRV'] = { title: 'New Int. Readers Version', languageCode: 'en', availableSections: ['OT', 'NT'] };
        this['en.NIV'] = { title: 'New International Version', languageCode: 'en', availableSections: ['OT', 'NT'] };
        this['es.BTX'] = { title: 'La Biblia Textual', languageCode: 'es', availableSections: ['OT', 'NT'] };
        this['es.CST'] = { title: 'Nueva Versión Internacional (Castilian)', languageCode: 'es', availableSections: ['OT', 'NT'] };
        this['es.NVI'] = { title: 'Nueva Versión Internacional', languageCode: 'es', availableSections: ['OT', 'NT'] };
        this['fa.FCB'] = { title: 'کتاب مقدس، ترجمه تفسیری', languageCode: 'fa', availableSections: ['OT', 'NT'] };
        this['fr.BDS'] = { title: 'Bible du Semeur', languageCode: 'fr', availableSections: ['OT', 'NT'] };
        this['fr.LSG'] = { title: 'Louis Segond 1910', languageCode: 'fr', availableSections: ['OT', 'NT'] };
        this['fr.S21'] = { title: 'Segond 21', languageCode: 'fr', availableSections: ['OT', 'NT'] };
        this['he.OT'] = { title: 'Hebrew OT', languageCode: 'he', availableSections: ['OT'] };
        this['hr.CKK'] = { title: 'Knjiga O Kristu', languageCode: 'hr', availableSections: ['NT'] };
        this['hu.HUN'] = { title: 'Hungarian', languageCode: 'hu', availableSections: ['NT'] };
        this['hu.KAR'] = { title: 'IBS-fordítás (Új Károli)', languageCode: 'hu', availableSections: ['OT'] };
        this['it.ITA'] = { title: 'La Parola è Vita', languageCode: 'it', availableSections: ['NT'] };
        this['it.NRS'] = { title: 'Nuova Riveduta 2006', languageCode: 'it', availableSections: ['OT', 'NT'] };
        this['la.LXX'] = { title: 'Septuaginta', languageCode: 'la', availableSections: ['OT'] };
        this['la.VUL'] = { title: 'Vulgata', languageCode: 'la', availableSections: ['OT', 'NT'] };
        this['nl.HTB'] = { title: 'Het Boek', languageCode: 'nl', availableSections: ['OT', 'NT'] };
        this['no.NOR'] = { title: 'En Levende Bok', languageCode: 'no', availableSections: ['NT'] };
        this['pl.PSZ'] = { title: 'Słowo Życia', languageCode: 'pl', availableSections: ['NT'] };
        this['pt.PRT'] = { title: 'O Livro', languageCode: 'pt', availableSections: ['OT', 'NT'] };
        this['ro.NTR'] = { title: 'Noua traducere în limba românã', languageCode: 'ro', availableSections: ['OT', 'NT'] };
        this['ru.CARS'] = { title: 'Священное Писание, Восточный перевод', languageCode: 'ru', availableSections: ['OT', 'NT'] };
        this['ru.RSZ'] = { title: 'Новый перевод на русский язык', languageCode: 'ru', availableSections: ['OT', 'NT'] };
        this['sk.NPK'] = { title: 'Nádej pre kazdého', languageCode: 'sk', availableSections: ['NT'] };
        this['sv.BSV'] = { title: 'Nya Levande Bibeln', languageCode: 'sv', availableSections: ['OT', 'NT'] };
        this['tr.TR'] = { title: 'Türkçe', languageCode: 'tr', availableSections: ['OT', 'NT'] };
        this['za.CCBT'] = { title: '聖經當代譯本修訂版', languageCode: 'za', availableSections: ['OT', 'NT'] };
        this['za.CUVS'] = { title: '中文和合本（简体）', languageCode: 'za', availableSections: ['OT', 'NT'] };
    }
    return BibleVersions;
}());
exports.BibleVersions = BibleVersions;


/***/ })
/******/ ]);
//# sourceMappingURL=blinx.js.map
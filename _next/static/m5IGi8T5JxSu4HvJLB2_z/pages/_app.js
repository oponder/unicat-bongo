(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{205:function(t,e,n){__NEXT_REGISTER_PAGE("/_app",function(){return t.exports=n(206),{page:t.exports.default}})},206:function(t,e,n){"use strict";n.r(e),n.d(e,"default",function(){return y});var r=n(76),o=n.n(r),u=n(0),a=n.n(u),i=n(77),c=n.n(i);n(19);function l(t){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function s(t,e,n,r,o,u,a){try{var i=t[u](a),c=i.value}catch(t){return void n(t)}i.done?e(c):Promise.resolve(c).then(r,o)}function f(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function p(t,e){return!e||"object"!==l(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function h(t){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function d(t,e){return(d=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var y=function(t){function e(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),p(this,h(e).apply(this,arguments))}var n,r,u;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&d(t,e)}(e,c.a),n=e,r=[{key:"render",value:function(){var t=this.props,e=t.Component,n=t.pageProps;return a.a.createElement(i.Container,null,a.a.createElement("meta",{name:"viewport",content:"width=device-width,initial-scale=1.0"}),a.a.createElement("link",{type:"text/css",rel:"stylesheet",href:"/static/style.css"}),a.a.createElement("div",{id:"site-content"},a.a.createElement("div",{className:"content"},a.a.createElement(e,n))))}}],u=[{key:"getInitialProps",value:function(){var t,e=(t=o.a.mark(function t(e){var n,r,u;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.Component,e.router,r=e.ctx,u={},!n.getInitialProps){t.next=6;break}return t.next=5,n.getInitialProps(r);case 5:u=t.sent;case 6:return t.abrupt("return",{pageProps:u});case 7:case"end":return t.stop()}},t,this)}),function(){var e=this,n=arguments;return new Promise(function(r,o){var u=t.apply(e,n);function a(t){s(u,r,o,a,i,"next",t)}function i(t){s(u,r,o,a,i,"throw",t)}a(void 0)})});return function(t){return e.apply(this,arguments)}}()}],r&&f(n.prototype,r),u&&f(n,u),e}()},207:function(t,e,n){"use strict";var r=n(20),o=n(4);Object.defineProperty(e,"__esModule",{value:!0}),e.createUrl=P,e.Container=e.default=void 0;var u=o(n(43)),a=o(n(44)),i=o(n(208)),c=o(n(7)),l=o(n(8)),s=o(n(16)),f=o(n(17)),p=o(n(18)),h=o(n(13)),d=r(n(0)),y=o(n(30)),v=n(25),m=n(47),b=function(t){function e(){return(0,c.default)(this,e),(0,s.default)(this,(0,f.default)(e).apply(this,arguments))}var n;return(0,p.default)(e,t),(0,l.default)(e,[{key:"getChildContext",value:function(){return{headManager:this.props.headManager,router:(0,m.makePublicRouterInstance)(this.props.router)}}},{key:"componentDidCatch",value:function(t){throw t}},{key:"render",value:function(){var t=this.props,e=t.router,n=t.Component,r=t.pageProps,o=P(e);return d.default.createElement(w,null,d.default.createElement(n,(0,i.default)({},r,{url:o})))}}],[{key:"getInitialProps",value:(n=(0,a.default)(u.default.mark(function t(e){var n,r,o;return u.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.Component,e.router,r=e.ctx,t.next=3,(0,v.loadGetInitialProps)(n,r);case 3:return o=t.sent,t.abrupt("return",{pageProps:o});case 5:case"end":return t.stop()}},t,this)})),function(t){return n.apply(this,arguments)})}]),e}(d.Component);e.default=b,(0,h.default)(b,"childContextTypes",{headManager:y.default.object,router:y.default.object});var w=function(t){function e(){return(0,c.default)(this,e),(0,s.default)(this,(0,f.default)(e).apply(this,arguments))}return(0,p.default)(e,t),(0,l.default)(e,[{key:"componentDidMount",value:function(){this.scrollToHash()}},{key:"componentDidUpdate",value:function(){this.scrollToHash()}},{key:"scrollToHash",value:function(){var t=window.location.hash;if(t=!!t&&t.substring(1)){var e=document.getElementById(t);e&&setTimeout(function(){return e.scrollIntoView()},0)}}},{key:"render",value:function(){return this.props.children}}]),e}(d.Component);e.Container=w;var g=(0,v.execOnce)(function(){0});function P(t){var e=t.pathname,n=t.asPath,r=t.query;return{get query(){return g(),r},get pathname(){return g(),e},get asPath(){return g(),n},back:function(){g(),t.back()},push:function(e,n){return g(),t.push(e,n)},pushTo:function(e,n){g();var r=n?e:null,o=n||e;return t.push(r,o)},replace:function(e,n){return g(),t.replace(e,n)},replaceTo:function(e,n){g();var r=n?e:null,o=n||e;return t.replace(r,o)}}}},208:function(t,e,n){var r=n(75);function o(){return t.exports=o=r||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},o.apply(this,arguments)}t.exports=o},76:function(t,e,n){t.exports=n(86)},77:function(t,e,n){t.exports=n(207)}},[[205,1,0]]]);
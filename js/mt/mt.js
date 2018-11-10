try {
	(function(w, WS) {
		if (navigator.userAgent.match(/MSIE\s(?!9.0)/)) {
			// ie less than version 9
			w.location = '/unsupported-browser';
		}
		function ready() {
			let t = this;
			try {
				if (t.readyState == 4) {
					if (t.status >= 200 && t.status < 400) {
						t.o(t.responseText);
					} else {
						if (t.e) {
							t.e();
						} else {
							mt.dbg(t.status, t.responseURL, t.c);
						}
					}
				}
			} catch (e) {
				mt.err(e, t);
			}
		}
		let mt = {
			m : /Android|iPhone|SymbianOS|Windows Phone|iPad|iPod/.test(navigator.userAgent),
			ma : 3153600000,// maxAge=100 years
			dbg : function() {
				if (mt.m) {
					alert(JSON.stringify(arguments));
				} else {
					console.log.apply(console, arguments);
				}
			},
			err : function(e, a) {
				if (mt.m) {
					alert(e.stack);
				} else {
					console.log(e);
				}
				if (a) {
					mt.dbg.apply(mt, a);
				}
			},
			extend : function(t, o) {
				if (t) {
					for (n in t) {
						o[n] = t[n];
					}
				}
			},
			ext : function(c, p, o) {
				let Super = function() {
				};
				Super.prototype = p.prototype;
				c.prototype = new Super();
				mt.extend(o, c.prototype);
			},
			$ : function(s) { // querySelectorAll
				if (mt.isString(s)) {
					let a = document.querySelectorAll(s);
					return a.length <= 1 ? a[0] : a;
				} else {
					return s;
				}
			},
			_ : function(o, s, b) {
				// mt.dbg(arguments);
				let r = document.createElement(s);
				if (b) {
					o.insertBefore(r, b);
				} else {
					o.appendChild(r);
				}
				return r;
			},
			$class : function(o) {// get sub class name of object
				let s = Object.prototype.toString.call(o);
				return s.substring(8, s.length - 1);
			},
			is : function(o, c) {// return true if object is instance of class
				return this.$class(o) == c;
			},
			assert : function(o, c) {// throw Error if object not instance of class
				if (mt.$class(o) != c) {
					console.log(o);
					throw new Error(mt.$class(o) + ' not ' + c);
				}
			},
			$children : function(o) {// get direct children of input element
				let r;
				let a = o.childNodes;
				if (mt.isNodeList(a)) {
					r = [];
					for (let i = 0; i < a.length; i++) {
						let o = a[i];
						if (o.nodeName != '#text') {
							r.push(o);
						}
					}
				} else {
					mt.assertNodeList(o);
					r = o;
				}
				return r;
			},
			$t : function(t, o) {// getElementsByTagName
				switch (typeof (o)) {
				case 'undefined':
					o = document.documentElement;
					break;
				case 'string':
					o = mt.$(o);
					break;
				default:
					break;
				}
				let ret = null;
				switch (typeof (t)) {
				case 'string':
					ret = o.getElementsByTagName(t);
					break;
				case 'object':
					if (t.length) {
						ret = [];
						for (let i = 0; i < t.length; i++) {
							ret.push.apply(ret, o.getElementsByTagName(t[i]));
						}
					}
					break;
				default:
					break;
				}
				return ret;
			},
			_t : function(o, s) {
				// mt.dbg(arguments);
				return o.appendChild(document.createTextNode(s));
			},
			val : function(s, v, d) {
				let o = mt.$(s);
				if (o) {
					if (v) {
						mt.$(s).value = v;
					} else {
						mt.$(s).value = d;// default value
					}
				} else {
					throw new Error(s + ' not exists');
				}
			},
			$v : function(n, s, r) {
				// mt.dbg(arguments);
				if (n.length == 0)
					return '';
				let c = s.match(r);
				if (!c)
					return '';
				let i = -1, j = c.length;
				r = RegExp('^' + n + '=', 'i');
				while (++i < j) {
					if (c[i].match(r))
						return c[i].replace(r, '')
				}
				return ''
			},
			$s : function(n) {
				// mt.dbg(arguments);
				return decodeURIComponent(this.$v(n, document.location.search.toString(), /\w+=[^&?]+/gi));
			},
			$c : function(n) {
				// mt.dbg(arguments);
				return decodeURIComponent(this.$v(n, document.cookie.toString(), /[^=\s;]+=[^;]+/gi));
			},
			// html转义
			$html : function(s) {
				return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;').replace(/\'/g, '&#39;').replace(/\"/g, '&quot;').replace(/\n/g, '<br/>');
			},
			// html反转
			html$ : function(s) {
				return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#39;/g, '\'').replace(/&quot;/g, '\"');
			},
			_c : function(n, v, maxAge) {
				// mt.dbg(arguments);
				if (typeof (v) != 'string')
					v = v.toString();
				let a = [];
				a.push(n);
				a.push('=');
				a.push(encodeURIComponent(v));
				if (typeof (maxAge) == 'number') {
					// let t=new Date();
					// t.setTime(t.getTime() + maxAge);
					// a.push('expires=' + expires);
					a.push(';max-age=');
					a.push(maxAge);
				}
				a.push(';path=/');
				document.cookie = a.join('');
			},
			c_ : function(n) {
				// mt.dbg(arguments);
				if (n) {
					let a = [];
					a.push(n + '=');
					a.push('max-age=-1');
					a.push('path=/');
					document.cookie = a.join(';');
					mt.dbg(document.cookie);
				}
			},
			_e : function(s, f, o) {
				// mt.dbg(arguments);
				if (f) {
					if (s === undefined) {
						s = 'load';
					} else {
						s = s.replace(/^on/, '');
					}
					if (o === undefined) {
						o = w;
					} else if (typeof o == 'string') {
						o = this.$(o);
					}
					if (typeof o.attachEvent == 'object') {
						s = 'on' + s;
						o.attachEvent(s, f);
					} else if (o.addEventListener instanceof Function) {
						o.addEventListener(s, f, false);
					}
				}
			},
			_js : function(src, f) {
				// mt.dbg(arguments);
				let o = mt._(mt.$t('head')[0], 'script', mt.$t('script')[0]);
				o.setAttribute('type', 'text/javascript');
				mt._e('onload', f, o);
				o.setAttribute('src', src);
			},
			g : function(charset, size) {
				// mt.dbg(arguments);
				let a = [];
				let i = 0;
				while (i++ < size) {
					let k = Math.floor(charset.length * Math.random());
					a.push(charset[k]);
				}
				return a.join('');
			},
			w : function() {
				return w.innerWidth || document.documentElement.clientWidth;
			},
			h : function() {
				return w.innerHeight || document.documentElement.clientHeight;
			},
			x : function(e) {
				return e.clientX || e.pageX;
			},
			y : function(e) {
				return e.clientY || e.pageY;
			},
			showhide : function(o) {
				o = mt.$(o);
				if (o.style.display == 'none') {
					o.style.display = '';
				} else {
					o.style.display = 'none';
				}
			},
			shader : function(g, s, t) {// glObject, sourceLocation,
				// shaderType,callbackFunction
				// VERTEX_SHADER | FRAGMENT_SHADER
				let r = g.createShader(t);
				g.shaderSource(r, s);
				g.compileShader(r);
				if (g.getShaderParameter(r, g.COMPILE_STATUS)) {
					return r;
				} else {
					mt.dbg(g.getShaderInfoLog(r), s);
				}
			},
			program : function(g, v, f) {
				let p = g.createProgram();
				g.attachShader(p, v);
				g.attachShader(p, f);
				g.linkProgram(p);
				if (g.getProgramParameter(p, g.LINK_STATUS)) {
					return p;
				} else {
					mt.dbg(g.getProgramInfoLog(p));
				}
			},
			vbo : function(g, d) {
				if (g && d) {
					let r = g.createBuffer();
					g.bindBuffer(g.ARRAY_BUFFER, r);
					g.bufferData(g.ARRAY_BUFFER, new Float32Array(d), g.STATIC_DRAW);
					return r;
				}
			},
			vao : function(g, p, n, o) {
				let l = g.getAttribLocation(p, n);
				g.bindBuffer(g.ARRAY_BUFFER, o);
				g.enableVertexAttribArray(l);
				g.vertexAttribPointer(l, 3, g.FLOAT, false, 0, 0);
				g.bindBuffer(g.ARRAY_BUFFER, null);
			},
			mat : function(n) {
				if (!n)
					n = 4;
				let j = n * n;
				let r = new Float32Array(j);
				for (let i = 0; i < j; i++) {
					r[i] = Math.floor(i / n) == i % n;
				}
				return r;
			},
			mul : function(a, b, n) {
				if (!n)
					n = 4;
				let r = new Float32Array(n * n);
				for (let i = 0; i < n; i++) {// 行
					for (let j = 0; j < n; j++) {// 列
						let s = 0;
						for (let k = 0; k < n; k++) {
							s += a[i * n + k] * b[k * n + j];
						}
						r[i * n + j] = s;
					}
				}
				return r;
			},
			dot : function(a, b) {
				return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
			},
			nor : function(s) {
				let r = [ 0, 0, 0 ];
				let t = mt.dot(s, s);
				if (t > 0) {
					t = 1 / Math.sqrt(t);
					r[0] = s[0] * t;
					r[1] = s[1] * t;
					r[2] = s[2] * t;
				}
				return r;
			},
			translate : function(x, y, z) {// 平移
				return [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1 ];
			},
			scale : function(x, y, z) {// 缩放
				return [ x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1 ];
			},
			rotate : function(a, x, y, z) {// 旋转
				let n = this.nor([ x, y, z ]);
				x = n[0];
				y = n[1];
				z = n[2];
				let c = Math.cos(a);
				let s = Math.sin(a);
				return [ x * x * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s, 0,//
				x * y * (1 - c) + z * s, y * y * (1 - c) + c, y * z * (1 - c) - x * s, 0,//
				x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, z * z * (1 - c) + c, 0,//
				0, 0, 0, 1 ];
			},
			url : function(l, p) {
				// mt.dbg(arguments);
				let a = [];
				a.push(l);
				if (l.indexOf('?') == -1) {
					a.push('?');
				} else {
					a.push('&');
				}
				switch (typeof (p)) {
				case 'object':
					for (n in p) {
						a.push(n);
						a.push('=');
						a.push(encodeURIComponent(p[n]));
						a.push('&');
					}
					break;
				case 'string':
					a.push(p);
					a.push('&');
					break;
				default:
					break;
				}
				a.push(Math.random());
				return a.join('');
			},
			ajax : function() {
				let ret = 0;
				if (w.XMLHttpRequest) {
					try {
						ret = new XMLHttpRequest();
					} catch (e) {
						mt.dbg(e.stack + e);
					}
				} else if (w.ActiveXObject) {
					try {
						ret = new ActiveXObject('Microsoft.XMLHTTP');
					} catch (e) {
						mt.dbg(e.stack + e);
					}
				}
				return ret;
			},
			get : function(l, o, d, e) {// url, onok, data, onerror
				try {
					let t = this.ajax();
					if (!t)
						return;
					t.o = o;
					t.e = e;
					t.open('GET', mt.url(l, d), true);
					mt._e('readystatechange', ready, t);
					t.send(0);
				} catch (e) {
					mt.err(e, arguments);
				}
			},
			stringify : function(d) {
				switch (typeof (d)) {
				case 'string':
					return d;
				case 'object':
				default:
					return JSON.stringify(d);
				}
			},
			post : function(l, o, d, e, h) {// url, onok, data, onerror, header
				try {
					let t = this.ajax();
					if (!t)
						return;
					t.o = o;
					t.e = e;
					t.c = mt.stringify(d);
					t.open('POST', mt.url(l), true);
					if (typeof h == 'object') {
						for (n in h) {
							t.setRequestHeader(n, h[n]);
						}
					}
					mt._e('readystatechange', ready, t);
					t.send(t.c);
				} catch (e) {
					mt.dbg(e, arguments);
				}
			},
		};
		w.mt = mt;
		let types = [ 'Array', 'Boolean', 'Date', 'Function', 'NodeList', 'Number', 'Object', 'RegExp', 'Set', 'String', 'Window', 'HTMLDocument' ];
		for (let i = 0; i < types.length; i++) {
			(function(c) {
				mt['is' + c] = function(o) {
					return mt.$class(o) == c;
				};
				mt['assert' + c] = function(o) {
					if (mt.$class(o) != c) {
						console.log(o);
						throw new Error(mt.$class(o) + ' not ' + c);
					}
				};
			})(types[i]);
		}
		let ws = {
			i : 0,
			m : [],
			o : 0,
			$2 : function(l, p) {
				let r = 0;
				if (ws.o) {
					if (ws.o.readyState == WS.OPEN) {
						r = ws.o;
					}
				} else {
					ws.l = mt.url(l, p);
					// mt.dbg(p);
					ws.o = ws.$(ws.l, ws);// 此时还在初始化会丢消息
					if (!ws.i) {
						ws.i = setInterval(ws.auto, 1000);
					}
				}
				return r;
			},
			$ : function(uri, f, p) {
				let o;
				if (WS) {
					o = new WS(uri, p);
					if (o) {
						// mt.dbg(o);
						mt._e('open', f.open, o);
						mt._e('close', f.close, o);
						mt._e('message', f.message, o);
						mt._e('error', f.error, o);
					}
				} else {
					mt.dbg('ws is not support!');
				}
				return o;
			},
			open : function(e) {
				ws.send('init(' + mt.w() + ',' + mt.h() + ')');
				// mt.dbg('ws open',e);
			},
			close : function(e) {
				ws.o = 0;
				// mt.dbg('ws close',e);
			},
			message : function(m) {
				// mt.dbg(m.data);
				try {
					eval(m.data);
				} catch (e) {
					mt.dbg(m.data, e);
				}
			},
			error : function(e) {// 通信发生错误时触发
				ws.o.close();
				ws.o = 0;
				mt.dbg('ws error', e);
			},
			auto : function() {
				let t = ws;// this
				if (t.p) {
					let o = t.$2(t.p);
					if (o) {
						while (t.m.length > 0) {
							o.send(t.m[0]);
							t.m.shift();
						}
					} else {
						if (t.m.length > 0) {
							mt.dbg(t.m.length);
						}
					}
				}
			},
			send : function(m) {
				// mt.dbg(m);
				let t = ws;// this
				if (t.o) {
					t.o.send(m);
				} else {
					t.m.push(m);
				}
			}
		};
		w.ws = ws;
	})(window, WebSocket || MozWebSocket);
} catch (e) {
	alert(e.stack + e);
}

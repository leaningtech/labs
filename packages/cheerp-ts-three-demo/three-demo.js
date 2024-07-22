"use strict";
/*Compiled using Cheerp (R) by Leaning Technologies Ltd*/ var aL = Math.imul;
var aM = Math.fround;
var oSlot = 0;
var nullArray = [null];
var nullObj = { d: nullArray, o: 0 };
var CHEERP_ENV = null,
	CHEERP_ARGV = null;
function aJ(aK) {
	var A = null,
		z = null,
		y = -0,
		j = null,
		g = null,
		c = null,
		e = null,
		a = null,
		d = null;
	c = ax();
	c.canvas = aK;
	e = av();
	e.color = "white";
	a = new THREE.Scene();
	A = [null];
	A[0] = a;
	z = [null];
	z[0] = new THREE.WebGLRenderer(c);
	y = +aK.clientWidth;
	c = new THREE.PerspectiveCamera(75, y / +aK.clientHeight, 0.1, 1000);
	j = [null];
	j[0] = c;
	d = new THREE.BoxGeometry(1, 1, 1);
	d = new THREE.Mesh(d, new THREE.MeshStandardMaterial(e));
	e = [null];
	e[0] = d;
	g = "white";
	a.add(d, new THREE.HemisphereLight(g, "black", 1));
	c.position.z = 3;
	a = {
		a0: nullArray,
		a1: nullArray,
		a2: nullArray,
		a3: nullArray,
		a4: nullArray,
	};
	c = [null];
	a.a0 = c;
	a.a1 = e;
	a.a2 = z;
	a.a3 = A;
	a.a4 = j;
	a = aa(a);
	c[0] = a;
	+requestAnimationFrame(a);
}
function ax() {
	return new Object();
}
function av() {
	return al();
}
function i(a, b) {
	var e = 0,
		d = 0,
		c = null;
	c = String();
	e = 0;
	while (1) {
		d = a[(b + e) | 0] | 0;
		if ((d & 255) !== 0) {
			c = c.concat(String.fromCharCode(d & 255));
			e = (e + 1) | 0;
			continue;
		}
		break;
	}
	return String(c);
}
function aa(a) {
	return $(a);
}
function $(c) {
	var a = null,
		d = null;
	a = { a0: null, a1: null, a2: null };
	Z(a, c);
	d = Y(a);
	X(a);
	return d;
}
function Z(c, a) {
	aD(c, a);
}
function Y(c) {
	var a = null;
	if (c.a1 !== null) {
		a = [{ a0: null, a1: null }];
		a[0].a0 = c.a1;
		a[0].a1 = c.a2;
		a = a2(V, a[0]);
		aF(c.a0, a);
		c.a1 = null;
	}
	return c.a0;
}
function X(c) {
	var a = null;
	a = c.a1;
	if (a !== null) a(c.a2);
}
function V(a) {
	a.a0(a.a1);
}
function aF(d, c) {
	var a = null;
	a = u;
	if (a !== null) {
		a.set(d, c);
		return;
	}
	a = new Map();
	u = a;
	a.set(d, c);
}
function aD(c, a) {
	aC(c, a);
}
function aC(e, d) {
	var a = null,
		c = null;
	a = [
		{
			a0: nullArray,
			a1: nullArray,
			a2: nullArray,
			a3: nullArray,
			a4: nullArray,
		},
	];
	c = d.a0;
	a[0].a0 = c;
	c = d.a1;
	a[0].a1 = c;
	c = d.a2;
	a[0].a2 = c;
	c = d.a3;
	a[0].a3 = c;
	c = d.a4;
	a[0].a4 = c;
	c = a2(T, a[0]);
	e.a0 = c;
	e.a1 = null;
	e.a2 = a[0];
}
function T(a) {
	R(a);
}
function R(c) {
	var e = null,
		d = null,
		a = null;
	a = c.a0;
	+requestAnimationFrame(a[0]);
	a = c.a1;
	a = a[0].rotation;
	a.x = +a.x + 0.01;
	a.y = +a.y + 0.01;
	a = c.a2;
	e = c.a3;
	d = c.a4;
	a[0].render(e[0], d[0]);
}
function al() {
	return new Object();
}
function o() {
	M();
}
function M() {
	L();
}
function L() {
	K();
}
function K() {
	throw new Error("Cheerp: Signal raised");
}
function J(g) {
	var e = null,
		c = null,
		d = null,
		a = 0;
	e = ay();
	c = (typeof process == "undefined" ? [] : process.argv) || [];
	if ((c.length | 0) !== 0) {
		a = 0;
		while (1) {
			d = c[+(a >>> 0)];
			if (d.startsWith(g)) +e.push(d.substr(+(g.length | 0)));
			a = (a + 1) | 0;
			if (a >>> 0 < c.length >>> 0) continue;
			break;
		}
	}
	return e;
}
function n(g, h, e, d, c) {
	var a = 0;
	if (d.length >>> 0 > c >>> 0) {
		a = az(g, h, e, d[+(c >>> 0)]) | 0;
		if (a >>> 0 < e >>> 0) g[(h + a) | 0] = 0;
		return (a + 1) | 0;
	}
	return 0 | 0;
}
function az(A, B, z, y) {
	var j = 0,
		g = 0,
		d = 0,
		c = 0,
		e = 0,
		a = 0;
	j = y.length;
	if ((j | 0) === 0) return 0 | 0;
	e = 0;
	c = 0;
	d = 0;
	while (1) {
		a = y.charCodeAt(+(c >>> 0));
		a: {
			if (((a & -2048) | 0) === 55296) {
				g = (c + 1) | 0;
				if (g >>> 0 < j >>> 0) {
					c = y.charCodeAt(+(g >>> 0));
					a = (((c | a) & 1023) + 65536) | 0;
					c = g;
				} else {
					a = -1;
				}
			} else if (a >>> 0 > 1114111) {
				a = -1;
			} else {
				if (a >>> 0 < 128) {
					if (e >>> 0 < z >>> 0) {
						A[(B + d) | 0] = a;
						d = (d + 1) | 0;
						a = 1;
						break a;
					}
					a = 1;
					break a;
				}
				if (a >>> 0 < 2048) {
					if ((e + 1) >>> 0 < z >>> 0) {
						A[(B + d) | 0] = (a >>> 6) | 192;
						A[(((B + d) | 0) + 1) | 0] = (a & 63) | 128;
						d = (d + 2) | 0;
						a = 2;
						break a;
					}
					a = 2;
					break a;
				}
				if (a >>> 0 < 65536) {
					if ((e + 2) >>> 0 < z >>> 0) {
						A[(B + d) | 0] = (a >>> 12) | 224;
						A[(((B + d) | 0) + 1) | 0] = ((a >>> 6) & 63) | 128;
						A[(((B + d) | 0) + 2) | 0] = (a & 63) | 128;
						d = (d + 3) | 0;
						a = 3;
						break a;
					}
					a = 3;
					break a;
				}
			}
			if ((e + 3) >>> 0 < z >>> 0) {
				A[(B + d) | 0] = (a >>> 18) | 240;
				A[(((B + d) | 0) + 1) | 0] = ((a >>> 12) & 63) | 128;
				A[(((B + d) | 0) + 2) | 0] = ((a >>> 6) & 63) | 128;
				A[(((B + d) | 0) + 3) | 0] = (a & 63) | 128;
				d = (d + 4) | 0;
				a = 4;
			} else {
				a = 4;
			}
		}
		e = (e + a) | 0;
		c = (c + 1) | 0;
		if (c >>> 0 < j >>> 0) continue;
		break;
	}
	return e | 0;
}
function ay() {
	return new Array();
}
function E() {
	var d = 0,
		a = 0,
		c = 0;
	a = l | 0;
	c = 0;
	while (1) {
		d = (65536 - a) | 0;
		a = D(aA, a, d, c) | 0;
		if ((a | 0) !== 0) {
			if (a >>> 0 > d >>> 0) o();
			a = ((l | 0) + a) | 0;
			l = a;
			c = (c + 1) | 0;
			if ((c | 0) !== 64) continue;
			o();
		}
		break;
	}
}
function D(e, f, d, c) {
	var a = null;
	if (w | 0) return n(e, f, d, v, c) | 0 | 0;
	a = CHEERP_ENV;
	if (a !== null) a = CHEERP_ENV;
	else a = J("--cheerp-env=");
	v = a;
	w = 1;
	return n(e, f, d, a, c) | 0 | 0;
}
function C() {
	E();
}
var l = 0;
var aA = new Uint8Array(65536);
var w = 0;
var v = null;
var u = null;
function a2(func, obj) {
	return function () {
		var a = Array.prototype.slice.call(arguments);
		a.unshift(obj);
		return func.apply(null, a);
	};
}
function a3(func, obj, objo) {
	return function () {
		var a = Array.prototype.slice.call(arguments);
		a.unshift(obj, objo);
		return func.apply(null, a);
	};
}
var run = {};
export default function (a) {
	CHEERP_ENV = (typeof a == "undefined" ? null : a.env) || null;
	CHEERP_ARGV = (typeof a == "undefined" ? null : a.argv) || null;
	return Promise.resolve().then((_) => {
		run = aJ;
		C();
		return { run: run };
	});
}

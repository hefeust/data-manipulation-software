(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
}((function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn) {
	  var module = { exports: {} };
		return fn(module, module.exports), module.exports;
	}

	var dist = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	    factory(exports) ;
	}(commonjsGlobal, (function (exports) {
	    var C37  = '0123456789_abcdefghijklmnopqrstuvwxyz'.split('');

	    var num2char = function (num, charset) {
	        num  = Math.floor(num);

	        if(0 <= num && num < charset.length) {
	            return charset[num]
	        } else {
	          return '#' + num  + '#'
	        }
	    };

	    var keys = function (values) {
	        var charset = C37;
	        var text = '';

	    //    console.log(values)

	        values.map(function (value) {
	            text += num2char(value, charset);
	        });

	        return  text
	    };

	    var create_mwc = function (a, b, r) {

	        var R2 =  (r  );
	    //    const xi = new Array(r)
	    //    const ci = new Array(r)
	        var xi = new Array(R2);
	        var ci = new Array(R2);

	        var init = function (seeds) {
	            seeds.map(function (s, idx) { 
	                xi[idx] = s;
	                ci[idx] = (a - s);
	            });
	        };

	        var step = function () {
	            var xn = (a * xi[R2 - 1] + ci[0]) % b;
	            var cn = Math.floor((a * xi[R2 - 1] + ci[0]) / b);

	    //        twist = (twist + ) % r

	            xi.pop();
	            ci.pop();

	            xi.unshift(xn);
	            ci.unshift(cn);

	            return { xn: xn, cn: cn }
	        };

	        var next = function () {
	            var results = [];

	            for(var i = 0; i < r; i++) {
	                results.push(step().xn);
	            }

	    //        console.log('results', results)

	            return results
	        };

	        return { init: init, next: next }
	    };

	    var merge = function (target, defaults, options) {
	        (({})).toString.call(defaults);    
	        // const opts = ({}).toString.call(options)    

	        for(var prop in defaults) {
	            var dots$1 = ({}).toString.call(defaults[prop]);    

	    //        console.log({ prop })
	        
	            if(dots$1 === '[object Object]') {
	                target[prop] = {};
	                //merge(target[prop], defaults[prop], options[prop])
	                Object.assign(
	                    target[prop], 
	                    defaults[prop], 
	                    options[prop]
	                );


	            } else if(dots$1 === '[object Array]') {
	                target[prop] = defaults[prop];
	    //            throw new Error('Not implemented')
	            } else {
	    //           target[prop] = options[prop] || defaults[prop]
	                target = options || defaults;
	            }
	        }
	    };

	    var defaults = {
	        mwc: {
	            modulus: 83047,
	            divider: 36,
	            keysize: 5
	        },
	        pool: {
	            size: 10 * 1000,
	            thresold: 0.05,
	            growth: 0.10
	        }
	    };

	    var create_bmp = function (options) {
	        if ( options === void 0 ) { options = {}; }


	        var blocks = [];

	        var lookup = new Map();

	        var set_data = async function (data) {
	            var uid = await allocate();
	            var block = blocks[lookup.get(uid)];

	            

	            block.data = data;
	            stats.sets++;

	            return uid
	        };

	        var get_data = async function (uid) {
	    //        console.log(lookup)

	            var idx = lookup.get(uid);
	            var block = blocks[idx];

	            stats.gets++;

	            return block.data
	        };

	        var release_data = async function (uid) {
	            
	        };


	        var allocate = async function () {
	            var ref = conf.pool;
	            var size = ref.size;
	            var thresold = ref.thresold;
	            var growth = ref.growth;
	            var newly = Math.floor(size * growth) || 1;
	            var first;

	            stats.watermark++;

	            if((stats.watermark) >= (stats.count * (1 - thresold))) {
	    //            console.log('reallocate', { count: stats.count })            

	                for(var k = 0; k < newly; k++) {
	                    var uid = '';
	                       
	                    do {
	                        // to avoid collisions... 
	                        // it's a MWC generator after all...
	                        uid = keys(mwc.next());
	                    } while(lookup.has(uid)) 

	    //                if(i > 1) console.log({ collision: uid })
	                    blocks.push({ uid: uid, data: null });
	                    lookup.set(uid, k + stats.count);

	    //                if(k === 0) first = uid
	                }

	                stats.count += newly;
	                stats.allocates++;
	            }

	    //        console.log({ first })

	            first = blocks[stats.watermark].uid;


	            return first
	        };

	        var clear = async function () {

	        };

	        var toString = function () {

	        };

	        var get_stats = function () {
	            var result = {};
	            
	            Object.keys(stats).map(function (prop) {
	                result[prop] = stats[prop];
	            });

	            return result
	        };


	        var debug = function () {
	            return blocks
	        };

	        var init_generator = function () {
	            var ref = conf.mwc;
	            var modulus = ref.modulus;
	            var divider = ref.divider;
	            var keysize = ref.keysize;
	            var seeds = [];

	            seeds[0] = modulus % (divider - 1);

	            for(var s = 1; s < keysize; s++) {
	                seeds[s] = (seeds[s - 1] + modulus) % (divider - 1);
	            }

	            Object.assign(mwc, 
	                create_mwc(modulus, divider, keysize)
	            );

	            mwc.init(seeds);
	        };

	        var init_stats = function (options) {
	            Object.assign(stats, {
	                watermark: 0,
	                count: 0,
	                sets: 0,
	                gets: 0,
	                releases: 0,
	                allocates: 0,
	            });
	        };

	        var setup = function () {
	            merge(conf, defaults, options);

	    //        console.log({ conf })

	            init_generator(options.generator);
	            init_stats();
	        };

	        var bmp_api = {
	            set_data: set_data, 
	            release_data: release_data,
	            get_data: get_data, 
	            allocate: allocate,
	            clear: clear,
	            toString: toString,
	            get_stats: get_stats,
	            debug: debug
	        };

	        var conf = {};
	        var mwc = {};
	        var stats = {};
	        
	        setup();

	        return bmp_api
	    };

	    var create_bag = function (keynames, options) {


	        create_bmp({ size: 1000 });

	        var set = async function (pairs, with_data) {
	            
	        };

	        var get = async function (pairs) {
	            return Promise()
	        };

	        var select = async function (filters_bag, collector)  {
	            return Promise()        
	        };

	        var debug = function (pairs) {};

	        var toString = function () {
	            var text = 'mukemuva::bag' + '\n'
	                + 'keys: ' + keynames;

	            return text
	        };

	        var bag_api = {
	            set: set, get: get, select: select, debug: debug, toString: toString
	        };

	        return bag_api
	    };

	    exports.create_bag = create_bag;
	    exports.create_bmp = create_bmp;
	    exports.create_mwc = create_mwc;
	    exports.keys = keys;

	    Object.defineProperty(exports, '__esModule', { value: true });

	})));
	});

	var bmp = dist.create_bmp({
	    pool: {
	        size: 100
	    }
	});

	var N = 100 * 1000;   
	var objs = [];
	var uids = [];

	for(var i = 0; i < N; i++) {
	    objs[i] = { item: i };
	    uids[i] = bmp.set_data(objs[i]);    
	}

	//console.log('stored objects', objs)
	//console.log('uid promise lsii', uids)

	Promise.all(uids)
	.then(function (values) {
	    var arr = values.map(function (value, idx) {
	        return bmp.get_data(value)
	    });

	    return arr
	})
	.then(function (values) {
	    Promise.all(values).then(function (stored_data) {
	        var test = stored_data.reduce(function (acc, data, idx) {
	            if(data !== objs[idx]) {
	                 console.log(bmp.debug(idx));
	                console.log(idx, data, objs[idx]);
	                // console.log({ idx })
	            }
	            

	            return acc && data === objs[idx]
	        }, true);
	    
	        console.log(test);
	    });
	});

	console.log({ stats: bmp.get_stats()  });

})));

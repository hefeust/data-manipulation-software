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
	    var keygen = function (name) {
	    };

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

	    //        console.log('merge:', { [prop]: dots })
	        
	            if(dots$1 === '[object Object]') {
	                target[prop] = {};
	    //            merge(target[prop], defaults[prop], options[prop])

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
	                //target = options || defaults

	                Object.assign(
	                    target, 
	                    defaults, 
	                    options
	                );

	            }
	        }

	    //    console.log('MERGE:', { target })
	    };

	    var defaults = {
	        mwc: {
	            modulus: 314159,
	            divider: 37,
	            keysize: 5
	        },
	        pool: {
	            size: 100 * 1000,
	            thresold: 0.10,
	            growth: 0.10
	        }
	    };

	    var create_bmp = function (options) {
	        if ( options === void 0 ) { options = {}; }


	        //  console.log('OPTIONS:', options)

	        var blocks = [];

	        var lookup = new Map();

	        var set_data = async function (data) {
	            var uid = await allocate();
	            var block = blocks[lookup.get(uid)];

	            block.data = data;
	            stats.sets++;

	    //        console.log('        bmp.set_data:', { uid, data })

	            return uid
	        };

	        var get_block = async function (uid) {
	            var idx = lookup.get(uid);
	            var block = blocks[idx];

	            stats.gets++;

	            return block
	        };

	        var has_data = function (uid) {
	            return lookup.has(uid)
	        };


	        var get_data = async function (uid) {
	            var block = await get_block(uid);

	            // console.log({ uid, block })

	            return block.data
	        };

	        var release_data = async function (uid) {
	            
	        };


	        var allocate = async function () {
	            var ref = conf.pool;
	            var size = ref.size;
	            var thresold = ref.thresold;
	            var growth = ref.growth;
	            var newly = Math.max(Math.floor(size * growth), 1);
	            var first;




	            if((stats.watermark) >= (stats.count * (1 - thresold))) {
	                // console.log('reallocate', { count: stats.count })            

	                for(var k = 0; k < newly; k++) {
	                    var uid = '';
	                    var i = 0;
	                       
	                    do {
	                        // to avoid collisions... 
	                        // it's a MWC generator after all...
	                        uid = keys(mwc.next());
	                        i++;               
	                    } while(lookup.has(uid)) 

	                    if(i > 1) { stats.collisions += (i - 1); }

	                    blocks.push({ uid: uid, data: null });
	                    lookup.set(uid, k + stats.count);

	    //                if(k === 0) first = uid
	                }

	                stats.count += newly;
	                stats.allocates++;
	            }
	    /*
	            console.log({
	                blocks_length: blocks.length,
	                stats_watermark: stats.watermark,
	                newly,
	                stats_count:  stats.count
	            })
	    */
	            first = blocks[stats.watermark];        

	            stats.watermark++;

	            return first.uid
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
	            // return blocks.map(b => b.data)
	             return blocks.map(function (b) {   
	                return { 
	                    uid: b.uid,
	                    data: b.data
	                }
	            })
	        };

	        var init_generator = function () {
	            var ref = conf.mwc;
	            var modulus = ref.modulus;
	            var divider = ref.divider;
	            var keysize = ref.keysize;
	            var seeds = [];

	    //        seeds[0] = modulus % (divider - 1)
	            seeds[0] = 0;

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
	                collisions: 0
	            });
	        };

	        var setup = function () {
	            merge(conf, defaults, options);

	            console.log({ conf: conf });

	            init_generator(options.generator);
	            init_stats();
	        };

	        var bmp_api = {
	            set_data: set_data, 
	            release_data: release_data,
	            get_block: get_block,
	            get_data: get_data, 
	            has_data: has_data,
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

	    var make_naivestore = function (roles_names, options) {


	        var entries = [];

	        var set = async function (bag, with_data) {
	            var keys = Object.keys(bag);
	            var idx = -1;

	            for(var entry of entries) {
	                var bag$1 = entry.bag;
	                var matches = [];

	                for(var key of keys) {
	                    var value = bag$1[key];

	                    if(bag$1[key] === value)
	                        { matches.push(key); }              
	                }


	                if(matches.length === roles_names.length) { break }

	                idx++;
	            }

	            if(idx === -1) {
	                entries.push({ bag: bag, with_data: with_data });
	            } else {
	                entries[idx].with_data = with_data;
	            }

	    //        console.log(stats.sets)

	            stats.sets++;
	        };

	        var get = async function (bag, with_data) {

	        };

	        var select = async function* (filters) {
	            var keys = Object.keys(filters);

	            for(var entry of entries) {
	                var bag = entry.bag;
	                var matches = [];

	                for(var key of keys) {
	                    var filter = filters[key];

	                    if(bag[key] === filter)
	                        { matches.push(key); }              
	                }

	                if(matches.length === roles_names.length) { yield entry; }
	            }


	            stats.selects++;
	        };

	        var toString = function () {

	        };

	        var debug = function () {
	            return { DEBUG_ENTRIES_LENGTH:  entries.length }
	        };

	        var get_stats = function () {
	            return stats
	        };

	        var stats = {
	            sets: 0, gets: 0, releases: 0, selects : 0
	        };

	        return { 
	            set: set, 
	            get: get, 
	            select: select, 
	            toString: toString, 
	            debug: debug,
	            get_stats: get_stats
	        }
	    };

	    var lists_intersect = function (lists) {
	        var results = [];
	        var lookup = new Map();

	    //    console.log('lists.map', lists )

	    //    lists.sort((l1, l2) => l2.length - l1.length).map((list) => {
	        lists.map(function (list, idx) {
	            list.map(function (element) {
	                var count = lookup.get(element) || 0;

	    //         if(count === idx) {
	               lookup.set(element, 1 + count);
	    //         } else {
	    //             lookup.delete(element)
	    //         }
	            });
	        });

	        Array.from(lookup.keys()).map(function (key) {
	            if(lookup.get(key) === lists.length) {
	               results.push(key);
	            }
	        });

	    //    console.log(lists.map((list) => list.length).join(', '))
	            
	        return results
	    };

	    var make_logics = function (keynames) {

	        var kns = keynames;

	        var lookups = new Map();

	        var set_record = function (record) {
	            var kn = record.kn;
	            var pv = record.pv;
	            record.uids;
	            var entries = lookups.get(pv) || [];

	            if( entries.filter(function (e) { return e.kn === kn; }).length === 0) {
	                entries.push(record);
	            }

	            lookups.set(pv, entries);
	        };

	        var find_record = function (selector) {
	            var kn = selector.kn;
	            var pv = selector.pv;
	            var entries = lookups.get(pv) || [];

	            return (entries.filter(function (e) { return e.kn === kn; })[0]) || null
	        };

	        var collect_uids = function (filters) {
	            var temps = new Map();
	            var index = 0;

	            kns.map(function (kn) {
	                var pv = filters[kn];
	                var record = find_record({ kn: kn, pv: pv  }) || { kn: kn, pv: pv, uids: []  };

	                if (index === 0)  {
	                    temps.set(0, [record.uids]);
	                    temps.set(1, [record.uids]);
	                } else {
	                    var prevs = temps.get(1 - (index % 2));
	                    var nexts = prevs.reduce(function (acc, prev) {
	    //                    console.log({ acc })
	                        return acc.concat(prev)
	                    }, []);

	                    temps.set(  (index % 2), [nexts]);
	                }
	               
	                index++;
	            });

	            // console.log(temps)
	            // console.log({index })
	            // console.log({ lists: temps.get((index % 2)) })

	            var cartesian = temps.get((index % 2));

	    //        console.log({ cartesian })

	            return lists_intersect(cartesian)
	        };

	        return {
	            find_record: find_record,
	            set_record: set_record,
	            collect_uids: collect_uids
	        }
	    };

	    var make_pair = function (bag) {

	            var payload;

	            var test = function (other_bag) {
	                var kns = Object.keys(bag);

	                return kns.map(function (kn) {
	                    return other_bag[kn] === bag[kn]
	                }).reduce(function (acc, val) { return acc && val; }, true)
	            };

	            var set_data = function (with_data) { 
	                payload = with_data;

	                return api
	            };
	            
	            var api = {
	                test: test, set_data: set_data
	            };

	            Object.defineProperty(api, 'bag', {
	                get: function () { return bag; }
	            }); 

	            Object.defineProperty(api, 'payload', {
	                get: function () { return payload; }
	            }); 

	            return api
	        };

	    var make_bagstore = function (keynames, options) {


	        var pool = create_bmp({
	            pool: {
	                size: 100 * 1000
	            }
	        });

	        var kns = keynames;

	        var logics = make_logics(kns);

	        var allocated = [];

	    //    const lookups = new Map()

	        var stats = {
	            sets: 0, gets: 0, releases: 0, selects : 0
	        };

	        var set = async function (bag, with_data) {


	            var filtered = logics.collect_uids(bag);
	            var pair = null;
	            var new_uid =  null;
	            var counter = 0;

	    //        console.log({ filtered })

	            for (var uid of filtered) {
	                pair = await pool.get_data(uid);
	                
	                if (pair && pair.test(bag)) {
	                    pair.set_data(with_data);
	                }
	                
	                counter++;
	            }

	    //        console.log(counter)

	            if (counter === 0) {
	                pair = make_pair(bag).set_data(with_data);

	                new_uid = await pool.set_data(pair);
	                allocated.push(new_uid);

	                kns.map(function (kn) {
	                    var pv = bag[kn];
	                    var record = logics.find_record({ kn: kn, pv: pv }) 
	                        || { kn: kn, pv: pv, uids: [] };

	                    record.uids.push(new_uid);

	                    logics.set_record(record);
	                });
	            }

	            stats.sets++;
	        };

	        var get = async function (bag, with_data) {

	        };

	        var select = async function* (kn_filters, post_filter) {
	            if ( post_filter === void 0 ) { post_filter = '*'; }

	    //        console.log(await  Promise.all( allocated.map(async (a) => await pool.get_data(a))))

	            var filtered = logics.collect_uids(kn_filters);

	    //        console.log({ filtered })

	            for (var uid of filtered) {
	                var pair = await pool.get_data(uid);

	                var bag = pair.bag;
	                var with_data = pair.payload;
	                
	    //            console.log(allocated.indexOf(uid))
	    //            console.log({ pair })

	                if (post_filter === '*') {
	                    yield { bag: bag, with_data: with_data };
	                } else if (typeof post_filter === 'function') {
	                    if (post_filter(pair.bag)) {
	                        yield { bag: bag, with_data: with_data };
	                    }
	                }
	            }

	            stats.selects++;
	        };

	        var toString = function () {

	        };

	        var debug = function () {
	            var text = [
	                'allocated blocks: ' + allocated.length,
	                'checkset: ' + (allocated.length === (new Set(allocated)).size)
	            ].join('\n');

	            return text
	        };



	        var get_stats = function () {
	            return {
	                pool: pool.get_stats(),
	                store: stats
	            }
	        };

	        return { 
	            set: set, 
	            get: get, 
	            select: select, 
	            toString: toString, 
	            debug: debug,
	            get_stats: get_stats
	        }
	    };

	    exports.create_bmp = create_bmp;
	    exports.create_mwc = create_mwc;
	    exports.keygen = keygen;
	    exports.keys = keys;
	    exports.make_bagstore = make_bagstore;
	    exports.make_naivestore = make_naivestore;

	    Object.defineProperty(exports, '__esModule', { value: true });

	})));
	});

	var NMAX = 1300 * 1000;
	var roles_names = 'ab'.split('');
	var DIMS = roles_names.length;

	var rand = function (n) { return 1 + Math.floor(n * Math.random()); };

	console.log(roles_names);

	var ms = dist.make_bagstore(roles_names, {
	    pool: {
	        size: NMAX
	    },
	    debug: true
	});

	// console.log(ms)

	var pairs = [];

	for(var i = 0; i < NMAX; i++) {

	    var bag = {};

	    for (var kn of roles_names) {
	        bag[kn] = rand(NMAX) / rand(DIMS * Math.PI); 
	    }

	    var with_data = {
	        r: rand(NMAX) / NMAX,
	        g: rand(NMAX) / NMAX,
	        b: rand(NMAX) / NMAX,
	    };

	    pairs.push({ bag: bag, with_data: with_data });
	}

	var test  = pairs[rand(NMAX) - 1];
	// const test  = pairs[0]
	// const test = { bag: { x: 0, y: 0, z: 0 } }

	console.log('multistore debug...');
	//console.log({ test: idx, NMAX})

	var show = async function () {
	var t1 = Date.now();
	    console.log('*** ASSOCIATE DATA ***');

	    for(var j = 0; j < pairs.length; j++) {
	        var ref = pairs[j];
	        var bag = ref.bag;
	        var with_data = ref.with_data;
	        
	//        console.log('setting element j=' + j)
	//        console.log('\n', bag, '\n')

	        if((j % 1000) === 0) { console.log('iteration: ' + j + ' / ' +NMAX); }

	        await ms.set(bag, with_data);
	    }

	    console.log({ STATS: ms.get_stats() });

	    console.log('fetching results...');
	    console.log({ test: test });
	    console.log('**** RESULTS ****');

	    var results = await ms.select(test.bag);

	    for await(var selected of results) {
	        console.log({ selected: selected });
	    }

	    console.log({ STATS: ms.get_stats() });

	    console.log(ms.debug());
	var t2 = Date.now();

	console.log({ timer: (t2 - t1) / 1000 });

	};

	show();

})));

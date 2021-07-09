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

	    var defaults$1 = {
	        mwc: {
	            modulus: 314159,
	            divider: 37,
	            keysize: 5
	        },
	        pool: {
	            size: 100 * 1000,
	            thresold: 0.05,
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
	    //            console.log('reallocate', { count: stats.count })            

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
	            merge(conf, defaults$1, options);

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

	    var ROLE = 'R';

	    var PART = 'P';

	    var ITEM = 'I';

	    var duck_blocks = function (context) {

	        var ref =  context.tooling;
	        var pool = ref.pool;

	        var create = async function (def) {
	            var ducktype = def.ducktype;
	            var fellow = def.fellow;
	            var payload = def.payload;


	          var block = {
	                ducktype: ducktype,
	                payload: payload,
	                fellow: fellow,
	                related: [],
	                lookup: new Map(),
	                counter: 0
	            };

	            var uid = await pool.set_data(block);
	           
	            block.uid = uid;

	            return block        
	        };

	        var hydrate = async function (query) {
	            var uid = query.uid;
	            var ducktype = query.ducktype;
	            query.fellow;

	            var block = await pool.get_data(uid);

	            if(!block) 
	                { throw new Error('duck_blocks.hydrate: block not found @uid = ' + uid) }

	            if(block.ducktype !== ducktype)
	               { throw new Error('duck_blocks.hydrate: ducktype inconsistency !!!') }


	            return block
	        };

	        return {
	            create: create,
	            hydrate: hydrate
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
	            
	        return results
	    };

	    var duck_lookup = function (context) {
	        
	        // grab ducks tooling from context
	        var ref = context.tooling;
	        var ducks = ref.ducks;

	        // role blocks lookup
	        var roles  = new Map();

	        // parts blocks lookup
	        var parts = new Map();

	        // install role blocks in pool
	        var install_roles = async function (roles_names) {

	            var promises = roles_names.map(async function (role_name) {
	                if(false === roles.has(role_name)) {
	                    var block = await ducks.create({
	                        ducktype: ROLE,
	                        fellow: null,
	                        payload: { role_name: role_name }                    
	                    });

	                    roles.set(role_name, block);
	                }
	            });

	            return await Promise.all(promises)
	        };

	        // get role block by its name from lookup
	        var get_role = function (role_name) {
	            var role = roles.get(role_name);

	            if(!role) 
	                { throw new Error('lookup.get_role: HO for role_name= ' + role_name) }

	            return role
	        };

	        // install parts blocks in pool (by part value)
	        var install_parts = async function (bag) {
	            var roles_names = Array.from(roles.keys());

	            var promises = roles_names.map(async function (role_name) {
	                var role = get_role(role_name);
	                var part_value = bag[role_name];
	                var entries = parts.get(part_value) || [];
	                var found = false;

	                if(false === (role_name in bag)) 
	                    { throw new Error('lookup.install_parts: user bag KO for role_name= ' + role_name) }

	                for(var part of entries) {
	                    if(part.fellow === role.uid) {
	                        // console.log({ found})
	                        found = true;
	                    }
	                }

	                if (!found) {
	                    var part$1 = await ducks.create({
	                        ducktype: PART,
	                        fellow: role.uid,
	                        payload: { part_value: part_value } 

	                    });

	                    role.related.push(part$1.uid);
	                    role.counter++;
	                    entries.push(part$1);    

	                    role.lookup.set(part_value, part$1);
	                }
	                
	    //            parts.set(part_value, entries)

	                return part_value
	            });

	            return await Promise.all(promises)
	        };

	        var collect_records = async function* filters() {
	            var roles_names = Array.from(roles.keys());               
	            Array.from(parts.keys());        
	            var still_extracting = true;

	            while (still_extracting) {
	                var record = [];

	                var loop = function () {
	                    var role = get_role (role_name);
	                    var filter = filters[role_name];
	                    var pvs = Array.from(role.lookup.keys());

	                    var filtered = [];

	                    if (role.lookup.has(filter)) {
	                        filtered = role.lookup.get(filter);
	                    } else if (typeof filter === 'function') {
	                        filtered = pvs.filter(function (pv) { return filter(pv); });
	                    } else if (filter === '*') {
	                        filtered = pvs;
	                    } else {
	                       filtered = [];
	                    }

	                    for (var part_value of filtered) {
	                        record.push(part_value);          
	                    }
	                };

	                for (var role_name of roles_names) loop();

	                if(record.length === roles_names.length) {
	                    yield record;
	                } else {
	                    still_extracting = false;
	                }
	            }
	        };

	        var install_item = async function (bag, with_data) {
	            var records = collect_records();
	            var record_idx = 0;

	            for await (var record of records) {
	                record_idx++;

	                var lists = [];

	                for(var part of record) {
	    //                lists.push(part.refs.related)
	                    lists.push(part.related);
	                }

	                var isect = lists_intersect(lists);

	    //            console.log({ INSTALL_ITEMS: isect })

	                for (var uid of isect) {
	                    var item = await ducks.hydrate({ 
	                        uid: uid,
	                        ducktype: ITEM,
	                        fellow: null
	                    });

	                    item.payload.with_data = with_data;
	                }

	    //            console.log({ isect })

	                if(isect.length === 0) {
	                    var index = 0;
	                    var item$1 = null;

	                    for (var part$1 of record ) {
	                        if (index === 0) {
	                            // add new item to parts
	                            //  console.log('create-item')
	                            item$1 = await ducks.create({
	                                ducktype: ITEM,
	                                fellow: null,
	                                payload: { with_data: with_data }
	                            });
	                        }

	                        part$1.related.push(item$1.uid);
	                        part$1.counter++;
	                        index++;
	                    }


	    //                console.log(record.map(part => ducktypes.trace(part)))
	                }
	            }

	            //console.log({ record_idx })
	    //            console.log({ record_idx })

	            return record_idx
	        };

	        var select_items = async function* (filters) {
	            var records = collect_records();

	            for await (var record of records) {
	                var lists = [];
	                var bag = {};
	                var with_data = '#KO!';

	                for (var part of record) {
	                    var role = await ducks.hydrate({
	                        uid: part.fellow,
	                        ducktype: ROLE
	                    });

	                    bag[role.payload.role_name] = part.payload.part_value;
	                    lists.push(part.related);
	                    console.log(part.related.length); 
	               }

	                var isect = lists_intersect(lists);

	    //            console.log({ SELECT_ITEMS: isect.length })

	                for (var uid of isect) {
	                    var item = await ducks.hydrate({ 
	                        uid: uid,
	                        ducktype: ITEM
	                    });

	    //                console.log('select_item', item)

	                    with_data = item.payload.with_data;
	                }

	                yield { bag: bag, with_data: with_data};
	            }
	        };

	        return {
	            install_roles: install_roles,
	            install_parts: install_parts,
	            install_item: install_item,
	            select_items: select_items
	        }    

	    };

	    var defaults = {
	        debug: true,
	        pool: {
	            size: 100000
	        }
	    };

	    var create_multistore = function (roles_names, options) {
	        if ( options === void 0 ) { options = {}; }


	        var set = async function (bag, with_data) {
	            await tooling.lookup.install_roles(roles_names);
	            await tooling.lookup.install_parts(bag);
	            var inst_items = await tooling.lookup.install_item(bag, with_data);

	            return inst_items
	        };

	        var get = async function (bag) {

	        };

	        var select = async function* (filters) {
	            var pairs = await tooling.lookup.select_items(filters);                

	            for await (var pair of pairs) {
	                yield pair;
	            }
	        };

	        var remove= async function (bag) {

	        };

	        var toString = function () {

	        };

	        var debug = function () {

	        };

	        var trace = async function (filters) {

	        };

	        var get_stats = function () {
	            return {
	                pool: tooling.pool.get_stats()
	            }
	        };


	        var conf = {};

	        var stats = {
	            sets: 0,
	            gets: 0,
	            removes: 0,
	            selects: 0
	        };

	        var tooling = {
	            keygen: {},
	            pool: {},
	            ducks: {},
	            lookup: {}
	        };

	        var context = {
	            conf: conf,
	            tooling: tooling,
	            stats: stats
	        };

	        var setup = function () {
	            merge(context.conf, defaults, options);
	            merge(tooling.pool, create_bmp(conf));
	            merge(tooling.ducks, duck_blocks(context));
	            merge(tooling.lookup, duck_lookup(context));
	    //        console.log('context.conf', context.conf)
	    //        console.log('context.tooling', context.tooling)
	        };
	        
	        setup();

	        return {
	            set: set, 
	            get: get, 
	            select: select, 
	            toString: toString, 
	            debug: debug, 
	            get_stats: get_stats,
	            remove: remove,
	            trace: trace
	        }
	    };

	    var create_naive_store = function (roles_names, options) {


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

	    exports.create_bmp = create_bmp;
	    exports.create_multistore = create_multistore;
	    exports.create_mwc = create_mwc;
	    exports.create_naive_store = create_naive_store;
	    exports.keygen = keygen;
	    exports.keys = keys;

	    Object.defineProperty(exports, '__esModule', { value: true });

	})));
	});

	var DIMS = 100;
	var roles_names = 'x,y,z'.split(',');
	var NMAX = Math.pow(DIMS, roles_names.length);
	var rand = function (n) { return 1 + Math.floor(n * Math.random()); };

	var ms = dist.create_multistore(roles_names, {
	    pool: {
	        size: NMAX
	    },
	    debug: true
	});

	//console.log(ms)

	var pairs = [];

	for(var i = 0; i < NMAX; i++) {

	    pairs.push({
	        bag:  {
	//             x: rand(NMAX),
	//           y: rand(NMAX),
	//           z: rand(NMAX),
	           x: rand(DIMS),
	            y: rand(DIMS),
	            z: rand(DIMS),
	      },
	        with_data: {
	             r: rand(NMAX) / NMAX,
	             g: rand(NMAX) / NMAX,
	             b: rand(NMAX) / NMAX,
	        }
	    });
	}

	var test  = pairs[NMAX - 1];
	// const test  = pairs[0]
	// const test = { bag: { x: 0, y: 0, z: 0 } }

	console.log('multistore debug...');
	//console.log({ test: idx, NMAX})

	var show = async function () {

	    console.log('*** ASSOCIATE DATA ***');

	    for(var j = 0; j < pairs.length; j++) {
	        var ref = pairs[j];
	        var bag = ref.bag;
	        var with_data = ref.with_data;
	        
	//        console.log('setting element j=' + j)
	//        console.log('\n', bag, '\n')

	        if((j % DIMS === 0)) { console.log('iteration: ' + j + ' / ' +NMAX); }

	        await ms.set(bag, with_data);
	    }

	    console.log({ STATS: ms.get_stats() });

	    console.log('fetching results...');
	    
	//    console.log({ test })

	    console.log('**** RESULTS ****');

	    var results = await ms.select(test.bag);

	    for await(var selected of results) {
	        console.log({ selected: selected });
	    }

	    console.log({ STATS: ms.get_stats() });

	    console.log(ms.debug());
	};

	show();

})));

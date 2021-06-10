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
	            size: 10 * 1000,
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

	    var create_roles_lookup = function (context) {
	        context.pool;
	        var ducks = context.ducks;

	        var lookup = new Map();

	        var install_roles = async function (roles_names) {
	            var promises = roles_names.map(async function (role_name) {
	                var uid, role;

	                if(lookup.has(role_name)) {
	                    uid = lookup.get(role_name);
	                } else {
	                    role = await ducks.create({
	                        ducktype: 'role',
	                        data: { role_name: role_name, lookup: new Map() }
	                    });

	                    uid = role.uid;
	                    lookup.set(role_name, uid);
	                }

	                return uid
	            });

	            return await Promise.all(promises)
	        };

	        var get_role = async function (role_name) {
	            if (lookup.has(role_name)) {
	                var uid = lookup.get(role_name);

	    //            console.log({ HYDRATE: uid })

	                return await ducks.hydrate({ 
	                    ducktype: 'role',
	                    uid: uid 
	                })
	            } 

	            throw new Error('role not found for role_name = ' +  role_name)
	        };

	        return { install_roles: install_roles, get_role: get_role }
	    };

	    var wrap_role = function (context) {

	        var ducks = context.ducks;

	        var wrap = function (def) {
	            var uid = def.uid;
	            def.ducktype;
	            var block = def.block;
	            var ref = block.data;
	            var lookup = ref.lookup;

	            var install_part = async function (part_value) {
	                var uid, part;

	                if(lookup.has(part_value)) {
	                    uid = lookup.get(part_value);
	                    part = await ducks.hydrate({
	                        ducktype: 'part',
	                        uid: uid
	                    });
	                } else {
	                    part = await ducks.create({
	                        ducktype: 'part',
	                        data:  { part_value: part_value }
	                    });

	                    lookup.set(part_value, part.uid);
	                    block.related.push(part.uid);
	                }

	                return part
	            };

	            var get_part = async function (uid) {
	                var idx = block.related.indexOf(uid);
	                
	                if(idx > -1) 
	                    { return await ducks.hydrate({ 
	                        ducktype: 'part', 
	                        uid: block.related[idx]
	                    }) }

	                return null
	            };

	            var select_parts = async function (filter) {
	                var results = [];

	    //            console.log(Array.from(lookup.keys()))

	                if (lookup.has(filter)) {
	                    var uid =  lookup.get(filter);

	                    var part = await ducks.hydrate({
	                        ducktype: 'part',
	                        uid: uid
	                    });

	                    results.push(part);
	                } else {
	                    for (var uid$1 of block.related) {
	                        var part$1 = await ducks.hydrate({
	                            ducktype: 'part',
	                            uid: uid$1
	                        });
	    //                    console.log({ part: part.get_part_value() })

	                        if (part$1.test_value(filter)) {
	                            results.push(part$1);
	                        }
	                    }
	                }

	    //            console.log({ results: results.length })

	                return  results 
	            };

	            var debug = function () {
	                return (uid + "\t role \t [" + (block.counter) + "] " + (block.data.role_name))
	            };

	            var get_role_name = function () { return block.data.role_name; };

	            return {
	                uid: uid, 
	                get_role_name: get_role_name,
	                install_part: install_part, 
	                get_part: get_part, 
	                select_parts: select_parts, 
	                debug: debug
	            }
	        };

	        return { wrap: wrap }
	    };

	    var wrap_part = function (context) {

	        var ducks = context.ducks;

	        var wrap = function (def) {
	            var uid = def.uid;
	            def.ducktype;
	            var block = def.block;

	            var setup_item = async function (with_data ) {
	    //            console.log('    SETUP ITEM')

	                var item = await ducks.create({
	                    ducktype: 'item',
	                    data:  with_data 
	                });

	                block.related.push(item.uid);
	                block.counter++;
	        
	                return item
	            };

	             var refer_item  = function (uid) {
	    //            console.log('    REFER ITEM')
	                block.related.push(uid);
	                block.counter++;
	            };

	            var test_value = function (expected) {
	    //            console.log(block)

	                if(expected === '*') { return true }
	                if(typeof expected === 'function') {
	                    return expected(block.data.part_value)
	                }
	                    
	                return expected === block.data.part_value
	            };
	        
	            var select_items = async function* () {

	    //            console.log(block)

	                for(uid of block.related) {
	                    var item = await ducks.hydrate({
	                        ducktype: 'item',
	                        uid: uid
	                    });

	                    yield item;
	                }
	            };

	            var debug = function () {
	                return (uid + "\t part \t [" + (block.counter) + "] " + (block.data.part_value))
	            };

	            var get_part_value = function () { return block.data.part_value; };

	            return {
	                uid: uid, 
	                get_part_value: get_part_value,
	                setup_item: setup_item,
	                refer_item: refer_item,
	                test_value: test_value,
	                select_items: select_items,
	                debug: debug
	            }
	        };

	        return { wrap: wrap }
	    };

	    var wrap_item = function (context) {
	        context.ducks;

	        var wrap = function (def) {
	            var uid = def.uid;
	            def.ducktye;
	            var block = def.block;

	            var set_data = async function (data) {
	                block.data = data;
	            };
	      
	            var get_data = async function () {
	                return block.data
	            };

	            var debug = function () {
	                return (uid + "\t item \t [" + (block.counter) + "] " + (block.data.with_data))
	            };


	            return {
	                uid: uid, 
	                set_data: set_data, 
	                get_data: get_data, 
	                debug: debug
	            }
	        };

	        return { wrap: wrap }
	    };

	    var duck_blocks = function (context) {

	        var pool = context.pool;
	        context.ducks;

	            var funcs = {
	                role: wrap_role(context),
	                part: wrap_part(context),
	                item: wrap_item(context)
	            };

	        var create = async function (def)  {
	            var ducktype = def.ducktype;
	            var data = def.data;
	            
	            var block = {
	                data: data,
	                related: [],
	                counter: 0
	            };

	            var uid = await pool.set_data(block);

	            return wrap({ uid: uid, ducktype: ducktype, block: block})
	        };

	        var hydrate = async function (query)  {
	            var ducktype = query.ducktype;
	            var uid = query.uid;

	    //        console.log({ HYDRATE: query })

	            var block = await pool.get_data(uid);

	            return wrap({ uid: uid, ducktype: ducktype, block: block})        
	        };

	        var wrap = function (def)  {
	            var ducktype = def.ducktype;



	    //        console.log(funcs[ducktype])

	            var wrapped = funcs[ducktype].wrap(def);

	            return wrapped
	        };

	        var debug = function (def) {

	        };

	        return {
	            create: create,
	            hydrate: hydrate,
	            debug: debug
	        }
	    };

	    var uids_selector = function (roles_names) {
	        var lookup = new Map();

	        var collect = function (record) {
	            var item_uid = record.item_uid;
	            var collected = lookup.get(item_uid) || [];
	            var found = false;

	    //        console.log('     collect', { collected })
	            // *********
	            for(var entry of collected) {
	                if (entry.role_uid !== record.role_uid) { continue }
	                if (entry.part_uid !== record.part_uid) { continue }
	                if (entry.item_uid !== record.item_uid) { continue }

	                found = true;
	    //            collected.push(record)
	            }
	     
	            if(found === false) { collected.push(record); }
	            

	            // *********

	    //        collected.push(record)
	            lookup.set(item_uid, collected);
	        };

	        var get_collected = function* () {
	    //        console.log(lookup)

	            var items_uids = Array.from(lookup.keys());
	            var acc = new Map();

	            for (var item_uid of items_uids) {
	                var records = lookup.get(item_uid);


	    //            console.log(records)

	                for (var record of records) {
	                    var collect_idx = record.collect_idx;
	                    var extracted = acc.get(collect_idx) || [];
	                    
	                    extracted.push(record);               
	                    acc.set(collect_idx, extracted);

	                    if (extracted.length === roles_names.length) {
	                        // console.log(extracted.length)
	                        yield extracted;
	                    }
	                }
	            }
	        };

	        var debug = function () {
	            return lookup        
	        };

	        return { collect: collect, get_collected: get_collected, debug: debug }
	    };

	    var defaults = {
	        pool: {
	            size: 1000
	        }
	    };

	    var create_multistore = function (roles_names, options) {

	        var selector = uids_selector(roles_names);
	        var collect_idx = 0;


	        var set = async function (pairs_bag, with_data) {
	            await roles_lookup.install_roles(roles_names);
	            var inst_parts = await install_parts(pairs_bag);
	            var collected_records = await collect_uids(pairs_bag);

	            var counter = 0;

	    //        collect_idx++

	            for await (var record of collected_records) {
	    //            console.log({ RECORD: record }) 
	                if (record.length === roles_names.length) {
	                    var item_uid = record[0].item_uid;

	                    var item = await ducks.hydrate({
	                        ducktype: 'item', uid: item_uid
	                    });

	    //                console.log({ item })

	                    var promise = item.set_data(with_data); 

	                    return await promise
	                }

	                counter++;
	            }

	            if(counter === 0) {
	    //            console.log('NEW_ITEM')
	    //            console.log({ SET_INST_PARTS: inst_parts.length})
	                var item$1;
	                var index = 0; 

	                for (var part of inst_parts) {
	    //                console.log('PART', { part })

	                    if (index === 0) {
	                        item$1 = await part.setup_item( with_data); 
	                    } else {
	                        part.refer_item(item$1.uid);
	                    }

	    //                console.log(item)

	                    index++;
	                }
	            }

	            stats.sets++;

	    //        console.log({ SET_COUNTER: stats.sets }, '\n')

	        };

	        var install_parts = async function (pairs_bag) {
	    //        let counter = 0

	            var installed = roles_names.reduce(async function (acc, role_name) {
	                var role = await roles_lookup.get_role(role_name);
	                var values = await acc;
	                var part;

	                if (role_name in pairs_bag) {
	                    await role.select_parts(pairs_bag[role_name]);                
	                    
	                    part = await role.install_part(pairs_bag[role_name]);

	                    values.push(part);
	                } else {
	                    throw new Error('Undefined role in bag: ' + role_name)    
	                }
	                
	                return values
	            }, Promise.resolve([]));

	    //        console.log({ INSTALLED: await installed })

	            if ((await installed).length !== roles_names.length) {
	                throw new Error ('bad roles pairs count !')
	            }

	    //        return await Promise.all(installed)
	            return await installed
	        };

	        var collect_uids = async function (filters) {

	            collect_idx++;

	            for (var key of roles_names) {
	                var role = await roles_lookup.get_role(key);
	                var parts = await role.select_parts(filters[key]);

	                for (var part of parts) {
	                    var items = await part.select_items();

	                    for await (var item of items) {
	                        selector.collect({
	                            collect_idx: collect_idx,
	                            role_uid: role.uid, 
	                            part_uid: part.uid, 
	                            item_uid: item.uid
	                        });
	                    }
	                }
	            }     
	            
	    //        console.log('COLLECT', { counter })

	            return selector.get_collected()
	        };

	        var get = async function (pairs_bag) {

	            stats.gets++;
	            console.log('GET', { pairs_bag: pairs_bag });            
	        };

	        var select = async function* (filters_bag) {
	            var collected_records = await collect_uids(filters_bag);

	    //        collect_idx++

	            for await (var record of collected_records) {
	                var bag = {};
	                var data = (void 0); 

	    //            if (record.length !== roles_names.length)

	                for (var entry of record) {
	                    var role_uid = entry.role_uid;
	                    var part_uid = entry.part_uid;
	                    var item_uid = entry.item_uid;
	                    var role = await ducks.hydrate({ ducktype: 'role', uid: role_uid });
	                    var part = await ducks.hydrate({ ducktype: 'part', uid: part_uid });
	                    var item = await ducks.hydrate({ ducktype: 'item', uid: item_uid });

	                 // console.log(role.get_role_name(), part.get_part_value())

	                    bag[role.get_role_name()] = part.get_part_value();
	                    data = await item.get_data();
	                }

	                yield { pairs_bag: bag, with_data: data };
	            }

	            stats.selects++;
	        };

	        var debug = function () {

	            var values = pool.debug().map(function (d) {
	                if (!d) {
	                    return { uid: d.uid, data: '#EMPTY!' }
	                } else {

	                    return { uid: d.uid, data: d.data ? d.data.data : '#NULL!' }
	                }
	            });

	            return values
	        };


	        var toString = function () {

	        };

	        var get_stats = function () {
	            return {
	                multistore: stats,
	                pool: pool.get_stats()
	            }
	        };

	        var setup = function () {
	            merge(conf, defaults, options);

	            merge(stats, {
	                sets: 0,
	                gets: 0,
	                selects: 0,
	                relases: 0
	            });

	            merge(context.pool, create_bmp(conf));
	            merge(context.ducks, duck_blocks(context));
	            merge(context.roles_lookup, create_roles_lookup(context));  

	            // console.log(context)
	        };
	        var pool = {};
	        var ducks = {};
	        var roles_lookup = {};
	        var context = { pool: pool, ducks: ducks, roles_lookup: roles_lookup };
	        var conf = {};
	        var stats = {};

	        setup();

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
	    exports.keygen = keygen;
	    exports.keys = keys;

	    Object.defineProperty(exports, '__esModule', { value: true });

	})));
	});

	var DIMS = 2;
	var roles_names = 'x,y,z'.split(',');
	var NMAX = Math.pow(DIMS, roles_names.length);
	var rand = function (n) { return 2 + Math.floor(n * Math.random()); };

	var ms = dist.create_multistore(roles_names, {
	    pool: {
	        size: NMAX
	    }
	});

	//console.log(ms)

	var pairs = [];

	for(var i = 0; i < NMAX; i++) {
	    pairs.push({
	        bag:  {
	//             x: rand(NMAX),
	//             y: rand(NMAX),
	//             z: rand(NMAX),
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

	var idx = rand(NMAX) - 2;

	console.log(pairs);
	console.log(idx);

	var test  = pairs[idx];

	console.log('multistore debug...');

	var show = async function () {

	    console.log('associate data...');

	    for(var j = 0; j < pairs.length; j++) {
	        var ref = pairs[j];
	        var bag = ref.bag;
	        var with_data = ref.with_data;

	        await ms.set(bag, with_data);
	    }

	    console.log('fetching results...');
	    
	    console.log({ test: test });

	    console.log('**** RESULTS ****');

	    var results = await ms.select(test.bag);

	    for await(var selected of results) {
	        console.log({ selected: selected });
	    }

	//    (await ms.debug()).map(d => console.log(d.uid, d.data))
	//    console.log(ms.debug())               

	    console.log('***** STATS *****');

	    console.log(ms.get_stats());
	    console.log(ms.debug());
	};

	show();

})));

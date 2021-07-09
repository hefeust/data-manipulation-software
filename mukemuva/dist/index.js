(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.mukemuva = {}));
}(this, (function (exports) { 'use strict';

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
        if ( options === void 0 ) options = {};


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

    var f = function (a, b) {
        var ref;

        return (ref = []).concat.apply(ref, a.map(function (d) { return b.map(function (e) { return [].concat(d, e); }); }));
    };

    var cartesian = function (a, b) {
        var c = [], len = arguments.length - 2;
        while ( len-- > 0 ) c[ len ] = arguments[ len + 2 ];

        return (b ? cartesian.apply(void 0, [ f(a, b) ].concat( c )) : a);
    };

    var cartesian_product = cartesian;

    var duck_lookup = function (context) {
        
        // grab ducks tooling from context
        var ref = context.tooling;
        var ducks = ref.ducks;

        // role blocks lookup
        var roles  = new Map();

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
                var entries = role.lookup.get(role_name) || [];
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

                    role.lookup.set(part_value, part$1.uid);
                }
                
    //            parts.set(part_value, entries)

                return part_value
            });

            return await Promise.all(promises)
        };

        var collect_records = async function* (filters) {
            var roles_names = Array.from(roles.keys());
            var marked = new Map();
    //        const collected = new Map()       

    //            console.log('**** collect_records ****')

            var loop = function () {
                    var role = get_role(role_name);
                    var filter = filters[filter];
                    var by_role = marked.get(role_name) || [];
                    var pvs = Array.from(role.lookup.keys());
                    var filtered = [];
                    
                    if (role.lookup.has(filter)) {
                        filtered = [role.lookup.get(filter)];
                    } else if (typeof filter === 'function') {
                        filtered = pvs.filter(function (pv) { return filter(pv); });
                    } else if (filter === '*') {        
                        filtered = pvs;
                    }
                    
                    console.log({ filtered: filtered });

                    for (var part_value of filtered) {
                        by_role.push(part_value);
                    }

                    marked.set(role_name, by_role);
            };

            for( var role_name of roles_names) loop();

            var arrays = roles_names.map(function (role_name) {
                var entries = marked.get(role_name);

                return entries
            }).reduce(function (acc, val) { return acc.concat([val]); }, []);

            console.log('marked', marked);
            console.log('arrays', arrays);

            var cart_prod = cartesian_product.apply(void 0, arrays);

            console.log('CARTESIAN PRODUCT', cart_prod);

            for(var cp of cart_prod) {
                var results = [];

                for(var uid of cp) {
                    var part = ducks.hydrate({
                        uid: uid,
                        ducktype: PART
                    });

                    results.pusg(part);
                }

                yield result;
            }
        };

        var install_item = async function (bag, with_data) {
            var records = await collect_records(bag);
            var record_idx = 0;

            for await (var record of records) {
                record_idx++;

                var lists = [];

                for(var part of record) {
                    lists.push(part.related);
                }

                var isect = lists_intersect(lists);


                for (var uid of isect) {
                    var item = await ducks.hydrate({ 
                        uid: uid,
                        ducktype: ITEM,
                        fellow: null
                    });

                    item.payload.with_data = with_data;
                }

                console.log({ INSTALL_isect: isect.length });
                console.log({ isect: isect });

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
            var records = await collect_records(filters);

            for await (var record of records) {

                console.log({ select_items: record.length});

                var lists = [];
                var bag = {};
                var with_data = '#KO!';

                for (var part of record) {
                    var role = await ducks.hydrate({
                        uid: part.fellow,
                        ducktype: ROLE
                    });

    //                    console.log({ related: part.related.length})                    

                    bag[role.payload.role_name] = part.payload.part_value;
                    lists.push(part.related);

    //                console.log(part.related.length) 
               }

                console.log({ lists: lists });                    

                var isect = lists_intersect(lists);


                console.log({ SELECT_ITEMS: isect.length });

                for (var uid of isect) {
                    var item = await ducks.hydrate({ 
                        uid: uid,
                        ducktype: ITEM
                    });

    //                console.log('select_item', item)

                    with_data = item.payload.with_data;
                }

                console.log({ bag: bag });

                yield { bag: bag, with_data: with_data }; 
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
        if ( options === void 0 ) options = {};


        var set = async function (bag, with_data) {
            await tooling.lookup.install_roles(roles_names);
            await tooling.lookup.install_parts(bag);
            var inst_items = await tooling.lookup.install_item(bag, with_data);

            stats.sets++;

            return inst_items
        };

        var get = async function (bag) {
            stats.gets++;
        };

        var select = async function* (filters) {
            var pairs = await tooling.lookup.select_items(filters);                

            for  await (var pair of pairs) {
                yield pair;
            }

            stats.selects++;
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
                multistore: stats,
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

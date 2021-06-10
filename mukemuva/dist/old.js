(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.kesko = {}));
}(this, (function (exports) { 'use strict';

  var CHARACTERS  = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');

  var num2char = function (num) {
  //    num  = Math.floor(num)

  //    if(0 <= num && num < CHARACTERS.length) {
          return CHARACTERS[num]
  //    } else {
    //      return '#' + num  + '#'
  //    }
  };

  var keys36 = function (values) {
      var text = '';

  //    console.log(values)

      values.map(function (value) {
          text += num2char(value);
      });

      return  text
  };

  var create_mwc = function (a, b, r) {

      var xi = new Array(r);
      var ci = new Array(r);

      var init = function (seeds) {
          seeds.map(function (s, idx) { 
              xi[idx] = s;  
              ci[idx] = s * (s * (s * r - 1) * r - 1) * r - 1;
  //            ci[idx] = Math.floor(a * s * (r - idx) / b)
  //            ci[idx] = Math.floor((a * s  + (r - idx) ) / b) 
          });
      };

      var step = function () {
          var xn_1 = xi.shift();
          var cn_1 = ci.shift();
          var xn = (a * xn_1 + cn_1) % b;
          var cn = Math.floor((a * xn_1 + cn_1) / b);

          xi.push(xn);
          ci.push(cn);

  //        console.log(xi, ci)

          return xi        
      };

      var next = function () {
          var results = [];

          for(var i = 0; i < r; i++) {
              results = step();
          }

          return results
      };

      return { init: init, next: next }
  };

  var create_bmp = function (options) {

      /**
      * complete blocks list
      */
      var blocks = [];

      /**
      * block uids lookup
      * 
      */
      var lookup = new Map();

      /**
      * get data by uid
      * @param UID uid
      * @return Any
      */
      var get_data = function (uid) {
          var idx = lookup.get(uid);
          var block = null;

          get_calls++;

          if(idx < blocks_count) {
              block = blocks[idx];

              return block.data
          } else {
              return null
          }
      };

      /**
      * set data a,d return compputed store  UID
      * @param Any data
      * @return UID
      */
      var set_data = function (data) {
          var block = blocks[watermark];
          
          lookup.set(block.uid, watermark);
          block.data = data;         
          watermark++;
          set_calls++;

          return block.uid
      };

      /** 
      * empty the block at UID
      * and relase data
      *
      */
      var release_data = function (uid) {
          var idx = lookup.get(uid);
          var temp = blocks[idx];

          blocks[idx] = blocks[watermark];
          blocks[watermark] = temp;
          release_calls++;
          watermark--;
      };

      var reallocate_blocks = function (amount) {
          var newly_created = new Array(amount);
          var block = null;
          var uid = null;
          var i = 0;

          for(var k = 0; k < amount; k++) {
              do {
                  uid = keys36(mwc.next());
                  i++;
  //                console.log(++i)
                  if(lookup.has(uid)) { console.log('collision: ' + i); }
              } while(lookup.has(uid))

              block = { uid: uid, data: null };
              newly_created[k] = block;
              lookup.set(uid, k + blocks_count);
          }

          blocks.push.apply(blocks, newly_created);
          blocks_count += amount;
      };

      var toString = function () {};

      var debug = function () {
          
      };

      var get_stats = function () {
          return {
              watermark: watermark, 
              blocks_count: blocks_count, 
              set_calls: set_calls,
              get_calls: get_calls,
              release_calls: release_calls
          }
      };

      var bmp_api = {
          set_data: set_data, 
          get_data: get_data,
          release_data: release_data,
          reallocate_blocks: reallocate_blocks,
          get_stats: get_stats,
          toString: toString, 
          debug: debug, 
      };

      var setup = function (options) {
          var size = options.size || (50 * 1000);
          var seeds = [];
          var key_length = 4;

          if(size >  (1000 * 1000)) {
              key_length = 6;
          } 

          for(var s = 0; s < key_length; s++) {
              seeds[s] = Math.pow(s + 1, s);
          }

          mwc = create_mwc(17*17*17+13*13+11+1, 36, key_length);
          mwc.init(seeds);
          reallocate_blocks(size);
      };

      var mwc = null;
      var blocks_count = 0;
      var watermark = 0;
      var set_calls = 0;
      var get_calls = 0;
      var release_calls = 0;

      setup(options);

      return bmp_api
  };

  var bags = function (bmp) {

      var find = function (actual_uids, will_add) {
          var search_lookup = new Map();
          var empty_block = { data: null };
          var found = [];
          var new_uid = null;

  //        console.log('bags.find')
  //        console.log({ actual_uids_length: actual_uids.length , will_add})
  //        console.log({ actual_uids })

          actual_uids.map(function (actual_role_uid, idx) {
              var actual_role = bmp.get_data(actual_role_uid);
              
  //            console.log(actual_role)

              actual_role.items.map(function (item_uid) {
                  var count =  search_lookup.get(item_uid) || 0;

                  if(count === idx) {
  //                    console.log('count: ' + item_uid)
                      search_lookup.set(item_uid, 1 + count);
                  } else {
  //                    console.log('delete: ' + item_uid)
                      search_lookup.delete(item_uid);
                  }
              });
          });

          found = Array.from(search_lookup.keys());        

          if(found.length === 1) {
  //            console.log(1)
              return found[0]
          } else if(will_add) {
              new_uid = bmp.set_data(empty_block);

              actual_uids.map(function (actual_role_uid) {
                  var actual_role = bmp.get_data(actual_role_uid);

                  actual_role.items.push(new_uid);
              });

              return new_uid
          }

          return null
      };

      var store_data = function (uid, with_data) {
          var stored = bmp.get_data(uid);
  	
          if(stored) {
              stored.data = with_data;

              return true
          } else {
              console.log('bags.store: data bag not found for uid=', uid);
              return  false
          }
      };

      var get_data = function (uid) {
          var stored = bmp.get_data(uid);       

          if(stored.data) {
              return stored.data
          } else {
              return null
          }
      };
      
      return {
          find: find, store_data: store_data, get_data: get_data
      }
  };

  var roles = function (bmp) {

      var lookup = new Map();

      var stats = {
          bag_store_calls: 0,
          unique_bag_created: 0
      };
      
      var create_from_list = function (roles_names_list) {
          roles_names_list.map(function (role_name) {
              var uid = bmp.set_data({
                  role_name: role_name, 
                  values: [], 
                  lookup: new Map()
              });

              lookup.set(role_name, uid);
          });
      };

      var get_names = function () { return Array.from(lookup.keys()); };

      var get_actual_role = function (role_name, role_value, will_create) {
          var role_uid = lookup.get(role_name);
          var role = bmp.get_data(role_uid);
          var actual_role_uid = null;
          var actual_role = {
              role_value: role_value,
              items: [],
              counter: 0
          };

  //        console.log({ get_actual_role: {role_name, role_value  }})
  //        console.log(lookup)
  //        console.log("ROLE:", role)

          if(role) {
              actual_role_uid = role.lookup.get(role_value);

              if(actual_role_uid ) {
                  actual_role = bmp.get_data(actual_role_uid);

  //                if(! actual_role)
  //                    return null

              } else if(will_create) {
                  actual_role_uid = bmp.set_data(actual_role);
                  role.values.push(actual_role_uid);
                  role.lookup.set(role_value, actual_role_uid);
              }
          } 
          
  //        console.log('****', { actual_role_uid })

          return actual_role_uid
      };

      var get_bag = function (roles_bag, will_create)  {
          var actual_uids = [];
          var roles_names = get_names();
          var query_names = Object.keys(roles_bag);            

  //        console.log('** get_bag')
  //        console.log({ roles_names})
  //        console.log({ query_names })

          roles_names.map(function (role_name) {
              var role_value = roles_bag[role_name];

              if(query_names.indexOf(role_name) > -1) {
                  actual_uids.push( get_actual_role(
                      role_name, role_value, will_create
                  ));
              } else {
                  console.log('get_bag_not_found'); 
                  console.log({ role_name: role_name });
              }
          });

          if(actual_uids.length === roles_names.length) {
              return actual_uids
          } else {
              return null
          }
      };

      var bag_store = function (roles_bag, with_data) {
          var roles_names = get_names();
          var bag_uids = get_bag(roles_bag, 'will-create');

          var item_uid = null; 

  //        console.log('* bag_store', { stats })
  //        console.log({ bag_uids })
                     
          stats.bag_store_calls++;

          if(bag_uids.length > 0) {
              item_uid = bags(bmp).find(bag_uids, 'will-add');
              bags(bmp).store_data(item_uid, with_data);
          } else {
              console.log('roles.bag_store: bag_uids is EMPTY!');
          }
      };

      var bag_recall = function (roles_bag) {
          var roles_names = get_names();
          var bag_uids = get_bag(roles_bag);
          var item_uid = bags(bmp).find(bag_uids); 

          return bags(bmp).get_data(item_uid)
      };

      var get_stats = function () {
          return stats 
      };

      var roles_api = { 
          create_from_list: create_from_list,
          get_names: get_names,
          bag_store: bag_store,
          bag_recall: bag_recall,
          get_stats: get_stats,
      };



      return roles_api
  };

  var create_multimap = function (roles_list) {

      var bmp = create_bmp({});

      var actual_roles = roles(bmp);

  //    const actual_bags = bags(bmp)

      /**
      * set roles_bag associated with data
      */
      var set = function (roles_bag, with_data) {
          return actual_roles.bag_store(roles_bag, with_data)
      };

      var get = function (roles_bag) {
          return actual_roles.bag_recall(roles_bag)
      };

      var remove = function (selector_bag, collector) {

      };

      /**
      * performs a quey against multimap
      *
      * @roles_
      */
      var select = function (selector_bag, collector) {

      };

      var toString = function () {};

      var debug = function (roles_bag) {
      };

      var get_stats = function () {
          console.log('get_stats');

          return {
              roles: actual_roles.get_stats(),
              bmp: bmp.get_stats()
          }
      };

      var mm_api = {
          set: set, 
          get: get, 
          remove: remove,
          select: select,
          debug: debug, 
          toString: toString, 
          get_stats: get_stats
      };

      // setup

      actual_roles.create_from_list(roles_list);

      Object.defineProperty(mm_api, 'roles', {
          get: function () { return actual_roles.get_names(); }
      });

      return mm_api
  };

  exports.create_multimap = create_multimap;
  exports.create_mwc = create_mwc;
  exports.keys36 = keys36;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

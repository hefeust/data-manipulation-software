
import { create_bmp } from '../memopool/bmp.js'


export const create_multimap = (roles_names_list, options) => {

    const bmp = create_bmp({})

    const roles_lookup = new Map()

    const stats = {
        raw_sets: 0,
        unique_sets: 0
    }

    const create_roles_from_list = () => {
        roles_names_list.map((role_name) => {
            const role_uid = bmp.set_data({
                role_name,
                values_uids: [],
                lookup_uids: new Map()
            })

            roles_lookup.set(role_name, role_uid)
        })
    }

    const set_actual_role = (role_name, role_value) => {
        const role_uid = roles_lookup.get(role_name)
        const role = bmp.get_data(role_uid)
        let actual_role_uid = null
        let actual_role =null

        if(role) {
            actual_role_uid = role.lookup_uids.get(role_value)

            if(actual_role_uid) {
                actual_role = bmp.get_data(actual_role_uid)
            } else {
                actual_role_uid = bmp.set_data( {
                    role_value,    
                    items_uids: [],
                    counter: 0
                })

                role.lookup_uids.set(role_value, actual_role_uid)
                role.values_uids.push(actual_role_uid)

                actual_role = bmp.get_data(actual_role_uid)
            }
        } else {
            console.log('unknown role for:', { role_name, role_value })

            throw new Error('UNKNOWN-ROLE')
        }

        return actual_role
    }

    const get_actual_role = (role_name, role_value) => {
        const role_uid = roles_lookup.get(role_name)
        const role = bmp.get_data(role_uid)
        let actual_role_uid = null
        let actual_role = null

        if(role) {
            actual_role_uid = role.lookup_uids.get(role_value)

            if(actual_role_uid) {
                actual_role = bmp.get_data(actual_role_uid)
            } else {
                console.log('role found but actual value not found !')
            }
        } else {
            console.log('unknown actual role for:', { rple_name, role_value })
        }

        return actual_role

    }

    const intersect_lists = (lists) => {
        const results = []
        const lookup = new Map()

        lists.sort((l1, l2) => l2.length - l1.length).map((list) => {
//        lists.map((list, idx) => {
            list.map((element) => {
                const count = lookup.get(element) || 0

//                if(count === idx) {
                    lookup.set(element, 1 + count)
//                } else {
  //                  lookup.delete(element)
//                }
            })
        })


        Array.from(lookup.keys()).map((key) => {
            if(lookup.get(key) === lists.length) {
                results.push(key)
            }
        })

//        console.log('intersect lookup:', lookup)
//        console.log(results)
        
        return results
    }

    const set_data = (actual_roles, with_data) => {
        const lists = []
        let write = []
        let new_bag_uid = null

       //console.log('actual_roles.length: ' + actual_roles.length )

        actual_roles.map((actual_role) => {
            lists.push(actual_role.items_uids)
        })

        write = intersect_lists(lists)

//        console.log('write.length: ' + write.length, write)

        if(write.length === 0) {
//            console.log('***** NEW BAG ****')
            new_bag_uid = bmp.set_data({ bag_data: with_data })

            actual_roles.map((actual_role) => {
                actual_role.items_uids.push(new_bag_uid)
                actual_role.counter++
            })

            stats.raw_sets++
            stats.unique_sets++
        } else if(write.length === 1)  {
//            console.log('** EXISTING BAG **')
            let old = null 

            write.map((bag_uid) => {
                const data = bmp.get_data(bag_uid)

//                console.log({ bag_uid, data, with_data})
                data.bag_data = with_data

//                console.log('BAG', bmp.get_data(bag_uid))
            })

            stats.raw_sets++ 
        } else {
//            console.log('ERROR ! write length > 1 = ' + actual_roles.length)
            actual_roles.map((actual_role) => {
                console.log(actual_role)
            })
/*
            write.map((bag_uid) => {
                console.log('BAG: ' + bag_uid, bmp.get_data(bag_uid))
            })
*/
            throw new Error('multiple values not yet allowed for onr bag !!!')
        }

//            console.log(bmp.debug())
    }

    const get_data = (actual_roles) => {
        const lists = []
        let found = []
        let new_bag_uid = null

        actual_roles.map((actual_role) => {
            lists.push(actual_role.items_uids)
        })

        found = intersect_lists(lists)

//        console.log('search_lookup', found)

        if(found.length === 1) {
            return bmp.get_data(found[0]).bag_data
        } 

//        console.log('get_data:', { result, found })

        return null
    }

    const set = (roles_bag, with_data) => {
        const roles_bag_names = Object.keys(roles_bag)
        const actual_roles = []        

//        console.log({ roles_bag, with_data })

        get_roles_names().map((role_name) => {
            const role_value = roles_bag[role_name]
            const actual_role = set_actual_role(role_name, role_value)

            actual_roles.push(actual_role)            
        })

        set_data(actual_roles, with_data)
    }

    const get = (roles_bag) => {
//        console.log('multimap.get', { roles_bag })        
        const roles_bag_names = Object.keys(roles_bag)
        const actual_roles = []        

        get_roles_names().map((role_name) => {
            const role_value = roles_bag[role_name]
            const actual_role = get_actual_role(role_name, role_value)

            actual_roles.push(actual_role)            
        })

        return get_data(actual_roles)       
    }

    const remove = (selector, collector) => {

    }

    const select_role = (role_name, selector) => {
        const role_uid = roles_lookup.get(role_name)
        const role = bmp.get_data(role_uid)
        let actual_role_keys = []
        let actual_collected = []
        let actual_role_uid = null
        let actual_role = null
        let test_func = (value) => true

        if(selector && collector.length > 0) {
            test_func = (value) => value === selector
        }

        if(role) {
            actual_roles_keys = Array.from(role.lookup.keys())

            actual_role_keys.map((actual_role_name) => {
                const test = test_func(actual_role_name)
                const actual_role = bmp.get_data(role.lookup.get(actual_role_name))

                if(test === true) {
                    actual_collected.push(actual_role)
                }
            })

        } else {
            console.log('unknown actual role for:', { rple_name, role_value })
        }

        return actual_collected
    }

    const select_data = (colected_roles) => {
        const lists = []
        let found = []

        selected_roles.map((actual_role) => {
            lists.push(actual_role.items_uids)
        })

        found = intersect_lists(lists)

        console.log({ found: found.length })

        return found
    }

    const select = (selector, collector) => {
        const roles_bag_names = Object.keys(roles_bag)
        const collected = []

        get_roles_names().map((role_name) => {
            const role_selector = roles_bag[role_name]
            const selected = select_actual_role(role_name, role_selector)
            const aggregated = []

            selected.map((sel) => {
                aggregated.push(...sel.items_uids)
            })

            collected.push(aggregated)
        })

        select_data(collected).map((bag) => {
            collector(bag)
        })
    }

    const toString = () => {

    }

    const debug = (roles_bag) => {

    }

    const get_stats = () => {
//        console.log('get_stats')

        return {
            multimap: stats,
            bmp: bmp.get_stats()
        }
    }

    const get_roles_names = () => Array.from(roles_lookup.keys())

    const mm_api = {
        set, 
        get, 
        remove,
        select,
        debug, 
        toString, 
        get_roles_names,
        get_stats
    }

    const setup = () => {
        create_roles_from_list()

    }

    setup()

    return mm_api
}

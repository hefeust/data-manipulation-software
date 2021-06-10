
import { create_bmp } from '../memopool/bmp.js'
import { create_bmp_wrapper } from './bmp-wrapper.js'
import { create_roles } from './roles.js'
import { lists_intersect } from './lists-intersect.js'

export const create_multimap = (roles_names_list, options) => {

    const bmp = create_bmp({})
    const bmp_wrapper = create_bmp_wrapper(bmp)
    const roles = create_roles(bmp_wrapper, roles_names_list)

    const stats = {
        raw_sets: 0,
        unique_sets: 0
    }


    const set_data = (parts, with_data) => {
        const lists = []
        let write = []
        let new_bag_uid = null

//        console.log('mm#set_data: partsl.length: ' + parts.length )
//        console.log( parts ) 

        parts.map((part) => {
            lists.push(part.items)
        })

        write = lists_intersect(lists)

//        console.log('write.length: ' + write.length, write)

        if(write.length === 0) {
//            console.log('***** NEW BAG ****')
            new_bag_uid = bmp_wrapper.set_duck('D', { bag_data: with_data })

            parts.map((part) => {
                part.items.push(new_bag_uid)
                part.counter++
            })

            stats.raw_sets++
            stats.unique_sets++
        } else if(write.length === 1)  {
//            console.log('** EXISTING BAG **')
            let old = null 

            write.map((bag_uid) => {
                const data = bmp_wrapper.get_duck('D', bag_uid)
                data.bag_data = with_data
            })

            stats.raw_sets++ 
        } else {
//            console.log('ERROR ! write length > 1 = ' + actual_roles.length)
            parts.map((part) => {
//                console.log(part)
            })
    
            throw new Error('multiple values not yet allowed for onr bag !!!')
        }
    }

    const set = (roles_bag, with_data) => {
        const roles_names = Object.keys(roles_bag)
        const parts = []        

        roles.names.map((role_name) => {
            const role_value = roles_bag[role_name]
            const part_uid = roles.set_part(role_name, role_value)
            const part = roles.get_part(role_name, role_value)

            // safety guard            
            if(false === roles_bag.hasOwnProperty(role_name)) {
                console.log('Unknown prop name in bag: ' + role_name)
                throw new Error('#INCONSISTENCY!')
            }

            parts.push(part)            
        })

//        console.log('roles#set_data: ' + parts.length)
        set_data(parts, with_data)
    }

    const get_data = (parts) => {
        const lists = []
        let found = []
        let new_bag_uid = null

        parts.map((part) => {
            lists.push(part.items)
        })

        found = lists_intersect(lists)
//        console.log('mm#get_data: ', found.length   )

        if(found.length === 1) {
            return bmp_wrapper.get_duck('D', found[0]).bag_data
        } 

        return null
    }


    const get = (roles_bag) => {
//        console.log('multimap.get', { roles_bag })        
        const roles_bag_names = Object.keys(roles_bag)
        const parts = []        

        roles.names.map((role_name) => {
            const role_value = roles_bag[role_name]
            const part = roles.get_part(role_name, role_value)

            parts.push(part)            
        })

//        console.log('roles#get : ' + parts.length)
//        console.log({ parts })

        return get_data(parts)       
    }

    const remove = (selector, collector) => {

    }

    const select = (roles_selector,  collector) => {
        const collected = []
        const bags_lookup = new Map()
        const selector_names = Object.keys(roles_selector)

        roles.names.map((role_name) => {
            const selector =  roles_selector[role_name]
            const selected_parts = roles.select_parts(role_name, selector)
            // selected = array of { role, part }
            const aggregated = []

            selected_parts.map((selected) => {
                const items = selected.part.items

                items.map((item_uid) => {
                    const bag_infos = bags_lookup.get(item_uid) || []
                    const role_name = selected.role.role_name
                    const role_value = selected.part.role_value

                    // console.log('select/map/map', { selected })
                    aggregated.push(item_uid)
                    bag_infos.push({ role_name, role_value })
                    bags_lookup.set(item_uid, bag_infos)
                })
            })

            collected.push(aggregated)
        })

        lists_intersect(collected).map((item_uid) => {
            const with_data = bmp_wrapper.get_duck('D', item_uid).bag_data
            const bag = {}

            bags_lookup.get(item_uid).map((bag_infos) => {
                bag[bag_infos.role_name] = bag_infos.role_value
            })

            collector({ bag, with_data })
        })
    }

    const toString = () => {

    }

    const get_debug = (roles_bag) => {
        const bmp_debug = bmp.get_debug()
        const results = []

        bmp_debug.map(entry => {
            const duck = entry.data ? entry.data.duck : undefined
            let text = `DUCK-BLOCK: [${entry.uid}] (duck=${duck}]`

            results.push(text)
        })

        return results
    }

    const get_stats = () => {
//        console.log('get_stats')

        return {
            multimap: stats,
            bmp: bmp.get_stats()
        }
    }

    const get_roles_names = () => roles.names

    const mm_api = {
        set, 
        get, 
        remove,
        select,
        get_debug, 
        toString, 
        get_roles_names,
        get_stats
    }

    const setup = () => {
//        create_roles_from_list()

    }

    setup()

    return mm_api
}

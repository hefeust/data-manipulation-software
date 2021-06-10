
import { create_bmp } from '../memopool/bmp.js'
import { roles } from './roles.js'
import { parts } from './parts.js'
// import { selector } from './selector.js'

export const create_multimap = (roles_names_list) => {

    const bmp = create_bmp({})

    const roles_bmp = roles(bmp)

    const parts_bmp  = parts(bmp)

    const has = (roles_bag) => {
        
    }
    
    /**
    * sets a nerw roles_bag and associated data
    */ 
    const set = (roles_bag, stored_data) => {
//        console.log('mm.set')

        roles_bmp.select_bag(roles_bag, (collected) => {
//            console.log('***********')
//            console.log({ collected_length: collected.length })
//            console.log('collected-items', collected)
            parts_bmp.store(collected, stored_data)
        }, 'add-role')

    }

    const get = (roles_bag) => {}

    const remove = (roles_bag, remove_colector) => {}

    const select = (roles_selector, selected_collector) => {}

    const debug = (roles_bag) => {
        return bmp.debug()
    }

    const toString = () => {}
 
    const get_stats = () => {
        return { tuples_count, bmp: bmp.get_stats() }        
    }

    const setup = () => {
        roles_bmp.create_from_list(roles_names_list)
    }

    const mm_api = {
        set, get, remove,
        select,
        debug, toString, get_stats
    }

    let tuples_count = 0

    setup()

    Object.defineProperty(mm_api, 'roles', {
        get: () => roles_bmp.get_names()
    })

    return mm_api
}

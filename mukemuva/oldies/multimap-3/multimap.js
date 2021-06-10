
import { create_bmp } from '../memopool/bmp.js'
import {roles } from './roles.js'

export const create_multimap = (roles_list) => {

    const bmp = create_bmp({})

    const actual_roles = roles(bmp)

//    const actual_bags = bags(bmp)

    /**
    * set roles_bag associated with data
    */
    const set = (roles_bag, with_data) => {
        return actual_roles.bag_store(roles_bag, with_data)
    }

    const get = (roles_bag) => {
        return actual_roles.bag_recall(roles_bag)
    }

    const remove = (selector_bag, collector) => {

    }

    /**
    * performs a quey against multimap
    *
    * @roles_
    */
    const select = (selector_bag, collector) => {

    }

    const toString = () => {}

    const debug = (roles_bag) => {
    }

    const get_stats = () => {
        console.log('get_stats')

        return {
            roles: actual_roles.get_stats(),
            bmp: bmp.get_stats()
        }
    }

    const mm_api = {
        set, 
        get, 
        remove,
        select,
        debug, 
        toString, 
        get_stats
    }

    // setup

    actual_roles.create_from_list(roles_list)

    Object.defineProperty(mm_api, 'roles', {
        get: () => actual_roles.get_names()
    })

    return mm_api
}

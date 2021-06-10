

import { merge } from '../utils/merge.js'
import { create_bmp } from '../pool/bmp.js'
import *  as duck from './duck.js'
import { roles_handling } from './roles_handling.js'

const defaults = {
    pool: {
        size: 5 * 1000
    }
}

export const create_multistore = (roles_names, options = {}) => {

    const roles = roles_handling(roles_names)

    const set = async (pairs_bag, with_data) => {
        try {
            const installed = await roles.install_to(bmp)

//            console.log('set', pairs_bag)
//            console.log({ installed })
    
            const keys = Object.keys(pairs_bag)


            roles_names.map(async (role_name) => {
                console.log('    role: ' + role_name)
            })

//            console.log(bmp.get_stats())
        } catch(err) {
            console.log(err)
        }
    }

    const  get = async (pairs_bag) => {

    }

    const select = async function* (filters_bag, collector_fn) {

    }

    const toString = () => {

    }

    const debug = (pairs_bag) => {

    }

    const setup = () => {
        merge(conf, defaults, options)

        console.log({ conf })

        merge(stats, {
            sets: 0, gets: 0, selects: 0
        })

//        console.log('bmp', create_bmp(conf))

        merge(bmp, create_bmp(conf))

//        console.log('***',  bmp )
    }

    const mb_api = {
        set, get, select, debug, toString
    }

    const conf = {}
    const stats = {}
    const bmp = {}

    setup()


    return mb_api
}


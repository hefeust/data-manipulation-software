

import { merge } from '../utils/merge.js'
import *  as duck from './duck.js'
import { create_role } from './role.js'

export const create_multistore = (roles_names, options) => {

    const roles = create_roles(roles_names)

    const set = async (pairs_bag, with_data) => {
        const installed = await roles.install(bmp)

        const keys = Object.keys(pairs_bag)


        conf.roles_names.map((role_name) => {

        })
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
        merge(conf, options, {})

        merge(stats, {
            sets: 0, gets: 0, selects: 0
        })

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


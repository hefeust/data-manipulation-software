
import { create_part } from './part.js'


export const create_role = (name) => {

    const set_part = async (value) => {

    }

    const get_part = async (name, vawlue) => {}

    const select = async (filter) => {}

    const toString = () => {}

    const debug = () => {}

    const setup = () => {
        const duck = {
            name,
            duck: DUCK_ROLE,
            parts_list: [],
            parts_lookup: new Map(),
            counter: 0
        }

        const uid = bmp.set_data(duck)
        
        Object.defineProperty(role_api, 'uid', {
            get: () => uid
        })
    }

    const role_api = { 
        set_part,
        get_part,
        select_part,
        toString,
        debug
    }

    setup()

    return role_api
}


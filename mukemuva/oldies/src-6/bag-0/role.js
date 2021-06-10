
import { create_part } from './part.js'

export const create_role = (role_name) => {

    const parts_list = []
    const parts_lookup = new Map()
    const stats = { counter: 0 }

    const set = async (value) => {
        const part = create_part(value)
        const uid = await part.install(bmp)


        return uid
    }

    const get = async (value) => {
        
    }

    const select = async function* (filter) {

    }


    const install_to = async (pool) => {
        console.log('installing role to pool. role = ', role_name)

        const role = { role_name, parts_lookup, parts_list, stats }
        const uid = await pool.set_data(role)

        return uid
    }

    const nope = async (bmp) => void 0


    const api = (tasks) => {
        return {
            install_to: (pool) => {
                tasks.install_to(pool)
                tasks = { install_to: nope }
        
                return { set, get, select }       
            }
        }
    }

    let once = { install_to }

    return api(once)



}


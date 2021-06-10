
import { duck_role } from './duck_role.js'

export const duck_lookup = (pool) => {
    const lookup = new Map()
 
    const install = async (roles_names) => {
        console.log('duck_lookup.install', roles_names)

        const pooled = duck_role(pool)

        const promises = roles_names.map(async (role_name) => {

            const role = pooled.create(role_name)
            const uid = await pooled.save(role)

            console.log('****  ', { role_name, uid })

            lookup.set(role_name, uid)
        })



        return await Promise.all(promises)
    }    

    const get_role = async (role_name) => {
        const pooled_role = duck_role(pool)
//        console.log({ pool } )
        const uid = lookup.get(role_name)

//        console.log('duck_lookup.get_role', { lookup } )

        const block = await pool.get_data(uid)
        const role = await pooled_role.hydrate(block)

        

        return role
    }

    const nope = async (roles_names) => void 0

    const api = (task) => {
        return {
            install:  async (roles_names) => {
                const stuff = await task.install(roles_names)    

                console.log('lookup:', lookup)

                task = { install: nope }

                return { get_role }
            }
        }
    }

    let task =  { install }

    return api (task)
}

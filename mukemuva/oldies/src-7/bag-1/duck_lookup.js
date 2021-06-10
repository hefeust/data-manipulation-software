
import { duck_role } from './duck_role.js'

export const duck_lookup = (pool) => {
    const lookup = new Map()
 
    const set_role = async (role_name) => {
        const pooled_role = duck_role(pool)

//        console.log({ roles_lookup_set_role: role_name 
//            + ': ' 
//            +  Array.from(lookup.keys()).join(', ') }
//        )

        if(false === lookup.has(role_name)) {
            const role = pooled_role.create(role_name)
            const uid = await pooled_role.save(role)

            console.log('****  ', { role_name, uid })

            lookup.set(role_name, uid)
       }
    }

    const install_roles = async (roles_names) => {
        const installed = await roles_names.map(async (role_name) => {
            return await set_role(role_name)
        })

         return await Promise.all(installed)
//        return installed
    }

    const get_role = async (role_name) => {
        const pooled_role = duck_role(pool)
        const uid = lookup.get(role_name)

        console.log('  roles_lookup', { role_name, uid })

        const role = await pooled_role.hydrate(uid)
//        const role = await pooled_role.wrap(block)
        
        return role
    }

    

    const debug = () => lookup

    return { install_roles, set_role, get_role, debug }
}


import { duck_role } from './duck_role.js'

export const duck_lookup = (pool) => {

    const lookup = new Map()
    const pooled_role = duck_role(pool)

    const install_roles = async (roles_names) => {

        const uids = await roles_names.map(async (role_name) => {
            let role, uid

            if(lookup.has(role_name)) {
                return lookup.get(role_name)
            } else {
                role = pooled_role.create(role_name)
                uid = await pooled_role.save(role)
    
                lookup.set( role_name, uid)

                console.log('roles_lookup.install_roles', {role_name, uid } )

                return uid
            }
       })
        
        return uids
    }


    const get_role = async (role_name) => {
        const uid = lookup.get(role_name)

        console.log('    duck_lookup.get_role:', { uid })

        const block = await pooled_role.hydrate(uid)
        const role = await pooled_role.wrap(uid, block)

        return role
    }
    

    const debug = () => lookup 
    
    return {
        install_roles,
        get_role,
        debug
    }
}


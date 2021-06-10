
import { duck_roles } from './duck_roles.js'

export const duck_lookup = (ctx) => {
//    console.log( ctx )
    const { pool } = ctx
    const roles = duck_roles(ctx)
    const lookup = new Map()

    const install_roles = async (roles_names) => {

        installed = await roles_names.map(async (role_name) => {
            let uid, role

            if(lookup.has(role_name)) {

                console.log('##### LOOKUP.GET')
                uid = lookup.get(role_name)
            } else {
                console.log('##### lookup.set')
                role = roles.create(role_name)
                uid = await roles.save(role)
                lookup.set(role_name, uid)
            }

            return uid
        })

//        return await Promise.all(installed)
        return installed
    }

    const get_role = async (role_name) => {
        const uid = lookup.get(role_name)
        const block = await roles.hydrate(uid)
        const role = roles.wrap(block)

        return role
    }

    const debug = () => {
        return { installed, lookup}
    }

    let installed = false

    return { install_roles, get_role, debug }
}


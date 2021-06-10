
import { duck_roles } from './duck_roles.js'

export const duck_lookup = (ctx) => {
//    console.log( ctx )
    const { pool } = ctx
    const lookup = new Map()

    const install_roles = async (roles_names) => {
        const p_roles = duck_roles(ctx)

        installed = roles_names.map(async (role_name) => {
            if(lookup.has(role_name)) {
                const uid = lookup.get(role_name)

                return uid
            } else {
                const role = p_roles.create(role_name)
                const uid = await p_roles.save(role)

                lookup.set(role_name, uid)

                return uid
            }
        })

        return await Promise.all(installed)
    }

    const get_role = async (role_name) => {
        const p_roles = duck_roles(ctx)
        const uid = lookup.get(role_name)
        const block = await p_roles.hydrate(uid)
        const role = p_roles.wrap(block)

        return role
    }

    const debug = () => {
        return { installed, lookup}
    }

    let installed = false

    return { install_roles, get_role, debug }
}


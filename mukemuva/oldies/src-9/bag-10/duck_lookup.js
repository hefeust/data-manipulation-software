
import { duck_roles } from './duck_roles.js'

export const duck_lookup = (ctx) => {

    const lookup = new Map()

    const roles = duck_roles(ctx)

    const install_roles = async (roles_names) => {

        const delayed =  roles_names.map(async (role_name) => {
            let uid, block

            if(lookup.get(role_name)) {
                uid = lookup.get(uid)
            } else {
                block = roles.create(role_name)
                uid = await roles.save(block)
                lookup.set(role_name, uid)
            }

            return uid
        })   

//        console.log({ delayed })

        return await Promise.all(delayed)

    }

    const get_role = async (role_name) => {
            const uid = lookup.get(role_name)

//            console.log({ role_name, uid })

            const block = await roles.hydrate(uid)
            const role = roles.wrap(block)

            return role
    }

    return { install_roles, get_role }
}

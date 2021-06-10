
import { create_role } from './role.js'

export const create_roles = (roles_names) => {

    const lookup = new Map()

    const install = async (bmp) => {
        if(lookup.size === 0) {
            roles_names.map(async (role_name) => {
                const role = create_role(role_name)
                const uid = await role.install(bmp)

                if(lookup.has(role_name)) {
                    throw new Error('Duplicated role in lookup !')
                }

                lookup.set(role_name, uid)
            })
        }
    }

    return { install }
}


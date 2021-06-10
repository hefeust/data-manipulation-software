
import { create_role } from './role.js'

export const roles_aspects = (roles_names) => {

    const lookup = new Map()

    const find = async (role_name) => {
        const uid = lookup.get(role_name)
        const role = await bmp.get_data(uid)

        return role
    }

    const install_to = async (bmp) => {
        roles_names.map(async (role_name) => {
            const role = create_role(role_name)
            const uid = await bmp.set_data(role)            

            lookup.set(role_name, uid)            
        })

        return { find }
    }

    return { install_to }
}


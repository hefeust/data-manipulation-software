
import { create_role } from './role.js'

export const roles_handling = (roles_names) => {
    const lookup = new Map()

    const get = async (role_name) => {
        const uid = lookup.get(role_name)

        return await bmp.get_data(uid)
    }

    const install_to = async (bmp) => {
        console.log('installing to bmp...')

        roles_names.map(async (role_name) => {
            const role = create_role(role_name)
            const uid = await role.install_to(bmp)

            if (lookup.has(role_name)) {
                throw new Error('roles_aspects: duplicate role_name: ' + role_name)
            }

            lookup.set(role_name, uid)
        })
    }

    const nope = async (bmp) => void 0


    const api = (tasks) => {
        return {
            install_to: (pool) => {
                tasks.install_to(pool)
                tasks = { install_to: nope }
        
                return { get }       
            }
        }
    }

    let once = { install_to }

    return api(once)

}

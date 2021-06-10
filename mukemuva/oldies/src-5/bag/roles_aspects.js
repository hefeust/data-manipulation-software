
import { create_role } from './role.js'

export const roles_aspects = (roles_names) => {

    const lookup = new Map()
    let i = 0

    const select_role = async (role_name) => {
        console.log('select_role: ' + role_name)

        const uid = lookup.get(role_name)
        const role = await bmp.get_data(uid)

        return role
    }

    const install_to =  async (bmp) => {
        console.log('roles_aspects.install_to(bmp): ', roles_names)

        roles_names.map(async (role_name) => {
            console.log('    role_name', role_name)
            // console.log(lookup.size)

            const role = create_role(role_name)
            const uid = await role.install_to(bmp)

            if (lookup.has(role_name)) {
                throw new Error('roles_aspects: duplicate role_name: ' + role_name)
            }

            lookup.set(role_name, uid)

            console.log({ i: i++, uid })
            console.log(lookup)

            return uid
        })


    //        console.log('lookup entries',  Array.from(lookup.keys())) 
   
        return aspects_api

    }

    const aspects_api = { select_role }


    return {  install_to }
}

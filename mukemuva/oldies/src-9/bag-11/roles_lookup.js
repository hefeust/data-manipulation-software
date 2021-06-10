
export const roles_lookup = (ctx) => {

    const { ducks } = ctx

    const lookup = new Map()

    const install_roles = async (roles_names) => {
        const promises =  roles_names.map(async (role_name) => {
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

        return await Promise.all(promise)
    }

    const get_role = async (role_name) => {
        const uid = lookup.get(role_name)
        
        
    }

    return { install_roles, get_role }
}

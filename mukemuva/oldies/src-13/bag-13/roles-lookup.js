	

export const roles_lookup = (ctx) => {
    const { ducks } = ctx

    const lookup = new Map()

    const install_role = async (role_name) => {
        let uid, role

        if (lookup.has(role_name)) {
            uid = lookup.get(uid)
        } else {
           uid = await ducks.create('role').with_data({ role_name })
           lookup.set(role_name, uid)
        }

        return uid
    }

    const get_role = async (role_name) => {
        const uid = lookup.get(role_name)
        let duck, role

        if(!uid) throw new Error('Unexisting role_name:'  + role_name )

        role = await (ducks.hydrate('role')).for_uid(uid)

        return role
    }

    return { install_role, get_role }
}


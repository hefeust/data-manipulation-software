
export const create_roles_lookup = (context) => {
    const { pool, ducks } = context

    const lookup = new Map()

    const install_roles = async (roles_names) => {
        const promises = roles_names.map(async (role_name) => {
            let uid, role

            if(lookup.has(role_name)) {
                uid = lookup.get(role_name)
            } else {
                role = await ducks.create({
                    ducktype: 'role',
                    data: { role_name, lookup: new Map() }
                })

                uid = role.uid
                lookup.set(role_name, uid)
            }

            return uid
        })

        return await Promise.all(promises)
    }

    const get_role = async (role_name) => {
        if (lookup.has(role_name)) {
            const uid = lookup.get(role_name)

//            console.log({ HYDRATE: uid })

            return await ducks.hydrate({ 
                ducktype: 'role',
                uid 
            })
        } 

        throw new Error('role not found for role_name = ' +  role_name)
    }

    return { install_roles, get_role }
}


export const roles = (bmp) => {
    
    const lookup = new Map()

    const create_from_list = (roles_names) => {
//        console.log('roles_names = ', roles_names)

        roles_names.map((role_name) => {
            const role_uid = bmp.set_data({
                role_name, values: [], lookup: new Map()
            })

            lookup.set(role_name, role_uid)
        })
    }

    const get_names = () => Array.from(lookup.keys())

    const select_role = (role_name, role_value, will_add) => {
        const role_uid = lookup.get(role_name)
        const role = bmp.get_data(role_uid)
        let actual = { role_value, items: [], counter: 0 }
        let actual_uid = null

        if(role) {
            actual_uid = role.lookup.get(role_value)

            if(actual_uid) {
                return bmp.get_data(actual_uid)
            } else if(will_add) {
                actual_uid = bmp.set_data(actual)
                role.lookup.set(role_value, actual_uid)

                return actual
            }

            

            return null
        } else {
            console.log('select_role: role-not-found')
            return null
        }
    }

    const select_bag = (roles_bag, collector, will_add) => {
        const roles_names = Array.from(lookup.keys())
        const tests_names = Object.keys(roles_bag)
        const collected = []

        roles_names.map((role_name) => {
            const role_value = roles_bag[role_name]
            const actual_role = select_role(role_name, role_value, will_add)

            // console.log({ role_name, role_value})

            if(actual_role) {
                collected.push(actual_role)
            } else {
                console.log('error', { actual_role})
            }
        })

        if(collected.length === roles_names.length) {
            collector(collected)
        } else {
            console.log('select_bag: bad roles_bag key length')
        }
    }

    const roles_api = {
        create_from_list,
        select_bag,
        get_names
    }

    return roles_api
}

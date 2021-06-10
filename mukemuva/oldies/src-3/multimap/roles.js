-
const DUCK_ROLE = 'R'
const DUCK_PART = 'P'

export const create_roles = (bmp_wrapper, roles_list) => {
    const roles_lookup = new Map()

    const setup = () => {
        if(!roles_list) 
            throw new Error('roles#setup: fatal! roles names sist array')

        roles_list.map((role_name) => {
            const role_uid = bmp_wrapper.set_duck(DUCK_ROLE, {
                role_name,
                values: [],
                lookup: new Map(),
                counter: 0
            })

            roles_lookup.set(role_name, role_uid)
        })
    }

    const search_role = (role_name) => {
        const role_uid = roles_lookup.get(role_name)
        const role = bmp_wrapper.get_duck(DUCK_ROLE, role_uid)

        if(!role_uid) {
            console.log('roles#search: unexisting role lookup for name=' + role_name)
            throw new Error('')
        }

        if(!role) {
            console.log('roles#search: unexisting role for uid=' + role_uid)
            throw new Error('INCONSISTENT UID !!!')
        }
sw
        return role
    }

    const set_part = (role_name, role_value) => {
        const role = search_role(role_name)
        let part_uid = role.lookup.get(role_value)

//        console.log('roles#set_part', { role_name, role_value })

        if(!part_uid) {
            part_uid = bmp_wrapper.set_duck(DUCK_PART,  {
                role_value,    
                items: [],
                counter:  0
            })

            role.lookup.set(role_value, part_uid)
            role.values.push(part_uid)
        }
    }

    const get_part = (role_name, role_value) => {
        const role = search_role(role_name)
        let part_uid = role.lookup.get(role_value)
        let part = null

        // console.log({ role })

        if(part_uid) {
            part = bmp_wrapper.get_duck(DUCK_PART, part_uid)
        } else {
            console.log('role part not found for:',  { role_name, role_value })
        }

        return part
    }

    const select_parts = (role_name, selector) => {
        const role = search_role(role_name)

//        let part_names = []
        let collected_parts = []
        let parts_uids = []
        let part = null

        let test_func = (value) => value

//        console.log(
//            'roles#select_parts role_name=' +  role_name, 
//            selector.toString()  
//        )

        if(selector === '*') {
            parts_uids = role.values
        } else if(typeof selector === 'string') {
            parts_uids = [role.lookup.get(selector)]
        } else if(true) {
            // role parts selector is a function....
        }

        parts_uids.map((part_uid) => {
            const part = bmp_wrapper.get_duck(DUCK_PART, part_uid)

            collected_parts.push({ role, part })
        })
  
        return collected_parts
    }



    const roles_api = { set_part, get_part, select_parts }

    setup()

    Object.defineProperty(roles_api, 'names', {
        get: () => Array.from(roles_lookup.keys())
    })

    return roles_api
}

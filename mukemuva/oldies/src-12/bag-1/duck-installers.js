
import * as ducktypes from './ducktypes.js'
import { uids_selector } from './uids-selector.js'

export const duck_installers = (context) => {
    const { ducks, debug } = context
    const lookup = new Map()

    // ***********
    // we should use the keygen instead !!!
    let collect_idx = 0
    // ***********

    const install_roles = async (roles_names) => {

        const promises = roles_names.map(async (role_name) => {
            let role_uid, role    

            if(lookup.has(role_name)) {
                role_uid = lookup.get(role_name)
            } else {
                role = await ducks.create({
                    ducktype: ducktypes.DUCKTYPE_ROLE,
                    data: { 
                        role_name, 
                        lookup: new Map() 
                    }
                })

                role_uid = role.uid
                lookup.set(role_name, role_uid)
            }

            return role_uid
        })

//        console.log(await Promise.all(promises))

        return await Promise.all(promises)
    }

    const install_parts = async (bag) => {
//        console.log(lookup)

        const roles_names = Array.from(lookup.keys())
        const keys = Object.keys(bag)
//        let counter = 0

        const installed = roles_names.reduce(async (acc, role_name) => {
            const role = await get_role(role_name)
            let values = await acc
            let part

            if (role_name in bag) {
                const parts = await role.select_parts(bag[role_name])                
                
                part = await role.set_part(bag[role_name])

                values.push(part)
            } else {
                throw new Error('Undefined role in bag: ' + role_name)    
            }
            
            return values
        }, Promise.resolve([]))

//        console.log({ INSTALLED: await installed })

        if ((await installed).length !== roles_names.length) {
            throw new Error ('bad roles pairs count !')
        }

//        return await Promise.all(installed)
        return await installed
    }

    const get_role = async (role_name) => {
        const role_uid = lookup.get(role_name)
        const role = await ducks.hydrate({ 
            uid: role_uid, 
            ducktype: ducktypes.DUCKTYPE_ROLE
        })

        return role
    }

    const collect_uids = async (filters) => {
        const roles_names = Array.from(lookup.keys())
        const selector = uids_selector(roles_names)       
        let counter = 0

        // KEYGEN INSTEAD !!!!
        collect_idx++

        for (const key of roles_names) {
            const role = await get_role(key)
            const parts = await role.select_parts(filters[key])

            for (const part of parts) {
                const items = await part.select_items()

                for await (const item of items) {
                    selector.collect({
                        collect_idx,
                        role_uid: role.uid, 
                        part_uid: part.uid, 
                        item_uid: item.uid
                    })

                    counter++
                }
            }
        }     

        return selector.get_collected()
    }

    return {
        install_roles,
        install_parts,
        get_role,
        collect_uids
    }
}


import { bags } from './bags.js'

export const roles = (bmp) => {

    const lookup = new Map()

    const stats = {
        bag_store_calls: 0,
        unique_bag_created: 0
    }
    
    const create_from_list = (roles_names_list) => {
        roles_names_list.map((role_name) => {
            const uid = bmp.set_data({
                role_name, 
                values: [], 
                lookup: new Map()
            })

            lookup.set(role_name, uid)
        })
    }

    const get_names = () => Array.from(lookup.keys())

    const get_actual_role = (role_name, role_value, will_create) => {
        const role_uid = lookup.get(role_name)
        const role = bmp.get_data(role_uid)
        let actual_role_uid = null
        let actual_role = {
            role_value,
            items: [],
            counter: 0
        }

//        console.log({ get_actual_role: {role_name, role_value  }})
//        console.log(lookup)
//        console.log("ROLE:", role)

        if(role) {
            actual_role_uid = role.lookup.get(role_value)

            if(actual_role_uid ) {
                actual_role = bmp.get_data(actual_role_uid)

//                if(! actual_role)
//                    return null

            } else if(will_create) {
                actual_role_uid = bmp.set_data(actual_role)
                role.values.push(actual_role_uid)
                role.lookup.set(role_value, actual_role_uid)
            }
        } 
        
//        console.log('****', { actual_role_uid })

        return actual_role_uid
    }

    const get_bag = (roles_bag, will_create)  => {
        const actual_uids = []
        const roles_names = get_names()
        const query_names = Object.keys(roles_bag)            

//        console.log('** get_bag')
//        console.log({ roles_names})
//        console.log({ query_names })

        roles_names.map((role_name) => {
            const role_value = roles_bag[role_name]

            if(query_names.indexOf(role_name) > -1) {
                actual_uids.push( get_actual_role(
                    role_name, role_value, will_create
                ))
            } else {
                console.log('get_bag_not_found') 
                console.log({ role_name })
            }
        })

        if(actual_uids.length === roles_names.length) {
            return actual_uids
        } else {
            return null
        }
    }

    const bag_store = (roles_bag, with_data) => {
        const query_names = Object.keys(roles_bag)            
        const roles_names = get_names()
        const bag_uids = get_bag(roles_bag, 'will-create')

        let item_uid = null 

//        console.log('* bag_store', { stats })
//        console.log({ bag_uids })
                   
        stats.bag_store_calls++

        if(bag_uids.length > 0) {
            item_uid = bags(bmp).find(bag_uids, 'will-add')
            bags(bmp).store_data(item_uid, with_data)
        } else {
            console.log('roles.bag_store: bag_uids is EMPTY!')
        }
    }

    const bag_recall = (roles_bag) => {
        const query_names = Object.keys(roles_bag)            
        const roles_names = get_names()
        const bag_uids = get_bag(roles_bag)
        let item_uid = bags(bmp).find(bag_uids) 

        return bags(bmp).get_data(item_uid)
    }

    const remove_bag = (roles_bag, collector) => {

    }

    const select_bags = () => {
        
    }

    const get_stats = () => {
        return stats 
    }

    const roles_api = { 
        create_from_list,
        get_names,
        bag_store,
        bag_recall,
        get_stats,
    }



    return roles_api
}

    


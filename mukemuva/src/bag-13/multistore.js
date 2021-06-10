
import { merge} from '../utils/merge.js'
import { create_bmp } from '../pool/bmp.js'
import { duck_blocks } from './duck-blocks.js'
import { roles_lookup } from './roles-lookup.js'
import { uids_selector } from './uids-selector.js'

export const create_multistore = (roles_names, options) => {

    const install_roles = async (bag) => {
        
        const roles_promises = roles_names.map(async (role_name) => {
            const role_uid = await lookup.install_role(role_name)
            const role = await lookup.get_role(role_name)
        })

        const roles_resolved = await Promise.all(roles_promises)

        return roles_resolved
    }

    const install_parts = async (bag) => {
        const keys = Object.keys(bag)

        const parts_promises = keys.map(async (key) => {
            const role = await lookup.get_role(key)
            const parts = role.select_parts(bag[key])
            let parts_counter = 0

            for await (const part of parts) {
                parts_counter++
                break
            }

            if(parts_counter === 0) {
                role.install_part(bag[key])
            }
        })

        const parts_resolved = await Promise.all(parts_promises)

        return parts_resolved
    }

    const collect_assocs = async (filters)  => {
        const selector = uids_selector(roles_names)
        const keys = Object.keys(filters)

        console.log(filters)

        for(const key of keys) {
            const role = await roles_lookup.get_role(key)
            let counter = 0
            let nested = 0
            const parts = role.select_parts(filters[key])

            for await (const part of $$parts) {
                const $$items = await part.select_items()

                for await (const item of $$items) {
                    selector.collect(role.uid, part.uid, item.uid) 
                    nested++
                }

                counter++   
            }
            
            console.log('collect_assocs', { key, counter, nested })
        }
    
       return selector.get_collected()
    }

    const set = async (bag, with_data) => {
        const selector = uids_selector(roles_names)
        const inst_roles = await install_roles(bag)
        const inst_parts = await install_parts(bag)
        const collected = await collect_assocs(bag)
        let ref_counter = 0

        console.log({ collected })

        for await (const assoc of collected) {
            console.log({ assoc })

            for (let coll of collected) {
                console.log({ coll })

                break    
            }

            ref_counter++
        }

        console.log({ ref_counter   })

        if(ref_counter == 0) {
            roles_names.map(async (role_name) => {
                const role = await lookup.get_role(role_name)
                const parts = await role.select_parts(bag[role_name])         
                let item_uid

                for await (const part of parts) {
                    if (ref_counter === 0 ) {
                        console.log('NEW ITEM')
                        item_uid = await part.add_item(with_data)
                    } else {
                       console.log('refer item')
                       part.refer_item(item_uid)
                    }
                }
                ref_counter++
            })    
        } 
    }           

    const select = async function* (filters) {
        roles_names.map(async (role_name) => {
            const role = await lookup.get_role(role_name)
            const parts = await role.select_parts(filters[role_name])         

                   
               
        })
    }    

    const debug = () => {
        
    }    

    const toString = () => {

    }    

    const get_stats = () => {
        return ctx.pool.get_stats()
    }    

    const setup = () => {
        merge(ctx.pool, create_bmp({}))
        merge(ctx.ducks, duck_blocks(ctx))
        merge(ctx.lookup, roles_lookup(ctx))

//        console.log({ ctx })
    }

    const conf = {}
    const stats = {}
    const lookup = {}
    const pool = {}
    const ducks = {}
    const ctx = { pool, lookup, ducks }

    setup()

    return { 
        set, 
        select, 
        debug, 
        get_stats,
        toString 
    }
}


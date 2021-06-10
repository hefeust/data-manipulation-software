
import { merge} from '../utils/merge.js'
import { create_bmp } from '../pool/bmp.js'
import { duck_blocks } from './duck-blocks.js'
import { roles_lookup } from './roles-lookup.js'
import { uids_selector } from './uids-selector.js'

export const create_multistore = (roles_names, options) => {

    const set = async (bag, with_data) => {
       const selector = uids_selector(roles_names)
       let ref_counter = 0

       const promises = roles_names.map(async (role_name) => {
            const role_uid = await lookup.install_role(role_name)
            const role = await lookup.get_role(role_name)
            const part_uid = await role.install_part(bag[role_name])
            const parts = await role.select_parts(bag[role_name])         
        
            let parts_count = 0
         
            for await (const part of parts) {
                const items = await part.select_items()                

                for await (const item of items) {
                    selector.collect(role.uid, part.uid, item.uid)
                    ref_counter++
                }

                parts_count++
            }
        })

        const resolved = await Promise.all(promises)

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

            const collected = selector.get_collected()
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


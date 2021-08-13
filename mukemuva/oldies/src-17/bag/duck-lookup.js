
import { lists_intersect } from '../utils/lists-intersect.js'
import * as ducktypes from './ducktypes.js'
import { cartesian_product } from '../utils/cartesian-product.js'

export const duck_lookup = (context) => {
    
    // grab ducks tooling from context
    const { ducks } = context.tooling

    // role blocks lookup
    const roles  = new Map()

    // parts blocks lookup
    const parts = new Map()

    let collect_idx = 0

    // install role blocks in pool
    const install_roles = async (roles_names) => {

        const promises = roles_names.map(async (role_name) => {
            if(false === roles.has(role_name)) {
                const block = await ducks.create({
                    ducktype: ducktypes.ROLE,
                    fellow: null,
                    payload: { role_name }                    
                })

                roles.set(role_name, block)
            }
        })

        return await Promise.all(promises)
    }

    // get role block by its name from lookup
    const get_role = (role_name) => {
        const role = roles.get(role_name)

        if(!role) 
            throw new Error('lookup.get_role: HO for role_name= ' + role_name)

        return role
    }

    // install parts blocks in pool (by part value)
    const install_parts = async (bag) => {
        const roles_names = Array.from(roles.keys())

        const promises = roles_names.map(async (role_name) => {
            const role = get_role(role_name)
            const part_value = bag[role_name]

//            console.log('install_parts: ' + role_name + ': ' + part_value)

            if(false === (role_name in bag)) 
                throw new Error('lookup.install_parts: user bag KO for role_name= ' + role_name)

            if (false === role.lookup.has(part_value)) {
                const part = await ducks.create({
                    ducktype: ducktypes.PART,
                    fellow: role.uid,
                    payload: { part_value } 

                })

                role.related.push(part.uid)
                role.lookup.set(part_value, part.uid)
                role.counter++
            }
            
//            parts.set(part_value, entries)

            return part_value
        })

        return await Promise.all(promises)
    }

    const collect_records = async function* (filters) {
        const roles_names = Array.from(roles.keys())
        const marked = new Map()
        let extract_idx = 0

        for( const role_name of roles_names) {
            const role = get_role(role_name)
            const filter = filters[role_name]
            const by_role = marked.get(role_name) || []
            const pvs = Array.from(role.lookup.keys())
            let filtered = []
                
//            console.log(role.lookup)
//            console.log({ [filter]: role.lookup.has(filter) })

            if (role.lookup.has(filter)) {
                filtered = [role.lookup.get(filter)]
            } else if (typeof filter === 'function') {
                filtered = pvs.filter((pv) => filter(pv))
            } else if (filter === '*') {        
                filtered = pvs
            } 

//            console.log('filtered', filtered)

            marked.set(role_name, filtered)
        }

        const arrays = roles_names.map((role_name) => {
            const entries = marked.get(role_name)
            return entries
        }).reduce((acc, val) => acc.concat([val]), [])

//        console.log('marked', marked)
//        console.log('arrays', arrays)

        const cart_prod = cartesian_product(...arrays)

//        console.log('CARTESIAN PRODUCT', cart_prod)

        for(const cp of cart_prod) {
            const results = []

            for(const uid of cp) {
                const part = ducks.hydrate({
                    uid,
                    ducktype: ducktypes.PART
                })

                results.push(part)
            }

            yield results
        }
    }

    const install_item = async (bag, with_data) => {
        const records = await collect_records(bag)
        let record_counter = 0

//        console.log('\n LOOPING RECORDS', records)

        for await (const promises of records) {
            const record = await Promise.all(promises)
//            console.log('record', record)

            const lists = []

            for(const part of record) {
//                const part = await promise 

                lists.push( part.related)
            }

//            console.log("LISTS to intersect", lists)

            const isect = lists_intersect(lists)

            for (const uid of isect) {
                const item = await ducks.hydrate({ 
                    uid,
                    ducktype: ducktypes.ITEM,
                    fellow: null
                })

                item.payload.with_data = with_data
                record_counter++
            }

            if (record_counter === 0) {
//                console.log('NEW-ITEM')

                let index = 0
                let item = null

                for (const part of record ) {
//                    console.log('part', part)

                    if (index === 0) {
                        // add new item to parts
                        //  console.log('create-item')
                        item = await ducks.create({
                            ducktype: ducktypes.ITEM,
                            fellow: null,
                            payload: { with_data }
                        })
                    }

                    part.related.push(item.uid)
                    part.counter++
                    index++
                }
            }
        }
 
        return record_counter
    }

    const select_items = async function* (filters) {
        const records = await collect_records(filters)

        for await (const promises of records) {
            const record = await Promise.all(promises)
            const lists = []
            const bag = {}
            let with_data = '#KO!'

            for (const part of record) {
                const role = await ducks.hydrate({
                    uid: part.fellow,
                    ducktype: ducktypes.ROLE
                })

                bag[role.payload.role_name] = part.payload.part_value
                lists.push(part.related)
            }

            const isect = lists_intersect(lists)

//            console.log({ lists })                    
//            console.log({ SELECT_ITEMS: isect.length })

            for (const uid of isect) {
                const item = await ducks.hydrate({ 
                    uid,
                    ducktype: ducktypes.ITEM
                })

//                console.log('select_item', item)

                with_data = item.payload.with_data
            }

            console.log({ bag })

            yield { bag, with_data } 
        }
    }

    return {
        install_roles,
        install_parts,
        install_item,
        select_items
    }    

}


import { lists_intersect } from '../utils/lists-intersect.js'
import * as ducktypes from './ducktypes.js'
import { cartesian_product } from '../utils/cartesian-product.js'

export const duck_lookup = (context) => {
    
    // grab ducks tooling from context
    const { ducks, stats } = context.tooling

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
            const parts_values = Array.from(parts.keys())

            if (false === bag.hasOwnProperty(role_name))
                throw new Error('lookup.install_parts: user bag KO for role_name= ' + role_name)

            if (parts_values.indexOf(part_value) === -1) {
                const entries = parts.get(part_value) || []
                const filtered = entries.filter((e) => e.role_name === role.name)

                if (0 === filtered.length) {
                    const part = await ducks.create({
                        ducktype: ducktypes.PART,
                        payload: { part_value }
                    })

                    entries.push({
                        role_name: role_name,
                        part_uid: part.uid
                    })

                    role.related.push(part.uid)
                    role.counter++
                    
                }

                parts.set(part_value, entries)
            }

            return part_value
        })

        return await Promise.all(promises)
    }

    const collect_records = async function* (filters) {
        const roles_names = Array.from(roles.keys())
        const parts_values = Array.from(parts.keys())
        const cart_prod = new Map()
//        const marked = new Map()
        const arrays = []

        // an attempt to boost partition finding        
        const cache = new Map()

        let swap_idx = 0        
        
        collect_idx++

        for( const role_name of roles_names) {
            const role = get_role(role_name)
            const filter = filters[role_name]
//            const by_role = marked.get(role_name) || []
//            const pvs = Array.from(role.lookup.keys())
            const hits = []
            let filtered = []

            if (parts.has(filter)) {
                filtered = [parts.get(filter)]
            } else if (typeof filter === 'function') {
                filtered = parts_values.filter((pv) => filter(pv))
                    .map((pv) => filtered.pushparts.get(pv))
            } else if (filter === '*') {        
                filtered = parts_values
                    .map((pv) => filtered.pushparts.get(pv))
            } 

            const cps_prev = cart_prod.get(swap_idx) || []
            const cps_next = []
            
//            console.log('filtered', filtered)

            for (const entry of filtered) {
//                for (const entry of entries) {
                    if (role_name === entry.role_name) {
                        for (const vals of cps_prev) {
                            cps_next.push(vals.concat(entry))
                        }
//                    }
                }
            }

            swap_idx = 1 - swap_idx
            cart_prod.set(swap_idx, cps_next)
        }

        console.log(cart_prod)

//        const cart_prod = cartesian_product(...arrays)
        const cps = cart_prod.get(swap_idx)

        for(const cp of cps) {
            const results = []

            for(const uid of cp) {
                let part

                if(cache.has(uid)) {
                    part = cache.get(uid)
                } else {
                    part = await ducks.hydrate({
                        uid,
                        ducktype: ducktypes.PART
                    })
                    
                    cache.set(part.uid, part)
                }

                results.push(part)
            }

            yield results
        }
    }

    const install_item = async (bag, with_data) => {
        const records = await collect_records(bag)
        let record_counter = 0

        for await (const record of records) {
//            const record = await Promise.all(promises)

            const lists = []

            for(const part of record) {
                lists.push( part.related)
            }

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
                let index = 0
                let item = null

                for (const part of record ) {
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

            for (const uid of isect) {
                const item = await ducks.hydrate({ 
                    uid,
                    ducktype: ducktypes.ITEM
                })

                with_data = item.payload.with_data
            }

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


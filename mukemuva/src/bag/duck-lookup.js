
import { lists_intersect } from '../utils/lists-intersect.js'
import * as ducktypes from './ducktypes.js'

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
            const entries = parts.get(part_value) || []
            let found = false

            if(false === (role_name in bag)) 
                throw new Error('lookup.install_parts: user bag KO for role_name= ' + role_name)

            for(const part of entries) {
                if(part.fellow === role.uid) {
                    // console.log({ found})
                    found = true
                }
            }

            if (!found) {
                const part = await ducks.create({
                    ducktype: ducktypes.PART,
                    fellow: role.uid,
                    payload: { part_value } 

                })

                role.related.push(part.uid)
                role.counter++
                entries.push(part)    
            }
            
            parts.set(part_value, entries)

            return part_value
        })

        return await Promise.all(promises)
    }


    const collect_records = function* (filters) {
        const roles_names = Array.from(roles.keys())               
        const parts_values = Array.from(parts.keys())        
        const markers = new Set()
        let still_extracting = true
        let idx = 0

        collect_idx++
//        console.log({ collect_idx })

        while(still_extracting) {
            const record = []
            idx++

            for (const role_name of roles_names) {
                const role = get_role(role_name)
                const filter = filters[role_name]

                let filtered = []

                if (parts.has(filter)) {
                    filtered = [filter]
                } else if (typeof filter === 'function') {
                    filtered = parts_values.filter(pv => filter(pv))
                } else if (filter === '*') {
                    filtered = parts_values
                } else {
                   filtered = []
                }

//                    console.log('filtered', filtered)

                    for (const pv of filtered ) {
                        const entries = parts.get(pv)

                        for (const part of entries) {
                            const hash_key = role.uid + ':' + part.uid

                            idx++
                            if (markers.has(hash_key)) continue


                        if(role.uid === part.fellow) {
                            markers.add(hash_key)
                            record.push(part)
                        }
                    }
                }
            }

            if(record.length === roles_names.length) {

//                console.log(record.map(p => p.uid + ',' + p.fellow + ' ' + p.payload.part_value))
                yield record
            }
        
            if(idx >= roles_names.length * parts_values.length) break
        }
        

    }

    const install_item = async (bag, with_data) => {
        const records = collect_records(bag)
        let record_idx = 0

        for await (const record of records) {
            record_idx++

            const lists = []

            for(const part of record) {
//                lists.push(part.refs.related)
                lists.push(part.related)
            }

            const isect = lists_intersect(lists)

//            console.log({ INSTALL_ITEMS: isect })

            for (const uid of isect) {
                const item = await ducks.hydrate({ 
                    uid,
                    ducktype: ducktypes.ITEM,
                    fellow: null
                })

                item.payload.with_data = with_data
            }

//            console.log({ isect })

            if(isect.length === 0) {
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


//                console.log(record.map(part => ducktypes.trace(part)))
            }
        }

        //console.log({ record_idx })
//            console.log({ record_idx })

        return record_idx
    }

    const select_items = async function* (filters) {
        const records = collect_records(filters)

        for await (const record of records) {
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
                console.log(part.related.length) 
           }

            const isect = lists_intersect(lists)

//            console.log({ SELECT_ITEMS: isect.length })

            for (const uid of isect) {
                const item = await ducks.hydrate({ 
                    uid,
                    ducktype: ducktypes.ITEM
                })

//                console.log('select_item', item)

                with_data = item.payload.with_data
            }

            yield { bag, with_data}
        }
    }

    return {
        install_roles,
        install_parts,
        install_item,
        select_items
    }    

}

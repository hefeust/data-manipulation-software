
import { lists_intersect } from '../utils/lists-intersect.js'
import * as ducktypes from './ducktypes.js'

export const duck_lookup = (context) => {
    
    // grab ducks tooling from context
    const { ducks } = context.tooling

    // role blocks lookup
    const roles  = new Map()

    // parts blocks lookup
    const parts = new Map()

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
            const entries = parts.get(part_value) || []
            const part_value = bag[role_name]
            let found = false

            if(false === role_name in bag) 
                throw new Error('lookup.install_parts: user bag KO for role_name= ' + role_name)

            for(const part of entries) {
                if(part.fellow === role.uid)
                    found = true
            }

            if (false === found) {
                const part = await ducks.create({
                    ducktype: ducktypes.PART,
                    fellow: role.uid,
                    payload: { part_value } 
                })

                entries.push(part)    
            }
            
            parts.set(part_value, entries)

            return part_value
        })

        return await Promise.all(promises)
    }

    const collect_records = function* (filters) {
        const roles_names = Array.from(roles.keys())               
        const selected = []
        let counter = 0

        for (const role_name of roles_names) {
            const filter = filters[role_name]
            const filtered = parts.get(filter) || []

            if (filtered.length > 0) {
                selected.push(filtered)
                counter += filtered.length
            } 
        }

        if (counter % roles_names.length > 0) throw new Error('length modulo !!!')

        console.log({ counter })

        let records = []

        do {
            records = []
              counter++

            for(const entries of selected) {
                for(const role_name of roles_names) {
                    const role = get_role(role_name)

                    for(const part of entries) {
                        if (part.fellow === role.uid) records.push(part)
                    }
                }
            }

            counter -= roles_names.length

            

            yield records
        } while(counter > 0)
    }

 
    const install_item = async (bag, with_data) => {
        const records = collect_records(bag)

//        console.log('install item')

        for await (const record of records) {
//            console.log({ record })

            const lists = []

            for(const part of record) {
                lists.push(part.refs.related)
            }

            const isect = lists_intersect(lists)

            for (const uid of isect) {
                const block = await ducks.hydrate({ 
                    uid,
                    ducktypesITEM,
                    fellow: null
                })

                block.payload.with_data = with_data
            }

//            console.log({ isect })

            if(isect.length === 0) {
                let index = 0
                let item = null

                for (const part of record ) {
                    if (index === 0) {
                        // add new item to parts
                        item = await ducks.create({
                            ducktype: ducktypes.ITEM,
                            fellow: null,
                            payload: { with_data }
                        })
                    }

                    // refer item to parts
                    part.refs.related.push(item.uid)
                    part.refs.counter++
                }

                index++
            }
        }
    }

    return {
        install_roles,
        install_parts,
        install_item

    }    

}

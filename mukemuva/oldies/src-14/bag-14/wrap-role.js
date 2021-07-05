
export const wrap_role = (context) => {

    const { ducks } = context

    const wrap = (def) => {
        const { uid, ducktype, block }  =def
        const { lookup } = block.data

        const install_part = async (part_value) => {
            let uid, part

            if(lookup.has(part_value)) {
                uid = lookup.get(part_value)

                part = await ducks.hydrate({
                    ducktype: 'part',
                    uid
                })
            } else {
                part = await ducks.create({
                    ducktype: 'part',
                    data:  { part_value }
                })

                lookup.set(part_value, part.uid)
                block.related.push(part.uid)
            }

            return part
        }

        const get_part = async (uid) => {
            const idx = block.related.indexOf(uid)
            
            if(idx > -1) 
                return await ducks.hydrate({ 
                    ducktype: 'part', 
                    uid: block.related[idx]
                })

            return null
        }

        const test_part = (expected) => {
            if(expected === '*') return true
            if(typeof expected === 'function') 
                return expected(part.get_part_value())
                
            return expected === part.get_part_value()
        }

        const select_parts = async (filter) => {
            const results = []

//            console.log(Array.from(lookup.keys()))

            if(lookup.has(filter)) {
                const uid =  lookup.get(filter)

                const part = await ducks.hydrate({
                    ducktype: 'part',
                    uid
                })

                results.push(part)
            } else {
                for (let uid of block.related) {
                    const part = await ducks.hydrate({
                        ducktype: 'part',
                        uid
                    })
//                    console.log({ part: part.get_part_value() })

                    if (part.test_value(filter)) {
                        results.push(part)
                    }
                }
            }

//            console.log({ results: results.length })

            return  results 
        }

        const select_parts0 = async (filter) => {
            const selected = block.related.map(async (uid) => {
                const part = await ducks.hydrate({
                    ducktype: 'part',
                    uid
                })
                
                return part
            }).reduce(async (acc, promise) => {
                const values = await acc
                const part = await promise

                if (part.test_value(filter)) {
                    values.push(part)
                }

                return values
            }, Promise.resolve([]))

//            return await Promise.all(promises)
            return await selected
        }

        const debug = () => {
            return `${uid}\t role \t [${block.counter}] ${ block.data.role_name}`
        }

        const get_role_name = () => block.data.role_name

        return {
            uid, 
            get_role_name,
            install_part, 
            get_part, 
            select_parts, 
            debug
        }
    }

    return { wrap }
}

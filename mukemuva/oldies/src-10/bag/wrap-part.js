
export const wrap_part = (context) => {

    const { ducks } = context

    const wrap = (def) => {
        const { uid, ducktype, block } = def

        const setup_item = async (with_data ) => {
//            console.log('    SETUP ITEM')

            const item = await ducks.create({
                ducktype: 'item',
                data:  with_data 
            })

            block.related.push(item.uid)
            block.counter++
    
            return item
        }

         const refer_item  = (uid) => {
//            console.log('    REFER ITEM')
            block.related.push(uid)
            block.counter++
        }

        const test_value = (expected) => {
//            console.log(block)

            if(expected === '*') return true
            if(typeof expected === 'function') {
                return expected(block.data.part_value)
            }
                
            return expected === block.data.part_value
        }
    
        const select_items = async function* () {

//            console.log(block)

            for(uid of block.related) {
                const item = await ducks.hydrate({
                    ducktype: 'item',
                    uid
                })

                yield item
            }
        }

        const debug = () => {
            return `${uid}\t part \t [${block.counter}] ${ block.data.part_value}`
        }

        const get_part_value = () => block.data.part_value

        return {
            uid, 
            get_part_value,
            setup_item,
            refer_item,
            test_value,
            select_items,
            debug
        }
    }

    return { wrap }
}

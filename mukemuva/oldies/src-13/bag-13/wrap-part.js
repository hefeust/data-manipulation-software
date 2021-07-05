
export const wrap_part = (ctx) => {

    const { ducks } = ctx

    const wrap = (def) => {
        const { uid, ducktype, block } = def
        const part_value = block.data.part_value

        const  add_item = async (data) => {
            const item_uid = ducks.create('item').with_data({ data })

            block.related.push(item_uid)
            block.counter++
        }

        const refer_item = async  (item_uid) => {
            block.related.push(item_uid)
            block.counter++
        }

        const get_item = async  (uid) => {

        }

        const select_items = async  function* (uids = []) {
            for (const item_uid of block.related) {
                const item = ducks.hydrate('item').with_uid(part_uid)

                yield item
            }
        }

        const debug = () => {
            return `${uid}\t part\t [${block.counter}] data: ${ block.data }`
        }

        return {
            uid, 
            ducktype,
            part_value,
            add_item, 
            refer_item, 
            select_items,
            debug
        }
    }    
    
    return { wrap }
}


export const wrap_part = (ctx) => {

    const { ducks } = ctx

    const wrap = (def) => {
        const { uid, ducktype, block } = def

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

        return {
            uid, add_item, refer_item, select_items
        }
    }    
    
    return { wrap }
}

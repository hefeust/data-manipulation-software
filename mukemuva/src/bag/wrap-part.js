
import { DUCKTYPE_ITEM } from './ducktypes.js'

export const wrap_part = (context) => {

    const { pool, debug, ducks} = context

    const set_item = async (def, with_data) =>  {
        const { uid, ducktype, block } = def

        const item = await ducks.create({
            ducktype: DUCKTYPE_ITEM,
            data:  { with_data  }
        })

        block.related.push(item.uid)
        block.counter++

        return item
    }

    const get_item = async (def, item_uid) =>  {
        const { uid, ducktype, block } = def

    }

    const refer_item = async (def, item_uid) =>  {
        const { uid, ducktype, block } = def

        block.related.push(item_uid)
        block.counter++
    }

    const select_items = async function* (def, filter) {
        const { uid, ducktype, block } = def

//        console.log({ SELECT_ITEMS: block.related })

        for(const item_uid of block.related) {
            const item = await ducks.hydrate({
                uid: item_uid,
                ducktype: DUCKTYPE_ITEM                
            })

            yield item
       }
    }

    const wrap = (def) => {
        const { uid, ducktype, block } = def

        return {
            uid,
            ducktype,
            part_value: block.data.part_value,

            set_item: (with_data) => set_item(def, with_data),
            refer_item: (item_uid) => refer_item(def, item_uid),
            get_item: (item_uid) => get_item(def, item_uid),
            select_items: (filter) => select_items(def, filter)
        }
    }

    return { wrap }
}

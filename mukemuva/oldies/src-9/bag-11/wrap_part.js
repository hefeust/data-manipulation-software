
import { wrap_item } from './wrap_item.js'

export const wrap_part = (pool) => {
    return {
         wrap: (block) => {
            const set_item = (data) => {
                const item = items.create({ data })
                block.payload.related.push(uid)
            }

            const get_item = (uid) => {}
            const add_ref = (uid) => {}
            const select_items = () => {}
            const toString = () => {}
            const debug = () => {}

            return { set_item, add_ref, get_item, select_items }
        }
    }
}



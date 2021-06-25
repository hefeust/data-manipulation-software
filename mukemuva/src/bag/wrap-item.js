
import { DUCKTYPE_ITEM } from './ducktypes.js'

export const wrap_item = (context) => {

    const set_data = async (def, payload) => {
        const { uid, ducktype, block } = def

//          console.log({ def })

        block.data = payload
        block.counter++
    }

    const get_data = async (def) => {
        const { uid, ducktype, block } = def

        return block.data
    }


    const wrap = (def) => {
        const { uid, ducktype, block } = def

        return {
            uid, ducktype,
            set_data: (payload) => set_data(def, payload), 
            get_data: () => get_data(def)
        }
    }

    return { wrap }
}


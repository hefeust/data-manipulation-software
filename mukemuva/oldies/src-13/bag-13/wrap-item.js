
export const wrap_item = (ctx) => {

    const wrap = (def) => {
        const { uid, ducktype, block } = def

        const debug = () => {
            return `${uid}\t item\t [${block.counter}]`
        }

        const set_data = (data) => {
            block.data = data
        }

        const get_data = (data) => {
            return block.data
        }

        return {
            uid,
            set_data,
            get_data,
            debug
        }
    }

    return { wrap }
}

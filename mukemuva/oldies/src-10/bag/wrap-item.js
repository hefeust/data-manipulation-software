
export const wrap_item = (context) => {
    const { ducks } = context

    const wrap = (def) => {
        const { uid, ducktye, block } = def

        const set_data = async (data) => {
            block.data = data
        }
  
        const get_data = async () => {
            return block.data
        }

        const debug = () => {
            return `${uid}\t item \t [${block.counter}] ${ block.data.with_data}`
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

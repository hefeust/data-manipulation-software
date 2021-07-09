
export const wrap_item = (context) => {
    const { ducks } = context

    const wrap = (def) => {
        const { uid, ducktye, block, debug } = def

        const set_data = async (data) => {
            block.data = data
        }
  
        const get_data = async () => {
            return block.data
        }

        const infos = () => {
            return `${uid}\t item \t [${block.counter}] ${ block.data.with_data}`
        }


        return {
            uid, 
            set_data, 
            get_data, 
            infos   
        }
    }

    return { wrap }
}

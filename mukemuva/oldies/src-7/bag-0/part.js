
export const create_part = (value) => {
    const items_list = []
    const stats = { counter: 0 }

    const set_item = async (data) => {
        const uid = await bmp.set_data({ used: true, data })

        items_list.push(uid)
    }

    const get_item = async (uid) => {

    }

    const api = (task) => {
        return {
            install_to: async (bmp) => {
                const part = { value, items_list, stats }
                const uid = await bmp.set_data(part)
                
            }
        }
    }

    let once = { install_to }

    return api(once)
}


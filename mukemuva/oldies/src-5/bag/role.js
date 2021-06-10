
import { create_part } from './part.js'

export const create_role = (role_name) => {

    const parts_list = []
    const parts_lookup = new Map()
    const stats = { counter: 0 }

    const set_part = async (value) => {
        const part =  await create_part(value)
    }

    const get_part = async (value) => {}

    const role_api = { set_part, get_part }

    return {
        install_to: async (bmp) => {
            const role = { role_name, parts_lookup, parts_list, stats }
            const uid = await bmp.set_data(role)

            return uid
        }
    }
}


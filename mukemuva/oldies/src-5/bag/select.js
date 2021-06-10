    
import { Maybe } from '../fp/maybe.js'

export const select = (bmp) => {
    const roles = new Map()

    const setup_roles = (names) => {
        names.map((name) => {
            const counter = 0
            const parts = new Map()
            const role = { name, parts, counter}
            const uid = bmp.set_data(role)

            duck(DUCK_ROLE).bind(role)
            roles.set(name, uid)
        })
    }

    const create_role = (name, value) => {
        const result = Maybe()

        Maybe(roles.get(name))
            .map((ruid) => bmp.get_data(ruid))
            .map((role) => role.parts)
            .map((parts) => parts.get(value))
            .cata({
                Just: (val) => console.log(val.inspect()),
                Nothing: () => {
                    const counter = 0
                    const part =  { value, items, counter }
                    const puid = bmp.set_data(part)
                }
            })
    }

    const find_role = (name, filter) => {

    }

    return {
        setup_role, create_role, find_role
    }   
}

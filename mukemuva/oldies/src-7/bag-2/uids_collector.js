
import { lists_intersect } from '../utils/lists_intersect.js'

export const data_collector = (roles_names) => {

    const collected = new Map()

    const collect_uids = (role_name, uids) => {
        const per_role_name = collected.get(role_name)

        collected.set(role_name, per_role_name.concat(uids))
    }

    const intersect_uids = () => {
        const lists = []

        roles_names.map((role_name) => {
            lists.push(collected.get(role_name) )
        })

        const isect = lists_intersect(lists
)
        
        console.log('            isect:', isect)

        return isect
    }

    const setup = () => {
        roles_names.map ((role_name) => {
            collected.set(role_name, [])
        })
    }

    setup()

    return {
        collect_uids, intersect_uids
    }
}

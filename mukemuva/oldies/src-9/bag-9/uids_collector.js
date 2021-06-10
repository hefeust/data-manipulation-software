
import { lists_intersect } from '../utils/lists_intersect.js'

export const uids_collector = (roles_names) => {
    const collected = new Map()

    const setup = () => {
        roles_names.map((role_name) => {
            collected.set(role_name, [])
        })
    }

    setup()

    return {
        collect:  (role_name, uids) => {
            const per_role_name = collected.get(role_name)
                
            per_role_name.push(...uids)
//            collected.set(role_name, per_role_name.concat(...uids))

            collected.set(role_name, per_role_name)

//            console.log('collect', { [role_name]: collected.get(role_name) })

            return uids.length
        },

        intersect: () => {
            const lists_uids = []                                

            roles_names.map((role_name) => {
                lists_uids.push(collected.get(role_name))
            })

//            console.log({ collected })

            console.log(
                lists_uids.map((l) => l.length).join(', ')
            )
            return lists_intersect(lists_uids)
        }
    }
}


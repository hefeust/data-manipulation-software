
export const create_naive_store = (roles_names, options = {}) => {

    const entries = []

    const set = async (bag, with_data) => {
        const keys = Object.keys(bag)
        let idx = -1

        for(const entry of entries) {
            const { bag } = entry
            const matches = []

            for(const key of keys) {
                const value = bag[key]

                if(bag[key] === value)
                    matches.push(key)              
            }


            if(matches.length === roles_names.length) break

            idx++
        }

        if(idx === -1) {
            entries.push({ bag, with_data })
        } else {
            entries[idx].with_data = with_data
        }

//        console.log(stats.sets)

        stats.sets++
    }

    const get = async (bag, with_data) => {

    }

    const select = async function* (filters) {
        const keys = Object.keys(filters)

        for(const entry of entries) {
            const { bag } = entry
            const matches = []

            for(const key of keys) {
                const filter = filters[key]

                if(bag[key] === filter)
                    matches.push(key)              
            }

            if(matches.length === roles_names.length) yield entry
        }


        stats.selects++
    }

    const toString = () => {

    }

    const debug = () => {
        return { DEBUG_ENTRIES_LENGTH:  entries.length }
    }

    const get_stats = () => {
        return stats
    }

    const stats = {
        sets: 0, gets: 0, releases: 0, selects : 0
    }

    return { 
        set, 
        get, 
        select, 
        toString, 
        debug,
        get_stats
    }
}

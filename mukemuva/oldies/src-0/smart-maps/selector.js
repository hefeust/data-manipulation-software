
export const create_selectorr = (roles_length) => {

    const lookup = new Map()

    let steps_counter = 0

    const purge_uids  = () => {}

    const set_marks = (uids) => {
        uids.map((uid) => {
            const count = lookup.get(uid) || 0

            if(count === steps_counter) {
                lookup.set(uid, 1 + count)
            } else {
                lookup.delete(uid)
            }
        })

        steps_counter++
    }

    const get_selected = () => {
        return Array.from(lookup.keys())
    }

    return {
        set_marks, get_selected
    }
}


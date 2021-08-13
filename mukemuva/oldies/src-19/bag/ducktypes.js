
export const ROLE = 'R'

export const PART = 'P'

export const ITEM = 'I'

const get_fullname = (ducktype) => {
    switch (ducktype) {
        case ROLE: return 'role'
        break
        case PART: return 'part'
        break
        case ITEM: return 'item'
        break
        default: return '#KO!'
        break
    }
}

export const trace = (block) => {
    const { uid, ducktype, related, counter, fellow } = block
    const fullname = get_fullname(ducktype)
    let payload = '#user-data!'

    if(ducktype === ROLE) payload = block.payload.role_name
    if(ducktype === PART) payload = block.payload.part_value

    return `[${uid}] ${fullname}  (${fellow}) ${counter}, ${ related.length} payload=${payload}`
}










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
    const { uid, ducktype, refs } = block

//    console.log({ uid, ducktype, refs})

    const { fellow, related, counter  } = refs

    const fullname = get_fullname(ducktype)

    return `${uid} ${fullname} ${fellow} ${counter}`
}

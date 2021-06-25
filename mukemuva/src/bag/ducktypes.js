
export const DUCKTYPE_ROLE = 'R'
export const DUCKTYPE_PART = 'P'
export const DUCKTYPE_ITEM = 'I'

export const toString = (ducktype) => {
    switch (ducktype) {
        case DUCKTYPE_ROLE: return  'role'
        break
        case DUCKTYPE_PART: return  'part'
        break
        case DUCKTYPE_ITEM: return  'item'
        break
        default: return '#KO!'
        break
    }
}


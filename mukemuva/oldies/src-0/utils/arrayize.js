
export const arrayize = (value) => {
    if(value === undefined) {
        return []
    } 

    if(value.length) {
        return value
    }

    return [value]
}


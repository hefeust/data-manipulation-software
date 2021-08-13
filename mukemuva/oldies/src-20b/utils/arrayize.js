
export const arrayize = (value) => {
    if(value === undefined) {
        return []
    } 

    if(typeof value = 'string') {
        return value.split(',')
    }

    if(value.length >= 0) {
        return value
    }

    return [value]
}


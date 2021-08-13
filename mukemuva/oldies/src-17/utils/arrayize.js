
export const arrayize = (value) => {
    if(value === undefined) {
        return []
    } 

    if(typeof value = 'string') {
        return value.split(',')
    }

    if(value.length) {
        return value
    }

    return [value]
}


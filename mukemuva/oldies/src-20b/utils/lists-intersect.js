
export const lists_intersect = (lists) => {

    const lookups = new Map()

    lists.map((list) => {
        list.map((item) => {
            const counter = lookups.get(item) || 0

            lookups.set(item, 1 + counter)
        })
    })

    const results = Array.from(lookups.keys()).reduce((acc, key) => {
        const counter = lookups.get(key)

        if (counter === lists.length) {
            acc.push(key)
        }

        return acc
    }, [])
    
    return results
}


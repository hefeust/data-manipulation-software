


const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));

const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

const pi_cart = (array, ...others) => {
    const store = [array]
    let  index = 0

    for (const other of others) {
        const prev = store[index]
        const next = []

        for (const parr of prev) {
            for (const oval of other) {
                if(Array.isArray(parr)) {
                    next.push(parr.concat(oval))
                } else {
                    next.push([parr, oval])
                }
            }
        }

        index = 1 - index
        store[index] = next
    }

    return store[index]
}


export const cartesian_product = pi_cart

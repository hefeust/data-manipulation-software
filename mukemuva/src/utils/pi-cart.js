
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

const a = [0, 1, 2, 3]
const b = 'a,b,c'.split(',')
const c = [false, true]
const d = 'x,y,z'.split(',')

const pic = pi_cart(a, b, c, d)

console.log('\n**** results ****')
console.log(pic)
console.log(pic.length)


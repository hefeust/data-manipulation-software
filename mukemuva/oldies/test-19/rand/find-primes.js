
const MAX_ROOT = 25

module.exports = (x) => {
    const factors = [7, 11, 13, 17, 19, 23, 29, 31]

    let test = true

    if(x === 1) return true
    if(x === 2) return true
    if(x === 3) return true
    if(x === 5) return true

    if((x % 2) === 0) return false
    if((x % 3) === 0) return false
    if((x % 5) === 0) return false

    for(let i =0; i < Math.sqrt(x); i += 30) {
        for(let c = 0; c < factors.length; c++) {
            if(factors[c] > Math.sqrt(x)) {
                break
            } else {
                if(x % (factors[c] + i) === 0) {
                    return false
                }
            }
        }
    }

    return test
}

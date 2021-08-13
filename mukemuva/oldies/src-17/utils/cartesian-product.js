

const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));

const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

const prod = (arrays) => {
    const temp = []

    for (const arr of arrays) {
        for(const entry of temp) {
            for (const value of arr) {

            }
        }
    }
}

export const cartesian_product = cartesian

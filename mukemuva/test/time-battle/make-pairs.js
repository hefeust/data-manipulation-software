
const rand = (n) => 1 + Math.floor(n * Math.random())

export const make_pairs = (params) => {

    const { NMAX, keynames } = params
    const pairs = []

    for(let i = 0; i < NMAX; i++) {

        const bag = {}

        for (const kn of keynames) {
            bag[kn] = rand(1000) 
        }

        const with_data = {
            r: rand(NMAX),
            g: rand(NMAX),
            b: rand(NMAX)
        }

        pairs.push({ bag, with_data })
    }

    return pairs
}


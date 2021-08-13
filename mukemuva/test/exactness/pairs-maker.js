

const rand = (n) => 1 + Math.floor(n * Math.random())

export const pairs_maker = (params) => {

    const { NMAX, DIMS } = params
    const kns = Array.from(DIMS.keys())
//    console.log({ kns })

    const pairs = []

    for (let i = 0; i < NMAX; i++) {
        const bag = {}
        const with_data = {
            r: rand(NMAX) % 256,
            g: rand(NMAX) % 256,
            b: rand(NMAX) % 256
        }
        const test = {
            counter: 0,
            uid: null
        }
    

//        console.log({ kns })
        kns.map((kn) => {
            bag[kn] = i     
        })

        pairs.push({ bag, with_data, test })
    }

    return pairs
}



import { create_multistore } from '../../dist/index.js'

const DIMS = 2
const roles_names = 'x,y,z'.split(',')
const NMAX = Math.pow(DIMS, roles_names.length)
const rand = (n) => 2 + Math.floor(n * Math.random())

const ms = create_multistore(roles_names, {
    pool: {
        size: NMAX
    }
})

//console.log(ms)

const pairs = []

for(let i = 0; i < NMAX; i++) {
    pairs.push({
        bag:  {
//             x: rand(NMAX),
//             y: rand(NMAX),
//             z: rand(NMAX),
            x: rand(DIMS),
            y: rand(DIMS),
            z: rand(DIMS),
        },
        with_data: {
             r: rand(NMAX) / NMAX,
             g: rand(NMAX) / NMAX,
             b: rand(NMAX) / NMAX,
        }
    })
}

const idx = rand(NMAX) - 2

console.log(pairs)
console.log(idx)

const test  = pairs[idx]

console.log('multistore debug...')

const show = async () => {

    console.log('associate data...')

    for(let j = 0; j < pairs.length; j++) {
        const { bag, with_data} = pairs[j]

        const sets = await ms.set(bag, with_data)
    }

    console.log('fetching results...')
    
    console.log({ test })

    console.log('**** RESULTS ****')

    const results = await ms.select(test.bag)

    for await(const selected of results) {
        console.log({ selected })
    }

//    (await ms.debug()).map(d => console.log(d.uid, d.data))
//    console.log(ms.debug())               

    console.log('***** STATS *****')

    console.log(ms.get_stats())
    console.log(ms.debug())
}

show()












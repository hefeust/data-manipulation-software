
import { create_multistore } from '../../dist/index.js'

const DIMS = 20
const roles_names = 'x,y,z'.split(',')
const NMAX = Math.pow(DIMS, roles_names.length)
const rand = (n) => 1 + Math.floor(n * Math.random())

const ms = create_multistore(roles_names, {
    pool: {
        size: NMAX
    },
    debug: true
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

const idx = rand(NMAX) - 1

const test  = pairs[NMAX - 1]
//const test  = pairs[0]

console.log('multistore debug...')
//console.log({ test: idx, NMAX})

const show = async () => {

    console.log('associate data...')

    for(let j = 0; j < pairs.length; j++) {
        const { bag, with_data} = pairs[j]
        
//        console.log('setting element j=' + j)
        const sets = await ms.set(bag, with_data)
    }

    console.log({ STATS: ms.get_stats() })

    console.log('fetching results...')
    
    console.log({ test })

    console.log('**** RESULTS ****')

    const results = await ms.select(test.bag)

    for await(const selected of results) {
        console.log({ selected })
    }

    console.log('***** STATS *****')
    console.log({ STATS: ms.get_stats() })

    console.log(ms.debug())
}

show()












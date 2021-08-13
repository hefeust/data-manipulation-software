
import { make_bagstore } from '../../dist/index.js'

const DIMS = 100
const roles_names = 'x,y,z'.split(',')
const NMAX = Math.pow(DIMS, roles_names.length)
const rand = (n) => 1 + Math.floor(n * Math.random())

const ms = make_bagstore(roles_names, {
    pool: {
        size: NMAX
    },
    debug: true
})

console.log({ NMAX })

const pairs = []

for(let i = 0; i < NMAX; i++) {

    pairs.push({
        bag:  {
//             x: rand(NMAX),
             y: rand(NMAX),
             z: rand(NMAX),
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

const test  = pairs[rand(NMAX) - 1]
// const test  = pairs[0]
// const test = { bag: { x: 0, y: 0, z: 0 } }

console.log('multistore debug...')
//console.log({ test: idx, NMAX})

const show = async () => {

    console.log('*** ASSOCIATE DATA ***')

    for(let j = 0; j < pairs.length; j++) {
        const { bag, with_data} = pairs[j]
        
//        console.log('setting element j=' + j)
//        console.log('\n', bag, '\n')

        if((j % 1000) === 0) console.log('iteration: ' + j + ' / ' + NMAX)

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

    console.log({ STATS: ms.get_stats() })

    console.log(ms.debug())
}

show()












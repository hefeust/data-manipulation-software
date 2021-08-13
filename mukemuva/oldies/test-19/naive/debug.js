
import { make_naivestore } from '../../dist/index.js'

const NMAX = 1300 * 1000
const roles_names = 'ab'.split('')
const DIMS = roles_names.length

const rand = (n) => 1 + Math.floor(n * Math.random())

console.log(roles_names)

const ms = make_naivestore(roles_names, {
    pool: {
        size: NMAX
    },
    debug: true
})

// console.log(ms)

const pairs = []

for(let i = 0; i < NMAX; i++) {

    const bag = {}

    for (const kn of roles_names) {
        bag[kn] = rand(NMAX) / rand(DIMS * Math.PI) 
    }

    const with_data = {
        r: rand(NMAX) / NMAX,
        g: rand(NMAX) / NMAX,
        b: rand(NMAX) / NMAX,
    }

    pairs.push({ bag, with_data })
}

const idx = rand(NMAX) - 1

const test  = pairs[rand(NMAX) - 1]
// const test  = pairs[0]
// const test = { bag: { x: 0, y: 0, z: 0 } }

console.log('multistore debug...')
//console.log({ test: idx, NMAX})

const show = async () => {
var t1 = Date.now()
    console.log('*** ASSOCIATE DATA ***')

    for(let j = 0; j < pairs.length; j++) {
        const { bag, with_data} = pairs[j]
        
//        console.log('setting element j=' + j)
//        console.log('\n', bag, '\n')

        if((j % 1000) === 0) console.log('iteration: ' + j + ' / ' +NMAX)

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
var t2 = Date.now()

console.log({ timer: (t2 - t1) / 1000 })

}

show()


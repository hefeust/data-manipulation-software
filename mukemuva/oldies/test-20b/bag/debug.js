
import { make_bagstore } from '../../dist/index.js'

const NMAX = 10  * 1000
const DIMS = 1 * 1000
const roles_names = 'a,b,c'.split(',')

const rand = (n) => 1 + Math.floor(n * Math.random())

console.log(roles_names)

const ms = make_bagstore(roles_names, {
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
        bag[kn] = rand(DIMS)
    }

    const with_data = {
        r: rand(NMAX) % 256,
        g: rand(NMAX) % 256,
        b: rand(NMAX) % 256
    }

    pairs.push({ bag, with_data })
}

const idx = rand(NMAX) - 1
const test  = pairs[rand(NMAX) - 1]

console.log('multistore debug...')

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
        console.log(' ' + selected)
    }

    console.log({ STATS: ms.get_stats() })

    console.log(ms.debug())
var t2 = Date.now()

console.log({ timer: (t2 - t1) / 1000 })

}

show()


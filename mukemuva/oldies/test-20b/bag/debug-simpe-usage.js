
import { create_multistore } from '../../dist/index.js'

const roles_names = 'x,y,z'.split(',')

const ms = create_multistore(roles_names, {
    pool: {
        size: 25
    }
})

//console.log(ms)

const bag1 = { x: 3, y: 2, z: 1 }
const bag2 = { x: 1, y: 2, z: 3 }
const bag3 = { x: 0, y: 0, z: 0 }

const bags = [
    bag1, bag2, bag3
]

console.log(bags    )

    console.log('multistore debug...')

const show = async () => {

    console.log('associate data...')
    const a1 = await ms.set(bag1, 1234)
    const a2 = await ms.set(bag2, 4321)
    const a3 = await ms.set(bag3, 0)

    console.log('fetching results...')
    const results = await ms.select({
        x: '*', y: '*', z: '*'
    })

//    console.log({ results })

    for await(const r of results) {
        console.log({ r })
    }

//    (await ms.debug()).map(d => console.log(d.uid, d.data))
//    console.log(ms.debug())               

    console.log(ms.get_stats())
}

show()












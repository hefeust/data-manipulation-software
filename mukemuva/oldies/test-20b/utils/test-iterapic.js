
import {
    iterative_cartesian_product
} from '../../src/utils/iterative-cartesian-product.js'

const iterapic = iterative_cartesian_product({ debug: true })

const a = 'x,y'.split(',')
const b = 'a,b,c'.split(',')
const c = [0, 1, 2, 3]
const d = [100, 200, 300, 400, 500]

const list = [a, b, c, d]

const totals = list.reduce((acc, l, idx) => { 
    if(idx === 0) {
        acc.push(l.length)
    } else {
        acc.push(acc[idx - 1] * l.length)
    }
        
    return acc
}, [])

// console.log(totals)

export const test_iterapic = () => {
    console.log('* test iterapic')

    list.map((l, idx) => {
        iterapic.prod_array(l)

        console.log(iterapic.results)
        
        console.log(
            iterapic.counter + ': ' + totals[idx] +' ' +iterapic.results.length
        )
    })

    console.log('')
}


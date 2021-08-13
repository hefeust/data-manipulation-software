
import { Maybe } from '../../src/fp/maybe.js'

console.log('*** simple examples ***')

console.log(Maybe(null).inspect())
console.log(Maybe(42).inspect())

console.log('*** map test ***')

let abc = 5

let m = Maybe(abc).map(x => x * x).cata({
    Just: (val) => console.log(val),
    Nothing: (val) => console.log(val)
})


console.log(m.inspect())

console.log('*** ap test ***')

Maybe(x => y => x + y)
    .ap(Maybe.Just(6))
//    .ap(Maybe.Just(7))
    .cata({
        Just: (val) => console.log(val),
        Nothing: () => console.log('No result')
    })

console.log(Maybe(42).chain(x => x - 2).chain(x => x * x).inspect())


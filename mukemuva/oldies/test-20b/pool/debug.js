
import { create_bmp } from '../../dist/index.js'

const bmp = create_bmp({
    pool: {
        size: 100
    }
})

const N = 100 * 1000   
const objs = []
const uids = []

for(let i = 0; i < N; i++) {
    objs[i] = { item: i }
    uids[i] = bmp.set_data(objs[i])    
}

//console.log('stored objects', objs)
//console.log('uid promise lsii', uids)

Promise.all(uids)
.then((values) => {
    const arr = values.map((value, idx) => {
        return bmp.get_data(value)
    })

    return arr
})
.then((values) => {
    Promise.all(values).then((stored_data) => {
        const test = stored_data.reduce((acc, data, idx) => {
            if(data !== objs[idx]) {
                 console.log(bmp.debug(idx))
                console.log(idx, data, objs[idx])
                // console.log({ idx })
            }
            

            return acc && data === objs[idx]
        }, true)
    
        console.log(test)
    })
})

console.log({ stats: bmp.get_stats()  })




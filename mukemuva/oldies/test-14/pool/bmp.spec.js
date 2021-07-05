
import * as mkemuva from '../../dist/index.js'

const N = 1000
const objs = []
const uid$ = []

const bmp = mukemuva.create_bmp({
    pool: {
        size: 20 * 1000
    }
})

describe('Blocks Memory Pool', () => {
    it('should return stored data', (done) =>{
        for(let i = 0; i < N; i++) {
            objs[i] = { x: i, y: i * i }
            uid$[i] = bmp.set_data(objs[i])
        }

        Promise.all(uid$)
            .then((uids) => 
                uids.map((uid) => bmp.get_data(uid))
            )
            .then((stored$) => {
                Promise.all(stored$)
                    .then((stored) => {
                        const test = stored.reduce(
                            (acc, data, idx) => 
                            acc && (data === objs[idx]),
                             true)
                
                        expect(test).to.be.true
    
                        done()
            })
            .catch((err) => done(err))
        })
    })
})



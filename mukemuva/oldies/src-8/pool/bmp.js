
import { Maybe } from '../fp/maybe.js'
import { Result } from '../fp/result.js'
import { merge} from '../utils/merge.js'
import { create_mwc } from '../rand/mwc.js'
import { keys } from '../rand/keys.js'

const defaults = {
    mwc: {
        modulus: 83047,
        divider: 36,
        keysize: 5
    },
    pool: {
        size: 10 * 1000,
        thresold: 0.05,
        growth: 0.10
    }
}

export const create_bmp = (options = {}) => {

    const blocks = []

    const lookup = new Map()

    const set_data = async (data) => {
        const uid = await allocate()
        const block = blocks[lookup.get(uid)]

        block.data = data
        stats.sets++

//        console.log('        bmp.set_data:', { uid, data })

        return uid
    }

    const get_block = async (uid) => {
        const idx = lookup.get(uid)
        const block = blocks[idx]

        stats.gets++

        return block
    }

    const has_data = (uid) => {
        return lookup.has(uid)
    }


    const get_data = async (uid) => {
        const block = await get_block(uid)

        return block.data
    }

    const release_data = async(uid) => {
        
    }


    const allocate = async() => {
        const { size, thresold, growth } = conf.pool
        const newly = Math.floor(size * growth) || 1
        let first

        stats.watermark++

        if((stats.watermark) >= (stats.count * (1 - thresold))) {
//            console.log('reallocate', { count: stats.count })            

            for(let k = 0; k < newly; k++) {
                let uid = ''
                let i = 0
                   
                do {
                    // to avoid collisions... 
                    // it's a MWC generator after all...
                    uid = keys(mwc.next())
                    i++               
                } while(lookup.has(uid)) 

                if(i > 1) stats.collisions += (i - 1)

                blocks.push({ uid, data: null })
                lookup.set(uid, k + stats.count)

//                if(k === 0) first = uid
            }

            stats.count += newly
            stats.allocates++
        } else {
//            console.log('just enough room')            
        }

        first = blocks[stats.watermark]

        // console.log({ first })


        return first.uid
    }

    const clear = async() => {

    }

    const toString = () => {

    }

    const get_stats = () => {
        const result = {}
        
        Object.keys(stats).map((prop) => {
            result[prop] = stats[prop]
        })

        return result
    }


    const debug = () => {
        return blocks
    }

    const init_generator = () => {
        const { modulus, divider, keysize } = conf.mwc
        const seeds = []

        seeds[0] = modulus % (divider - 1)

        for(let s = 1; s < keysize; s++) {
            seeds[s] = (seeds[s - 1] + modulus) % (divider - 1)
        }

        Object.assign(mwc, 
            create_mwc(modulus, divider, keysize)
        )

        mwc.init(seeds)
    }

    const init_stats = (options) => {
        Object.assign(stats, {
            watermark: 0,
            count: 0,
            sets: 0,
            gets: 0,
            releases: 0,
            allocates: 0,
            collisions: 0
        })
    }

    const setup = () => {
        merge(conf, defaults, options)

//        console.log({ conf })

        init_generator(options.generator)
        init_stats()
    }

    const bmp_api = {
        set_data, 
        release_data,
        get_block,
        get_data, 
        has_data,
        allocate,
        clear,
        toString,
        get_stats,
        debug
    }

    const conf = {}
    const mwc = {}
    const stats = {}

    let UID = null
    
    setup(options)

    return bmp_api
}

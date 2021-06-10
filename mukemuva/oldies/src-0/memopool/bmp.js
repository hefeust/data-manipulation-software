
import { keys36 } from '../mwc-generator/keys.js'
import { create_mwc } from '../mwc-generator/mwc.js'

export const create_bmp = (options) => {

    /**
    * complete blocks list
    */
    const blocks = []

    /**
    * block uids lookup
    * 
    */
    const lookup = new Map()

    /**
    * get data by uid
    * @param UID uid
    * @return Any
    */
    const get_data = (uid) => {
        const idx = lookup.get(uid)
        let block = null

        get_calls++

        if(idx < blocks_count) {
            block = blocks[idx]

            return block.data
        } else {
            return null
        }
    }

    /**
    * set data a,d return compputed store  UID
    * @param Any data
    * @return UID
    */
    const set_data = (data) => {
        const block = blocks[watermark]
        
        lookup.set(block.uid, watermark)
        block.data = data         
        watermark++
        set_calls++

        return block.uid
    }

    /** 
    * empty the block at UID
    * and relase data
    *
    */
    const release_data = (uid) => {
        let idx = lookup.get(uid)
        let temp = blocks[idx]

        blocks[idx] = blocks[watermark]
        blocks[watermark] = temp
        release_calls++
        watermark--
    }

    const reallocate_blocks = (amount) => {
        const newly_created = new Array(amount)
        let block = null
        let uid = null
        let i = 0

        for(let k = 0; k < amount; k++) {
            do {
                uid = keys36(mwc.next())
                i++
//                console.log(++i)
                if(lookup.has(uid)) console.log('collision: ' + i)
            } while(lookup.has(uid))

            block = { uid, data: null }
            newly_created[k] = block
            lookup.set(uid, k + blocks_count)
        }

        blocks.push(...newly_created)
        blocks_count += amount
    }

    const toString = () => {}

    const debug = () => {
        
    }

    const get_stats = () => {
        return {
            watermark, 
            blocks_count, 
            set_calls,
            get_calls,
            release_calls
        }
    }

    const bmp_api = {
        set_data, 
        get_data,
        release_data,
        reallocate_blocks,
        get_stats,
        toString, 
        debug, 
    }

    const setup = (options) => {
        const size = options.size || (50 * 1000)
        let seeds = []
        let key_length = 4

        if(size >  (1000 * 1000)) {
            key_length = 6
        } 

        for(let s = 0; s < key_length; s++) {
            seeds[s] = Math.pow(s + 1, s)
        }

        mwc = create_mwc(17*17*17+13*13+11+1, 36, key_length)
        mwc.init(seeds)
        reallocate_blocks(size)
    }

    let mwc = null
    let blocks_count = 0
    let watermark = 0
    let UID = null
    let set_calls = 0
    let get_calls = 0
    let release_calls = 0

    setup(options)

    return bmp_api
}

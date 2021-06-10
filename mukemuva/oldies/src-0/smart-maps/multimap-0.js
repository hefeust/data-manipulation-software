
const DUCK_BLOCK_EMPTY = 0
const DUCK_BLOCK_MAP = 1
const DUCK_BLOCK_LIST = 2
const DUCK_BLOCK_DATA = 3

export const create_block = (uid, duck, scout) => {

    let block = {}

    Object.defineProperty(block, 'uid', {
        get: () => uid
    })

    Object.defineProperty(block, 'duck', {
        get: () => duck
    })

    Object.defineProperty(block, 'scout', {
        get: () => scout
    })

    switch(duck) {
        case DUCK_BLOCK_MAP: 
            Object.defineProperty(block, 'related', new Map())
        break
        case DUCK_BLOCK_LIST: 
            Object.defineProperty(block, 'related', [])
        break
        case DUCK_BLOCK_DATA: 
            Object.defineProperty(block, 'related', {})
        break
    }

    return block
}

export const create_multimap = (roles_list, options) => {
    
    const root = create_block(0, DUCK_BLOCK_MAP, 0)
    const roles_defs = []

    const debug = options.debug || 0

    const check_roles = () => {}

    const set = (roles_valuations, data) => {
        
    }

    const delte = (roles_valuations, cleaner_callback) => {
        
    }

    const query = (roles_selector, finder_callback) => {
        
    }

    const api = { set, delte, query }

    returnn api
}












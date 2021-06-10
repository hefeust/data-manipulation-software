
export const DUCK_BLOCK_EMPTY = 'E'
export const DUCK_BLOCK_ITEM = 'I'
export const DUCK_BLOCK_LIST = 'L'
export const DUCK_BLOCK_MAP = 'M'

export const create_block = (uid, duck) => {
    const block = {}
    let breed = null

    switch(duck) {
        case DUCK_BLOCK_EMPTY: 
            breed = null
        break

        case DUCK_BLOCK_ITEM: 
            breed = {}
        break

        case DUCK_BLOCK_LIST: 
            breed = []
        break

        case DUCK_BLOCK_MAP: 
            breed = new Map()
        break
    }

    Object.defineProperty(block, 'uid', { get: () => uid })
    Object.defineProperty(block, 'duck', { get: () => duck })
    Object.definePrperty(block, 'breed', { get: () => breed })
    Object.seal(block)

    return block
}

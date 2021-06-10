
const DUCK_BLOCK_ITEM = 1
const DUCK_BLOCK_LIST = 2
const DUCK_BLOCK_MAP = 3

const create_block = (uid, duck, call_me) => {
    switch (duck) {
        case DUCK_BLOCK_ITEM: 
            return { uid, duck, item: {}, counter: 0, call_me }
        break

        case DUCK_BLOCK_LIST: 
            return { uid, duck, list: [], counter: 0, call_me }
        break

        case DUCK_BLOCK_MAP: 
            return { uid, duck, map: new Map(), counter: 0, call_me }            
        break
    }
}

export const create_multimap = (roles_list, options) => {

    const roles = new Map()

    let UID = 0

    const assert_oles_names = (roles_names_list) => {
        roles_names_list.map((name) => {
            if(roles_list.indexOf(name) === -1) {
                throw new Error('assert_roles_names error: unhandled role:  ' + name)
            }
        })
    }

    const call_me = (block) => {
        console.log('call_me on block: ', block.uid, block.duck)
    }

    const set = (roles_bag, data)  => {
        const rb_names = Object.keys(roles_bag)
        const term = create_block(++UID, DUCK_BLOCK_DATA, call_me)

        assert_roles(rb_names)

        rb_names.map((rb_name) => {
            const role = roles.map.get(rb_name)
            const rb_value = roles_bag[rb_name]
            let part = null

            if(role.item.lookup.has(rb_value)) {
                part = role.item.r_lookup.get(rb_value)

                part.list.push(block)
            } else {
                part = create_block(++UID, DUCK_BLOCK_LIST, call_me)
                role.item.r_values.list.push(part)
                role.item.r_lookup.map.set(rb_value, part)
                part.list.push(block)
            }
        })
    }

    const get = (roles_bag, callback) => {

    }

    const has = (roles_bag) => {

    }

    const remove = (roles_bag) => {

    }

    const select = (roles_selector, callback) => {

    }

    const mm_api = { set, get, has, remove, select }

    Object.defineProperty(mm_api, 'count', {
        get: () => {
            return blocks.length
        }
    })

    return mm_api
}














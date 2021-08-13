
export const make_logics = (context) => {

    const basis_lookups = new Map()

    const parts_lookups = new Map()

    const install_basis = async (keynames) => {
        const { pool, boot_uid } = context
        
        if (boot_uid === null) {
            const boot_related = []
            const boot_lookups =new Map()

            const promises = keynames.map(async (kn) => {
                const kn_block = {
                    ducktype: 'K',
                    lookups: new Map(),
                    related: [],
                    payload: { keyname: kn },
                    counter: 0
                }

                const kn_uid = await pool.set_data(kn_block)

                basis_lookups.set(kn_uid, kn_block)
                boot_lookups.set(kn, kn_uid)
                boot_related.push(kn_uid)
            })

            const boot_block  = {
                ducktype: 'B',
                related: boot_related,
                lookups: boot_lookups,
                counter: 0,
            }

            const resolved = await Promise.all(promises)
        }
    }

    const install_parts = async (bag) => {
        const { pool, boot_uid } = context
        const boot_block = basis_lookups.get(boot_uid)
        const kns = Array.from(boot_block.lookups.keys())

        const promises = kns.map(async (kn) => {
            const kn_uid = boot_block.lookups.get(kn)
            const kn_block = basis_lookups.get(kn_uid)

            if (false === bag.hasOwnProperty(kn)) {
                throw new Error('missing keyname in bag; ' + kn)
            }

            const part_value = bag[kn]

            if(false === kn_block.lookup.has(part_value)) {
                const part_block = {
                    ducktype: 'P',
                    related: [],
                    lookups: new Map(),
                    payload: { part_value },
                    counter: 0
                }

                const part_uid = await pool.set_data(part_block)

                kn_block.related.push(kn_uid)
                kn_block.lookups.set(part_value, part_uid)
                kn_block.counter++
            }

            return part_value
        })

        const resolved = await Promise.all(promises)

        return resolved
    }

    const install_items = async () => {}

    const select_pairs = async (kns_filters = {}, post_filter = null) => {

    
    }


    return {
        install_keynames,
        install_parts,
        install_items,
        select_pairs
    }
}



import { lists_intersect } from '../utils/lists-intersect.js'

export const make_logics = (keynames) => {

    const kns = keynames

    const lookups = new Map()

    const set_record = (record) => {
        const { kn, pv, uids } = record
        const entries = lookups.get(pv) || []

        if( entries.filter((e) => e.kn === kn).length === 0) {
            entries.push(record)
        }

        lookups.set(pv, entries)
    }

    const find_record = (selector) => {
        const { kn, pv } = selector
        const entries = lookups.get(pv) || []

        return (entries.filter((e) => e.kn === kn)[0]) || null
    }

    const collect_uids = (filters) => {
        const results = []
        const temps = new Map()
        let index = 0

        kns.map((kn) => {
            const pv = filters[kn]
            const record = find_record({ kn, pv  }) || { kn, pv, uids: []  }

            if (index === 0)  {
                temps.set(0, [record.uids])
                temps.set(1, [record.uids])
            } else {
                const prevs = temps.get(1 - (index % 2))
                const nexts = prevs.reduce((acc, prev) => {
//                    console.log({ acc })
                    return acc.concat(prev)
                }, [])

                temps.set(  (index % 2), [nexts])
            }
           
            index++
        })

        // console.log(temps)
        // console.log({index })
        // console.log({ lists: temps.get((index % 2)) })

        const cartesian = temps.get((index % 2))

//        console.log({ cartesian })

        return lists_intersect(cartesian)
    }

    return {
        find_record,
        set_record,
        collect_uids
    }
}


If you can use ES6 Maps and your arrays items are scalar values (easily usable as Map keys), then you can try this (works in my case) :

    const intersect_lists = (lists) => {
        const results = []
        const lookup = new Map()

        lists.map((list, idx) => {
            list.map((element) => {
                const count = lookup.get(element) || 0

                if(count === idx) {
                    lookup.set(element, 1 + count)
                } else {
                    lookup.delete(element)
                }
            })
        })

        // only elements present in all lists will have 
        // their respective counter equllling the total number of lists
        Array.from(lookup.keys()).map((key) => {
            if(lookup.get(key) === lists.length) {
                results.push(key)
            }
        })

        return results
    }

Optionally you can pre-sort "lists" (of lists) by creasing length to avoid lots of  iterations of the outer map() call, especially if lists lengths are heterogenous :

    lists.sort((l1, l2) => l1.length - l2.length).map((list, idx) => { ... })



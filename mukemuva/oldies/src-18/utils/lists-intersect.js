
export const lists_intersect = (lists) => {
    const results = []
    const lookup = new Map()

//    console.log('lists.map', lists )

//    lists.sort((l1, l2) => l2.length - l1.length).map((list) => {
    lists.map((list, idx) => {
        list.map((element) => {
            const count = lookup.get(element) || 0

//         if(count === idx) {
           lookup.set(element, 1 + count)
//         } else {
//             lookup.delete(element)
//         }
        })
    })

    Array.from(lookup.keys()).map((key) => {
        if(lookup.get(key) === lists.length) {
           results.push(key)
        }
    })

//    console.log(lists.map((list) => list.length).join(', '))
        
    return results
}


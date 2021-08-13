
export const lists_intersect = (lists) => {
    let s = null
    let index = 0
    
    if(lists.length === 0) return []
//    console.log(lists)

//    console.log('lenghts: ' + lists.map(l => l.length).join(' '))
//    lists.sort((la, lb) => {
//        return la.length - lb.length

//    console.log(lists.map(l => l.length).join(' '))

    for (const list of lists) {
        if (index > 0) {
            for(const item of list) {
                s.add(item)
            }
        } else {
            s = new Set(list)
        }

        index++
    }

    return Array.from(s)
}


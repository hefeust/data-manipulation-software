
const a = [0, 1, 2]
const b ='a,b'.split(',')
const c = 'x,y,z'.split(',')
const lists = [a, b, c]
const m = new Map()
const l0 = lists[0].map((uid) => [uid])

let index = 0, prevs, nexts

while (index < lists.length) {
    if(index === 0) {
        m.set(0, l0)
        m.set(1, l0)
    } else {
        prevs = m.get(1 - (index % 2))
        nexts = prevs.reduce((acc, prev) => {
            // console.log("reduce:", prev )
            // console.log(lists[index])

            const new_arrs = lists[index].map((uid) => {
                return prev.concat(uid)
            })

            return acc.concat(new_arrs)
        }, [])        

        // console.log('prevs:', prevs)
        // console.log('nexts:', nexts)

        m.set(index % 2, nexts)
    }

    index++
}

console.log(m.get(1 - (index % 2)))


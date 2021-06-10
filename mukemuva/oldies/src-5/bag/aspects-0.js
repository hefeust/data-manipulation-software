
const create = (l) => {
    console.log('seting up for list', l)

    const install = (pool) => console.log('installing', pool)
    const nope = (pool) => void 0
    const action = (t) => console.log('action', t)  

    const api = (tasks) => {
        return {
            install: (pool) => {
                tasks.install(pool)
                tasks = { install: nope }
        
                return { action }       
            }
        }
    }

    let once = { install }

    return api(once)
}   


const bmp = { 'blocks-memoty-pool':  1234 }
const lists = ['a,b,c', 'd,e,f']
const arr = [0, 1, 2, 3]

lists.map((l) => {
    console.log()
    const created = create(l)
  
    arr.map((e) => {        
        created.install(bmp).action(e)
    })
})

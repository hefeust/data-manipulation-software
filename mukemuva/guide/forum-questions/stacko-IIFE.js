
Hi there,

Considering the following code which takes a list as argument and performs operations on an array accordingly :

    # ready to test: just copy it in a file...
    const create = (list) => {
        console.log('seting up for list', list)
ww&
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

Here, the 'install' action is triggered only once at the beginning. of the 'list' and applies only once at the very beginnning of processing the array 'arr' of numbers.
The (here, ficitve) blocks-memory-pool  data structure may have asynchronous access.

Is there a way to abstract the 'once' behavior, using IIFE ?

Could we have an endong post-installation task also with the same way ?

Regards.


// iterative cartesian product
export const iterative_cartesian_product = (options = {}) => {
    const arrays = []
    let results = []
    let counter = 0

    const check_array = (any) => {
        if (false === Array.isArray(any)) {
              throw new Error('not an array !!!')
        }
    }

    const prod_array = (some_array) => {
        const temp = []

        check_array(some_array)

        if (counter === 0) {
            temp.push(some_array) 
        } else if (counter === 1) {
            results[0].map((item) => {
                some_array.map((some_item) => {
                    temp.push([].concat(item).concat(some_item))
                })
            })

        } else {
//            temp.push(...product(results, some_array))
            results.map((arr) => {
                some_array.map((some_item) => {
                    temp.push(arr.concat(some_item))
                })
            })
        }

        results = temp
        counter++
    }

    const api = { prod_array }

    Object.defineProperty(api, 'results', {
        get: () => results
    })

    Object.defineProperty(api, 'counter', {
        get: () => counter
    })

   return api
}


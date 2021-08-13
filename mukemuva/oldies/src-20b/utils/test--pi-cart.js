
// iterative cartesian product
export const iterative_cartesian_product = (options) => {

    const arrays = []

    let results_acc = []

    let index = 0

    const check_array = (any) => {
        if (false === Array.isArray(any)) {
            throw new Error('not an array !!!')
        }
    }

    const prod_array = (some_array) => {
        check_array(some_array)
        
        if(options.debug) arrays.push(some_array)

        results_acc = some_array.map((some_item) => [some_item])
            .reduce((acc, item) => {
                return resutls_acc.map((array) => {
                    return array.concat(item)
                })
            }, results_acc)
    }

    Object.defineProperty(api, 'results', {
        get: () => results_acc
    })

    return pai    
}


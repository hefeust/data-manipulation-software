// iterative cartesian product

const product = (a1, a2) => {
    const results = []
    const s1 = Array.isArray(a1) ? 1 : 0
    const s2 = Array.isArray(a2) ? 1 : 0

    if (s1 === 1 && s2 === 1) {
        a1.map((v1) => {
            a2.map((v2) => {
                results.push(...product(v1, v2))
            })
        })
    } else if (s1 === 0 && s2 === 0) {
        results.push([a1, a2])
    } else if (s1 === 1 && s2 === 0) {
        results.push(a1.concat(a2))
    } else {
        a2.map((v2) => {
            results.concat(...product(a1, v2))
        })
    }

    return results
}

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

        if (counter === 0) {
            temp.push(some_array) 
        } else if (counter === 1) {
            temp.push(...product(results[0], some_array))
        } else {
            temp.push(...product(results, some_array))
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


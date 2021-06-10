
export const create_mwc = (a, b, r) => {

    const R2 =  (r  )
//    const xi = new Array(r)
//    const ci = new Array(r)
    const xi = new Array(R2)
    const ci = new Array(R2)


    let idx = 0

    const init = (seeds) => {
        seeds.map((s, idx) => { 
            xi[idx] = s
            ci[idx] = (a - s)
        })
    }

    const step = () => {
        const xn = (a * xi[R2 - 1] + ci[0]) % b
        const cn = Math.floor((a * xi[R2 - 1] + ci[0]) / b)

//        twist = (twist + ) % r

        xi.pop()
        ci.pop()

        xi.unshift(xn)
        ci.unshift(cn)

        return { xn, cn }
    }

    const next = () => {
        let results = []

        for(let i = 0; i < r; i++) {
            results.push(step().xn)
        }

//        console.log('results', results)

        return results
    }

    return { init, next }
}



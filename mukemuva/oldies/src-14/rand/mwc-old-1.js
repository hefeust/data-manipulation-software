
export const create_mwc = (a, b, r) => {

    const xi = new Array(r)
    const ci = new Array(r)

    let idx = 0

    const init = (seeds) => {
        seeds.map((s, idx) => { 
            xi[idx] = s  
            ci[idx] = s * (s * (s * r - 1) * r - 1) * r - 1
//            ci[idx] = Math.floor(a * s * (r - idx) / b)
//            ci[idx] = Math.floor((a * s  + (r - idx) ) / b) 
        })
    }

    const step = () => {
        const xn_1 = xi.shift()
        const cn_1 = ci.shift()
        const xn = (a * xn_1 + cn_1) % b
        const cn = Math.floor((a * xn_1 + cn_1) / b)

        xi.push(xn)
        ci.push(cn)

//        console.log(xi, ci)

        return xi        
    }

    const next = () => {
        let results = []

        for(let i = 0; i < r; i++) {
            results = step()
        }

        return results
    }

    return { init, next }
}



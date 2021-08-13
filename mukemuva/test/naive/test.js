
export const test = async (params) => {
    const results = []    
    const {
        name,
        store,
        pairs,
        NMAX,
        SAMPLING,
        PICKING
    } = params
    
    const START_T = Date.now() / 1000

    let sample = 0
    let pick = 0
    let sample_t = Date.now() / 1000
    let pick_t = 0
    let delta_t = 0

    

    for(let j = 0; j < pairs.length; j++) {
        const { bag, with_data } = pairs[j]
        const sets = await store.set(bag, with_data)

        if((j % SAMPLING) === 0)  {
            console.log('iteration: ' + j + ' / ' + NMAX + '\t' + name) 
            sample = j
            sample_t = (Date.now() / 1000) - START_T
            pick = 0
        }

        if(pick === PICKING) {
            pick_t = (Date.now() / 1000) - START_T
            delta_t = pick_t - sample_t

            results.push({ 
                sample, sample_t, delta_t
            })
        }

        pick++
    }

    return results
}


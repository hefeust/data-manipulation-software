
export const merge_results = (params, resultsets) => {
    const { NMAX, SAMPLING } = params

    console.log('resultsets', resultsets)

    for(let i = 0; i < resultsets[0].length; i ++) {
        const slow = resultsets[0][i]
        const fast = resultsets[1][i]
        const slow_sample = slow.sample
        const fast_sample = fast.sample
        const ratio = slow.delta_t / fast.delta_t
        const log10 = Math.log10(ratio)
        
        const calc = [
            i,
            slow_sample,
            slow.delta_t.toFixed( 3),
            fast_sample,    
            fast.delta_t.toFixed( 3),
            ratio.toFixed( 3),
            log10.toFixed(3)
        ].join('    ')

        console.log(calc)        
    }
}

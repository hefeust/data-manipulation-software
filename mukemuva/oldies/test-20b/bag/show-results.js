
export const show_results = (params, resultsets) => {
    const { NMAX, DIMS, SAMPLING } = params

    console.log('resultsets', resultsets)

    for(let i = 0; i < resultsets[0].length; i ++) {
        const test = resultsets[0][i]
        const calc = [
            i,
            test.sample,
            test.sample_t.toFixed(3),
            test.delta_t.toFixed(3)
        ].join('    ')

        console.log(calc)        
    }
}

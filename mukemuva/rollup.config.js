
import buble from '@rollup/plugin-buble'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'

const aliases = alias({})

const plugins = [
    aliases,
    buble({
        transforms: {
            asyncAwait: false,
            generator: false,
            forOf: false,
            dangerousForOf: false    

        },
        objectAssign: 'Object.assign    '
    }),
    commonjs({ format: 'es' }),
    resolve()    
]

export default [{
        input: 'src/index.js',
        output: {
            name: 'mukemuva', 
            file: 'dist/index.js',
            format: 'umd'
        },
        plugins
    }, 
    {
        input: 'test/bag/index.js',
        output: {
            name: 'mukemuva_bag_debug', 
            file: 'dist/bag.js',
            format: 'umd'
        },
        plugins
    },
    {
        input: 'test/naive/index.js',
        output: {
            name: 'mukemuva_naive_debug', 
            file: 'dist/naive.js',
            format: 'umd'
        },
        plugins
    }, {
        input: 'test/time-battle/index.js',
        output: {
            name: 'mukemuva_battle', 
            file: 'dist/time-battle.js',
            format: 'umd'
        },
        plugins
    }, {
        input: 'test/utils/index.js',
        output: {
            name: 'mukemuva_test_utils', 
            file: 'dist/test-utils.js',
            format: 'umd'
        },
        plugins
    }
, {
        input: 'test/exactness/index.js',
        output: {
            name: 'mukemuva_test_exactness', 
            file: 'dist/test-exactness.js',
            format: 'umd'
        },
        plugins
    }

]


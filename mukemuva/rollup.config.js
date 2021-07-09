
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
    input: 'test/bag/debug.js',
    output: {
        name: 'mukemuva_debug', 
        file: 'dist/test.js',
        format: 'umd'
    },
    plugins
},
{
    input: 'test/naive/debug.js',
    output: {
        name: 'mukemuva_debug', 
        file: 'dist/naive.js',
        format: 'umd'
    },
    plugins
}

]


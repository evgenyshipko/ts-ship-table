import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import pkg from './package.json'
import commonjs from 'rollup-plugin-commonjs'

export default {
    input: pkg.source,
    output: [
        {
            file: pkg.main,
            format: 'es',
            exports: 'named',
            sourcemap: true
        },
        {
            file: pkg.module,
            format: 'es',
            exports: 'named',
            sourcemap: true
        },
        {
            file: pkg.typings,
            format: 'es',
            sourcemap: true
        }
    ],
    plugins: [
        typescript({
        }),
        postcss(),
        commonjs({

        })
    ]
}

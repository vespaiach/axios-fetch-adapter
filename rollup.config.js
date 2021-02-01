import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

const globals = {
    globals: {
        'axios/lib/core/settle': 'settle',
        'axios/lib/core/createError': 'createError',
        'axios/lib/helpers/buildURL': 'buildURL',
        'axios/lib/core/buildFullPath': 'buildFullPath',
        'axios/lib/utils': 'utils',
    },
};

export default {
    input: 'src/index.js',
    output: [
        Object.assign(
            {},
            {
                file: 'dist/adapter.js',
                name: 'fetchAdapter',
                format: 'umd',
            },
            globals
        ),
        Object.assign(
            {},
            {
                file: 'dist/adapter.es.js',
                name: 'fetchAdapter',
                format: 'es',
            },
            globals
        ),
    ],
    external: [
        'axios/lib/core/settle',
        'axios/lib/core/createError',
        'axios/lib/core/buildFullPath',
        'axios/lib/utils',
        'axios/lib/helpers/buildURL',
    ],
    plugins: [resolve(), babel({ babelHelpers: 'bundled' })],
};

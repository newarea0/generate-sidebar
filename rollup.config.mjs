import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import shebang from 'rollup-plugin-preserve-shebang';

export default {
  input: 'src/index.ts',
  output: {
    file: 'bin/index.js',
    format: 'cjs',
  },
  plugins: [
    shebang(),
    typescript(),
    commonjs(),
    resolve({ preferBuiltins: true }),
  ],
  external: ['fs', 'path'],
}

module.exports =  (api) => {
    api.cache(true)
    const presets = [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current'
          }
        }
      ],
      '@babel/typescript',
      'const-enum'
    ]
    const plugins = [
      'const-enum',
      '@babel/proposal-class-properties',
      '@babel/proposal-object-rest-spread',
      '@babel/plugin-transform-reserved-words',
      [
        'module-resolver',
        {
          root: [
            './'
          ],
          alias: {
            '!': './test',
            '~': './src',
            '~api': './src/api',
            '~storage': './src/storage'

          }
        }
      ]
    ]
    const sourceMaps = 'inline'
    return {
      presets,
      plugins,
      sourceMaps
    }
  }
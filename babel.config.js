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
            '~google-api': './src/google-api',
            '~aws': './src/aws',
            '~utils': './src/utils',
            '~config': './src/config'
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
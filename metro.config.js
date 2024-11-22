const {getDefaultConfig} = require('@react-native/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  
  config.resolver.sourceExts = [
    'jsx',
    'js',
    'json',
    'ts',
    'tsx'
  ];

  const { assetExts } = config.resolver;
  
  return {
    ...config,
    resolver: {
      ...config.resolver,
      assetExts: [...assetExts, 'png', 'jpg', 'jpeg']
    }
  };
})();
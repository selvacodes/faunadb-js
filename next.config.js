module.exports = {
  webpack(config, options) {
    // Enable tree shaking.
    // https://github.com/gcanti/fp-ts/issues/1044#issue-536939300
    config.resolve.alias['fp-ts/lib'] = 'fp-ts/es6';
    config.resolve.alias['io-ts/lib'] = 'io-ts/es6';
    config.resolve.alias['io-ts-types/lib'] = 'io-ts-types/es6';
    config.resolve.alias['monocle-ts/lib'] = 'monocle-ts/es6';
    config.resolve.alias['newtype-ts/lib'] = 'newtype-ts/es6';
    return config;
  },
};

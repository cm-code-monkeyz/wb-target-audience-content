module.exports = function (api) {
  api.cache(true);
  const presets = [
    [
      '@babel/preset-env',
      {
        corejs: "3",
        useBuiltIns: 'entry',
        loose: true,
      }
    ]
  ];
  const plugins= [
      ["@babel/plugin-transform-runtime", {
          "corejs": false,
          "helpers": false,
          "regenerator": true,
          "useESModules": false
      }]
  ];
  return {
    presets,
    plugins
  }
}
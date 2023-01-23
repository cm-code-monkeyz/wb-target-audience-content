module.exports = {
    plugins: {
      "postcss-import": {},
      "postcss-preset-env": {
        "autoprefixer": {
          grid: true
        },
      },
      "cssnano": {
        'cssnano': {
          zindex: false
        }
      }
    }
}
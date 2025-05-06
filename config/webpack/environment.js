const { environment } = require('@rails/webpacker')
const webpack = require('webpack')

// Remove the problematic node configuration
environment.config.delete('node.dgram')
environment.config.delete('node.fs')
environment.config.delete('node.net')
environment.config.delete('node.tls')
environment.config.delete('node.child_process')

// Set proper node configuration
environment.config.set('node', {
  __dirname: true,
  __filename: true
})

// Add Bootstrap
environment.plugins.prepend('Provide',
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    Popper: ['popper.js', 'default']
  })
)

// Configure PostCSS
const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  }
}

// Add PostCSS loader to the CSS loader
const cssLoader = environment.loaders.get('css')
cssLoader.use.push(postcssLoader)

module.exports = environment

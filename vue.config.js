const port = process.env.port || process.env.npm_config_port || 8080;

module.exports = {
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: "http://127.0.0.1:7001"
  }
}
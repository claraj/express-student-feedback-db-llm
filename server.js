// import the configured web application 
const app = require('./app')

// Azure will set process.env.PORT, otherwise use 3000
const port = process.env.PORT || 3000

// Start server running
let server = app.listen(port, function() {
    console.log('Express server running on port', port)
})


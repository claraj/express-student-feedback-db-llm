const app = require('./app')

// Start server running 
const port = process.env.PORT || 3000

let server = app.listen(port, function() {
    console.log('Express server running on port', port)
})


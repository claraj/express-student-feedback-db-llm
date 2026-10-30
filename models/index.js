const { Sequelize } = require('sequelize')

const config = require('./config.json')

const env = process.env.NODE_ENV || 'development'

const configuration = config[env]


// // How to connect to the database, what type of database 
// const configuration = {
//     'storage': 'feedback.sqlite',
//     'dialect': 'sqlite'
// }

const password = process.env.POSTGRES_PW
configuration.password = password

console.log('node env', process.env.NODE_ENV, process.env.POSTGRES_PW, 'config', configuration)

// New Sequelize object 
const sequelizeDatabase = new Sequelize(configuration)

// Get the feedback model and call the function to create it, for this database 
const createFeedbackModel = require('./feedback')
const feedbackModel = createFeedbackModel(sequelizeDatabase)

const models = {}
// An app could have several models, add them to an object, using their name as the property 
models[feedbackModel.name] = feedbackModel //  { 'Feedback': object with the feedback model info}

module.exports = models 
const { Sequelize } = require('sequelize')

const config = require('./config')

const env = process.env.NODE_ENV || 'development'

const configuration = config[env]

console.log(configuration)
// New Sequelize object 
const sequelizeDatabase = new Sequelize(configuration)

// Get the feedback model and call the function to create it, for this database 
const createFeedbackModel = require('./feedback')
const feedbackModel = createFeedbackModel(sequelizeDatabase)

const models = {}
// An app could have several models, add them to an object, using their name as the property 
models[feedbackModel.name] = feedbackModel //  { 'Feedback': object with the feedback model info}

module.exports = models 
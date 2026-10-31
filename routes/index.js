const express = require('express')
const router = express.Router()
const identifyDepartments = require('../services/message_sorter')
const databaseModels = require('../models')
const Feedback = databaseModels.Feedback


router.get('/', function(req, res, next) {
    res.render('index', {title: 'Feedback app', author: 'Clara'})
})

router.get('/feedback-form', function(req, res, next){
    res.render('student_feedback_form')
})

router.post('/submit-feedback', async function(req, res, next){
    // get the form data
    const formData = req.body

    if (!req.body) {
        return next('No feedback form')
    }

    const comments = req.body.comments
    let newFeedback
    let departmentList

    try {     
        newFeedback = await Feedback.create(formData)  // Save the data in the form to the database 
        res.render('thank_you', { ...formData })  // if saved, return response to use, continue to process data 
    }

    catch (error) {  // Error saving, notify user.
        console.error(`Failed saving feedback to database because ${error}`, formData)  // for developers 
        res.locals.message = 'Error saving feedback. Please try again later'
        return next()  // for users. End response, don't try to categorize message if it can't be saved 
    }

    try {
        console.log('Making LLM request for comments', comments)
        departmentList = await identifyDepartments(comments)
        if (departmentList.length == 0) {
            departmentList = ['General College Feedback']
        }
        console.log(departmentList)
        
    } catch (error) { 
        console.error(`Failed LLM identification of departments for comments "${comments}" because ${error}`)  // for developers 
        return  // End response processing function, don't procede to saving in database. We already sent a response to the user
    }

    try {    
        // update the database with the feedback departments identified 
        console.log('Updating database with departments', departmentList)
        await Feedback.update( {departments: departmentList}, {where: {id: newFeedback.id}})

    } catch (error) { 
        console.error(`Failed saving departments for feedback ID "${newFeedback.id}" because ${error}`)  // for developers 
    }
})

module.exports = router







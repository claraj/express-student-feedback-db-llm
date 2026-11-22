const request = require('supertest')
const Feedback = require('../models').Feedback
const app = require('../app')

// Replace the LLM calls with a mock function, to avoid excessive use.
//  And, we don't know for sure what they will return so we can't test them 
//  by expecting a particular return value 
jest.mock('../services/message_sorter', () => {
    return jest.fn().mockResolvedValue(['Mock Department'])
})

describe('Home page request', () => {
    it('should return the home page with the developer name', async () => {
        const response = await request(app).get('/')
        expect(response.statusCode).toBe(200)
        expect(response.text).toContain('Clara') // use your name 
    })

    it('should return a message about Azure', async () => {
        const response = await request(app).get('/')
        expect(response.statusCode).toBe(200)
        expect(response.text).toContain('Azure') // typo! Test fails
    })
})

describe('Post feedback form', () => {

    beforeEach( async () => {  // Clear database 
        await Feedback.destroy({ truncate: true })
    })

    it('should store posted feedback in the database', async () => {
        const exampleFeedback = {'name': 'test name', 'email': 'example@email.com', 'comments': 'testing', 'isCurrentStudent': 'no'}
        const urlEncodedData = new URLSearchParams(exampleFeedback).toString()

        const response = await request(app).post('/submit-feedback').send(urlEncodedData)
        expect(response.statusCode).toBe(200)
        expect(response.text).toContain('Thank you')

        const feedbacksInDatabase = await Feedback.count() 
        expect(feedbacksInDatabase).toBe(1)  // toBe for strings, ints, is this the exact same object 
        const firstFeedback = await Feedback.findOne()
        expect(firstFeedback.name).toBe('test name')  // could check individual fields ... 
        expect(firstFeedback).toMatchObject(exampleFeedback)   // or check against the original object 

        expect(firstFeedback.departments).toEqual(['Mock Department'])  // Did the mock work? toEqual for objects, arrays
    })

    
    it('should reject feedback with no comments', async () => {
        const exampleFeedback = {'name': 'test name', 'email': 'example@email.com', 'comments': '', 'isCurrentStudent': 'no'}
        const urlEncodedData = new URLSearchParams(exampleFeedback).toString()

        const response = await request(app).post('/submit-feedback').send(urlEncodedData)
        // it would be more appropriate to return a 400 bad request vs. 500 server error
        // We'd have to create a new error handler, and real-world app would implement this 
        expect(response.statusCode).toBe(500)   
        expect(response.text).toContain('Error saving feedback. Please try again later')

        const feedbacksInDatabase = await Feedback.count() 
        expect(feedbacksInDatabase).toBe(0)  // nothing added to the database
        
    })
})



describe('admin page', () => {

    beforeEach( async () => {  // Clear database 
        await Feedback.destroy({ truncate: true })
    })

    it('should display all feedback', async () => {
        // Create two example feedbacks
        // The way departments are displayed is messy so we should revise this, and then complete this test. 
        const exampleA = {name: 'A Student', email: 'a@college.com', comments: 'how do I make an appointment', isCurrentStudent: 'yes'} 
        const exampleB = {name: 'B Student', email: 'b@college.com', comments: 'elevators are slow', isCurrentStudent: 'no'}
        Feedback.create(exampleA)
        Feedback.create(exampleB)

        const response = await request(app).get('/admin')

        Object.values(exampleA).forEach( value => {
                expect(response.text).toContain(value)
        })

        Object.values(exampleA).forEach( value => {
            expect(response.text).toContain(value)
        })

        expect(response.text).toContain('A Student')
        expect(response.text).toContain('B Student')
    })

})









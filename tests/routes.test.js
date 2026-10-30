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
        const res = await request(app).get('/')
        expect(res.statusCode).toBe(200)
        expect(res.text).toContain('Clara') // use your name 
    })

    it('should return a message about Azure', async () => {
        const res = await request(app).get('/')
        expect(res.statusCode).toBe(200)
        expect(res.text).toContain('Azure') // typo! Test fails
    })
})

describe('Post feedback form', () => {

    beforeEach( async () => {  // Clear database 
        await Feedback.destroy({ truncate: true })
    })

    it('should store posted feedback in the database', async () => {
        const exampleFeedback = {'name': 'test name', 'email': 'example@email.com', 'comments': 'testing', 'isCurrentStudent': 'no'}
        const urlEncodedData = new URLSearchParams(exampleFeedback).toString()

        const res = await request(app).post('/submit-feedback').send(urlEncodedData)
        expect(res.statusCode).toBe(200)
        expect(res.text).toContain('Thank you')

        const feedbacksInDatabase = await Feedback.count() 
        expect(feedbacksInDatabase).toBe(1)  // toBe for strings, ints, is this the exact same object 
        const firstFeedback = await Feedback.findOne()
        expect(firstFeedback.name).toBe('test name')  // could check individual fields ... 
        expect(firstFeedback).toMatchObject(exampleFeedback)   // or check against the original object 

        expect(firstFeedback.departments).toEqual(['Mock Department'])  // Did the mock work? toEqual for objects, arrays
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
        const exampleB = {name: 'B Student', email: 'b@college.com', comments: '', isCurrentStudent: 'no'}
        Feedback.create(exampleA)
        Feedback.create(exampleB)

        const res = await request(app).get('/admin')

        Object.values(exampleA).forEach( value => {
                expect(res.text).toContain(value)
        })

        Object.values(exampleA).forEach( value => {
            expect(res.text).toContain(value)
        })

        expect(res.text).toContain('A Student')
        expect(res.text).toContain('B Student')
    })


})
const { GoogleGenAI, Type } = require('@google/genai')
const departments = require('./departments.json')
const departmentsString = JSON.stringify(departments) 
const config = require('./config')

const genAI = new GoogleGenAI( {GEMINI_API_KEY: config.GEMINI_API_KEY} )

module.exports = (feedbackComments) => {

    // ask LLM to return a array of matching departments for feedbackComments 

    const prompt = `${config.promptInstruction}
    Feedback comments: ${feedbackComments} 
    Department choices: ${departmentsString}`

    return genAI.models.generateContent({
        model: config.model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: { 
                    type: Type.STRING
                }
            }
        }
    }).then( response => {
        return JSON.parse(response.text)
    })

}

// sorter('how to make appointment with advisor??').then( response => console.log(response))
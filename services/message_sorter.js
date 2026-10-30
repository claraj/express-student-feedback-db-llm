let { GoogleGenAI, Type } = require("@google/genai")
let departments = require("./departments.json")
let config = require('./config.json')

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const genAI = new GoogleGenAI( {GEMINI_API_KEY: GEMINI_API_KEY} );

async function selectDepartments(message) {

    const departmentString = JSON.stringify(departments) 

    const prompt = `${config.instructions}
    message: ${message}
    department choices: ${departmentString}`

    const response = await genAI.models.generateContent({
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
    })

    const departmentList = await JSON.parse(response.text)
    console.log(departmentList)
    return departmentList
}

module.exports = selectDepartments
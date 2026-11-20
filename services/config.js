module.exports = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    model: 'gemini-3.1-flash-lite',
    promptInstruction: `Return a list of the most likely college department or departments 
    to handle these feedback comments. A list of possible departments and a description 
    of their services is included. 
    Only include departments that seem to be a good fit for the feedback comments.
    If there does not seem to be a good match, return an empty list.`
}
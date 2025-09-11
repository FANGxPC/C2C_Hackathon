import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function eduChat(messages: Array<{role: string, content: string}>) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    
    const systemPrompt = `You are Edu AI Assistant, a helpful educational companion for computer science students. 
    You provide concise, accurate answers aligned with standard CS curriculum. 
    Always cite relevant topics and suggest 2 follow-up questions to deepen understanding.
    Keep responses focused and practical for exam preparation and concept mastery.`

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        {
          role: 'model', 
          parts: [{ text: 'I understand. I\'ll help you with computer science topics, providing clear explanations and suggesting follow-up questions.' }]
        }
      ]
    })

    const lastMessage = messages[messages.length - 1]
    const result = await chat.sendMessage(lastMessage.content)
    
    return result.response.text()
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('Failed to generate AI response')
  }
}

export async function reviewResume(resumeText: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    
    const prompt = `As an expert technical recruiter, review this resume and provide:
    1. Overall rating (1-10)
    2. Top 3 strengths
    3. Top 5 specific improvements
    4. Missing ATS keywords for software engineering roles
    
    Resume text:
    ${resumeText}
    
    Respond in JSON format:
    {
      "rating": number,
      "strengths": ["strength1", "strength2", "strength3"],
      "improvements": ["improvement1", "improvement2", "improvement3", "improvement4", "improvement5"],
      "keywordGaps": ["keyword1", "keyword2", "keyword3"]
    }`

    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Invalid response format')
  } catch (error) {
    console.error('Resume review error:', error)
    throw new Error('Failed to review resume')
  }
}

export async function reviewMockInterview(answers: Array<{question: string, answer: string}>) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    
    const answersText = answers.map((a, i) => 
      `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`
    ).join('\n\n')

    const prompt = `Review this mock interview performance and provide:
    1. Overall rating (1-10)
    2. Individual question ratings (1-10 each)
    3. Brief feedback for each answer
    4. Top 3 overall improvement tips
    
    Interview Q&A:
    ${answersText}
    
    Respond in JSON format:
    {
      "overallRating": number,
      "questionRatings": [number, number, number, number, number],
      "questionFeedback": ["feedback1", "feedback2", "feedback3", "feedback4", "feedback5"],
      "improvementTips": ["tip1", "tip2", "tip3"]
    }`

    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Invalid response format')
  } catch (error) {
    console.error('Mock interview review error:', error)
    throw new Error('Failed to review mock interview')
  }
}
export async function summarizePDF(text: string) {
  try {
    const response = await fetch(`https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID}/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: {
          prompt: `Summarize this PDF content into the following structured format:

TL;DR: (2-3 sentences)

Key Points: (5-7 bullet points)

Action Items: (3-5 actionable takeaways)

Quiz Questions: (5 multiple choice questions with answers)

Content to summarize:
${text.slice(0, 8000)}` // Limit to avoid token limits
        }
      })
    })

    if (!response.ok) {
      throw new Error(`RunPod API error: ${response.status}`)
    }

    const result = await response.json()
    
    // If it's a sync response, return immediately
    if (result.output) {
      return parseRunPodResponse(result.output)
    }

    // If async, poll for completion
    if (result.id) {
      return await pollRunPodJob(result.id)
    }

    throw new Error('Unexpected RunPod response format')
  } catch (error) {
    console.error('RunPod summarization error:', error)
    throw new Error('Failed to summarize PDF')
  }
}

async function pollRunPodJob(jobId: string, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`https://api.runpod.ai/v2/${process.env.RUNPOD_ENDPOINT_ID}/status/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.RUNPOD_API_KEY}`
        }
      })

      const result = await response.json()
      
      if (result.status === 'COMPLETED' && result.output) {
        return parseRunPodResponse(result.output)
      }
      
      if (result.status === 'FAILED') {
        throw new Error('RunPod job failed')
      }

      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.error(`Polling attempt ${i + 1} failed:`, error)
    }
  }
  
  throw new Error('RunPod job timeout')
}

function parseRunPodResponse(output: string) {
  // Parse the structured response
  const sections = {
    tldr: '',
    keyPoints: [] as string[],
    actionItems: [] as string[],
    quizQuestions: [] as string[]
  }

  try {
    // Simple parsing - in production, you might want more robust parsing
    const lines = output.split('\n')
    let currentSection = ''
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.toLowerCase().includes('tl;dr')) {
        currentSection = 'tldr'
      } else if (trimmed.toLowerCase().includes('key points')) {
        currentSection = 'keyPoints'
      } else if (trimmed.toLowerCase().includes('action items')) {
        currentSection = 'actionItems'
      } else if (trimmed.toLowerCase().includes('quiz questions')) {
        currentSection = 'quizQuestions'
      } else if (trimmed && currentSection) {
        if (currentSection === 'tldr') {
          sections.tldr += trimmed + ' '
        } else if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.match(/^\d+\./)) {
          const cleanLine = trimmed.replace(/^[-•\d.]\s*/, '')
          sections[currentSection as keyof typeof sections].push(cleanLine)
        }
      }
    }

    return sections
  } catch (error) {
    console.error('Error parsing RunPod response:', error)
    return {
      tldr: output.slice(0, 200) + '...',
      keyPoints: ['Summary processing completed'],
      actionItems: ['Review the generated summary'],
      quizQuestions: ['What was the main topic of this document?']
    }
  }
}
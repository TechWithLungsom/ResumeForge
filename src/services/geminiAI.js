/**
 * geminiAI.js — ResumeForge AI
 * Updated: April 2026 for Gemini 3.1 Flash-Lite
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL   = 'gemini-3.1-flash-lite-preview';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

/**
 * Safely extracts / parses the first JSON object found in a string.
 */
function extractJSON(text) {
  const stripped = text.replace(/```json|```/g, '').trim();
  const start = stripped.indexOf('{');
  const end   = stripped.lastIndexOf('}');
  
  if (start === -1 || end === -1) {
    console.error("Failed to find JSON. Raw response:", text);
    throw new Error('No JSON found in AI response.');
  }

  return JSON.parse(stripped.slice(start, end + 1));
}

/**
 * Calls the Gemini API with a prompt and built-in retry logic.
 */
async function callGemini(prompt, isJsonResponse = false, retryCount = 0) {
  if (!API_KEY) {
    throw new Error('Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file.');
  }

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.1, // Lowered for stricter JSON compliance
      topP: 0.95,
      maxOutputTokens: 2048,
      ...(isJsonResponse && { response_mime_type: "application/json" })
    },
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      if ((res.status === 503 || res.status === 429) && retryCount < 3) {
        const waitTime = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return callGemini(prompt, isJsonResponse, retryCount + 1);
      }
      throw new Error(data?.error?.message || `Gemini API error ${res.status}`);
    }

    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  } catch (error) {
    if (retryCount < 1) return callGemini(prompt, isJsonResponse, retryCount + 1);
    throw error;
  }
}

// ─────────────────────────────────────────────
// 1.  FULL RESUME ATS AUDIT
// ─────────────────────────────────────────────
export async function analyzeResumeATS(resumeData) {
  const resumeText = JSON.stringify(resumeData);

  const prompt = `
    Analyze this resume JSON for ATS compliance. 
    Return ONLY valid JSON with this exact structure:
    {
      "overallScore": 85,
      "grade": "A",
      "scoreBreakdown": { 
        "contact": {"score":90,"max":100}, 
        "summary": {"score":80,"max":100}, 
        "experience": {"score":75,"max":100}, 
        "education": {"score":100,"max":100}, 
        "skills": {"score":85,"max":100}, 
        "formatting": {"score":90,"max":100} 
      },
      "strengths": ["Strong technical stack", "Quantified achievements"], 
      "criticalIssues": ["Missing LinkedIn URL"], 
      "recommendations": [{"category":"Experience", "priority":"high", "issue":"Weak verbs", "fix":"Use action verbs like Led, Developed"}],
      "missingElements": ["Portfolio link"], 
      "keywordsFoundInResume": ["React", "Node.js"], 
      "suggestedKeywords": ["Docker", "AWS"]
    }
    RESUME DATA: ${resumeText}
  `;

  const raw = await callGemini(prompt, true);
  return extractJSON(raw);
}

// ─────────────────────────────────────────────
// 2.  JOB DESCRIPTION MATCH ANALYSIS
// ─────────────────────────────────────────────
export async function analyzeJobMatch(resumeData, jobDescription) {
  const resumeText = JSON.stringify(resumeData);

  const prompt = `
    Compare the resume to the Job Description (JD). 
    Return ONLY valid JSON with this exact structure for the UI to render:
    {
      "matchScore": 75,
      "matchGrade": "B+",
      "roleAlignment": {
        "title": "Software Engineer",
        "fitSummary": "Your experience with MERN stack aligns well with the core requirements."
      },
      "matchedKeywords": ["React", "JavaScript"],
      "missingKeywords": ["Kubernetes", "TypeScript"],
      "partialMatches": ["Backend Development"],
      "strengthsForRole": ["3 years of React experience"],
      "gapAnalysis": [
        {
          "gap": "Cloud Infrastructure",
          "importance": "important",
          "suggestion": "Highlight any AWS or Azure projects."
        }
      ],
      "tailoringAdvice": ["Move your 'Skills' section to the top."]
    }

    RESUME: ${resumeText}
    JD: ${jobDescription}
  `;

  const raw = await callGemini(prompt, true);
  return extractJSON(raw);
}

// ─────────────────────────────────────────────
// 3.  AI SUMMARY GENERATOR
// ─────────────────────────────────────────────
export async function generateSummary(resumeData) {
  const prompt = `Write a professional 2-sentence resume summary for this data: ${JSON.stringify(resumeData)}. Use first person. Return ONLY the text.`;
  return (await callGemini(prompt, false)).trim();
}

// ─────────────────────────────────────────────
// 4.  AI BULLET POINT IMPROVER
// ─────────────────────────────────────────────
export async function improveBullet(bullet, jobTitle, company) {
  const prompt = `Improve this resume bullet point using metrics and action verbs: "${bullet}" for a ${jobTitle} role at ${company}. Return ONLY the text.`;
  return (await callGemini(prompt, false)).trim();
}
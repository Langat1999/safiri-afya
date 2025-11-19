import { config } from '../config/env.js';

const systemPrompt = `You are a medical assistant AI.
Task: Assess the user's symptoms and classify risk as Low, Medium, or High.
Provide simple, safe home-care tips, and advise when to see a healthcare professional.
Respond in English or Swahili depending on user input.
Always include: "This is not a substitute for professional medical care."

Format your response as JSON with the following structure:
{
  "urgency": "low" | "medium" | "high",
  "condition": "Brief description of likely condition",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}`;

export async function analyzeWithAI(symptoms, ageRange, gender) {
  if (!config.openRouterApiKey || config.openRouterApiKey === 'your-openrouter-api-key-here') {
    throw new Error('OpenRouter API key not configured');
  }

  const userMessage = `Patient Information:
Age Range: ${ageRange || 'not specified'}
Gender: ${gender || 'not specified'}

Symptoms: ${symptoms}

Please analyze these symptoms and provide a risk assessment in JSON format.`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.openRouterApiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://safiri-afya.com',
      'X-Title': 'Safiri Afya Health App',
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;

  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
    if (parsed.urgency) {
      parsed.urgency = parsed.urgency.toLowerCase();
    }
    return parsed;
  } catch (error) {
    const urgencyMatch = aiResponse.toLowerCase().match(/\b(low|medium|high)\s*(risk|urgency|priority)?/i);
    const fallbackUrgency = urgencyMatch ? urgencyMatch[1].toLowerCase() : 'medium';
    return {
      urgency: fallbackUrgency,
      condition: 'Based on your symptoms',
      recommendations: [
        'Consult a healthcare professional for proper diagnosis',
        'Monitor your symptoms closely',
        'Seek medical attention if symptoms worsen'
      ]
    };
  }
}

export function keywordBasedAnalysis(symptoms, ageRange) {
  let urgency = 'low';
  let condition = 'Common Cold or Minor Illness';
  let recommendations = [];

  const symptomsLower = symptoms.toLowerCase();
  const isVulnerable = ageRange === '0-12' || ageRange === '65+';
  const isInfant = ageRange === '0-12';
  const isElderly = ageRange === '65+';

  const emergencySymptoms = [
    { en: ['chest pain', 'crushing chest'], sw: ['maumivu ya kifua', 'kifua kinaumwa sana'] },
    { en: ['difficulty breathing', 'can\'t breathe', 'shortness of breath'], sw: ['shida ya kupumua', 'kupumua vigumu'] },
    { en: ['severe bleeding', 'heavy bleeding'], sw: ['damu nyingi', 'kutoka damu kwingi'] },
    { en: ['unconscious', 'passed out', 'fainting'], sw: ['kuzimia', 'kuzirai'] },
    { en: ['stroke', 'facial drooping', 'arm weakness', 'speech difficulty'], sw: ['kiharusi', 'uso kulegea'] },
    { en: ['severe headache', 'worst headache'], sw: ['maumivu makali ya kichwa'] },
    { en: ['confusion', 'disoriented', 'not making sense'], sw: ['kuchanganyikiwa', 'kukosa fahamu'] },
    { en: ['seizure', 'convulsions'], sw: ['kifafa', 'degedege'] },
    { en: ['severe abdominal pain'], sw: ['maumivu makali ya tumbo'] },
    { en: ['coughing blood', 'vomiting blood'], sw: ['kutapika damu', 'kikohozi cha damu'] },
  ];

  for (const symptomGroup of emergencySymptoms) {
    const allSymptoms = [...symptomGroup.en, ...symptomGroup.sw];
    if (allSymptoms.some(s => symptomsLower.includes(s))) {
      urgency = 'high';
      condition = 'Medical Emergency - Immediate Attention Required';
      recommendations = [
        'Call emergency services immediately (999 or 112 in Kenya)',
        'Do NOT drive yourself - wait for ambulance or get emergency transport',
        'Stay calm and sit or lie down in a comfortable position',
        'Do not take any medication unless advised by emergency services',
        'Have someone stay with you while waiting for help'
      ];
      return { urgency, condition, recommendations };
    }
  }

  const mediumUrgencySymptoms = [
    { en: ['high fever', 'fever above 39', 'fever over 102'], sw: ['homa kali', 'homa ya juu'] },
    { en: ['persistent vomiting', 'can\'t keep food down'], sw: ['kutapika mara kwa mara', 'kutapika sana'] },
    { en: ['severe diarrhea', 'bloody diarrhea', 'frequent diarrhea'], sw: ['kuharisha sana', 'kuhara damu'] },
    { en: ['dehydration', 'very thirsty', 'dry mouth', 'dark urine'], sw: ['ukame wa mwili', 'mkavu'] },
    { en: ['persistent pain', 'severe pain'], sw: ['maumivu ya muda mrefu', 'maumivu makali'] },
    { en: ['rash with fever', 'spreading rash'], sw: ['upele na homa'] },
    { en: ['stiff neck', 'neck pain with fever'], sw: ['shingo ngumu'] },
    { en: ['difficulty swallowing'], sw: ['shida ya kumeza'] },
    { en: ['persistent cough', 'cough for weeks'], sw: ['kikohozi cha muda mrefu'] },
    { en: ['sudden weight loss'], sw: ['kupungua uzito ghafla'] },
  ];

  for (const symptomGroup of mediumUrgencySymptoms) {
    const allSymptoms = [...symptomGroup.en, ...symptomGroup.sw];
    if (allSymptoms.some(s => symptomsLower.includes(s))) {
      urgency = 'medium';
      condition = 'Condition Requiring Medical Attention';
      recommendations = [
        'Schedule a doctor\'s appointment within 24-48 hours',
        'Keep track of your symptoms (write them down with times)',
        'Stay well hydrated - drink clean water regularly',
        'Rest and avoid strenuous activities',
        'Monitor temperature if you have fever'
      ];

      if (isVulnerable) {
        urgency = 'high';
        condition = isInfant ? 'Infant/Child - Requires Immediate Medical Care' : 'Elderly Patient - Requires Prompt Medical Care';
        recommendations = [
          'Seek medical care immediately - vulnerable age group',
          'Go to the nearest clinic or hospital today',
          'Do not delay treatment',
          'Bring a list of all current medications',
          'Have someone accompany you if possible'
        ];
      }

      return { urgency, condition, recommendations };
    }
  }

  const mildSymptoms = [
    { en: ['headache', 'head hurts'], sw: ['maumivu ya kichwa', 'kichwa kinaumwa'] },
    { en: ['mild fever', 'low fever', 'slight fever'], sw: ['homa kidogo', 'joto kidogo'] },
    { en: ['cough', 'dry cough'], sw: ['kikohozi'] },
    { en: ['runny nose', 'stuffy nose', 'congestion'], sw: ['pua inzambia', 'pua imeziba'] },
    { en: ['sore throat', 'throat hurts'], sw: ['koo inaumwa', 'maumivu ya koo'] },
    { en: ['body aches', 'muscle pain'], sw: ['maumivu ya mwili', 'misuli inaumwa'] },
    { en: ['fatigue', 'tired', 'weak'], sw: ['uchovu', 'udhaifu'] },
    { en: ['sneezing'], sw: ['kupiga chafya'] },
    { en: ['mild nausea'], sw: ['kichefuchefu kidogo'] },
  ];

  for (const symptomGroup of mildSymptoms) {
    const allSymptoms = [...symptomGroup.en, ...symptomGroup.sw];
    if (allSymptoms.some(s => symptomsLower.includes(s))) {
      urgency = 'low';
      condition = 'Common Cold, Flu, or Minor Illness';
      recommendations = [
        'Rest at home and get plenty of sleep',
        'Drink lots of fluids - water, herbal tea, or warm lemon water',
        'Use over-the-counter pain relievers if needed (paracetamol/ibuprofen)',
        'Stay home to avoid spreading illness to others',
        'Gargle with warm salt water for sore throat',
        'See a doctor if symptoms persist beyond 7 days or worsen'
      ];
      return { urgency, condition, recommendations };
    }
  }

  return {
    urgency: 'low',
    condition: 'General Health Concern',
    recommendations: [
      'Monitor your symptoms over the next 24-48 hours',
      'Stay hydrated and get adequate rest',
      'Consult a healthcare provider if symptoms persist or worsen',
      'Keep a symptom diary noting when symptoms occur and their severity',
      'Seek medical attention if you develop concerning symptoms'
    ]
  };
}


const { findBestMatches } = require('../services/aiMatching.service');
const BloodRequest = require('../models/BloodRequest');
const { sendSuccess, sendError } = require('../utils/helpers');
/**
 * Perform manual AI match computation for a request
 */
const matchDonors = async (req, res, next) => {
  try {
    const { requestId, bloodGroup, city, latitude, longitude, topN = 10, radiusKm = 20 } = req.body;

    let requestData;

    // Resolve request by ID or mock request from body parameters
    if (requestId) {
      requestData = await BloodRequest.findById(requestId);
      if (!requestData) {
        return sendError(res, 'Blood request not found', 404);
      }
    } else {
      if (!bloodGroup || !city) {
        return sendError(res, 'Blood group and city are required for custom simulation', 400);
      }
      const coordinates = latitude && longitude ? [parseFloat(longitude), parseFloat(latitude)] : [0, 0];
      requestData = {
        bloodGroup,
        city,
        location: { type: 'Point', coordinates }
      };
    }

    const matchingOptions = {
      topN: parseInt(topN),
      radiusKm: parseFloat(radiusKm)
    };

    const results = await findBestMatches(requestData, matchingOptions);
    return sendSuccess(res, results, 'AI donor matching query executed successfully');
  } catch (err) {
    next(err);
  }
};

const chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return sendError(res, 'Message is required', 400);
    }
    
    if (!process.env.OPENROUTER_API_KEY) {
      return sendError(res, 'OpenRouter API key is not configured', 500);
    }
    
    const systemPrompt = `You are "BloodBridge AI", a helpful, empathetic, and highly human-like assistant for the BloodBridge emergency blood donation platform.
Your job is to assist users with finding blood donors, checking hospital availability, tracking requests, and providing information about blood donation.
You should ALWAYS reply natively in the language the user speaks to you in (e.g., if they speak in Hinglish/Hindi, reply in natural Hinglish/Hindi. If they speak Gujarati, reply in Gujarati).
Keep your responses relatively short, conversational, and very friendly. Use emojis where appropriate. Do not sound like a robot.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemma-4-26b-a4b-it:free",
        "messages": [
          { "role": "system", "content": systemPrompt },
          { "role": "user", "content": message }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API Error:', errorData);
      return sendError(res, 'Failed to connect to AI (OpenRouter)', response.status);
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content;
    
    // Determine type for UI styling (basic heuristic)
    let type = 'info';
    const lowerResp = responseText.toLowerCase();
    if (lowerResp.includes('urgent') || lowerResp.includes('emergency') || lowerResp.includes('critical')) {
      type = 'emergency';
    } else if (lowerResp.includes('donor') || lowerResp.includes('hospital') || lowerResp.includes('found')) {
      type = 'result';
    } else if (lowerResp.includes('track') || lowerResp.includes('progress')) {
      type = 'track';
    }

    return sendSuccess(res, { text: responseText, type }, 'Chat successful');
  } catch (err) {
    console.error('AI Error:', err);
    return sendError(res, 'Failed to connect to AI', 500);
  }
};

module.exports = {
  matchDonors,
  chatWithAI
};

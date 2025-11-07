// Utility to extract user information from chatbot messages

export function extractUserInfo(message) {
  const extracted = {};
  const lowerMessage = message.toLowerCase();

  // Extract age
  const agePatterns = [
    /(?:^|\s)(?:i\s+am|i'm|my\s+age\s+is|age\s+is|i\s+am\s+)(\d+)(?:\s|$|years?|yrs?)/i,
    /(\d+)(?:\s+)?(?:years?\s+old|yrs?\s+old)/i,
  ];
  for (const pattern of agePatterns) {
    const match = message.match(pattern);
    if (match) {
      extracted.age = parseInt(match[1]);
      break;
    }
  }

  // Extract weight
  const weightPatterns = [
    /(?:^|\s)(?:i\s+weigh|my\s+weight\s+is|weight\s+is|i\s+am\s+)(\d+(?:\.\d+)?)(?:\s|$|kg|kgs|kilograms?|pounds?|lbs?)/i,
    /(\d+(?:\.\d+)?)(?:\s+)?(?:kg|kgs|kilograms?|pounds?|lbs?)(?:\s|$)/i,
  ];
  for (const pattern of weightPatterns) {
    const match = message.match(pattern);
    if (match) {
      extracted.weight = parseFloat(match[1]);
      // Convert pounds to kg if needed
      if (lowerMessage.includes('pound') || lowerMessage.includes('lb')) {
        extracted.weight = (extracted.weight * 0.453592).toFixed(1);
      }
      break;
    }
  }

  // Extract height
  const heightPatterns = [
    /(?:^|\s)(?:i\s+am|my\s+height\s+is|height\s+is|i'm\s+)(\d+(?:\.\d+)?)(?:\s|$|cm|centimeters?|feet|ft|inches?|in)/i,
    /(\d+(?:\.\d+)?)(?:\s+)?(?:cm|centimeters?|feet|ft|inches?|in)(?:\s|$)/i,
  ];
  for (const pattern of heightPatterns) {
    const match = message.match(pattern);
    if (match) {
      let height = parseFloat(match[1]);
      // Convert feet/inches to cm if needed
      if (lowerMessage.includes('feet') || lowerMessage.includes('ft')) {
        const inchesMatch = message.match(/(\d+)(?:\s+)?(?:inches?|in)/i);
        const inches = inchesMatch ? parseFloat(inchesMatch[1]) : 0;
        height = (height * 30.48) + (inches * 2.54);
      } else if (lowerMessage.includes('inch') || lowerMessage.includes('in')) {
        height = height * 2.54;
      }
      extracted.height = Math.round(height);
      break;
    }
  }

  // Extract gender
  if (/(?:^|\s)(?:i\s+am\s+a|i'm\s+a|i\s+am|i'm|my\s+gender\s+is|gender\s+is)\s+(male|female|man|woman|boy|girl)/i.test(message)) {
    const genderMatch = message.match(/(?:^|\s)(?:i\s+am\s+a|i'm\s+a|i\s+am|i'm|my\s+gender\s+is|gender\s+is)\s+(male|female|man|woman|boy|girl)/i);
    if (genderMatch) {
      const gender = genderMatch[1].toLowerCase();
      if (gender === 'male' || gender === 'man' || gender === 'boy') {
        extracted.gender = 'male';
      } else if (gender === 'female' || gender === 'woman' || gender === 'girl') {
        extracted.gender = 'female';
      }
    }
  }

  // Extract activity level
  const activityKeywords = {
    sedentary: ['sedentary', 'not active', 'no exercise', 'desk job', 'inactive'],
    light: ['light', 'lightly active', '1-3 days', 'occasional'],
    moderate: ['moderate', 'moderately active', '3-5 days', 'regular'],
    active: ['active', '6-7 days', 'very active', 'daily'],
    very_active: ['very active', 'intense', 'athlete', 'professional']
  };
  for (const [level, keywords] of Object.entries(activityKeywords)) {
    if (keywords.some(kw => lowerMessage.includes(kw))) {
      extracted.activity_level = level;
      break;
    }
  }

  // Extract goal
  const goalKeywords = {
    weight_loss: ['lose weight', 'weight loss', 'slim down', 'reduce weight', 'burn fat'],
    weight_gain: ['gain weight', 'weight gain', 'bulk up', 'put on weight'],
    muscle_gain: ['build muscle', 'muscle gain', 'gain muscle', 'get stronger'],
    maintenance: ['maintain', 'maintenance', 'stay fit', 'keep current']
  };
  for (const [goal, keywords] of Object.entries(goalKeywords)) {
    if (keywords.some(kw => lowerMessage.includes(kw))) {
      extracted.goal = goal;
      break;
    }
  }

  // Extract diet type
  const dietTypeKeywords = {
    vegetarian: ['vegetarian', 'veg', 'no meat'],
    vegan: ['vegan', 'no dairy', 'plant based'],
    non_vegetarian: ['non veg', 'non-vegetarian', 'meat', 'chicken', 'fish'],
    keto: ['keto', 'ketogenic', 'low carb'],
    balanced: ['balanced', 'normal diet']
  };
  for (const [dietType, keywords] of Object.entries(dietTypeKeywords)) {
    if (keywords.some(kw => lowerMessage.includes(kw))) {
      extracted.diet_type = dietType;
      break;
    }
  }

  return extracted;
}


const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const getToneInstructions = (tone: string) => {
    switch (tone.toLowerCase()) {
        case 'supportive':
            return `You are an encouraging and optimistic advisor. Always highlight the positive aspects, 
            provide reassurance, and frame challenges as opportunities for growth. Use phrases like 
            "I believe in you", "You've got this", and emphasize the user's strengths.`;
            
        case 'critical':
            return `You are a strict, analytical critic. Point out potential flaws, risks, and 
            weaknesses in the user's thinking. Play devil's advocate and challenge assumptions. 
            Use phrases like "Have you considered the downsides?", "Let's be realistic here", 
            and "The critical flaw in this thinking is...". Be direct but not harsh.`;
            
        case 'humorous':
            return `You are a witty and playful advisor. Use humor liberally, including puns, 
            jokes, and funny analogies. Keep the mood light while still being helpful. 
            Feel free to use emojis and make playful references. Every response should 
            include at least one joke or humorous observation. Think of yourself as a 
            stand-up comedian giving advice.`;
            
        case 'direct':
            return `You are a no-nonsense, straightforward advisor. Skip all pleasantries 
            and get straight to the point. Use short, clear sentences. No fluff, no 
            sugar-coating, just pure actionable advice. Be blunt but not rude.`;
            
        default:
            return `You are a balanced advisor providing thoughtful insights.`;
    }
};

export async function getChatCompletion(
    messages: Array<{ role: string; content: string }>,
    tone: string
) {
    const systemMessage = {
        role: 'system',
        content: `${getToneInstructions(tone)}

        For each user's decision or dilemma:
        1. First, analyze the situation objectively (in your assigned tone)
        2. Then, provide your judgment and reasoning (strongly reflecting the ${tone} tone)
        3. Offer specific actionable advice (maintaining consistent ${tone} style)
        4. If appropriate, suggest potential alternatives (keeping the ${tone} voice)
        5. End with a brief summary of key takeaways (in the same ${tone} manner)
        
        Remember: Your ${tone} tone should be very pronounced and consistent throughout the response.
        
        Temperature is set to high (0.9) to encourage more personality in responses.`
    };

    try {
        console.log('Making API request with:', {
            url: DEEPSEEK_API_URL,
            messages: [systemMessage, ...messages],
            tone
        });

        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [systemMessage, ...messages],
                temperature: 0.9,
                max_tokens: 1000,
                top_p: 0.95,
                presence_penalty: 0.8,
                frequency_penalty: 0.5,
                stream: false
            })
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response text:', responseText);

        if (!response.ok) {
            throw new Error(`API error: ${response.status} - ${responseText}`);
        }

        const data = JSON.parse(responseText);
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Detailed error:', {
            error,
            apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY?.slice(0, 5) + '...',
            url: DEEPSEEK_API_URL
        });
        throw new Error('Failed to get response from DeepSeek. Check console for details.');
    }
} 
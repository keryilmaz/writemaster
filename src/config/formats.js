export const formats = {
  tweet: {
    id: 'tweet',
    name: 'Tweet',
    description: 'Single tweet, 280 characters max',
    constraints: {
      maxLength: 280,
      structure: 'single',
    },
    instructions: `Create a single tweet (max 280 characters).

Requirements:
- One killer insight that stops the scroll
- Punchy, memorable phrasing
- No hashtags unless absolutely essential
- Can use line breaks for emphasis
- Should work standalone without any context

The tweet should pass the "would I bookmark this?" test.
Make every word count. If you can remove a word without losing meaning, remove it.`,
    requiresResearch: false,
  },

  thread: {
    id: 'thread',
    name: 'Thread',
    description: '5-12 connected tweets',
    constraints: {
      minTweets: 5,
      maxTweets: 12,
      maxPerTweet: 280,
    },
    instructions: `Create a Twitter thread of 5-12 tweets.

Structure:
1. HOOK (Tweet 1): Must stop the scroll. Use "here's how", "what I learned", or a surprising statement
2. BODY (Tweets 2-N): Each tweet delivers ONE clear point. Should read well standalone but flow together
3. PAYOFF (Final tweet): Actionable takeaway or memorable conclusion

Formatting rules:
- Each tweet separated by "---"
- One sentence per line within tweets where possible
- Use ">" or "-" or numbers for lists
- White space matters - don't cram information
- Each tweet should be valuable on its own (people might only see one)

Natural engagement:
- Structure creates bookmarks automatically (useful content)
- Can take a stance to spark discussion
- Or invite perspective ("curious how others approach this")

No "like and retweet" calls to action. Let the content speak.`,
    requiresResearch: false,
  },

  substack: {
    id: 'substack',
    name: 'Substack',
    description: 'Long-form newsletter, 1000-2000 words',
    constraints: {
      minWords: 1000,
      maxWords: 2000,
    },
    instructions: `Create a Substack newsletter article (1000-2000 words).

Structure:
1. HOOK: Opening paragraph that creates curiosity or makes a bold claim
2. CONTEXT: Why this matters right now
3. BODY: 3-5 main sections with clear headers
4. DEPTH: Include specific examples, data points, or stories
5. ACTIONABLE: End with clear takeaways the reader can apply today

Formatting:
- Use ## for section headers
- One idea per paragraph
- Short paragraphs (2-4 sentences max)
- Use bold for key phrases
- Include bullet lists for scannable content
- Pull quotes for important insights

Tone:
- Conversational but substantive
- Like a smart friend explaining something over coffee
- Confident but not arrogant
- Acknowledge complexity without getting lost in it

Research integration:
- Include relevant data, examples, or references
- Ground abstract ideas in concrete reality
- Cite sources naturally in the text`,
    requiresResearch: true,
  },

  shortEssay: {
    id: 'shortEssay',
    name: 'Short Essay',
    description: 'Focused piece, 300-500 words',
    constraints: {
      minWords: 300,
      maxWords: 500,
    },
    instructions: `Create a short essay (300-500 words).

This is a tight, focused piece exploring ONE core idea.

Structure:
1. OPENER: A single observation or question that frames everything
2. DEVELOPMENT: 2-3 paragraphs that build the idea
3. LANDING: A conclusion that reframes how the reader sees the topic

Rules:
- One core idea only - if you have two, pick the better one
- Every sentence must earn its place
- No throat-clearing or preamble
- Get to the point fast, then go deeper
- End strong - the last line should resonate

This format is about precision. Say exactly what you mean in the fewest words possible while maintaining depth.`,
    requiresResearch: false,
  },

  longEssay: {
    id: 'longEssay',
    name: 'Long Essay',
    description: 'Comprehensive piece, 1500+ words',
    constraints: {
      minWords: 1500,
      maxWords: 3000,
    },
    instructions: `Create a long-form essay (1500-3000 words).

This is a comprehensive exploration of an idea with multiple angles.

Structure:
1. HOOK: Open with something unexpected - a story, a contradiction, a question
2. THESIS: What you're actually arguing (can be implicit)
3. DEVELOPMENT: 4-6 sections that build your case from different angles
4. COUNTERPOINT: Address the strongest objection to your view
5. SYNTHESIS: Bring it together with a broader insight
6. CALL TO ACTION: What should the reader do or think differently?

Techniques:
- Use specific stories and examples, not just abstractions
- Include data and research to ground claims
- Build tension and release - create intellectual drama
- Vary paragraph length for rhythm
- Use headers to help navigation but don't let them fragment the flow

The goal is an essay someone would share because it genuinely changed how they think about something.`,
    requiresResearch: true,
  },
};

export const getFormat = (formatId) => formats[formatId] || formats.tweet;

export const formatList = Object.values(formats).map(f => ({
  id: f.id,
  name: f.name,
  description: f.description,
  requiresResearch: f.requiresResearch,
}));

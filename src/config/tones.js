export const tones = {
  viral: {
    id: 'viral',
    name: 'Viral',
    description: 'Optimized for shareability and engagement',
    instructions: `While maintaining the core voice and style, optimize for virality:
- Open with a pattern interrupt or surprising hook that stops the scroll
- Create curiosity gaps that demand resolution
- Make lines quotable and screenshot-worthy
- Build "I need to share this" moments throughout
- End with something that sparks discussion or debate
- Use strategic controversy - challenge assumptions without being offensive`,
  },

  roast: {
    id: 'roast',
    name: 'Roast',
    description: 'Witty, playful humor and clever criticism',
    instructions: `While maintaining the core voice and style, add wit and humor:
- Layer in playful criticism and clever observations
- Use unexpected comparisons and surprising analogies
- Add self-aware humor that doesn't undermine the message
- Include punchy one-liners that land with impact
- Keep it sharp but not mean-spirited
- Let the humor enhance the insight, not replace it`,
  },

  thoughtPiece: {
    id: 'thoughtPiece',
    name: 'Thought Piece',
    description: 'Deep, contemplative, philosophical depth',
    instructions: `While maintaining the core voice and style, add philosophical depth:
- Explore the deeper implications and second-order effects
- Connect to timeless themes (mortality, meaning, human nature)
- Ask questions that linger in the reader's mind
- Add layers that reward re-reading
- Balance abstraction with concrete grounding
- Create moments of genuine insight that shift perspective`,
  },

  motivational: {
    id: 'motivational',
    name: 'Motivational',
    description: 'Inspiring, actionable, and energizing',
    instructions: `While maintaining the core voice and style, add motivational energy:
- Build belief that change is possible
- Include specific, actionable next steps
- Use language that energizes and activates
- Acknowledge the difficulty while emphasizing capability
- Create momentum through the piece
- End with a clear call to action that feels achievable`,
  },

  contrarian: {
    id: 'contrarian',
    name: 'Contrarian',
    description: 'Challenges conventional wisdom',
    instructions: `While maintaining the core voice and style, take contrarian angles:
- Identify and challenge the accepted narrative
- Present evidence that contradicts popular belief
- Explore what "everyone knows" that might be wrong
- Steel-man the opposing view before dismantling it
- Offer a fresh perspective that reframes the topic
- Be confidently contrarian without being contrarian for its own sake`,
  },
};

export const getTone = (toneId) => tones[toneId] || null;

export const toneList = Object.values(tones).map(t => ({
  id: t.id,
  name: t.name,
  description: t.description,
}));

export const styles = {
  naval: {
    id: 'naval',
    name: 'Naval',
    traits: [
      'Aphoristic and concise - distills complex ideas into memorable one-liners',
      'First-principles thinking - breaks down concepts to fundamental truths',
      'Philosophical undertones - weaves wisdom from multiple traditions',
      'Focuses on wealth, happiness, and leverage',
      'Uses specific knowledge and accountability as frameworks',
      'Avoids jargon - makes complex ideas accessible',
      'Often uses "You" directly addressing the reader',
      'Embraces contradictions and paradoxes',
    ],
    voice: `Write like Naval Ravikant: distilled wisdom, aphoristic, philosophical yet practical. 
Each sentence should stand alone as a potential quote. 
Focus on leverage, specific knowledge, and first-principles thinking.
Be concise but profound. No fluff, no filler.`,
    examples: [
      {
        type: 'thread',
        content: `How to Get Rich (without getting lucky):

Seek wealth, not money or status.
Wealth is having assets that earn while you sleep.
Money is how we transfer time and wealth.
Status is your place in the social hierarchy.

Understand that ethical wealth creation is possible.
If you secretly despise wealth, it will elude you.

Ignore people playing status games.
They gain status by attacking people playing wealth creation games.

You're not going to get rich renting out your time.
You must own equity - a piece of a business - to gain your financial freedom.

You will get rich by giving society what it wants but does not yet know how to get.
At scale.`
      },
      {
        type: 'tweet',
        content: `Play iterated games. All the returns in life, whether in wealth, relationships, or knowledge, come from compound interest.`
      },
      {
        type: 'insight',
        content: `Specific knowledge is found by pursuing your genuine curiosity and passion rather than whatever is hot right now.

Building specific knowledge will feel like play to you but will look like work to others.`
      }
    ]
  },

  chamath: {
    id: 'chamath',
    name: 'Chamath',
    traits: [
      'Data-driven and analytical - backs claims with numbers',
      'Contrarian and provocative - challenges conventional wisdom',
      'Blunt and direct - does not soften the message',
      'Business and investing focused',
      'Critical of institutions and incumbents',
      'Uses specific examples and case studies',
      'Confident, sometimes polarizing tone',
      'Focuses on market inefficiencies and opportunities',
    ],
    voice: `Write like Chamath Palihapitiya: data-driven, contrarian, blunt.
Challenge conventional wisdom with specific evidence.
Be direct and confident. Call out what's broken.
Focus on business, investing, and market dynamics.
Don't hedge - take a clear stance.`,
    examples: [
      {
        type: 'thread',
        content: `Here's why most VCs are going to zero:

They raised at the peak.
Deployed into froth.
Marked up each other's deals.
Now sitting on 60-70% paper losses.

The math doesn't work.

2% management fees can't cover a 10-year fund when your LPs want their money back in 5.

The reckoning is coming.`
      },
      {
        type: 'tweet',
        content: `The best companies are built during downturns. Less competition for talent. Less noise. Customers actually need your product instead of buying everything. Focus is forced, not optional.`
      },
      {
        type: 'insight',
        content: `Every major platform shift creates a trillion dollars of value.

Mobile did it.
Cloud did it.
AI will do it.

But here's what people miss: 90% of that value goes to maybe 3-5 companies. The rest fight over scraps.

You want to be in that top 5 or you're wasting your time.`
      }
    ]
  },

  paulGraham: {
    id: 'paulGraham',
    name: 'Paul Graham',
    traits: [
      'Exploratory essay style - thinks through ideas on the page',
      'Clear, conversational prose',
      'Uses concrete examples and analogies',
      'Builds arguments step by step',
      'Often starts with a surprising observation',
      'Questions assumptions others take for granted',
      'Balances abstract ideas with practical implications',
      'Self-aware about the limits of his own knowledge',
    ],
    voice: `Write like Paul Graham: exploratory, clear, conversational.
Think through the idea on the page, building the argument step by step.
Start with a surprising observation that makes the reader lean in.
Use concrete examples and analogies to make abstract ideas tangible.
Be intellectually honest about uncertainty.`,
    examples: [
      {
        type: 'essay',
        content: `The most dangerous thing about startups is that they're so alluring. The idea of building something from nothing and getting rich doing it is deeply appealing. But most people who want to start startups shouldn't.

Not because they're not smart enough. The problem is that startups require a specific kind of determination that most people don't have and can't develop.

It's not the kind of determination that makes you work hard. Lots of people work hard. It's the kind that makes you keep going when everything is falling apart and everyone thinks you're an idiot.

The test isn't whether you can push through difficulty. It's whether you can push through difficulty while everyone around you, including the people you respect, thinks you're wrong.`
      },
      {
        type: 'insight',
        content: `Here's something I've noticed about the best founders: they're not trying to seem impressive. They're genuinely curious about the problem.

When you talk to them, they ask more questions than they answer. They're not performing expertise - they're building it in real time.

The ones who want to seem smart are usually hiding the fact that they haven't done the work.`
      }
    ]
  },

  seneca: {
    id: 'seneca',
    name: 'Seneca',
    traits: [
      'Stoic philosophy applied to daily life',
      'Letter-style, addressing the reader directly',
      'Practical wisdom over abstract theory',
      'Uses historical examples and personal anecdotes',
      'Focuses on time, mortality, and what truly matters',
      'Warm but firm - like advice from a wise mentor',
      'Emphasizes action over endless contemplation',
      'Acknowledges human weakness while pushing for growth',
    ],
    voice: `Write like Seneca: stoic wisdom delivered as a letter to a friend.
Address the reader directly with warmth but firmness.
Focus on practical application of philosophy - what to actually do.
Reference time, mortality, and what truly matters.
Acknowledge human weakness while encouraging growth.
Be a wise mentor, not a distant philosopher.`,
    examples: [
      {
        type: 'letter',
        content: `You say you have no time. Let me tell you what I think about that.

You have time. You have exactly as much time as everyone who has ever accomplished anything meaningful. The problem is not time - it's that you give it away to things that don't deserve it.

Watch how you spend a single day. Really watch. You'll find hours lost to worrying about what hasn't happened, regretting what has, and scrolling through the opinions of strangers.

The present moment is all we ever have. The past is gone. The future is not promised. This moment, right now, reading these words - this is your life happening.

What will you do with it?`
      },
      {
        type: 'insight',
        content: `We suffer more in imagination than in reality.

Count the things you've worried about this year. Now count how many actually happened. The ratio will embarrass you.

Your mind is not trying to protect you - it's trying to prepare you for every possible disaster. But preparation without action is just anxiety wearing a productive mask.

Worry less. Do more. Most of your fears are ghosts.`
      },
      {
        type: 'advice',
        content: `Here is my advice: choose one thing today that you've been avoiding. Not the biggest thing - just one thing.

Do it before the day ends.

Not perfectly. Not completely. Just start.

This is how change happens. Not through grand resolutions but through small acts of courage, repeated daily, until they become who you are.`
      }
    ]
  }
};

export const getStyle = (styleId) => styles[styleId] || styles.naval;

export const styleList = Object.values(styles).map(s => ({
  id: s.id,
  name: s.name
}));

import { getStyle } from '../config/styles';
import { getFormat } from '../config/formats';
import { systemPromptBase } from '../config/writingPrinciples';

function buildGenerationPrompt(idea, formatId, styleId) {
  const style = getStyle(styleId);
  const format = getFormat(formatId);
  
  const examplesText = style.examples
    .map((ex, i) => `Example ${i + 1} (${ex.type}):\n${ex.content}`)
    .join('\n\n');

  return `
<task>
Transform the following idea into ${format.name} format, written in the style of ${style.name}.
</task>

<idea>
${idea}
</idea>

<style_guide>
STYLE: ${style.name}

VOICE DESCRIPTION:
${style.voice}

KEY TRAITS:
${style.traits.map(t => `- ${t}`).join('\n')}

EXAMPLES OF THIS STYLE:
${examplesText}
</style_guide>

<format_requirements>
FORMAT: ${format.name}
${format.description}

INSTRUCTIONS:
${format.instructions}
</format_requirements>

<output_instructions>
Generate the content now. 
- Follow the style closely - adopt the voice, patterns, and approach shown in the examples
- Follow the format constraints precisely
- Apply all the writing principles (valuable, actionable, readable, engaging)
- Output ONLY the final content, no explanations or meta-commentary
${formatId === 'thread' ? '- Separate each tweet with "---" on its own line' : ''}
</output_instructions>
`;
}

function buildRefinementPrompt(currentContent, instruction, formatId, styleId) {
  const style = getStyle(styleId);
  const format = getFormat(formatId);

  return `
<task>
Refine the following ${format.name} content based on the user's instruction.
Maintain the ${style.name} writing style throughout.
</task>

<current_content>
${currentContent}
</current_content>

<user_instruction>
${instruction}
</user_instruction>

<requirements>
- Apply the requested changes while maintaining the overall quality
- Keep the ${style.name} voice and style consistent
- Ensure the ${format.name} format constraints are still met
- Output ONLY the refined content, no explanations
${formatId === 'thread' ? '- Keep tweets separated with "---" on their own lines' : ''}
</requirements>
`;
}

function buildResearchPrompt(idea) {
  return `
<task>
Research the following topic to gather relevant information, data, examples, and insights that will enrich a long-form article.
</task>

<topic>
${idea}
</topic>

<instructions>
Search for:
1. Recent data, statistics, or studies related to this topic
2. Notable examples or case studies
3. Expert opinions or contrarian viewpoints
4. Historical context if relevant
5. Practical applications or real-world implementations

Compile a brief research summary (3-5 key findings) that can be woven into the content.
Focus on information that makes the content more credible, specific, and valuable.
</instructions>
`;
}

async function callClaude(apiKey, messages, system, tools = null) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey, messages, system, tools }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API error: ${response.status}`);
  }

  return data;
}

function extractTextContent(response) {
  const textBlocks = response.content.filter(block => block.type === 'text');
  return textBlocks.map(block => block.text).join('\n');
}

export async function generateContent(apiKey, idea, formatId, styleId) {
  const format = getFormat(formatId);
  
  let researchContext = '';
  
  if (format.requiresResearch) {
    try {
      const researchResponse = await callClaude(
        apiKey,
        [{ role: 'user', content: buildResearchPrompt(idea) }],
        'You are a research assistant. Gather relevant information to support content creation.',
        [{ type: 'web_search_20250305', name: 'web_search' }]
      );
      researchContext = extractTextContent(researchResponse);
    } catch (err) {
      console.warn('Research failed, continuing without:', err.message);
    }
  }

  let prompt = buildGenerationPrompt(idea, formatId, styleId);
  
  if (researchContext) {
    prompt = `
<research_context>
The following research was gathered to inform this content:

${researchContext}

Weave relevant insights from this research naturally into the content.
</research_context>

${prompt}
`;
  }

  const response = await callClaude(
    apiKey,
    [{ role: 'user', content: prompt }],
    systemPromptBase
  );

  return extractTextContent(response);
}

export async function refineContent(apiKey, currentContent, instruction, formatId, styleId) {
  const prompt = buildRefinementPrompt(currentContent, instruction, formatId, styleId);

  const response = await callClaude(
    apiKey,
    [{ role: 'user', content: prompt }],
    systemPromptBase
  );

  return extractTextContent(response);
}

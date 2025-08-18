'use server';

/**
 * @fileOverview AI flow to detect the emotional tone of journal entries.
 *
 * - detectEmotionalTone - A function that analyzes journal entries to detect emotional tone.
 * - DetectEmotionalToneInput - The input type for the detectEmotionalTone function.
 * - DetectEmotionalToneOutput - The return type for the detectEmotionalTone function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectEmotionalToneInputSchema = z.object({
  journalEntry: z
    .string()
    .describe('The journal entry to analyze for emotional tone.'),
});
export type DetectEmotionalToneInput = z.infer<typeof DetectEmotionalToneInputSchema>;

const DetectEmotionalToneOutputSchema = z.object({
  emotionalTone: z
    .string()
    .describe(
      'The detected emotional tone of the journal entry (e.g., positive, negative, neutral, angry, sad, happy).'
    ),
  summary: z.string().describe('A brief summary of the journal entry.'),
});
export type DetectEmotionalToneOutput = z.infer<typeof DetectEmotionalToneOutputSchema>;

export async function detectEmotionalTone(
  input: DetectEmotionalToneInput
): Promise<DetectEmotionalToneOutput> {
  return detectEmotionalToneFlow(input);
}

const detectEmotionalTonePrompt = ai.definePrompt({
  name: 'detectEmotionalTonePrompt',
  input: {schema: DetectEmotionalToneInputSchema},
  output: {schema: DetectEmotionalToneOutputSchema},
  prompt: `You are an AI trained to analyze text and detect the emotional tone.

Analyze the following journal entry and determine the emotional tone. Provide a brief summary of the entry as well.

Journal Entry: {{{journalEntry}}}

Emotional Tone:`, // The prompt should request a value corresponding to the emotionalTone field in the output schema.
});

const detectEmotionalToneFlow = ai.defineFlow(
  {
    name: 'detectEmotionalToneFlow',
    inputSchema: DetectEmotionalToneInputSchema,
    outputSchema: DetectEmotionalToneOutputSchema,
  },
  async input => {
    const {output} = await detectEmotionalTonePrompt(input);
    return output!;
  }
);

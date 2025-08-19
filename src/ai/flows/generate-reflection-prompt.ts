'use server';

/**
 * @fileOverview An AI agent that generates personalized reflection prompts based on previous journal entries.
 *
 * - generateReflectionPrompt - A function that generates a reflection prompt.
 * - GenerateReflectionPromptInput - The input type for the generateReflectionPrompt function.
 * - GenerateReflectionPromptOutput - The return type for the generateReflectionPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReflectionPromptInputSchema = z.object({
  journalEntries: z
    .string()
    .describe('A newline-separated list of the user\'s past journal entry titles.'),
});
export type GenerateReflectionPromptInput = z.infer<typeof GenerateReflectionPromptInputSchema>;

const GenerateReflectionPromptOutputSchema = z.object({
  reflectionPrompt: z
    .string()
    .describe('A personalized reflection prompt based on the journal entry titles.'),
});
export type GenerateReflectionPromptOutput = z.infer<typeof GenerateReflectionPromptOutputSchema>;

export async function generateReflectionPrompt(
  input: GenerateReflectionPromptInput
): Promise<GenerateReflectionPromptOutput> {
  return generateReflectionPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReflectionPromptPrompt',
  input: {schema: GenerateReflectionPromptInputSchema},
  output: {schema: GenerateReflectionPromptOutputSchema},
  prompt: `You are an AI assistant designed to generate personalized reflection prompts for users based on the titles of their past journal entries.

  Analyze the user's journal entry titles to identify recurring themes, emotions, and experiences.
  Based ONLY on the titles, create a single, thought-provoking, and insightful reflection prompt that encourages the user to explore new perspectives and insights. The prompt should be a question. Keep it concise.

  Journal Entry Titles:
  {{{journalEntries}}}

  Reflection Prompt:`,
});

const generateReflectionPromptFlow = ai.defineFlow(
  {
    name: 'generateReflectionPromptFlow',
    inputSchema: GenerateReflectionPromptInputSchema,
    outputSchema: GenerateReflectionPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

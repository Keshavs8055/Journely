// SummarizeJournalEntry.ts
'use server';

/**
 * @fileOverview Summarizes a journal entry to quickly grasp main points.
 *
 * - summarizeJournalEntry - A function that summarizes the journal entry.
 * - SummarizeJournalEntryInput - The input type for the summarizeJournalEntry function.
 * - SummarizeJournalEntryOutput - The return type for the summarizeJournalEntry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeJournalEntryInputSchema = z.object({
  journalEntry: z
    .string()
    .describe('The journal entry to be summarized.'),
});
export type SummarizeJournalEntryInput = z.infer<typeof SummarizeJournalEntryInputSchema>;

const SummarizeJournalEntryOutputSchema = z.object({
  summary: z
    .string()
    .describe('The summary of the journal entry.'),
});
export type SummarizeJournalEntryOutput = z.infer<typeof SummarizeJournalEntryOutputSchema>;

export async function summarizeJournalEntry(input: SummarizeJournalEntryInput): Promise<SummarizeJournalEntryOutput> {
  return summarizeJournalEntryFlow(input);
}

const summarizeJournalEntryPrompt = ai.definePrompt({
  name: 'summarizeJournalEntryPrompt',
  input: {schema: SummarizeJournalEntryInputSchema},
  output: {schema: SummarizeJournalEntryOutputSchema},
  prompt: `Summarize the following journal entry. Be concise and focus on the main points and themes.

Journal Entry:
{{{journalEntry}}}`,
});

const summarizeJournalEntryFlow = ai.defineFlow(
  {
    name: 'summarizeJournalEntryFlow',
    inputSchema: SummarizeJournalEntryInputSchema,
    outputSchema: SummarizeJournalEntryOutputSchema,
  },
  async input => {
    const {output} = await summarizeJournalEntryPrompt(input);
    return output!;
  }
);

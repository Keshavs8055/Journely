import { config } from 'dotenv';
config();

import '@/ai/flows/generate-reflection-prompt.ts';
import '@/ai/flows/summarize-journal-entry.ts';
import '@/ai/flows/detect-emotional-tone.ts';
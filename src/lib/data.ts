import type { JournalEntry } from './types';

let journalEntries: JournalEntry[] = [
  {
    id: '1',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    title: 'A Walk in the Park',
    content: 'Today was a beautiful day. I took a long walk in the park and felt the sun on my face. It was peaceful and helped me clear my head. I saw a family of ducks, which was delightful.',
    summary: 'A peaceful walk in the park cleared the mind and brought moments of delight, like seeing a family of ducks.',
    tone: 'Positive',
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString(),
    title: 'Work Project Stress',
    content: 'Feeling overwhelmed with the new project at work. The deadline is tight and the requirements are complex. I spent most of the day feeling anxious and unsure of where to start.',
    summary: 'Feeling overwhelmed and anxious due to a complex work project with a tight deadline.',
    tone: 'Negative',
  },
  {
    id: '3',
    date: new Date().toISOString(),
    title: 'Coffee with a Friend',
    content: 'Met up with Sarah for coffee this morning. It was so good to catch up and talk about everything. We laughed a lot. I feel so much lighter and more connected now.',
    summary: 'A joyful and connecting coffee meeting with a friend, resulting in laughter and a feeling of lightness.',
    tone: 'Joyful',
  },
];

export const getEntries = (): JournalEntry[] => {
  return journalEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addEntry = (entry: JournalEntry) => {
  journalEntries.unshift(entry);
};

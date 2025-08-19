export type JournalEntry = {
  id: string;
  date: string;
  title: string;
  content: string;
  type: 'journal' | 'reflection';
};

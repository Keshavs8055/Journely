'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { JournalEntries } from '@/components/JournalEntries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { getEntries } from '@/lib/data';
import { generateReflectionPrompt } from '@/ai/flows/generate-reflection-prompt';
import { useSession } from '@/components/SessionProvider';
import type { JournalEntry } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DailyReflectionForm } from '@/components/DailyReflectionForm';
import { Separator } from '@/components/ui/separator';
import { isToday, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';

const PROMPT_KEY = 'reflectionPrompt';
const PROMPT_DATE_KEY = 'reflectionPromptDate';

function DailyReflectionCard({ 
    prompt, 
    isLoading, 
    onReflectionSubmit, 
    todaysReflection 
}: { 
    prompt: string | null, 
    isLoading: boolean, 
    onReflectionSubmit: () => void, 
    todaysReflection: JournalEntry | undefined 
}) {
    return (
        <Card className="bg-primary/20 border-primary/40">
            <CardHeader>
                <CardTitle className="font-headline">Daily Reflection</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                ) : todaysReflection ? (
                    <div className="space-y-4 text-center">
                        <p className="text-muted-foreground">You've already completed your reflection for today.</p>
                        <Button asChild>
                            <Link href={`/entry/${todaysReflection.id}`}>View Today's Reflection</Link>
                        </Button>
                    </div>
                ) : (
                    <DailyReflectionForm prompt={prompt} onReflectionSubmit={onReflectionSubmit} />
                )}
            </CardContent>
        </Card>
    );
}


export default function DashboardPage() {
    const { user } = useSession();
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [reflectionPrompt, setReflectionPrompt] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPromptLoading, setIsPromptLoading] = useState(true);

    const journalEntries = entries.filter(e => e.type === 'journal');
    const reflectionEntries = entries.filter(e => e.type === 'reflection');
    const todaysReflection = reflectionEntries.find(e => isToday(parseISO(e.date)));

    const refreshEntries = useCallback(async () => {
        if (user) {
            setIsLoading(true);
            const fetchedEntries = await getEntries(user.uid);
            setEntries(fetchedEntries);
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refreshEntries();
    }, [refreshEntries]);

    useEffect(() => {
        async function managePrompt() {
            if (!user) return;
            setIsPromptLoading(true);

            const savedPrompt = localStorage.getItem(PROMPT_KEY);
            const savedDate = localStorage.getItem(PROMPT_DATE_KEY);
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

            if (savedPrompt && savedDate === today) {
                setReflectionPrompt(savedPrompt);
            } else {
                try {
                    const journals = journalEntries.length > 0 ? journalEntries : entries.filter(e => e.type === 'journal');
                    let newPrompt: string;
                    if (journals.length > 0) {
                        const entryTitles = journals.map(e => e.title).join('\n');
                        const result = await generateReflectionPrompt({ journalEntries: entryTitles });
                        newPrompt = result.reflectionPrompt;
                    } else {
                        newPrompt = "What are you grateful for today?";
                    }
                    setReflectionPrompt(newPrompt);
                    localStorage.setItem(PROMPT_KEY, newPrompt);
                    localStorage.setItem(PROMPT_DATE_KEY, today);
                } catch (error) {
                    console.error("Failed to generate reflection prompt:", error);
                    setReflectionPrompt("What was the most significant moment of your day?");
                }
            }
            setIsPromptLoading(false);
        }

        // Only manage prompt if we are not loading initial entries
        if (!isLoading) {
            managePrompt();
        }
    }, [user, entries, isLoading]); // depends on entries to get context for new prompts

    return (
        <div className="space-y-8">
            <Header />

            <DailyReflectionCard 
                prompt={reflectionPrompt} 
                isLoading={isPromptLoading || isLoading} 
                onReflectionSubmit={refreshEntries}
                todaysReflection={todaysReflection}
            />

            <Tabs defaultValue="journals" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="journals">Journal Entries</TabsTrigger>
                    <TabsTrigger value="reflections">Reflections</TabsTrigger>
                </TabsList>
                <TabsContent value="journals">
                     {isLoading ? (
                        <div className="space-y-4 mt-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-8 w-40" />
                            </div>
                            <Separator />
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <Skeleton className="h-40" />
                                <Skeleton className="h-40" />
                                <Skeleton className="h-40" />
                            </div>
                        </div>
                    ) : (
                        <JournalEntries entries={journalEntries} onEntriesChange={refreshEntries} />
                    )}
                </TabsContent>
                <TabsContent value="reflections">
                    {isLoading ? (
                         <div className="space-y-4 mt-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-8 w-40" />
                            </div>
                            <Separator />
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <Skeleton className="h-40" />
                                <Skeleton className="h-40" />
                                <Skeleton className="h-40" />
                            </div>
                        </div>
                    ) : (
                        <JournalEntries entries={reflectionEntries} onEntriesChange={refreshEntries} />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

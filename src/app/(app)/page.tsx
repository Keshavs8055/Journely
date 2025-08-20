'use client';

import { useEffect, useState } from 'react';
import { JournalEntries } from '@/components/JournalEntries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { getEntries } from '@/lib/data';
import { generateReflectionPrompt } from '@/ai/flows/generate-reflection-prompt';
import { useSession } from '@/components/SessionProvider';
import type { JournalEntry } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DailyReflectionForm } from '@/components/DailyReflectionForm';
import { Separator } from '@/components/ui/separator';

const PROMPT_KEY = 'reflectionPrompt';

function DailyReflectionCard({ prompt, isLoading, onReflectionSubmit }: { prompt: string | null, isLoading: boolean, onReflectionSubmit: () => void }) {
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

    async function fetchNewPrompt() {
        if (!user) return;
        setIsPromptLoading(true);
        try {
            const journals = entries.filter(e => e.type === 'journal');
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
        } catch (error) {
            console.error("Failed to generate reflection prompt:", error);
            setReflectionPrompt("What was the most significant moment of your day?");
        } finally {
            setIsPromptLoading(false);
        }
    }

    useEffect(() => {
        async function fetchData() {
            if (user) {
                setIsLoading(true);
                const fetchedEntries = await getEntries(user.uid);
                setEntries(fetchedEntries);
                setIsLoading(false);
            }
        }
        fetchData();
    }, [user]);

    useEffect(() => {
        async function managePrompt() {
            if (user) {
                const savedPrompt = localStorage.getItem(PROMPT_KEY);
                if (savedPrompt) {
                    setReflectionPrompt(savedPrompt);
                    setIsPromptLoading(false);
                } else {
                    await fetchNewPrompt();
                }
            }
        }
        // We only want to run this when the user or entries (for prompt context) change.
        if (!isLoading) {
            managePrompt();
        }
    }, [user, entries, isLoading]);

    const handleReflectionSubmit = () => {
        localStorage.removeItem(PROMPT_KEY);
        // After removing the key, we need to fetch a new prompt.
        // We can refetch entries as well to show the new reflection.
        async function refreshData() {
            if(user) {
                const fetchedEntries = await getEntries(user.uid);
                setEntries(fetchedEntries);
                // fetchNewPrompt will be triggered by the `entries` dependency change in the useEffect above.
            }
        }
        refreshData();
    };


    return (
        <div className="space-y-8">
            <Header />

            <DailyReflectionCard prompt={reflectionPrompt} isLoading={isPromptLoading} onReflectionSubmit={handleReflectionSubmit} />

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
                        <JournalEntries entries={journalEntries} />
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
                        <JournalEntries entries={reflectionEntries} />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

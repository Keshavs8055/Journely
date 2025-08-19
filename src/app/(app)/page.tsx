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

function DailyReflectionCard({ prompt, isLoading }: { prompt: string | null, isLoading: boolean }) {
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
                    <DailyReflectionForm prompt={prompt} />
                )}
            </CardContent>
        </Card>
    );
}


export default function DashboardPage() {
    const { user } = useSession();
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [dailyReflectionPrompt, setDailyReflectionPrompt] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const journalEntries = entries.filter(e => e.type === 'journal');
    const reflectionEntries = entries.filter(e => e.type === 'reflection');

    useEffect(() => {
        async function fetchData() {
            if (user) {
                setIsLoading(true);
                const fetchedEntries = await getEntries(user.uid);
                setEntries(fetchedEntries);

                const journals = fetchedEntries.filter(e => e.type === 'journal');

                if (journals.length > 0) {
                    try {
                        const entryTitles = journals.map(e => e.title).join('\n');
                        const result = await generateReflectionPrompt({ journalEntries: entryTitles });
                        setDailyReflectionPrompt(result.reflectionPrompt);
                    } catch (error) {
                        console.error("Failed to generate reflection prompt:", error);
                        setDailyReflectionPrompt("What was the most significant moment of your day?");
                    }
                } else {
                    setDailyReflectionPrompt("What are you grateful for today?");
                }
                setIsLoading(false);
            }
        }
        fetchData();
    }, [user]);


    return (
        <div className="space-y-8">
            <Header />

            <DailyReflectionCard prompt={dailyReflectionPrompt} isLoading={isLoading && !dailyReflectionPrompt} />

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

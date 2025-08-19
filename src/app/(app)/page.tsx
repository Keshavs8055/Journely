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

function DailyReflectionCard({ prompt }: { prompt: string | null }) {
    return (
        <Card className="bg-primary/20 border-primary/40">
            <CardHeader>
                <CardTitle className="font-headline">Daily Reflection</CardTitle>
            </CardHeader>
            <CardContent>
                {prompt ? (
                    <p className="text-lg text-foreground/80">{prompt}</p>
                ) : (
                    <Skeleton className="h-6 w-3/4" />
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

    useEffect(() => {
        async function fetchData() {
            if (user) {
                setIsLoading(true);
                const fetchedEntries = await getEntries(user.uid);
                setEntries(fetchedEntries);

                if (fetchedEntries.length > 0) {
                    try {
                        const entryTitles = fetchedEntries.map(e => e.title).join('\n');
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

            <DailyReflectionCard prompt={dailyReflectionPrompt} />

            {isLoading ? (
                 <div className="space-y-4">
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-px w-full" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Skeleton className="h-40" />
                        <Skeleton className="h-40" />
                        <Skeleton className="h-40" />
                    </div>
                 </div>
            ) : (
                <JournalEntries entries={entries} />
            )}
        </div>
    );
}

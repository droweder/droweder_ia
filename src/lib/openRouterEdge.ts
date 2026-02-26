// src/lib/openRouterEdge.ts

import { supabase } from './supabaseClient';
import type { OpenRouterMessage, OpenRouterResponse } from './openRouterClient';

export const chatWithOpenRouterViaEdge = async (
  model: string,
  messages: OpenRouterMessage[]
): Promise<OpenRouterResponse | null> => {
    try {
        const { data, error } = await supabase.functions.invoke('chat-completion', {
            body: {
                model,
                messages,
            },
        });

        if (error) {
            console.error('Supabase Function Error:', error);
            throw error;
        }

        return data as OpenRouterResponse;
    } catch (error) {
        console.error("Failed to invoke chat-completion:", error);
        return null;
    }
};

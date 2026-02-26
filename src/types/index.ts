export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterResponse {
  choices: {
    message: OpenRouterMessage;
  }[];
  model: string;
}

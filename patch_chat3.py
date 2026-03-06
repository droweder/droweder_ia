import json

with open('src/pages/Chat.tsx', 'r') as f:
    content = f.read()

# Update the default selected model
old_selected = "const [selectedModel, setSelectedModel] = useState<string>('google/gemini-2.0-flash-lite-001');"
new_selected = "const [selectedModel, setSelectedModel] = useState<string>('google/gemini-2.0-pro-exp-02-05:free');"
content = content.replace(old_selected, new_selected)

# Update the models array
old_models = """  const models = [
    { id: 'google/gemini-2.0-flash-lite-001', name: 'Gemini 2.0 Flash Lite' },
    { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B (Free)' },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (Free)' },
    { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1 24B (Free)' },
    { id: 'qwen/qwen3-coder:free', name: 'Qwen 3 Coder (Free)' },
  ];"""
new_models = """  const models = [
    { id: 'google/gemini-2.0-pro-exp-02-05:free', name: 'Gemini 2.0 Pro (Web Search)' },
    { id: 'google/gemini-2.0-flash-lite-001', name: 'Gemini 2.0 Flash Lite' },
    { id: 'perplexity/llama-3.1-sonar-huge-128k-online', name: 'Perplexity Sonar Online' },
    { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B (Free)' },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (Free)' },
  ];"""
content = content.replace(old_models, new_models)

# Add explicit instruction in system prompt that it has web search capabilities
old_prompt_instruction = "7. Seja conciso, profissional e use Português do Brasil."
new_prompt_instruction = "7. Seja conciso, profissional e use Português do Brasil.\\n        8. VOCÊ TEM ACESSO À INTERNET em tempo real. Sempre que um usuário pedir informações de datas futuras (ex: 2025, 2026), notícias, ou dados não constantes no ERP, NÃO NEGUE O ACESSO; pesquise e responda com base nos resultados da web acoplados à sua requisição."
content = content.replace(old_prompt_instruction, new_prompt_instruction)

with open('src/pages/Chat.tsx', 'w') as f:
    f.write(content)

print("Patch applied.")

import json

with open('src/lib/openRouterClient.ts', 'r') as f:
    content = f.read()

# Locate the requestBody assignment
old_body = """    const requestBody = {
      model: model,
      messages: messages,
    };"""

new_body = """    const requestBody = {
      model: model,
      messages: messages,
      plugins: [
        {
          id: "web",
          max_results: 5
        }
      ]
    };"""

content = content.replace(old_body, new_body)

with open('src/lib/openRouterClient.ts', 'w') as f:
    f.write(content)

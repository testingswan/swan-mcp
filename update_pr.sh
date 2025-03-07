#!/bin/bash

# Load environment variables from .env.local
source ./load_env.sh

# Update PR description
curl -X PATCH \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/testingswan/swan-mcp/pulls/4 \
  -d '{
    "body": "This PR fixes the issue where the text when running over a shitcoin gets cut off. Added word wrapping to the status text and increased the display time from 2000ms to 3000ms for better readability. Also made the message more concise.\n\nAdditionally, added a deploy script and README with deployment instructions.\n\nCloses LIN-12"
  }' 
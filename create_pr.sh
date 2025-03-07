#!/bin/bash

# Load environment variables from .env.local
source ./load_env.sh

# Create the PR
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/testingswan/swan-mcp/pulls \
  -d '{
    "title": "Change shitcoin color to black",
    "body": "This PR changes the color of shitcoins to black in both dark and light themes for better visibility. Closes Linear issue c91ffc24-b65b-43c7-9922-a4d0febf423f",
    "head": "ai/change-shitcoin-color-to-black",
    "base": "main",
    "reviewers": ["mcarthurgill"]
  }' 
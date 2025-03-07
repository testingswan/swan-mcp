#!/bin/bash

# Load environment variables from .env.local
source ./load_env.sh

# Add reviewer to PR #5
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/testingswan/swan-mcp/pulls/5/requested_reviewers \
  -d '{
    "reviewers": ["mcarthurgill"]
  }' 
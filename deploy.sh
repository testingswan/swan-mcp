#!/bin/bash

# Exit on error
set -e

# Default domain
DOMAIN="swan-mcp.surge.sh"

# Help function
function show_help {
  echo "Usage: ./deploy.sh [options]"
  echo ""
  echo "Options:"
  echo "  -d, --domain DOMAIN    Specify a custom domain for deployment (default: swan-mcp.surge.sh)"
  echo "  -h, --help             Show this help message"
  echo ""
  echo "Example:"
  echo "  ./deploy.sh --domain custom-domain.surge.sh"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -d|--domain)
      DOMAIN="$2"
      shift 2
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

echo "🚀 Starting deployment process..."
echo "🌐 Target domain: $DOMAIN"

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
  echo "⚠️ You have uncommitted changes. Please commit or stash them before deploying."
  echo "Uncommitted changes:"
  git status -s
  exit 1
fi

# Store current branch to return to it after deployment
CURRENT_BRANCH=$(git branch --show-current)
echo "📝 Current branch: $CURRENT_BRANCH"

# Switch to main branch and pull latest changes
echo "🔄 Switching to main branch and pulling latest changes..."
git checkout main || { echo "❌ Failed to checkout main branch"; exit 1; }
git pull origin main || { echo "❌ Failed to pull latest changes"; exit 1; }

# Run Surge to deploy
echo "🌐 Deploying to Surge..."
surge ./ "$DOMAIN" || { echo "❌ Deployment failed"; git checkout $CURRENT_BRANCH; exit 1; }

# Return to the original branch
echo "🔙 Returning to original branch: $CURRENT_BRANCH"
git checkout $CURRENT_BRANCH || { echo "❌ Failed to return to original branch"; exit 1; }

echo "✅ Deployment completed successfully!"
echo "🔗 Your site is live at: https://$DOMAIN" 
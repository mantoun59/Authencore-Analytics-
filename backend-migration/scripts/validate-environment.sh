#!/bin/bash

# AuthenCore Analytics - Environment Validation Script
# Run this script to validate your environment setup

set -e

echo "🔍 AuthenCore Analytics Environment Validation"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Required environment variables
required_vars=(
  "DATABASE_URL"
  "OPENAI_API_KEY"
  "ANTHROPIC_API_KEY"
  "RESEND_API_KEY"
)

# Optional but recommended variables
optional_vars=(
  "STRIPE_SECRET_KEY"
  "STORAGE_ACCESS_KEY"
  "SENTRY_DSN"
)

error_count=0
warning_count=0

echo "📋 Checking required environment variables..."

for var in "${required_vars[@]}"; do
  if [[ -z "${!var}" ]]; then
    echo -e "${RED}❌ ERROR: $var is not set${NC}"
    ((error_count++))
  else
    echo -e "${GREEN}✅ $var is set${NC}"
  fi
done

echo ""
echo "📋 Checking optional environment variables..."

for var in "${optional_vars[@]}"; do
  if [[ -z "${!var}" ]]; then
    echo -e "${YELLOW}⚠️  WARNING: $var is not set (optional)${NC}"
    ((warning_count++))
  else
    echo -e "${GREEN}✅ $var is set${NC}"
  fi
done

echo ""
echo "🔌 Testing external service connections..."

# Test database connection
if [[ -n "$DATABASE_URL" ]]; then
  echo -n "Testing database connection... "
  if psql "$DATABASE_URL" -c "SELECT version();" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Connected${NC}"
  else
    echo -e "${RED}❌ Failed to connect${NC}"
    ((error_count++))
  fi
fi

# Test OpenAI API
if [[ -n "$OPENAI_API_KEY" ]]; then
  echo -n "Testing OpenAI API... "
  if curl -s -H "Authorization: Bearer $OPENAI_API_KEY" \
    "https://api.openai.com/v1/models" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Connected${NC}"
  else
    echo -e "${RED}❌ Failed to connect${NC}"
    ((error_count++))
  fi
fi

# Test Anthropic API
if [[ -n "$ANTHROPIC_API_KEY" ]]; then
  echo -n "Testing Anthropic API... "
  if curl -s -H "x-api-key: $ANTHROPIC_API_KEY" \
    "https://api.anthropic.com/v1/messages" \
    -X POST \
    -H "content-type: application/json" \
    -H "anthropic-version: 2023-06-01" \
    -d '{"model":"claude-3-5-haiku-20241022","max_tokens":10,"messages":[{"role":"user","content":"test"}]}' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Connected${NC}"
  else
    echo -e "${RED}❌ Failed to connect${NC}"
    ((error_count++))
  fi
fi

# Test Resend API
if [[ -n "$RESEND_API_KEY" ]]; then
  echo -n "Testing Resend API... "
  if curl -s -H "Authorization: Bearer $RESEND_API_KEY" \
    "https://api.resend.com/domains" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Connected${NC}"
  else
    echo -e "${RED}❌ Failed to connect${NC}"
    ((error_count++))
  fi
fi

echo ""
echo "🏗️  Checking system requirements..."

# Check for required commands
commands=("psql" "curl" "docker" "deno")
for cmd in "${commands[@]}"; do
  if command -v "$cmd" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ $cmd is installed${NC}"
  else
    echo -e "${YELLOW}⚠️  WARNING: $cmd is not installed${NC}"
    ((warning_count++))
  fi
done

# Check Docker status
if command -v docker > /dev/null 2>&1; then
  if docker info > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker is running${NC}"
  else
    echo -e "${YELLOW}⚠️  WARNING: Docker is not running${NC}"
    ((warning_count++))
  fi
fi

echo ""
echo "📊 Validation Summary"
echo "===================="

if [[ $error_count -eq 0 ]]; then
  echo -e "${GREEN}✅ All required components are properly configured!${NC}"
  
  if [[ $warning_count -gt 0 ]]; then
    echo -e "${YELLOW}⚠️  $warning_count warnings found (optional components)${NC}"
  fi
  
  echo ""
  echo "🚀 Your environment is ready for deployment!"
  exit 0
else
  echo -e "${RED}❌ $error_count critical errors found${NC}"
  
  if [[ $warning_count -gt 0 ]]; then
    echo -e "${YELLOW}⚠️  $warning_count warnings found${NC}"
  fi
  
  echo ""
  echo "Please fix the errors above before proceeding with deployment."
  exit 1
fi
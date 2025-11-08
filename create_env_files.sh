#!/bin/bash

echo "🔧 Creating Environment Files"
echo "=============================="
echo ""
echo "This script will help you create your .env files."
echo "Make sure you have all your API keys ready!"
echo ""

# Backend .env
echo "📝 Creating backend/.env file..."
echo ""
read -p "Enter MongoDB DATABASE_URL: " DB_URL
read -p "Enter OpenAI API Key: " OPENAI_KEY
read -p "Enter Google Places API Key: " GOOGLE_KEY
read -p "Enter JWT Secret Key (or press Enter to generate): " SECRET_KEY

if [ -z "$SECRET_KEY" ]; then
    SECRET_KEY=$(openssl rand -hex 32 2>/dev/null || python3 -c "import secrets; print(secrets.token_hex(32))" 2>/dev/null || echo "change_this_to_a_random_secret_key_at_least_32_characters_long")
    echo "✅ Generated SECRET_KEY: $SECRET_KEY"
fi

cat > backend/.env << EOF
DATABASE_URL=$DB_URL
OPENAI_API_KEY=$OPENAI_KEY
GOOGLE_API_KEY=$GOOGLE_KEY
SECRET_KEY=$SECRET_KEY
ALGORITHM=HS256
EOF

echo ""
echo "✅ Backend .env file created!"
echo ""

# Frontend .env.local
echo "📝 Creating frontend/.env.local file..."
read -p "Enter Backend API URL [default: http://localhost:8000]: " API_URL

if [ -z "$API_URL" ]; then
    API_URL="http://localhost:8000"
fi

cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=$API_URL
EOF

echo "✅ Frontend .env.local file created!"
echo ""
echo "✨ All environment files created successfully!"
echo ""
echo "📋 Files created:"
echo "  - backend/.env"
echo "  - frontend/.env.local"
echo ""
echo "⚠️  Remember: These files are in .gitignore and won't be committed to git."


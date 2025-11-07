#!/bin/bash

echo "🔍 Verifying Sprint 0 Setup..."
echo ""

# Check backend structure
echo "📁 Checking backend structure..."
if [ -f "backend/main.py" ] && [ -f "backend/requirements.txt" ]; then
    echo "✅ Backend structure: OK"
else
    echo "❌ Backend structure: Missing files"
fi

# Check frontend structure
echo "📁 Checking frontend structure..."
if [ -f "frontend/package.json" ] && [ -f "frontend/app/page.tsx" ]; then
    echo "✅ Frontend structure: OK"
else
    echo "❌ Frontend structure: Missing files"
fi

# Check environment files
echo "📁 Checking environment files..."
if [ -f "backend/.env.example" ]; then
    echo "✅ Backend .env.example: OK"
else
    echo "⚠️  Backend .env.example: Missing (create manually if needed)"
fi

if [ -f "frontend/.env.example" ]; then
    echo "✅ Frontend .env.example: OK"
else
    echo "⚠️  Frontend .env.example: Missing (create manually if needed)"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Backend: Create .env file from .env.example and add your MongoDB/API keys"
echo "2. Backend: Run 'pip install -r requirements.txt' in backend directory"
echo "3. Backend: Run 'uvicorn main:app --reload' to start server"
echo "4. Frontend: Run 'npm install' in frontend directory"
echo "5. Frontend: Create .env.local from .env.example"
echo "6. Frontend: Run 'npm run dev' to start development server"
echo "7. Test health endpoints:"
echo "   - Backend: http://localhost:8000/api/v1/health"
echo "   - Frontend: http://localhost:3000/health"
echo ""
echo "✨ Sprint 0 setup complete!"


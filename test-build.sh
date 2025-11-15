#!/bin/bash
echo "Testing TypeScript compilation..."
if npm run build; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed with errors"
fi
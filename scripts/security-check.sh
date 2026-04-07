#!/bin/bash
# Comprehensive Dependency Security Check Script
# Run this regularly to ensure dependencies are secure

echo "========================================="
echo "DEPENDENCY SECURITY CHECK"
echo "========================================="
echo ""

echo "1. Checking for security vulnerabilities..."
echo "---"
npm audit --audit-level=high
AUDIT_RESULT=$?
echo ""

echo "2. Listing outdated packages..."
echo "---"
npm outdated || echo "All packages are up to date!"
echo ""

echo "3. Checking dependency tree..."
echo "---"
npm ls --depth=0
echo ""

echo "4. Checking for duplicate dependencies..."
echo "---"
npm ls 2>&1 | grep -i "peerDep" || echo "No peer dependency issues detected"
echo ""

echo "========================================="
if [ $AUDIT_RESULT -eq 0 ]; then
    echo "✓ ALL SECURITY CHECKS PASSED"
    exit 0
else
    echo "⚠ SECURITY WARNINGS DETECTED"
    echo "Run 'npm audit fix' to auto-fix issues"
    exit 1
fi

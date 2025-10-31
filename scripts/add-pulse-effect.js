import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chaptersDir = path.join(__dirname, '../app/components/chapitres');

// Pages déjà traitées manuellement
const skipPages = ['Page0.tsx', 'Page1.tsx'];

function addPulseEffectToPage(filePath) {
  const fileName = path.basename(filePath);

  if (skipPages.includes(fileName)) {
    console.log(`⏭️  Skipped ${fileName} - already has pulse effect`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has activeIndex state
  if (content.includes('activeIndex') || content.includes('pulse-active')) {
    console.log(`⏭️  Skipped ${fileName} - already has pulse effect`);
    return;
  }

  // Check if file has clickable elements
  if (!content.includes('cursor-pointer') && !content.includes('onClick')) {
    console.log(`⏭️  Skipped ${fileName} - no clickable elements`);
    return;
  }

  let modified = false;

  // Pattern 1: Add useState import if not present
  if (!content.includes('useState')) {
    content = content.replace(
      /import React(.*?)from ['"]react['"]/,
      "import React, { useState } from 'react'"
    );
    modified = true;
  }

  // Pattern 2: Add activeIndex state in component
  // Find the main component function
  const componentMatch = content.match(/const\s+(\w+)\s*=\s*\(\)\s*=>\s*\{/);

  if (componentMatch) {
    const componentStart = componentMatch.index + componentMatch[0].length;

    // Add activeIndex state after component opening
    const stateDeclaration = '\n  const [activeIndex, setActiveIndex] = useState<number>(0);\n';
    content = content.slice(0, componentStart) + stateDeclaration + content.slice(componentStart);
    modified = true;

    // Pattern 3: Add pulse-active class to clickable divs
    // Replace cursor-pointer divs with conditional pulse-active class
    content = content.replace(
      /className=["']([^"']*cursor-pointer[^"']*)["']/g,
      (match, classes) => {
        if (classes.includes('pulse-active')) return match;
        return `className={\`${classes} \${activeIndex === index ? 'pulse-active' : ''}\`}`;
      }
    );

    // Pattern 4: Update onClick handlers to set activeIndex
    content = content.replace(
      /onClick=\{([^}]*)\}/g,
      (match, handler) => {
        // Skip if already sets activeIndex
        if (handler.includes('setActiveIndex')) return match;

        // Simple case: onClick={() => func()}
        if (handler.includes('=>')) {
          return match.replace(
            /onClick=\{([^}]*)\}/,
            `onClick={() => { setActiveIndex(index); ${handler.replace('() =>', '').trim()} }}`
          );
        }
        return match;
      }
    );
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Added pulse effect to ${fileName}`);
  } else {
    console.log(`⚠️  Could not modify ${fileName} - manual intervention needed`);
  }
}

function processAllPages() {
  const chapters = fs.readdirSync(chaptersDir);

  let processedCount = 0;

  chapters.forEach(chapterDir => {
    const chapterPath = path.join(chaptersDir, chapterDir);
    const stat = fs.statSync(chapterPath);

    if (stat.isDirectory()) {
      const files = fs.readdirSync(chapterPath);

      files.forEach(file => {
        if (file.startsWith('Page') && file.endsWith('.tsx')) {
          const filePath = path.join(chapterPath, file);
          try {
            addPulseEffectToPage(filePath);
            processedCount++;
          } catch (error) {
            console.error(`❌ Error processing ${file}:`, error.message);
          }
        }
      });
    }
  });

  console.log(`\n🎉 Processed ${processedCount} pages!`);
  console.log('\n⚠️  Note: Some pages may need manual adjustments for proper integration.');
}

processAllPages();

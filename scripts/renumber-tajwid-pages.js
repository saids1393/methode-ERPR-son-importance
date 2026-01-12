// Script to renumber Tajwid pages like Lecture (unique across all chapters)
// Run with: node scripts/renumber-tajwid-pages.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/chapters-tajwid.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Pattern to match chapters and their pages
const chapters = content.match(/\{[\s\S]*?chapterNumber: \d+[\s\S]*?\]/g) || [];

console.log(`Found ${chapters.length} chapters to process`);

let pageCounter = 0;
const pageMapping = {}; // Track old -> new mappings

chapters.forEach((chapter, index) => {
  const chapterMatch = chapter.match(/chapterNumber: (\d+)/);
  const chapterNumber = chapterMatch ? parseInt(chapterMatch[1]) : null;
  
  if (chapterNumber === null) return;
  
  // Find all pageNumber occurrences in this chapter
  const pageMatches = chapter.match(/pageNumber: \d+/g) || [];
  
  pageMatches.forEach((pageMatch) => {
    const oldPageNum = parseInt(pageMatch.match(/\d+/)[0]);
    pageMapping[`${chapterNumber}-${oldPageNum}`] = pageCounter;
    pageCounter++;
  });
});

console.log('Page mapping:', pageMapping);

// Now replace all pageNumber values
Object.entries(pageMapping).forEach(([key, newNum]) => {
  const [chap, oldPage] = key.split('-').map(Number);
  // Replace: "pageNumber: X" where X is the old page number in context of this chapter
  // This is tricky since we need context. Let's use a different approach.
});

// Better approach: track chapter by chapter
let newContent = content;
let currentPageNum = 0;

// Process each chapter
const chapterMatches = [...content.matchAll(/\{\s*title: "[^"]*",\s*chapterNumber: (\d+)[\s\S]*?quiz:/g)];

chapterMatches.forEach((match) => {
  const startIndex = match.index;
  const chapterNumber = match[1];
  
  // Find the pages array for this chapter
  const pagesStartIdx = newContent.indexOf('pages: [', startIndex);
  const pagesEndIdx = newContent.indexOf('],', pagesStartIdx) + 1;
  
  const pagesSection = newContent.substring(pagesStartIdx, pagesEndIdx + 1);
  
  // Replace pageNumber within this chapter's pages
  let updatedPagesSection = pagesSection.replace(/pageNumber: \d+/g, () => {
    return `pageNumber: ${currentPageNum++}`;
  });
  
  newContent = newContent.substring(0, pagesStartIdx) + updatedPagesSection + newContent.substring(pagesEndIdx + 1);
});

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('✅ Pages renumbered successfully!');

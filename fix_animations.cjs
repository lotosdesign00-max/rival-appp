const fs = require('fs');

const files = [
  'src/components/AcademyScreen.tsx',
  'src/components/AIAssistantScreen.tsx',
  'src/components/SpaceScreen.tsx',
  'src/components/ExploreScreen.tsx',
  'src/components/CaseArchiveScreen.tsx',
  'src/components/ProfileScreen.tsx',
  'src/components/ReviewsScreen.tsx',
  'src/components/GalleryScreen.tsx',
  'src/components/HomeScreen.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // 1. Remove staggerContainer and itemAnim definitions
  content = content.replace(/  const staggerContainer = \{[\s\S]*?damping: 24 \} \}\n  \};\n\n?/g, '');
  content = content.replace(/  const itemAnim = \{[\s\S]*?damping: 24 \} \}\n  \};\n\n?/g, '');

  // 2. Remove the variants={...} and initial/animate props from the root motion.div,
  // and convert it back to a div with animate-in
  content = content.replace(/<motion\.div\s+variants=\{staggerContainer\}\s+initial="hidden"\s+animate="show"/g, '<div');
  
  // 3. Convert all other <motion.div> to <div>
  content = content.replace(/<motion\.div[^>]*variants=\{itemAnim\}[^>]*>/g, (match) => {
    return match.replace(/<motion\.div/, '<div').replace(/\s*variants=\{itemAnim\}/, '');
  });
  
  // Catch any stray motion.div that might not have itemAnim
  content = content.replace(/<motion\.div/g, '<div');
  content = content.replace(/<\/motion\.div>/g, '</div>');
  
  // Remove unused motion imports if we removed all motion elements (Wait, keeping motion for other things is okay, but we can clean it up later if needed. Actually it's fine).

  // Restore the animate-in fade-in duration-300 to the root div if it was lost.
  if (content.includes('className="space-y-') && !content.includes('animate-in')) {
    content = content.replace(/(className="[^"]*)(space-y-[^"]*)(")/, '$1$2 animate-in fade-in duration-300$3');
  }
  
  // Restore basic animations to screens if we stripped them
  if (content.includes('className="space-y-6 pb-28 font-sans"')) {
    content = content.replace('className="space-y-6 pb-28 font-sans"', 'className="space-y-6 pb-28 animate-in fade-in duration-300 font-sans"');
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
}

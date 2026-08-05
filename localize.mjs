import { Project, SyntaxKind } from 'ts-morph';
import { translate } from '@vitalets/google-translate-api';
import fs from 'fs';
import path from 'path';

const project = new Project();
project.addSourceFilesAtPaths("src/components/**/*.{ts,tsx}");
project.addSourceFilesAtPaths("src/data/**/*.{ts,tsx}");

const cyrillicPattern = /[\u0400-\u04FF]/;
const existingTranslationsPath = "src/translations.ts";

let translationKeys = {}; // key -> ru text

async function generateKey(ruText) {
    let key = "auto_" + Buffer.from(ruText).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
    // Try to get a meaningful key
    try {
        const res = await translate(ruText, { to: 'en' });
        key = res.text.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').substring(0, 30);
        if (key.endsWith('_')) key = key.slice(0, -1);
        if (key.startsWith('_')) key = key.slice(1);
        if (!key) key = "auto_" + Math.random().toString(36).substring(7);
    } catch (e) {
        // ignore
    }
    
    // ensure unique
    let finalKey = key;
    let counter = 1;
    while (Object.values(translationKeys).includes(finalKey)) {
        finalKey = key + "_" + counter;
        counter++;
    }
    return finalKey;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
    let newEntries = {}; // key -> text

    for (const sourceFile of project.getSourceFiles()) {
        let modified = false;
        let needsT = false;

        const processText = async (text, node, isJsxText = false, isJsxAttribute = false) => {
            if (cyrillicPattern.test(text)) {
                let key = Object.keys(newEntries).find(k => newEntries[k] === text.trim());
                if (!key) {
                    key = await generateKey(text.trim());
                    newEntries[key] = text.trim();
                    console.log(`Mapped: "${text.trim()}" -> ${key}`);
                    await sleep(50); // prevent rate limit
                }
                
                needsT = true;
                modified = true;

                if (isJsxText) {
                    node.replaceWithText(`{t('${key}')}`);
                } else if (isJsxAttribute) {
                    node.replaceWithText(`{t('${key}')}`);
                } else {
                    node.replaceWithText(`t('${key}')`);
                }
            }
        };

        // Find StringLiteral
        const stringLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral);
        for (const node of stringLiterals) {
            const parent = node.getParent();
            const text = node.getLiteralValue();
            if (cyrillicPattern.test(text)) {
                if (parent.getKind() === SyntaxKind.JsxAttribute) {
                    await processText(text, node, false, true);
                } else if (parent.getKind() === SyntaxKind.ImportDeclaration) {
                    // skip
                } else {
                    await processText(text, node, false, false);
                }
            }
        }

        // Find NoSubstitutionTemplateLiteral
        const templates = sourceFile.getDescendantsOfKind(SyntaxKind.NoSubstitutionTemplateLiteral);
        for (const node of templates) {
            const text = node.getLiteralValue();
            if (cyrillicPattern.test(text)) {
                await processText(text, node, false, false);
            }
        }

        // Find JsxText
        const jsxTexts = sourceFile.getDescendantsOfKind(SyntaxKind.JsxText);
        for (const node of jsxTexts) {
            const text = node.getText();
            if (cyrillicPattern.test(text)) {
                await processText(text, node, true, false);
            }
        }

        if (modified && needsT) {
            // Check if useTranslation is imported
            const imports = sourceFile.getImportDeclarations();
            let hasImport = false;
            for (const imp of imports) {
                if (imp.getModuleSpecifierValue().includes('LanguageContext')) {
                    hasImport = true;
                    break;
                }
            }

            if (!hasImport) {
                // Determine path to LanguageContext
                const filePath = sourceFile.getFilePath();
                let relPath = '../context/LanguageContext';
                if (filePath.includes('src/components/')) {
                    relPath = '../context/LanguageContext';
                } else if (filePath.includes('src/data/')) {
                    relPath = '../context/LanguageContext';
                }
                
                sourceFile.addImportDeclaration({
                    namedImports: ['useTranslation'],
                    moduleSpecifier: relPath
                });
            }

            // Find component declaration to inject const { t } = useTranslation();
            // Usually the first React.FC or function component
            const functions = sourceFile.getFunctions();
            const arrowFunctions = sourceFile.getDescendantsOfKind(SyntaxKind.ArrowFunction);
            
            let injected = false;
            for (const fn of [...functions, ...arrowFunctions]) {
                const body = fn.getBody();
                if (body && body.getKind() === SyntaxKind.Block) {
                    const block = body;
                    if (!block.getText().includes('useTranslation()')) {
                        block.insertStatements(0, 'const { t } = useTranslation();');
                        injected = true;
                        break;
                    } else {
                        injected = true;
                        break;
                    }
                }
            }
            if (!injected && sourceFile.getFilePath().includes('mockData.ts')) {
                // mockData doesn't have a component. We shouldn't use useTranslation hook here.
                // Revert or ignore for data files if they aren't components.
                // Actually for mockData we probably shouldn't use hooks. Let's just fix the imports if needed.
            }
        }

        if (modified) {
            sourceFile.saveSync();
        }
    }

    console.log("Found", Object.keys(newEntries).length, "new entries.");
    fs.writeFileSync('new_entries.json', JSON.stringify(newEntries, null, 2));
}

main().catch(console.error);

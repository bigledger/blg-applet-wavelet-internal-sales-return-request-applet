
const fs = require('fs');
const path = require('path');

// --- ⚠️ CONFIGURATION --- 
const APPLET_PATH = 'projects/wavelet-erp/applets/internal-sales-grn-applet';
// -----------------------

const PROJECT_ROOT = process.cwd();
const SHARED_I18N_ROOT = path.join(PROJECT_ROOT, 'projects/shared-utilities/services/i18n');
const LOCAL_I18N_ROOT = path.join(PROJECT_ROOT, APPLET_PATH, 'src/locales/i18n');

/**
 * Parses a TypeScript translation file to extract the main exported object.
 * @param {string} filePath - Absolute path to the .ts file.
 * @returns {object|null} The parsed object or null if parsing fails.
 */
/**
 * Enhanced parseFile function that handles your specific file structure
 */
function parseFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');

    // Handle imports
    const importMatches = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]([^'"]+)['"]/g);
    const importedValues = {};
    
    if (importMatches) {
      for (const importMatch of importMatches) {
        const match = importMatch.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]([^'"]+)['"]/);
        if (match) {
          const importedName = match[1].trim();
          const importPath = match[2];
          
          // Resolve the import path
          let resolvedPath;
          if (importPath.startsWith('./') || importPath.startsWith('../')) {
            resolvedPath = path.resolve(path.dirname(filePath), importPath + '.ts');
          } else {
            resolvedPath = path.join(PROJECT_ROOT, importPath + '.ts');
          }
          
          // Parse the imported file
          const importedData = parseFileSimple(resolvedPath);
          if (importedData) {
            importedValues[importedName] = importedData;
          }
        }
      }
    }

    // Find the export const declaration
    const exportMatch = content.match(/export const (\w+)\s*=\s*{/);
    if (!exportMatch) {
      console.error(`Could not find export const declaration in ${filePath}`);
      return null;
    }

    const exportName = exportMatch[1];
    const startIndex = content.indexOf('{', exportMatch.index);
    
    if (startIndex === -1) {
      console.error(`Could not find opening brace in ${filePath}`);
      return null;
    }

    // Count braces to find the end of the exported object
    let braceCount = 1;
    let endIndex = -1;
    let inString = false;
    let inComment = false;
    let stringChar = null;
    
    for (let i = startIndex + 1; i < content.length; i++) {
      const char = content[i];
      const prevChar = content[i - 1];
      
      // Handle string literals
      if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\' && !inComment) {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = null;
        }
      }
      
      // Handle comments
      if (!inString) {
        if (char === '/' && content[i + 1] === '/') {
          inComment = true;
        } else if (char === '\n' && inComment) {
          inComment = false;
        }
      }
      
      // Count braces only when not in strings or comments
      if (!inString && !inComment) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i;
            break;
          }
        }
      }
    }

    if (endIndex === -1) {
      console.error(`Could not find matching closing brace in ${filePath}`);
      return null;
    }

    const objectStr = content.substring(startIndex, endIndex + 1);
    
    // Create a function with the imported values in scope
    const func = new Function(...Object.keys(importedValues), `return (${objectStr})`);
    return func(...Object.values(importedValues));
    
  } catch (e) {
    console.error(`Error parsing ${filePath}: ${e.message}`);
    return null;
  }
}

/**
 * Simple parser for imported files
 */
function parseFileSimple(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Look for export const or just the object
    const exportMatch = content.match(/export const \w+\s*=\s*{/) || content.match(/^{/m);
    if (!exportMatch) return null;
    
    const startIndex = content.indexOf('{', exportMatch.index || 0);
    if (startIndex === -1) return null;

    let braceCount = 1;
    let endIndex = -1;
    let inString = false;
    let stringChar = null;
    
    for (let i = startIndex + 1; i < content.length; i++) {
      const char = content[i];
      const prevChar = content[i - 1];
      
      if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = null;
        }
      }
      
      if (!inString) {
        if (char === '{') braceCount++;
        else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i;
            break;
          }
        }
      }
    }

    if (endIndex === -1) return null;
    const objectStr = content.substring(startIndex, endIndex + 1);
    return new Function(`return (${objectStr})`)();
  } catch (e) {
    return null;
  }
}

/**
 * Rewrites the local translation file, removing specified keys while preserving file structure.
 * @param {string} filePath - Absolute path to the local .ts file.
 * @param {object} originalFullObject - The original full object from the file.
 * @param {string[]} keysToRemove - An array of keys to remove from the 'labels' property.
 */
function rewriteLocalFile(filePath, originalFullObject, keysToRemove) {
  const originalContent = fs.readFileSync(filePath, 'utf-8');
  
  // Find the export const declaration
  const exportMatch = originalContent.match(/(export const \w+\s*=\s*){/);
  if (!exportMatch) {
    console.error(`Could not find export statement in ${filePath} during rewrite.`);
    return;
  }
  
  const exportStart = exportMatch.index;
  const objectStart = originalContent.indexOf('{', exportStart);
  
  // Find the end of the exported object (same logic as parseFile)
  let braceCount = 1;
  let objectEnd = -1;
  let inString = false;
  let stringChar = null;
  
  for (let i = objectStart + 1; i < originalContent.length; i++) {
    const char = originalContent[i];
    const prevChar = originalContent[i - 1];
    
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
    }
    
    if (!inString) {
      if (char === '{') braceCount++;
      else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          objectEnd = i;
          break;
        }
      }
    }
  }
  
  if (objectEnd === -1) {
    console.error(`Could not find end of export object in ${filePath}`);
    return;
  }
  
  // Create new object with removed keys
  const newLabels = { ...originalFullObject.labels };
  keysToRemove.forEach(key => {
    delete newLabels[key];
  });
  
  const newFullObject = { ...originalFullObject, labels: newLabels };
  const newObjectString = JSON.stringify(newFullObject, null, 2);
  
  // Reconstruct the file
  const beforeExport = originalContent.substring(0, exportStart);
  const exportDeclaration = exportMatch[1];
  const afterObject = originalContent.substring(objectEnd + 1);
  
  const newContent = beforeExport + exportDeclaration + newObjectString + ' as const;' + afterObject;
  
  fs.writeFileSync(filePath, newContent, 'utf-8');
}

async function main() {
  console.log('\x1b[33m%s\x1b[0m', '*** WARNING: This script will remove ALL keys from local translation files that also exist in the shared files, regardless of their value. ***');
  console.log(`Targeting applet: ${APPLET_PATH}`);
  
  const localFiles = fs.readdirSync(LOCAL_I18N_ROOT);
  const languages = localFiles
    .filter(file => file.endsWith('.ts') && file !== 'index.ts')
    .map(file => path.basename(file, '.ts'));

  if (languages.length === 0) {
    console.error(`No language files found in ${LOCAL_I18N_ROOT}`);
    return;
  }
  
  console.log(`Found languages: ${languages.join(', ')}`);

  for (const lang of languages) {
    console.log(`\n--- Processing Language: ${lang.toUpperCase()} ---`);

    const sharedFilePath = path.join(SHARED_I18N_ROOT, `shared-util-${lang}.ts`);
    const localFilePath = path.join(LOCAL_I18N_ROOT, `${lang}.ts`);

    const sharedData = parseFile(sharedFilePath);
    const localData = parseFile(localFilePath);

    if (!localData || !localData.labels) {
      console.log(`Skipping ${lang}, could not parse local file or it has no labels.`);
      continue;
    }
    
    if (!sharedData || !sharedData.labels) {
      console.log(`Skipping ${lang}, could not parse shared file or it has no labels.`);
      continue;
    }

    const sharedLabels = sharedData.labels;
    const localLabels = localData.labels;
    const removals = [];

    // Find all keys in the local file that also exist in the shared file.
    for (const key in localLabels) {
      if (Object.prototype.hasOwnProperty.call(sharedLabels, key)) {
        removals.push(key);
      }
    }

    if (removals.length > 0) {
      rewriteLocalFile(localFilePath, localData, removals);
      console.log(`[REMOVED] Removed ${removals.length} keys from ${lang}.ts because they exist in the shared file.`);
      // For debugging, you can uncomment the next line to see which keys were removed.
      // console.log('  Keys removed:', removals.join(', '));
    } else {
      console.log('[REMOVED] No keys needed to be removed.');
    }
  }
  console.log('\n\nCleanup complete.');
}

main().catch(err => {
  console.error('\nAn unexpected error occurred:', err);
});

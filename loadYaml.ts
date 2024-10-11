// loadYaml.js
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

export const loadYamlFile = (filePath: string) => {
  try {
    const fullPath = path.resolve(__dirname, filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return yaml.load(fileContents);
  } catch (e) {
    console.error(`Error loading YAML file: ${e.message}`);
    return {};
  }
};

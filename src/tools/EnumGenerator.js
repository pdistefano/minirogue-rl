const fs = require('fs');

const filename = process.argv[2];

console.log('Argument 1:', filename);

// Define the function that generates the TypeScript class
function generatorClass(data) {
	let output = `export enum ${filename} {\n`;
	for (let i = 0; i < data.enumValues.length; i++) {
		output += `\t${data.enumValues[i]} = '${data.enumValues[i]}',\n`;
	}
	output += '}\n';

  return output;
}

// Read the JSON file
const rawData = fs.readFileSync(`${filename}.json`);
const parsedData = JSON.parse(rawData);

// Generate the TypeScript class
const generatedEnum = generatorClass(parsedData);

// Write the TypeScript class to a file
fs.writeFileSync(`${filename}.ts`, generatedEnum);
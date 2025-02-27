const fs = require("fs");
const { parse } = require("csv-parse");

async function parseCSVFile(filePath) {
  const records = [];
  const parser = fs.createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      from_line: 2, // Skip the header with metadata
      delimiter: ";",
    })
  );

  for await (const record of parser) {
    // Debug log
    if (records.length === 0) {
      console.log("First record structure:", record);
    }
    records.push(record);
  }

  return records;
}

module.exports = {
  parseCSVFile,
};

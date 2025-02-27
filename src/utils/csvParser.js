const fs = require("fs");
const { parse } = require("csv-parse");

async function parseCSVFile(filePath) {
  const records = [];
  const parser = fs.createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
    })
  );

  for await (const record of parser) {
    records.push(record);
  }

  return records;
}

module.exports = {
  parseCSVFile,
};

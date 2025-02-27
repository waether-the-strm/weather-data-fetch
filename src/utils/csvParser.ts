import { createReadStream } from "fs";
import { parse } from "csv-parse";

export interface WeatherRecord {
  Date: string;
  "rr3h(mm)": string;
}

export async function parseCSVFile(filePath: string): Promise<WeatherRecord[]> {
  const records: WeatherRecord[] = [];
  const parser = createReadStream(filePath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      from_line: 2, // Skip the header with metadata
      delimiter: ";",
    }),
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

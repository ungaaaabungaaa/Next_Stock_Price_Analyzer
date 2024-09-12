import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { parse } from 'csv-parse/sync';

export async function POST(req: NextRequest) {
  try {
    const { ticker, startDate, endDate } = await req.json();
    console.log('Received request:', { ticker, startDate, endDate });

    // Validate input
    if (!ticker || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const filePath = path.resolve('./public/stock_data.csv');
    console.log('Reading file from:', filePath);

    // Read the entire CSV file
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Parse the CSV content
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Filter the records
    const filteredRecords = records.filter((record: any) => {
      const recordDate = new Date(record.Date);
      return (
        record.ticker === ticker &&
        recordDate >= new Date(startDate) &&
        recordDate <= new Date(endDate)
      );
    });

    console.log(`Filtering complete. Found ${filteredRecords.length} matching records.`);

    if (filteredRecords.length === 0) {
      console.log('No matching records found');
      return NextResponse.json({ message: 'No matching records found' }, { status: 404 });
    }

    // Format the filtered records
    const formattedRecords = filteredRecords.map((record: any) => ({
      date: record.Date,
      open: parseFloat(record.open),
      high: parseFloat(record.high),
      low: parseFloat(record.low),
      close: parseFloat(record.close),
      volume: parseInt(record.volume),
      ticker: record.ticker
    }));

    console.log('Returning filtered records');
    return NextResponse.json(formattedRecords);
  } catch (error) {
    console.error('Error in POST request:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const filePath = path.resolve('./public/stock_data.csv'); // Adjust the path as necessary
    const fileStream = fs.createReadStream(filePath, 'utf8');
    
    // Initialize an empty array to store the records
    const records: any[] = [];
    
    // Create a parser stream
    const parser = csvParser({
      headers: true
    });
    
    // Create a promise that resolves when the stream is done
    const parsePromise = new Promise<void>((resolve, reject) => {
      fileStream.pipe(parser)
        .on('data', (data) => records.push(data))
        .on('end', () => resolve())
        .on('error', (error) => reject(error));
    });

    // Wait for the promise to resolve
    await parsePromise;
    
    // Return the parsed records as JSON
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error in GET request: ', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

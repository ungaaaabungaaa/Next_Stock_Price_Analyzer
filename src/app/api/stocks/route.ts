import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

export async function POST(req: NextRequest) {
  try {
    const { ticker, startDate, endDate } = await req.json();

    // Validate input
    if (!ticker || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Read and filter the CSV data
    const filePath = path.resolve('./public/stock_data.csv'); // Adjust the path as necessary
    const fileStream = fs.createReadStream(filePath, 'utf8');

    // Initialize an empty array to store the records
    const filteredRecords: any[] = [];

    // Create a parser stream
    const parser = csvParser({
      headers: true
    });

    // Create a promise that resolves when the stream is done
    const parsePromise = new Promise<void>((resolve, reject) => {
      fileStream.pipe(parser)
        .on('data', (data) => {
          // Debugging: Log the data being processed
          console.log('Processing record:', data);

          // Filter records based on ticker and date range
          const recordDate = new Date(data.date);
          const isInRange = recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
          if (data.ticker === ticker && isInRange) {
            filteredRecords.push(data);
          }
        })
        .on('end', () => {
          // Debugging: Log the filtered records
          console.log('Filtered records:', filteredRecords);
          resolve();
        })
        .on('error', (error) => reject(error));
    });

    // Wait for the promise to resolve
    await parsePromise;

    // Return the filtered records as JSON
    return NextResponse.json(filteredRecords);
  } catch (error) {
    console.error('Error in POST request: ', (error as Error).message);
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

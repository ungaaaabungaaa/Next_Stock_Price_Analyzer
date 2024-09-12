import { NextRequest } from 'next/server';
import { POST, GET, OPTIONS } from './route'; // Adjust the import path as necessary
import fs from 'fs';
import path from 'path';

// Mock the external modules
jest.mock('fs');
jest.mock('path');
jest.mock('csv-parser');
jest.mock('csv-parse/sync');

describe('Route Handler Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST method', () => {
    it('should return filtered records for valid input', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          ticker: 'AAPL',
          startDate: '2023-01-01',
          endDate: '2023-01-31'
        })
      } as unknown as NextRequest;

      (fs.readFileSync as jest.Mock).mockReturnValue(`Date,open,high,low,close,volume,ticker
2023-01-15,150,155,149,153,1000000,AAPL
2023-01-16,153,158,152,157,1200000,AAPL`);
      (path.resolve as jest.Mock).mockReturnValue('/mock/path/stock_data.csv');

      const mockParse = jest.requireMock('csv-parse/sync').parse;
      mockParse.mockReturnValue([
        { Date: '2023-01-15', open: '150', high: '155', low: '149', close: '153', volume: '1000000', ticker: 'AAPL' },
        { Date: '2023-01-16', open: '153', high: '158', low: '152', close: '157', volume: '1200000', ticker: 'AAPL' }
      ]);

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0]).toEqual({
        date: '2023-01-15',
        open: 150,
        high: 155,
        low: 149,
        close: 153,
        volume: 1000000,
        ticker: 'AAPL'
      });
    });

    it('should return 400 for missing parameters', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          ticker: 'AAPL',
          // Missing startDate and endDate
        })
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Missing required parameters' });
    });

    it('should return 404 when no matching records found', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          ticker: 'NONEXISTENT',
          startDate: '2023-01-01',
          endDate: '2023-01-31'
        })
      } as unknown as NextRequest;

      (fs.readFileSync as jest.Mock).mockReturnValue('Date,open,high,low,close,volume,ticker');
      (path.resolve as jest.Mock).mockReturnValue('/mock/path/stock_data.csv');

      const mockParse = jest.requireMock('csv-parse/sync').parse;
      mockParse.mockReturnValue([]);

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ message: 'No matching records found' });
    });
  });

  describe('GET method', () => {
    it('should return all records', async () => {
      const mockRequest = {} as NextRequest;

      (fs.createReadStream as jest.Mock).mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'data') {
            callback({ Date: '2023-01-15', open: '150', high: '155', low: '149', close: '153', volume: '1000000', ticker: 'AAPL' });
            callback({ Date: '2023-01-16', open: '153', high: '158', low: '152', close: '157', volume: '1200000', ticker: 'AAPL' });
          }
          if (event === 'end') {
            callback();
          }
          return { on: jest.fn() };
        })
      });

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0]).toEqual({
        Date: '2023-01-15',
        open: '150',
        high: '155',
        low: '149',
        close: '153',
        volume: '1000000',
        ticker: 'AAPL'
      });
    });

    it('should handle errors and return 500', async () => {
      const mockRequest = {} as NextRequest;

      (fs.createReadStream as jest.Mock).mockImplementation(() => {
        throw new Error('File read error');
      });

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'File read error' });
    });
  });

  describe('OPTIONS method', () => {
    it('should return correct CORS headers', async () => {
      const mockRequest = {} as NextRequest;

      const response = await OPTIONS(mockRequest);
      const headers = response.headers;

      expect(response.status).toBe(200);
      expect(headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(headers.get('Access-Control-Allow-Methods')).toBe('GET, POST, OPTIONS');
      expect(headers.get('Access-Control-Allow-Headers')).toBe('Content-Type, Authorization');
    });
  });
});

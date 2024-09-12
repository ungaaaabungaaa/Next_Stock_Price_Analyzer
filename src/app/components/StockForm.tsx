"use client";
import { useState } from "react";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // date range picker styles
import "react-date-range/dist/theme/default.css"; // default theme styles
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';

// Define Stock Data Type
interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const StockForm = () => {
  // State to store selected stock, date range, and fetched data
  const [selectedStock, setSelectedStock] = useState("");
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [stockData, setStockData] = useState<StockData[]>([]); // Update type here

  // Handle Submit
  const handleSubmit = async () => {
    try {
      if (!selectedStock) {
        console.error("No stock selected.");
        return;
      }

      if (!dateRange.startDate || !dateRange.endDate) {
        console.error("Date range is not defined properly.");
        return;
      }

      const startDate = dateRange.startDate.toISOString().slice(0, 10);
      const endDate = dateRange.endDate.toISOString().slice(0, 10);

      const response = await fetch("/api/stocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticker: selectedStock, startDate, endDate }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorDetails}`);
      }

      const data = await response.json();
      setStockData(data); // Store the fetched data in state
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Function to handle date range change
  const handleDateRangeChange = (item: RangeKeyDict) => {
    setDateRange(item.selection);
  };

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-row space-x-4 w-full">
          {/* Form */}
          <div className="flex-1 p-6 bg-white rounded-xl min-h-[300px]">
            <div>
              <label
                htmlFor="stockPicker"
                className="block mb-2 text-sm font-medium text-black"
              >
                Select Stock
              </label>
              <select
                id="stockPicker"
                className="border-gray-300 rounded-md p-2 w-full text-black"
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
              >
                <option value="">Select Stock</option>
                <option value="AAL">American Airlines (AAL)</option>
                <option value="AAPL">Apple (AAPL)</option>
                <option value="AMZN">Amazon (AMZN)</option>
                <option value="GOOGL">Google (GOOGL)</option>
                <option value="MSFT">Microsoft (MSFT)</option>
                <option value="NFLX">Netflix (NFLX)</option>
                <option value="TSLA">Tesla (TSLA)</option>
              </select>
            </div>

            {/* Date Range Picker */}
            <div>
              <label className="block mb-2 text-sm font-medium text-black">
                Select Date Range
              </label>
              <DateRange
                ranges={[dateRange]}
                onChange={handleDateRangeChange}
                moveRangeOnFirstSelection={false}
                editableDateInputs={true}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white rounded-md px-4 py-2"
            >
              Submit
            </button>
          </div>

          {/* Line Chart */}
          <div className="flex-1 p-6 bg-white rounded-xl min-h-[300px]">
            {stockData.length > 0 && (
                <>
                  <h2 className="text-lg font-semibold text-black mb-2">
                    {selectedStock} Stock Prices
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stockData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="close" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </>
              )}
          </div>

          {/* Table to display fetched data */}
          <div className="flex-1 p-6 bg-white rounded-xl  min-h-[300px]">
            {stockData.length > 0 && (
              <table className="table-auto w-full text-left text-sm text-black">
                <thead className="space-y-12 ">
                  <tr>
                    <th>Date</th>
                    <th>Open</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Close</th>
                    <th>Volume</th>
                  </tr>
                </thead>
                <tbody className="space-y-12">
                  {stockData.map((stock) => (
                    <tr key={stock.date}>
                      <td>{stock.date}</td>
                      <td>{stock.open}</td>
                      <td>{stock.high}</td>
                      <td>{stock.low}</td>
                      <td>{stock.close}</td>
                      <td>{stock.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          </div>
      </div>
    </>
  );
};

export default StockForm;

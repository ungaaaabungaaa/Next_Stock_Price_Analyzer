"use client"
import { useState } from "react";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // date range picker styles
import "react-date-range/dist/theme/default.css"; // default theme styles

const StockForm = () => {
  // State to store selected stock and date range
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  // Function to handle form submission
  const handleSubmit = () => {
    console.log("Selected Stock: ", selectedStock);
    console.log("Selected Date Range: ", dateRange.startDate, " to ", dateRange.endDate);
  };

  // Function to handle date range change
  const handleDateRangeChange = (item: RangeKeyDict) => {
    setDateRange(item.selection);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      {/* Dropdown for stock picker */}
      <div>
        <label htmlFor="stockPicker" className="block mb-2 text-sm font-medium text-black ">
          Select Stock
        </label>
        <select
          id="stockPicker"
          className="border-gray-300 rounded-md p-2 w-full text-black "
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
        <label className="block mb-2 text-sm font-medium text-black">Select Date Range</label>
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
  );
};

export default StockForm;
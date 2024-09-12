# Stock Price Analyzer

## Objective
Create a Next.js 14 application that analyzes and visualizes stock price data for multiple tech companies using TypeScript. The focus is on server actions for data processing and basic data visualization.

## Context
You will be provided with a CSV file containing daily stock price data for companies including Apple (AAPL), Microsoft (MSFT), and Amazon (AMZN) from January 1, 2023, to April 6, 2023. The data includes the following fields: Date, Open, High, Low, Close, Volume, and Ticker.

*Data:* [Stock Prices of 2023](https://www.kaggle.com/datasets/sabasaeed1953/stock-prices-of-2023/data)

## Requirements

1. **Project Setup**
   - Set up a Next.js 14 project with TypeScript.

2. **Server Actions**
   - Implement the following operations:
     - `getStockData`: Retrieve price data for a given stock ticker and date range.
     - `calculateReturns`: Calculate daily returns for a given stock.
   - Ensure proper error handling and validation.
   - Use TypeScript types/interfaces for input and return types.

3. **UI**
   - Create a user interface using React components and Tailwind CSS.
   - Implement a form to select stocks, date range, and analysis type.
   - Display results in both tabular and chart formats.
   - Implement a simple stock comparison view.

4. **Data Visualization**
   - Use a charting library of your choice for data visualization.

5. **Testing**
   - Write one unit test for the daily return calculation function.

6. **Documentation**
   - Provide detailed setup instructions in this README file.
   - Include comments in the code explaining any complex logic.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ungaaaabungaaa/Next_Stock_Price_Analyzer


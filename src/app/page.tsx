import StockForm from "./components/StockForm";
export default function Home() {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <h1 className="text-center text-2xl font-bold my-6">Stock Picker</h1>
      <StockForm />
    </div>
  );
}




import Example from "@/components/Example";
import { Counter } from "@/components/Counter";
import { CounterStoreProvider } from "@/provider/counterProvider";
import { QueryProvider } from "@/provider/queryProvider";

import "./assets/css/App.css";

function App() {
  return (
    <QueryProvider>
      <CounterStoreProvider>
        <div className="flex flex-col items-center justify-center h-screen">
          <Example />
          <Counter />
        </div>
      </CounterStoreProvider>
    </QueryProvider>
  );
}

export default App;

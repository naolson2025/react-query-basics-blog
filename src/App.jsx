import { Posts } from "./Posts";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

function App() {
  return (
    // provide React Query client to App
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>Blog Posts</h1>
        <Posts />
      </div>
      {/*
        dev tools will not be included in production
        it checks for process.env.NODE_ENV === 'production'
      */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import { ToastProvider } from './components/ui/toast';


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <div>

        <Index />
      </div>
    </ToastProvider>
  </QueryClientProvider>
);

export default App;
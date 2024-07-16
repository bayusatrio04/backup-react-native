import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { Provider as PaperProvider } from 'react-native-paper';
import App from './App';

const MainApp = () => (
  <PaperProvider>
    <App />
  </PaperProvider>
);

// Register the main app component
registerRootComponent(MainApp);

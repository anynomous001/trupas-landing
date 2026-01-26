import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './styles/globals.css';
import './stores/themeStore'; // Ensures store initializes early


function App(): JSX.Element {
  return <RouterProvider router={router} />;
}

export default App;


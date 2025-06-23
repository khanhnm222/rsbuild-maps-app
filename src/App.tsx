import { RouterProvider } from 'react-router-dom';
import router from './routers/router';
import './globals.css';

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;

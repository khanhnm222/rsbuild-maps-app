import { createBrowserRouter } from "react-router-dom"
import { Map, Error } from '@components/pages'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Map />,
    errorElement: <Error />
  },
]);

export default router;
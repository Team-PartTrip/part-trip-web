import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@pages/home'

import { paths } from './paths'

export const router = createBrowserRouter([
  {
    path: paths.home,
    element: <HomePage />,
  },
])

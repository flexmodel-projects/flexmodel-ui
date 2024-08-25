import {useRoutes} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import {TodoPage} from "./pages/TodoPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";

export const routes = [
  {
    path: "/",
    element: <HomePage/>,
  },
  {
    path: "/home",
    element: <HomePage/>,
  },
  {
    path: "/todo",
    element: <TodoPage todoItems={[]}/>,
  },
  {
    path: "/about",
    element: <AboutPage/>,
  },
];

export const RenderRoutes = () => useRoutes(routes)

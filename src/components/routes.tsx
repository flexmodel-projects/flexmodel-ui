import {useRoutes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import {TodoPage} from "./pages/TodoPage";
import AboutPage from "./pages/AboutPage";

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

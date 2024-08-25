import {useRoutes} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import {TodoPage} from "./pages/TodoPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import Datasource from "./pages/Datasource/index.tsx";

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
  {
    path: "/datasource",
    element: <Datasource/>,
  },
];

export const RenderRoutes = () => useRoutes(routes)

import {useRoutes} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import {TodoPage} from "./pages/TodoPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import DataSource from "./pages/DataSource/index.tsx";
import APIManagement from "./pages/APIManagement/index.tsx";
import APIDocument from "./pages/APIDocument/index.tsx";
import APILog from "./pages/APILog/index.tsx";
import IdPManagement from "./pages/IdPManagement/index.tsx";

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
    element: <DataSource/>,
  },
  {
    path: "/api-management",
    element: <APIManagement/>
  },
  {
    path: "/api-document",
    element: <APIDocument/>
  },
  {
    path: "/api-log",
    element: <APILog/>,
  },
  {
    path: "/identity-providers",
    element: <IdPManagement/>,
  },
];

export const RenderRoutes = () => useRoutes(routes)

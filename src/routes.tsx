import {useRoutes} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import {TodoPage} from "./pages/TodoPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import DataSource from "./pages/DataSource";
import APIManagement from "./pages/APIManagement";
import APIDocument from "./pages/APIDocument";
import APILog from "./pages/APILog";
import IdPManagement from "./pages/IdPManagement";
import Settings from "./pages/Settings";
import DataModeling from "./pages/DataModeling";

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
  },{
    path: "/modeling",
    element: <DataModeling/>,
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
  {
    path: "/settings",
    element: <Settings/>,
  },
];

export const RenderRoutes = () => useRoutes(routes)

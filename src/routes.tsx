import {useRoutes} from "react-router-dom";
import APIDocument from "./pages/APIDocument";
import APILog from "./pages/APILog";
import IdentityProvider from "./pages/IdentityProvider";
import Settings from "./pages/Settings";
import DataModeling from "./pages/DataModeling";
import APIManagement from "./pages/APIManagement";
import DataSource from "./pages/DataSource";

export const routes = [
  {
    path: "/",
    element: <APIManagement/>,
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
    element: <IdentityProvider/>,
  },
  {
    path: "/settings",
    element: <Settings/>,
  },
];

export const RenderRoutes = () => useRoutes(routes)

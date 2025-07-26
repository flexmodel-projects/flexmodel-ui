import {useRoutes} from "react-router-dom";
import IdentityProvider from "./pages/IdentityProvider";
import Settings from "./pages/Settings";
import Overview from "./pages/Overview";
import DataView from "./pages/DataView";
import ApiView from "./pages/APIView";

export const routes = [
  {
    path: "/",
    element: <Overview />,
  },
  {
    path: "/data",
    element: <DataView />,
  },

  {
    path: "/api",
    element: <ApiView />,
  },
  // {
  //   path: "/api-management",
  //   element: <APIManagement />,
  // },
  // {
  //   path: "/api-document",
  //   element: <APIDocument />,
  // },
  // {
  //   path: "/api-log",
  //   element: <APILog />,
  // },
  {
    path: "/identity-providers",
    element: <IdentityProvider />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
];

export const RenderRoutes = () => useRoutes(routes);

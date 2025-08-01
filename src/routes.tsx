import {useRoutes} from "react-router-dom";
import IdentityProvider from "./pages/IdentityProvider";
import Settings from "./pages/Settings";
import Overview from "./pages/Overview";
import DataView from "./pages/DataView";
import ApiView from "./pages/APIView";
import DataModeling from "./pages/DataModeling";
import DataSource from "./pages/DataSource";
import ERView from "./pages/DataView/components/ERView";
import APIDocument from "./pages/APIDocument";
import APILog from "./pages/APILog";
import APIManagement from "./pages/APIManagement";
import {
  ApiOutlined,
  BranchesOutlined,
  CloudServerOutlined,
  ContainerOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  FileTextOutlined,
  HomeOutlined,
  LineChartOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

export interface RouteConfig {
  path: string;
  element?: React.ReactNode;
  icon: React.ComponentType<any>;
  translationKey: string;
  children?: RouteConfig[];
  defaultChild?: string;
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    element: <Overview />,
    icon: HomeOutlined,
    translationKey: "overview",
  },
  {
    path: "/data",
    element: <DataView />,
    icon: CloudServerOutlined,
    translationKey: "data",
    defaultChild: "modeling",
    children: [
      {
        path: "/data/modeling",
        element: <DataModeling />,
        icon: ContainerOutlined,
        translationKey: "data_modeling",
      },
      {
        path: "/data/source",
        element: <DataSource />,
        icon: DatabaseOutlined,
        translationKey: "data_source",
      },
      {
        path: "/data/er",
        element: <ERView />,
        icon: BranchesOutlined,
        translationKey: "er_view",
      },
    ],
  },
  {
    path: "/api",
    element: <ApiView />,
    icon: ApiOutlined,
    translationKey: "api",
    defaultChild: "management",
    children: [
      {
        path: "/api/management",
        element: <APIManagement />,
        icon: DeploymentUnitOutlined,
        translationKey: "api_management",
      },
      {
        path: "/api/document",
        element: <APIDocument />,
        icon: FileTextOutlined,
        translationKey: "api_document",
      },
      {
        path: "/api/log",
        element: <APILog />,
        icon: LineChartOutlined,
        translationKey: "api_log",
      },
    ],
  },
  {
    path: "/identity-providers",
    element: <IdentityProvider />,
    icon: UserOutlined,
    translationKey: "identity_providers",
  },
  {
    path: "/settings",
    element: <Settings />,
    icon: SettingOutlined,
    translationKey: "settings",
  },
];

// 根据路径获取路由配置
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  // 先查找精确匹配
  const route = routes.find(route => route.path === path);

  // 如果没有找到，查找子路由
  if (!route) {
    for (const parentRoute of routes) {
      if (parentRoute.children) {
        const childRoute = parentRoute.children.find(child => child.path === path);
        if (childRoute) {
          return childRoute;
        }
      }
    }
  }

  return route;
};

// 获取路由的完整路径（包括父路由）
export const getFullRoutePath = (path: string): RouteConfig[] => {
  const pathSegments = path.split('/').filter(Boolean);
  const result: RouteConfig[] = [];

  let currentPath = '';
  for (const segment of pathSegments) {
    currentPath += `/${segment}`;
    const route = getRouteByPath(currentPath);
    if (route) {
      result.push(route);
    }
  }

  return result;
};

// 获取所有路由路径（包括子路由）
export const getAllRoutePaths = (): string[] => {
  const paths: string[] = [];

  const addPaths = (routeList: RouteConfig[]) => {
    routeList.forEach(route => {
      paths.push(route.path);
      if (route.children) {
        addPaths(route.children);
      }
    });
  };

  addPaths(routes);
  return paths;
};

// 为 react-router-dom 提供纯路由配置
export const routerRoutes = routes.map(({ path, element, children }) => {
  const route: any = { path, element };
  if (children) {
    route.children = children.map(({ path: childPath, element: childElement }) => ({
      path: childPath,
      element: childElement,
    }));
  }
  return route;
});

export const RenderRoutes = () => useRoutes(routerRoutes);

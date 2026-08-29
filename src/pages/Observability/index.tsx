import React from 'react';
import {Navigate, Outlet, useLocation, useParams} from 'react-router-dom';

/**
 * 可观测性入口容器。
 * 直接访问父路径时重定向到默认子页（链路追踪），子路由激活时渲染 <Outlet/>。
 */
const Observability: React.FC = () => {
  const {projectId} = useParams<{ projectId: string }>();
  const {pathname} = useLocation();
  const base = `/project/${projectId}/observability`;

  if (pathname.replace(/\/$/, '') === base) {
    return <Navigate to={`${base}/traces`} replace/>;
  }
  return <Outlet/>;
};

export default Observability;

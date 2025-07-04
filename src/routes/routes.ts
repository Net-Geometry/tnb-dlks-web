import { lazy } from "react";

// Lazy load components for better performance
const DashboardHome = lazy(
  () => import("@/components/dashboard/DashboardHome")
);
const WorkManagement = lazy(
  () => import("@/components/modules/WorkManagement")
);
const AMKAKKManagement = lazy(
  () => import("@/components/modules/AMKAKKManagement")
);
const AMKForm = lazy(() => import("@/components/modules/AMKForm"));
const AKKForm = lazy(() => import("@/components/modules/AKKForm"));
const PurchaseOrder = lazy(() => import("@/components/modules/PurchaseOrder"));
const CreatePurchaseOrderPage = lazy(
  () => import("@/components/modules/CreatePurchaseOrderPage")
);
const PurchaseOrderDetail = lazy(
  () => import("@/components/modules/PurchaseOrderDetail")
);
const PurchaseOrderWorkSummary = lazy(
  () => import("@/components/modules/PurchaseOrderWorkSummary")
);
const NewLKHPage = lazy(() => import("@/components/modules/NewLKHPage"));
const LKHDetail = lazy(() => import("@/components/modules/LKHDetail"));
const LKSSubmissionPage = lazy(
  () => import("@/components/modules/LKSSubmissionPage")
);
const LKSStatus = lazy(() => import("@/components/modules/LKSStatus"));
const LKSDetail = lazy(() => import("@/components/modules/LKSDetail"));
const JIBModule = lazy(() => import("@/components/modules/JIBModule"));
const UserManagement = lazy(
  () => import("@/components/modules/UserManagement")
);
const Settings = lazy(() => import("@/components/modules/Settings"));
const WorkOrderDetailWrapper = lazy(
  () => import("@/components/modules/WorkOrderDetailWrapper")
);

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  title: string;
  module: string;
}

// Organized routes by module
export const ProtectedRoutes: RouteConfig[] = [
  // Dashboard Module
  {
    path: "/dashboard",
    element: DashboardHome,
    title: "Dashboard Home",
    module: "Dashboard",
  },

  // Work Management Module
  {
    path: "/work-management",
    element: AMKAKKManagement,
    title: "Work Management",
    module: "Work Management",
  },
  {
    path: "/work-order/detail/:id/:documentType",
    element: WorkOrderDetailWrapper,
    title: "Work Order Detail",
    module: "Work Management",
  },
  {
    path: "/amk-form",
    element: AMKForm,
    title: "AMK Form",
    module: "AMK/AKK Management",
  },
  {
    path: "/akk-form",
    element: AKKForm,
    title: "AKK Form",
    module: "AMK/AKK Management",
  },

  // Purchase Order Module
  {
    path: "/purchase-order",
    element: PurchaseOrder,
    title: "Purchase Orders",
    module: "Purchase Order",
  },
  {
    path: "/purchase-order/create",
    element: CreatePurchaseOrderPage,
    title: "Create Purchase Order",
    module: "Purchase Order",
  },
  {
    path: "/purchase-order/detail/:id",
    element: PurchaseOrderDetail,
    title: "Purchase Order Detail",
    module: "Purchase Order",
  },
  {
    path: "/purchase-order/work-summary/:id",
    element: PurchaseOrderWorkSummary,
    title: "Purchase Order Work Summary",
    module: "Purchase Order",
  },

  // LKH Module
  {
    path: "/purchase-order/work-summary/:id/new-lkh/:serviceId",
    element: NewLKHPage,
    title: "New LKH",
    module: "LKH",
  },
  {
    path: "/lkh-detail/:id",
    element: LKHDetail,
    title: "LKH Detail",
    module: "LKH",
  },

  // LKS Module
  {
    path: "/lks-submission",
    element: LKSSubmissionPage,
    title: "LKS Submission",
    module: "LKS",
  },
  {
    path: "/lks-status",
    element: LKSStatus,
    title: "LKS Status",
    module: "LKS",
  },
  {
    path: "/lks-detail/:id",
    element: LKSDetail,
    title: "LKS Detail",
    module: "LKS",
  },

  // JIB Module
  // {
  //   path: "/jib",
  //   element: JIBModule,
  //   title: "JIB",
  //   module: "JIB",
  // },

  // Administration Module
  {
    path: "/user-management",
    element: UserManagement,
    title: "User Management",
    module: "Administration",
  },
  {
    path: "/settings",
    element: Settings,
    title: "Settings",
    module: "Administration",
  },
];

// Group routes by module for easier navigation
export const routesByModule = ProtectedRoutes.reduce((acc, route) => {
  if (!acc[route.module]) {
    acc[route.module] = [];
  }
  acc[route.module].push(route);
  return acc;
}, {} as Record<string, RouteConfig[]>);

// Get all modules
export const modules = Object.keys(routesByModule).sort();

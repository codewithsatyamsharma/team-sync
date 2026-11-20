import Chat from "../../features/chats/ui/pages/Chat";
import Home from "../../features/dashboard/ui/pages/Home";
import Setting from "../../features/settings/ui/pages/Setting";
import Profile from "../../features/employee module/profile/ui/pages/Profile";
import Attendance from "../../features/employee module/Attendance/ui/pages/Attendance";
import Document from "../../features/admin module/documents/ui/pages/Document";

export let commonRoutes = [
  {
    path: "",
    element: <Home />,
  },
  {
    path: "chat",
    element: <Chat />,
  },
  {
    path: "setting",
    element: <Setting />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  { path: "attendance", element: <Attendance /> },
  { path: "document", element: <Document /> },
];

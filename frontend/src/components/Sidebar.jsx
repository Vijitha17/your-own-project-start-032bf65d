import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { menuByRole } from "@/data/menuData";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = React.useState("");
  const [menuItems, setMenuItems] = React.useState([]);

  React.useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      setRole(userRole);
      const items = menuByRole[userRole] || [];
      setMenuItems(items);
    }
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleMenuClick = (item) => {
    if (item.path) navigate(item.path);
  };

  return (
    <aside
      className={cn(
        "bg-sidebar fixed inset-y-0 left-0 z-20 flex flex-col border-r border-sidebar-border",
        "transition-[transform,width] duration-300 ease-in-out",
        isOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <h2 className={cn(
          "text-lg font-bold text-sidebar-foreground",
          isOpen ? "block" : "hidden md:block"
        )}>
          {isOpen ? "College IMS" : "IMS"}
        </h2>
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-sidebar-accent"
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5 text-sidebar-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-sidebar-foreground" />
          )}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <div key={item.title} className="py-1">
              <button
                onClick={() => handleMenuClick(item)}
                className={cn(
                  "group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium",
                  "transition-colors duration-200",
                  isActive(item.path)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {item.icon && (
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isOpen ? "mr-3" : "mx-auto"
                  )} />
                )}
                {isOpen && (
                  <span className="flex-1 truncate">{item.title}</span>
                )}
              </button>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
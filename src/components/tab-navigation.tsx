"use client";

import { Home, XCircle } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  isActive?: boolean;
  onClose?: () => void;
}

interface TabNavigationProps {
  tabs?: Tab[];
  activeTabId?: string;
  onTabClose?: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs = [{ id: "admin-settings", label: "Admin Settings", isActive: true }],
  activeTabId,
  onTabClose,
}) => {
  const handleTabClose = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onTabClose?.(tabId);
  };

  return (
    <div className="bg-blue-600">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end h-12">
          {/* Home Icon */}
          <div className="flex items-center justify-center w-12 h-12 bg-blue-600 mr-2">
            <Home className="h-4 w-4 text-white" />
          </div>

          {/* Tabs */}
          <div className="flex items-end space-x-0">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`relative flex items-center px-4 py-2 rounded-t-lg transition-all duration-200 ${
                  tab.isActive || tab.id === activeTabId
                    ? "bg-white text-gray-900"
                    : "bg-blue-500 text-white hover:bg-blue-400"
                }`}
              >
                <span className="text-sm font-medium pr-2">{tab.label}</span>

                {/* Close button */}
                <button
                  onClick={(e) => handleTabClose(tab.id, e)}
                  className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-200 transition-colors duration-200"
                >
                  <XCircle className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;

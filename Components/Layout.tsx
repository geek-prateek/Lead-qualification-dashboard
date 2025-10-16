'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Phone, 
  Moon, 
  Sun,
  LogOut,
  Menu,
  X
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    roles: ["admin", "user"]
  },
  {
    title: "Webhook Data",
    url: "/webhook-data",
    icon: Phone,
    roles: ["admin", "user"]
  },
  {
    title: "Admin Panel",
    url: "/admin",
    icon: Users,
    roles: ["admin"]
  }
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Mock user data - in a real app, this would come from authentication
    setUser({
      full_name: "Admin User",
      email: "admin@bolna.ai",
      role: "admin"
    });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    // Mock logout functionality
    console.log('Logging out...');
  };

  const filteredNavItems = navigationItems.filter(item => 
    !user || item.roles.includes(user.role)
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
        <style>{`
          :root {
            --sidebar-background: 255 255 255;
            --sidebar-foreground: 15 23 42;
            --sidebar-border: 226 232 240;
          }
          .dark {
            --sidebar-background: 10 10 10;
            --sidebar-foreground: 248 250 252;
            --sidebar-border: 30 30 30;
          }
        `}</style>
        
        <Sidebar className="border-r border-gray-200 dark:border-[#1e1e1e]">
          <SidebarHeader className="border-b border-gray-200 dark:border-[#1e1e1e] p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">Bolna CRM</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI Call Analytics</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 rounded-xl mb-1 ${
                          pathname === item.url 
                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Link href={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 dark:border-[#1e1e1e] p-4 space-y-3">
            <Button
              variant="ghost"
              onClick={toggleDarkMode}
              className="w-full justify-start gap-3 hover:bg-gray-100 dark:hover:bg-[#1e1e1e] text-gray-700 dark:text-gray-300"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </Button>
            
            {user && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#141414]">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                    {user.full_name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {user.full_name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col md:ml-64">
          <header className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-[#1e1e1e] px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 dark:hover:bg-[#1e1e1e] p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bolna CRM</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

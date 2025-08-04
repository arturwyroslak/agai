"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Bot, BarChart3, Settings, Zap, FileText, Menu, LogOut, User, Wrench, Brain, Activity } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Neural Core", href: "/dashboard", icon: Brain },
  { name: "Chatbots", href: "/dashboard/chatbots", icon: Bot },
  { name: "Agents", href: "/dashboard/agents", icon: Zap },
  { name: "Providers", href: "/dashboard/providers", icon: Settings },
  { name: "Tools", href: "/dashboard/tools", icon: Wrench },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Neural Logs", href: "/dashboard/logs", icon: FileText },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex flex-col h-full bg-glass-dark border-r border-primary/20", mobile ? "w-full" : "w-64")}>
      {/* Logo */}
      <div className="flex items-center px-6 py-6 border-b border-primary/20">
        <div className="relative">
          <Bot className="h-8 w-8 text-primary" />
          <div className="absolute inset-0 h-8 w-8 rounded-full bg-primary/10 blur-md"></div>
        </div>
        <div className="ml-3">
          <span className="text-xl font-bold neon-text">AI Platform</span>
          <div className="text-xs text-muted-foreground font-mono">Neural Command Center</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => mobile && setSidebarOpen(false)}
              className={cn(
                "sidebar-nav-item group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 relative",
                isActive
                  ? "active bg-primary/8 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/4 hover:border-l-2 hover:border-primary/30",
              )}
            >
              <item.icon className="mr-3 h-5 w-5 transition-colors" />
              <span className="font-mono tracking-wide">{item.name}</span>
              {isActive && <div className="absolute right-2 w-2 h-2 bg-primary rounded-full opacity-60"></div>}
            </Link>
          )
        })}
      </nav>

      {/* System Status */}
      <div className="px-4 py-4 border-t border-primary/20">
        <div className="hud-card p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-muted-foreground">SYSTEM STATUS</span>
            <Activity className="h-3 w-3 text-success" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Neural Link</span>
              <span className="text-success font-mono">ACTIVE</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">AI Cores</span>
              <span className="text-primary font-mono">3/3</span>
            </div>
          </div>
        </div>
      </div>

      {/* User section */}
      <div className="p-4 border-t border-primary/20">
        <div className="hud-card p-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border border-primary/30">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback className="bg-primary/20 text-primary font-mono">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate font-mono">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                <span className="text-xs text-success font-mono">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-glass-dark border-primary/20">
          <Sidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-glass border-b border-primary/20 backdrop-blur-xl">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden px-4 border-r border-primary/20 hover:bg-primary/10 text-primary"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
          </Sheet>

          <div className="flex-1 px-4 flex justify-between items-center">
            {/* System Info */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-success">NEURAL LINK ACTIVE</span>
              </div>
              <div className="text-xs text-muted-foreground font-mono">{new Date().toLocaleTimeString()}</div>
            </div>

            <div className="ml-4 flex items-center md:ml-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full hover:bg-primary/10 border border-primary/20"
                  >
                    <Avatar className="h-8 w-8 border border-primary/30">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                      <AvatarFallback className="bg-primary/20 text-primary font-mono">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 dropdown-content" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground font-mono">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      <div className="flex items-center mt-2">
                        <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                        <span className="text-xs text-success font-mono">NEURAL LINK ACTIVE</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/20" />
                  <DropdownMenuItem className="dropdown-item font-mono">
                    <User className="mr-2 h-4 w-4" />
                    <span>Neural Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dropdown-item font-mono">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>System Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary/20" />
                  <DropdownMenuItem onClick={handleLogout} className="dropdown-item text-destructive font-mono">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Disconnect</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

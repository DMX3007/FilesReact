"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../../shared/lib/utils"
import { Button } from "../../shared/ui/Button/Button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../../shared/ui/NavigationMenu/NavigationMenu"
import { Avatar, AvatarFallback } from "../../shared/ui/Avatar/Avatar"
import { Menu, X } from "lucide-react"

interface UserAccount {
  username: string
  password: string
}

export default function Navigation() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const account = { name: "Test Account" }
  
  let user = JSON.parse(localStorage.getItem('user')) as UserAccount
  if (!user) user = { username: "User Name", password: 'none' }
  
  const navItems = [
    { name: "Journals", href: "/journal" },
    { name: "Reports", href: "/reports" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Filebump Web</span>
          </Link>
          <span className="text-sm text-muted-foreground hidden md:inline-block">{account.name}</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                    <Link to={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        location.pathname === item.href && "bg-accent text-accent-foreground",
                      )}
                    >
                      {item.name}
                    </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm">{user.username}</span>
            <Avatar className="h-8 w-8">
              <AvatarFallback>{user.username}</AvatarFallback>
            </Avatar>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium",
                    location.pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="mt-6 pt-6 border-t flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{account.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{user.username}</span>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user.username.split(' ').map((item)=> item[0].toUpperCase()).join('')}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

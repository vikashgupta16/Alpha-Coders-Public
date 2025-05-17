
'use client';

import Link from 'next/link';
import { Logo } from '@/components/core/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, LogIn, LogOut, UserCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { navItems } from '@/lib/placeholder-data';
import type { NavItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { ThemeToggle } from '@/components/core/theme-toggle'; // Temporarily commented out

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signInWithGoogle, signOut, isLoading, authAvailable } = useAuth();

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const renderNavLinks = (itemClass = "") => navItems.map((item) => (
    <Button key={item.label} variant="ghost" asChild className={cn("text-foreground hover:text-primary hover:bg-primary/10", itemClass)}>
      <Link href={item.href} onClick={handleLinkClick}>
        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
        {item.label}
      </Link>
    </Button>
  ));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="hidden md:flex items-center space-x-1">
          {renderNavLinks()}
        </nav>
        <div className="flex items-center gap-2">
          {/* <ThemeToggle /> */} {/* Temporarily commented out */}
          {!authAvailable ? (
             <Button variant="outline" size="sm" disabled className="border-destructive text-destructive h-8">
              <AlertTriangle className="mr-2 h-4 w-4" /> Auth Unavailable
            </Button>
          ) : isLoading ? (
            <Button variant="ghost" size="icon" disabled className="h-8 w-8 rounded-full">
                <Loader2 className="h-5 w-5 animate-spin" />
            </Button>
          ) : user ? (
            <>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                <AvatarFallback>
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() :
                   user.email ? user.email.charAt(0).toUpperCase() : <UserCircle className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={signOut} className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground h-8">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={signInWithGoogle} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground h-8">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          )}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-primary" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs bg-background p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold text-primary">Menu</span>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-6 w-6 text-primary" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="flex flex-col space-y-3">
                  {renderNavLinks("justify-start w-full text-lg py-3 px-2")}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ExternalLink, Frame, FolderOpen, LayoutDashboard, LogOut, Package } from 'lucide-react';
import { site } from '../../data/site';
import { logout, selectAuthUser } from '../../store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { cn } from '../../utils/cn';

const nav = [
{ label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
{ label: 'Artworks', to: '/admin/artworks', icon: Frame, end: false },
{ label: 'Orders', to: '/admin/orders', icon: Package, end: false },
{ label: 'Collections', to: '/admin/collections', icon: FolderOpen, end: false }];


export function AdminSidebar({ onNavigate }: {onNavigate?: () => void;}) {
  const dispatch = useAppDispatch();
  const email = useAppSelector(selectAuthUser)?.email;
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-sidebar-border px-6 py-6">
        <Link to="/admin" onClick={onNavigate} className="font-serif text-2xl">
          {site.name}
        </Link>
        <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Studio admin</p>
      </div>
      <nav aria-label="Admin" className="flex-1 px-3 py-5">
        <ul className="space-y-1">
          {nav.map((item) =>
          <li key={item.to}>
              <NavLink
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring',
                isActive ? 'bg-foreground text-ivory' : 'text-[#4a443d] hover:bg-sidebar-accent'
              )
              }>
              
                <item.icon className="size-4" aria-hidden="true" strokeWidth={1.75} />
                {item.label}
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <div className="space-y-3 border-t border-sidebar-border px-6 py-5 text-sm">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ExternalLink className="size-3.5" aria-hidden="true" />
          View public site
        </Link>
        <p className="truncate text-xs text-muted-foreground">Signed in as {email}</p>
        <button
          type="button"
          onClick={() => {
            // Signs out locally at once; the server is told to end the session in the background
            void dispatch(logout());
            navigate('/admin/login');
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
          
          <LogOut className="size-3.5" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>);

}
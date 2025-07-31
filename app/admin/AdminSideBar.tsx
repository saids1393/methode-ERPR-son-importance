'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
  Settings,
  Home,
  UserPlus,
  Edit,
  Trash2,
  Database,
  Shield,
  Bell,
  FileText,
  DollarSign,
  Activity,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Download
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Vue d\'ensemble',
      items: [
        { name: 'Dashboard', href: '/admin', icon: BarChart3 },
        { name: 'Statistiques', href: '/admin/stats', icon: TrendingUp },
        { name: 'Activité', href: '/admin/activity', icon: Activity },
      ]
    },
    {
      title: 'Gestion',
      items: [
        { name: 'Utilisateurs', href: '/admin/users', icon: Users },
        { name: 'Ajouter Utilisateur', href: '/admin/users/create', icon: UserPlus },
        { name: 'Vidéos', href: '/admin/videos', icon: Settings },
        { name: 'Contenu', href: '/admin/content', icon: FileText },
      ]
    },
    {
      title: 'Finances',
      items: [
        { name: 'Revenus', href: '/admin/revenue', icon: DollarSign },
        { name: 'Paiements', href: '/admin/payments', icon: Calendar },
        { name: 'Rapports', href: '/admin/reports', icon: Download },
      ]
    },
    {
      title: 'Système',
      items: [
        { name: 'Base de données', href: '/admin/database', icon: Database },
        { name: 'Sécurité', href: '/admin/security', icon: Shield },
        { name: 'Logs', href: '/admin/logs', icon: Bell },
      ]
    }
  ];

  return (
    <>
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-transform duration-300 ease-in-out
        w-56 sm:w-64 bg-zinc-800 border-r border-zinc-700 flex flex-col
      `}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-700">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 sm:p-2 rounded-lg group-hover:scale-110 transition-transform">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Admin Panel</h2>
              <p className="text-xs text-zinc-400 hidden sm:block">Méthode ERPR</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="space-y-4 sm:space-y-6">
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 sm:mb-3 px-2">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    
                    return (
                      <li key={itemIndex}>
                        <Link
                          href={item.href}
                          className={`
                            flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base
                            ${isActive 
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                              : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
                            }
                          `}
                        >
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                          <span className="font-medium hidden sm:inline">{item.name}</span>
                          <span className="font-medium sm:hidden text-xs">{item.name.split(' ')[0]}</span>
                          {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-700">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 text-zinc-300 hover:bg-zinc-700 hover:text-white rounded-lg transition-all duration-200 text-sm sm:text-base"
          >
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium hidden sm:inline">Retour au site</span>
            <span className="font-medium sm:hidden">Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BookOpen,
    Search,
    Home,
    FileText,
    ClipboardList,
    Info,
    X,
    Lightbulb,
    BarChart,
} from 'lucide-react';

interface DashboardSidebarProps {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export default function DashboardSidebar({
    mobileMenuOpen,
    setMobileMenuOpen
}: DashboardSidebarProps) {
    const pathname = usePathname(); // URL active

    return (
        <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6">
                {/* Logo */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-white " />
                        </div>
                        <span className="md:text-xl sm:text-sm font-bold text-gray-900">Méthode ERPR</span>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                    {/* Dashboard */}
                    <Link
                        href="/dashboard"
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${pathname === "/dashboard"
                                ? "text-blue-800 bg-blue-100"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <Home className="h-5 w-5" />
                        <span>Tableau de bord</span>
                    </Link>

                    {/* Cours */}
                    <button
                        onClick={() => {
                            console.log('🎯 ===== CLIC BOUTON COMMENCER =====');
                            localStorage.setItem('courseStarted', 'true');

                            fetch('/api/auth/time/start', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                            }).then(response => {
                                console.log('🚀 RÉPONSE START TIMER:', response.status);
                                if (response.ok) {
                                    console.log('✅ CHRONO DÉMARRÉ EN DB');
                                    window.location.href = '/chapitres/0/introduction';
                                }
                            }).catch(error => {
                                console.error('❌ ERREUR START TIMER:', error);
                                window.location.href = '/chapitres/0/introduction';
                            });
                            setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${pathname.startsWith("/chapitres")
                                ? "text-blue-800 bg-blue-100 font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                    >
                        <BookOpen className="h-5 w-5" />
                        <span>Cours</span>
                    </button>

                    {/* Accompagnement */}
                    <Link
                        href="/accompagnement"
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors relative ${pathname === "/accompagnement"
                                ? "text-blue-800 bg-blue-100 font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FileText className="h-5 w-5" />
                        <span>Accompagnement</span>
                        {/* point bleu dynamique */}
                        {pathname === "/accompagnement" && (
                            <div className="w-2 h-2 bg-blue-800 rounded-full ml-auto"></div>
                        )}
                    </Link>

                    {/* Devoirs */}
                    <Link
                        href="/devoirs"
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${pathname === "/devoirs"
                                ? "text-blue-800 bg-blue-100 font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <ClipboardList className="h-5 w-5" />
                        <span>Devoirs</span>
                    </Link>

                    {/* Notice */}
                    <Link
                        href="/notice"
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${pathname === "/notice"
                                ? "text-blue-800 bg-blue-100 font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <Info className="h-5 w-5" />
                        <span>Notice</span>
                    </Link>

                    {/* Conseil */}
                    <Link
                        href="/conseil"
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${pathname === "/conseil"
                                ? "text-blue-800 bg-blue-100 font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <Lightbulb className="h-5 w-5" />
                        <span>Conseil</span>
                    </Link>

                    {/* Niveaux */}
                    <Link
                        href="/niveaux"
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${pathname === "/niveaux"
                                ? "text-blue-800 bg-blue-100 font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <BarChart className="h-5 w-5" />
                        <span>Niveaux</span>
                    </Link>
                </nav>
            </div>
        </div>
    );
}

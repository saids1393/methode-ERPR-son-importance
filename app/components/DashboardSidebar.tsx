'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
    Lock,
} from 'lucide-react';
import FreeTrialRestrictionModal from './FreeTrialRestrictionModal';

interface User {
    id: string;
    email: string;
    username: string | null;
    gender: 'HOMME' | 'FEMME' | null;
    isActive: boolean;
    accountType?: 'FREE_TRIAL' | 'PAID_FULL' | 'PAID_PARTIAL';
}

interface DashboardSidebarProps {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    user: User;
}

export default function DashboardSidebar({
    mobileMenuOpen,
    setMobileMenuOpen,
    user
}: DashboardSidebarProps) {
    const pathname = usePathname(); // URL active
    const isDesktop = window.innerWidth >= 1024;
    const [showRestrictionModal, setShowRestrictionModal] = useState(false);
    const [restrictedContent, setRestrictedContent] = useState('');

    const handleRestrictedClick = (contentName: string) => {
        setRestrictedContent(contentName);
        setShowRestrictionModal(true);
    };

    return (
        <>
            <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6">
                    {/* Logo */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-1">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                                <img
                                    src="/img/logo-bleu-fonce-point.png" // 👉 remplace par ton chemin d'image
                                    alt="Logo Méthode ERPR"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="md:text-xl sm:text-sm font-bold text-gray-900" style={{
                                fontFamily: "'Spectral', serif",
                                fontSize: isDesktop ? "1.4rem" : "1.2rem",
                            }}>Méthode ERPR</span>
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
                                        window.location.href = '/chapitres/0/video';
                                    }
                                }).catch(error => {
                                    console.error('❌ ERREUR START TIMER:', error);
                                    window.location.href = '/chapitres/0/video';
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
                            href={user.accountType === 'FREE_TRIAL' ? "#" : "/accompagnement"}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors relative ${user.accountType === 'FREE_TRIAL'
                                ? "text-gray-400 cursor-not-allowed opacity-60"
                                : pathname === "/accompagnement"
                                    ? "text-blue-800 bg-blue-100 font-medium"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                            onClick={(e) => {
                                if (user.accountType === 'FREE_TRIAL') {
                                    e.preventDefault();
                                    handleRestrictedClick('Accompagnement');
                                } else {
                                    setMobileMenuOpen(false);
                                }
                            }}
                        >
                            <FileText className="h-5 w-5" />
                            <span>Accompagnement</span>
                            {user.accountType === 'FREE_TRIAL' && (
                                <Lock className="h-4 w-4 ml-auto text-gray-400" />
                            )}
                            {/* point bleu dynamique */}
                            {user.accountType !== 'FREE_TRIAL' && pathname === "/accompagnement" && (
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
                            href={user.accountType === 'FREE_TRIAL' ? "#" : "/conseil"}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${user.accountType === 'FREE_TRIAL'
                                ? "text-gray-400 cursor-not-allowed opacity-60"
                                : pathname === "/conseil"
                                    ? "text-blue-800 bg-blue-100 font-medium"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                            onClick={(e) => {
                                if (user.accountType === 'FREE_TRIAL') {
                                    e.preventDefault();
                                    handleRestrictedClick('Conseil');
                                } else {
                                    setMobileMenuOpen(false);
                                }
                            }}
                        >
                            <Lightbulb className="h-5 w-5" />
                            <span>Conseil</span>
                            {user.accountType === 'FREE_TRIAL' && (
                                <Lock className="h-4 w-4 ml-auto text-gray-400" />
                            )}
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

            <FreeTrialRestrictionModal
                isOpen={showRestrictionModal}
                onClose={() => setShowRestrictionModal(false)}
                contentName={restrictedContent}
            />
        </>
    );
}
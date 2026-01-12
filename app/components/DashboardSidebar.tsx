'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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
    CreditCard,
} from 'lucide-react';

interface DashboardSidebarProps {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export default function DashboardSidebar({
    mobileMenuOpen,
    setMobileMenuOpen,
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const [isDesktop, setIsDesktop] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    // Initialiser le module depuis localStorage (après montage pour éviter erreur SSR)
    const [selectedModule, setSelectedModule] = useState<'LECTURE' | 'TAJWID'>('LECTURE');
    const [userPlan, setUserPlan] = useState<'SOLO' | 'COACHING' | null>(null);
    
    // Charger le module sélectionné et le plan utilisateur depuis localStorage au montage
    useEffect(() => {
        const savedModule = localStorage.getItem('selectedDashboardModule');
        if (savedModule === 'TAJWID' || savedModule === 'LECTURE') {
            setSelectedModule(savedModule);
        }
        
        // Récupérer le plan utilisateur
        const fetchUserPlan = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUserPlan(data.subscriptionPlan || null);
                }
            } catch (error) {
                console.error('Erreur récupération plan:', error);
            }
        };
        fetchUserPlan();
        
        setMounted(true);
    }, []);
    
    // Recherche
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    
    // URL du cours selon le module sélectionné
    const coursUrl = selectedModule === 'TAJWID' ? '/chapitres-tajwid/1/1' : '/chapitres/1/1';
    
    // URL des devoirs selon le module sélectionné
    const devoirsUrl = selectedModule === 'TAJWID' ? '/devoirs-tajwid' : '/devoirs';
    
    const searchItems = [
        { label: 'Tableau de bord', href: '/dashboard', keywords: ['dashboard', 'tableau'] },
        { label: 'Cours', href: coursUrl, keywords: ['cours', 'chapitre', 'leçon', 'lecon'] },
        { label: 'Accompagnement', href: '/accompagnement', keywords: ['accompagnement', 'support'] },
        { label: 'Devoirs', href: devoirsUrl, keywords: ['devoir', 'devoirs', 'homework'] },
        { label: 'Notice', href: '/notice', keywords: ['notice', 'aide', 'help'] },
        { label: 'Conseil', href: '/conseil', keywords: ['conseil', 'astuce', 'tips'] },
        { label: 'Niveaux', href: '/niveaux', keywords: ['niveaux', 'niveau', 'progression'] },
    ];
    
    const norm = (s: string) => s.toLowerCase();
    const results = query.trim()
        ? searchItems.filter(i =>
            norm(i.label).includes(norm(query)) ||
            i.keywords.some(k => norm(k).includes(norm(query)) || norm(query).includes(norm(k)))
          )
        : [];

    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    const handleCoursClick = () => {
        localStorage.setItem('courseStarted', 'true');
        // Signaler qu'il faut ouvrir la sidebar cours automatiquement
        localStorage.setItem('autoOpenCourseSidebar', 'true');
        
        // Démarrer le timer
        fetch('/api/auth/time/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        }).catch(console.error);
        
        setMobileMenuOpen(false);
    };

    return (
        <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <div className="p-6">
                {/* Logo */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-1">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                            <img
                                src="/img/logo-bleu-fonce-point.png"
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
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
                        onFocus={() => setShowResults(true)}
                        onBlur={() => setTimeout(() => setShowResults(false), 150)}
                        placeholder="Rechercher..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {showResults && results.length > 0 && (
                      <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {results.map((r) => (
                          <Link
                            key={r.href}
                            href={r.href}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => { setMobileMenuOpen(false); setShowResults(false); setQuery(''); }}
                          >
                            {r.label}
                          </Link>
                        ))}
                      </div>
                    )}
                </div>

                {/* Navigation - Tout est accessible pour les abonnés */}
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
                    <Link
                        href={coursUrl}
                        onClick={handleCoursClick}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            pathname.startsWith("/chapitres")
                                ? "text-blue-800 bg-blue-100 font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                    >
                        <BookOpen className="h-5 w-5" />
                        <span>Cours</span>
                    </Link>

                    {/* Accompagnement - Réservé au plan COACHING */}
                    {userPlan === 'COACHING' ? (
                        <Link
                            href="/accompagnement"
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                pathname === "/accompagnement"
                                    ? "text-blue-800 bg-blue-100 font-medium"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <FileText className="h-5 w-5" />
                            <span>Accompagnement</span>
                        </Link>
                    ) : (
                        <div
                            className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-400 cursor-not-allowed"
                            title="Réservé au plan Coaching"
                        >
                            <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5" />
                                <span>Accompagnement</span>
                            </div>
                            <Lock className="h-4 w-4" />
                        </div>
                    )}

                    {/* Devoirs */}
                    <Link
                        href={devoirsUrl}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            pathname === "/devoirs" || pathname === "/devoirs-tajwid"
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
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            pathname === "/conseil"
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
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            pathname === "/niveaux"
                                ? "text-blue-800 bg-blue-100 font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <BarChart className="h-5 w-5" />
                        <span>Niveaux</span>
                    </Link>

                    {/* Séparateur */}
                    <div className="my-4 border-t border-gray-200"></div>

                    {/* Abonnement */}
                    <Link
                        href="/abonnement"
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            pathname === "/abonnement"
                                ? "text-blue-800 bg-blue-100 font-medium"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <CreditCard className="h-5 w-5" />
                        <span>Abonnement</span>
                    </Link>
                </nav>
            </div>
        </div>
    );
}
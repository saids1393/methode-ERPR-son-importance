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
} from 'lucide-react';
import FreeTrialRestrictionModal from './FreeTrialRestrictionModal';

interface User {
    id: string;
    email: string;
    username: string | null;
    gender: 'HOMME' | 'FEMME' | null;
    isActive: boolean;
    accountType?: 'FREE_TRIAL' | 'PAID_FULL' | 'PAID_PARTIAL';
    trialExpired?: boolean;
}

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
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showRestrictionModal, setShowRestrictionModal] = useState(false);
    const [restrictedContent, setRestrictedContent] = useState('');
    // Recherche en dur (peu d'infos)
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchItems = [
        { label: 'Tableau de bord', href: '/dashboard', keywords: ['dashboard', 'tableau'] },
        { label: 'Cours', href: '/chapitres/0/video', keywords: ['cours', 'chapitre', 'leçon', 'lecon'] },
        { label: 'Accompagnement', href: '/accompagnement', keywords: ['accompagnement', 'support'] },
        { label: 'Devoirs', href: '/devoirs', keywords: ['devoir', 'devoirs', 'homework'] },
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

    // Fonction pour récupérer l'utilisateur avec les restrictions actuelles
    const fetchUser = async () => {
        try {
            console.log('🔄 Fetching user data from /api/auth/get-user');
            const res = await fetch('/api/auth/get-user', {
                // Désactiver le cache pour toujours avoir les données fraiches
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            });
            
            if (res.ok) {
                const data = await res.json();
                console.log('📥 Raw API Response:', data);
                if (data.success && data.user) {
                    setUser(data.user);
                    console.log('✅ User state updated:', {
                        email: data.user.email,
                        accountType: data.user.accountType,
                        trialExpired: data.user.trialExpired,
                    });
                } else {
                    console.log('❌ API response missing user data:', data);
                }
            } else {
                console.log('❌ API request failed:', res.status, res.statusText);
            }
        } catch (error) {
            console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
        } finally {
            setLoading(false);
        }
    };

    // Récupération initiale
    useEffect(() => {
        fetchUser();
    }, []);

    // Mettre à jour à chaque focus (tab switch, reconnexion)
    useEffect(() => {
        const handleFocus = () => {
            console.log('🔄 Window focus - Rafraîchissement utilisateur');
            fetchUser();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log('🔄 Tab visible - Rafraîchissement utilisateur');
                fetchUser();
            }
        };

        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Mettre à jour aussi quand le pathname change (navigation)
    useEffect(() => {
        console.log('🔄 Pathname changed - Rafraîchissement utilisateur');
        fetchUser();
    }, [pathname]);

    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    const handleRestrictedClick = (contentName: string) => {
        setRestrictedContent(contentName);
        setShowRestrictionModal(true);
    };

    const isLocked = (page: string): boolean => {
        if (!user) return false;

        console.log(`🔐 Vérification restriction ${page}:`, {
            accountType: user.accountType,
            trialExpired: user.trialExpired,
        });

        // Si compte payant complet: rien n'est locked
        if (user.accountType === 'PAID_FULL') {
            console.log(`  -> Premium: ${page} DÉVERROUILLÉ ✅`);
            return false;
        }

        // Si FREE_TRIAL
        if (user.accountType === 'FREE_TRIAL') {
            // Si trial expiré: tout est locked sauf notice et dashboard
            if (user.trialExpired) {
                const locked = page !== 'notice' && page !== 'dashboard';
                console.log(`  -> Trial expiré: ${page} est ${locked ? 'LOCKED ❌' : 'DÉVERROUILLÉ ✅'}`);
                return locked;
            }
            
            // Si trial actif: bloquer seulement accompagnement et conseil
            // Cours (chapitres 0-1), devoirs et niveaux sont accessibles
            const locked = page === 'accompagnement' || page === 'conseil';
            console.log(`  -> Trial actif: ${page} est ${locked ? 'LOCKED ❌' : 'DÉVERROUILLÉ ✅'}`);
            return locked;
        }

        return false;
    };

    if (loading) {
        return (
            <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6">
                    {/* Logo skeleton */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-1">
                            <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Search skeleton */}
                    <div className="relative mb-8">
                        <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Navigation skeleton */}
                    <nav className="space-y-2">
                        {/* Dashboard skeleton */}
                        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50 animate-pulse">
                            <div className="w-5 h-5 bg-gray-200 rounded"></div>
                            <div className="h-4 w-28 bg-gray-200 rounded"></div>
                        </div>

                        {/* Menu items skeleton */}
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="space-y-2">
                                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg">
                                    <div className="w-5 h-5 bg-gray-200 animate-pulse rounded"></div>
                                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Loading text */}
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center space-x-2 text-gray-500">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                            <span className="text-sm">Chargement...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!user) return null;

    return (
        <>
            <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
                                if (isLocked('cours')) {
                                    handleRestrictedClick('Cours');
                                } else {
                                    console.log('🎯 ===== CLIC BOUTON COURS =====');
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
                                }
                                setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isLocked('cours')
                                ? "text-gray-400 opacity-60"
                                : pathname.startsWith("/chapitres")
                                    ? "text-blue-800 bg-blue-100 font-medium"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                        >
                            <BookOpen className="h-5 w-5" />
                            <span>Cours</span>
                            {isLocked('cours') && (
                                <Lock className="h-4 w-4 ml-auto text-gray-400" />
                            )}
                        </button>

                        {/* Accompagnement */}
                        {isLocked('accompagnement') ? (
                            <button
                                onClick={() => handleRestrictedClick('Accompagnement')}
                                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-400 opacity-60"
                            >
                                <FileText className="h-5 w-5" />
                                <span>Accompagnement</span>
                                <Lock className="h-4 w-4 ml-auto text-gray-400" />
                            </button>
                        ) : (
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
                                {pathname === "/accompagnement" && (
                                    <div className="w-2 h-2 bg-blue-800 rounded-full ml-auto"></div>
                                )}
                            </Link>
                        )}

                        {/* Devoirs */}
                        {isLocked('devoirs') ? (
                            <button
                                onClick={() => handleRestrictedClick('Devoirs')}
                                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-400 opacity-60"
                            >
                                <ClipboardList className="h-5 w-5" />
                                <span>Devoirs</span>
                                <Lock className="h-4 w-4 ml-auto text-gray-400" />
                            </button>
                        ) : (
                            <Link
                                href="/devoirs"
                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                    pathname === "/devoirs"
                                        ? "text-blue-800 bg-blue-100 font-medium"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <ClipboardList className="h-5 w-5" />
                                <span>Devoirs</span>
                                {pathname === "/devoirs" && (
                                    <div className="w-2 h-2 bg-blue-800 rounded-full ml-auto"></div>
                                )}
                            </Link>
                        )}

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
                        {isLocked('conseil') ? (
                            <button
                                onClick={() => handleRestrictedClick('Conseil')}
                                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-400 opacity-60"
                            >
                                <Lightbulb className="h-5 w-5" />
                                <span>Conseil</span>
                                <Lock className="h-4 w-4 ml-auto text-gray-400" />
                            </button>
                        ) : (
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
                                {pathname === "/conseil" && (
                                    <div className="w-2 h-2 bg-blue-800 rounded-full ml-auto"></div>
                                )}
                            </Link>
                        )}

                        {/* Niveaux */}
                        {isLocked('niveaux') ? (
                            <button
                                onClick={() => handleRestrictedClick('Niveaux')}
                                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-400 opacity-60"
                            >
                                <BarChart className="h-5 w-5" />
                                <span>Niveaux</span>
                                <Lock className="h-4 w-4 ml-auto text-gray-400" />
                            </button>
                        ) : (
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
                                {pathname === "/niveaux" && (
                                    <div className="w-2 h-2 bg-blue-800 rounded-full ml-auto"></div>
                                )}
                            </Link>
                        )}
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
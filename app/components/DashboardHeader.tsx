'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Link from 'next/link';
import {
    Menu,
    MessageCircle,
    Bell,
    ChevronDown,
    Edit3,
    LogOut,
    X,
    Eye,
    EyeOff
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

interface HomeworkSend {
    id: string;
    sentAt: string;
    homework: {
        id: string;
        chapterId: number;
        title: string;
    };
}

interface DashboardHeaderProps {
    user: User;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    homeworkSends: HomeworkSend[];
}

export default function DashboardHeader({
    user,
    mobileMenuOpen,
    setMobileMenuOpen,
    homeworkSends
}: DashboardHeaderProps) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [editForm, setEditForm] = useState({
        username: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        passwordForUsernameChange: ''
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPasswordForUsernameChange, setShowPasswordForUsernameChange] = useState(false);
    const [usernameChanged, setUsernameChanged] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactForm, setContactForm] = useState({
        message: '',
    });
    const [contactLoading, setContactLoading] = useState(false);
    const [contactSuccess, setContactSuccess] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [editError, setEditError] = useState('');
    const [showRestrictionModal, setShowRestrictionModal] = useState(false);
    const [restrictedContent, setRestrictedContent] = useState('');
    const router = useRouter();

    const handleRestrictedClick = (contentName: string) => {
        setRestrictedContent(contentName);
        setShowRestrictionModal(true);
    };

    const getSentHomeworkCount = () => {
        return homeworkSends.length;
    };

    const pathname = usePathname();

    useEffect(() => {
        setEditForm(prev => ({
            ...prev,
            username: user.username || ''
        }));
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.profile-menu')) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleEditProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditError('');

        const usernameIsChanged = editForm.username !== user?.username;

        // Validation du changement de pseudo
        if (usernameIsChanged && !editForm.passwordForUsernameChange) {
            setEditError('Veuillez entrer votre mot de passe pour modifier votre pseudo');
            return;
        }

        // Validation du changement de mot de passe
        if (editForm.newPassword && !editForm.currentPassword) {
            setEditError('Veuillez entrer votre ancien mot de passe pour modifier votre mot de passe');
            return;
        }

        if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
            setEditError('Les mots de passe ne correspondent pas');
            return;
        }

        if (editForm.newPassword && editForm.newPassword.length < 8) {
            setEditError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        setEditLoading(true);

        try {
            const updateData: any = {};

            if (usernameIsChanged) {
                updateData.username = editForm.username;
                updateData.passwordForUsernameChange = editForm.passwordForUsernameChange;
            }

            if (editForm.newPassword) {
                updateData.currentPassword = editForm.currentPassword;
                updateData.password = editForm.newPassword;
            }

            const response = await fetch('/api/auth/complete-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setShowEditProfile(false);
                setEditForm(prev => ({
                    ...prev,
                    username: data.user?.username || prev.username,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                    passwordForUsernameChange: ''
                }));
                setUsernameChanged(false);
                alert('Profil mis à jour avec succès !');
            } else {
                setEditError(data.error || 'Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            setEditError('Erreur de connexion');
        } finally {
            setEditLoading(false);
        }
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setContactLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user?.email,
                    message: contactForm.message,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setContactSuccess(true);
                setContactForm({ message: '' });
                setTimeout(() => {
                    setContactSuccess(false);
                    setShowContactModal(false);
                }, 3000);
            } else {
                alert('Erreur lors de l\'envoi du message');
            }
        } catch (error) {
            console.error('Contact error:', error);
            alert('Erreur de connexion');
        } finally {
            setContactLoading(false);
        }
    };

    return (
        <>
            {/* Top Header */}
            <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Navigation Links */}
                    <nav className="hidden lg:flex space-x-8 items-center">
                        <Link
                            href="/dashboard"
                            className={`${pathname === "/dashboard" ? "text-gray-900 font-medium border-b-2 border-blue-800" : "text-gray-500 hover:text-gray-900"}`}
                        >
                            Accueil
                        </Link>

                        <Link
                            href="/chapitres/0/video"
                            className={`${pathname.startsWith("/chapitres") ? "text-gray-900 font-medium border-b-2 border-blue-800" : "text-gray-500 hover:text-gray-900"}`}
                        >
                            Cours
                        </Link>

                        <Link
                            href={user.accountType === 'FREE_TRIAL' ? "#" : "/accompagnement"}
                            className={`${user.accountType === 'FREE_TRIAL'
                                    ? "text-gray-400 opacity-60 cursor-not-allowed"
                                    : pathname === "/accompagnement"
                                        ? "text-gray-900 font-medium border-b-2 border-blue-800"
                                        : "text-gray-500 hover:text-gray-900"
                                }`}
                            onClick={(e) => {
                                if (user.accountType === 'FREE_TRIAL') {
                                    e.preventDefault();
                                    handleRestrictedClick('Accompagnement');
                                }
                            }}
                        >
                            Accompagnement
                        </Link>

                        <Link
                            href="/devoirs"
                            className={`${pathname === "/devoirs"
                                    ? "text-gray-900 font-medium border-b-2 border-blue-800"
                                    : "text-gray-500 hover:text-gray-900"
                                }`}

                        >
                            Devoirs
                        </Link>
                    </nav>


                    {/* Mobile Navigation Toggle */}
                    <button
                        className="lg:hidden p-2 text-gray-600"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-4 justify-center">
                        <button
                            onClick={() => setShowContactModal(true)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <MessageCircle className="h-5 w-5" />
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowNotificationModal(true)}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Bell className="h-5 w-5 mt-1" />
                                {getSentHomeworkCount() > 0 && (
                                    <span className="absolute top-[-2px] -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                        {getSentHomeworkCount()}
                                    </span>
                                )}
                            </button>
                        </div>
                        <div className="relative profile-menu">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-3"
                            >
                                <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-sm font-medium">
                                        {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-gray-700 font-medium whitespace-nowrap">
                                    {user.username || (user.gender === 'FEMME' ? 'Utilisatrice' : 'Utilisateur')}
                                </span>
                                <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            </button>

                            {/* Dropdown Menu */}
                            {showProfileMenu && (
                                <div
                                    className="
      absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 
      rounded-xl shadow-lg overflow-hidden z-50
      will-change-transform will-change-opacity
      md:transition-none
    "
                                    style={{
                                        transform: 'translateZ(0)', // accélération matérielle
                                    }}
                                >
                                    <div className="p-4 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
                                                <span className="text-white font-medium">
                                                    {user.username
                                                        ? user.username.charAt(0).toUpperCase()
                                                        : user.email.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-gray-900 font-semibold truncate">
                                                    {user.username ||
                                                        (user.gender === 'FEMME' ? 'Utilisatrice' : 'Utilisateur')}
                                                </p>
                                                <p className="text-gray-500 text-sm truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                setShowEditProfile(true);
                                                setShowProfileMenu(false);
                                            }}
                                            className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <Edit3 className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-700">Modifier le profil</span>
                                        </button>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <LogOut className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-700">Se déconnecter</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                        {/* Modal Notifications */}
                        {showNotificationModal && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 border border-gray-200 max-h-[80vh] overflow-hidden">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Notifications ({getSentHomeworkCount()})
                                        </h3>
                                        <button
                                            onClick={() => setShowNotificationModal(false)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                        {homeworkSends.length > 0 ? (
                                            <div className="space-y-3">
                                                {homeworkSends.map((send) => (
                                                    <div key={send.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                        <div className="flex items-start space-x-3">
                                                            <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <span className="text-white text-sm font-bold">
                                                                    {send.homework.chapterId}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-medium text-gray-900 text-sm">
                                                                    {send.homework.title}
                                                                </h4>
                                                                <p className="text-xs text-green-600 mt-1">
                                                                    Envoyé le {new Date(send.sentAt).toLocaleDateString('fr-FR', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: 'numeric'
                                                                    })}
                                                                </p>
                                                            </div>
                                                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500">Aucune notification pour le moment</p>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    Les devoirs envoyés apparaîtront ici
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Modal Édition Profil */}
            {showEditProfile && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Modifier le profil</h3>
                            <button
                                onClick={() => {
                                    setShowEditProfile(false);
                                    setEditError('');
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Message d'erreur */}
                        {editError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{editError}</p>
                            </div>
                        )}

                        <form onSubmit={handleEditProfile} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pseudo
                                </label>
                                <input
                                    type="text"
                                    value={editForm.username}
                                    onChange={(e) => {
                                        setEditForm(prev => ({ ...prev, username: e.target.value }));
                                        setUsernameChanged(e.target.value !== user.username);
                                    }}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Votre pseudo"
                                />
                            </div>

                            {/* Mot de passe pour changement de pseudo */}
                            {usernameChanged && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mot de passe (requis pour modifier le pseudo)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswordForUsernameChange ? "text" : "password"}
                                            value={editForm.passwordForUsernameChange}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, passwordForUsernameChange: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                                            placeholder="Votre mot de passe"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordForUsernameChange(!showPasswordForUsernameChange)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPasswordForUsernameChange ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ancien mot de passe
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={editForm.currentPassword}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                                        placeholder="Ancien mot de passe"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nouveau mot de passe
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={editForm.newPassword}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                                        placeholder="Nouveau mot de passe"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {editForm.newPassword && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmer le nouveau mot de passe
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={editForm.confirmPassword}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                                            placeholder="Confirmer le mot de passe"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditProfile(false);
                                        setEditError('');
                                    }}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg transition-all duration-200"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={editLoading}
                                    className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editLoading ? 'Mise à jour...' : 'Sauvegarder'}
                                </button>
                            </div>

                            {/* Section Suppression de compte */}
                            <div className="pt-6 border-t border-gray-200">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-red-900 mb-2">
                                        Supprimer mon compte
                                    </h4>
                                    <p className="text-sm text-red-800">
                                        Pour supprimer votre compte, contactez le support :
                                    </p>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>
                                            📧 <a href="mailto:arabeimportance@gmail.com" className="font-semibold hover:underline">
                                                arabeimportance@gmail.com
                                            </a>
                                        </p>
                                        <p>💬 Ou utilisez le formulaire de contact ci-dessus.</p>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* Modal Contact Support */}
            {showContactModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Contactez le support</h3>
                            <button
                                onClick={() => {
                                    setShowContactModal(false);
                                    setContactSuccess(false);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {contactSuccess ? (
                            <div className="text-center py-8">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Message envoyé !</h4>
                                <p className="text-gray-600">Nous avons bien reçu votre message et vous répondrons dès que possible.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleContactSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Votre message
                                    </label>
                                    <textarea
                                        value={contactForm.message}
                                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[150px]"
                                        placeholder="Décrivez votre question ou problème..."
                                        required
                                    />
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowContactModal(false)}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg transition-all duration-200"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={contactLoading}
                                        className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {contactLoading ? 'Envoi en cours...' : 'Envoyer le message'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <FreeTrialRestrictionModal
                isOpen={showRestrictionModal}
                onClose={() => setShowRestrictionModal(false)}
                contentName={restrictedContent}
            />
        </>
    );
}
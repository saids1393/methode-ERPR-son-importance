// app/devoirs/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  FileText,
  BookOpen,
  Calendar,
  Loader2,
  ChevronDown,
  ChevronUp,
  Send,
  Type,
  CheckCircle,
  MessageSquare,
  Eye,
  Award,
  X,
  Clock,
} from 'lucide-react';
import DashboardHeader from '@/app/components/DashboardHeader';
import DashboardSidebar from '@/app/components/DashboardSidebar';

// Interfaces
interface User {
  id: string;
  email: string;
  username: string | null;
  gender: 'HOMME' | 'FEMME' | null;
  isActive: boolean;
}

interface Submission {
  type: 'TEXT' | 'FILE';
  textContent: string | null;
  files: { name: string; url: string }[] | null;
  fileUrls?: string | null;
  status: 'PENDING' | 'REVIEWED' | 'CORRECTED';
  feedback: string | null;
  correctedAt: string | null;
}

interface Homework {
  id: string;
  chapterId: number;
  title: string;
  content: string;
  createdAt: string;
  sentAt: string;
  emailSent: boolean;
  submission: Submission | null;
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

// Configuration des statuts
const statusConfig = {
  PENDING: {
    label: 'Envoyé',
    color: 'bg-green-100 text-green-800 border-green-200',
    description: 'Votre devoir a été envoyé avec succès et attend la correction'
  },
  REVIEWED: {
    label: 'Correction en cours',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Eye,
    description: 'Le professeur est en train de corriger votre devoir'
  },
  CORRECTED: {
    label: 'Devoir corrigé',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Award,
    description: 'Votre devoir a été corrigé'
  },
};

export default function DevoirsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [homeworkSends, setHomeworkSends] = useState<HomeworkSend[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // États pour les soumissions
  const [submitType, setSubmitType] = useState<{ [key: string]: 'TEXT' | 'FILE' }>({});
  const [textContent, setTextContent] = useState<{ [key: string]: string }>({});
  const [files, setFiles] = useState<{ [key: string]: File[] }>({});
  const [justSubmitted, setJustSubmitted] = useState<{ [key: string]: boolean }>({});

  // État pour le cooldown (timer)
  const [cooldowns, setCooldowns] = useState<{ [key: string]: number }>({});

  // Charger les cooldowns depuis le localStorage au démarrage
  useEffect(() => {
    const loadCooldownsFromStorage = () => {
      try {
        const storedCooldowns = localStorage.getItem('homeworkCooldowns');
        if (storedCooldowns) {
          const parsedCooldowns = JSON.parse(storedCooldowns);
          const currentTime = Date.now();
          
          // Filtrer les cooldowns expirés et calculer le temps restant
          const activeCooldowns: { [key: string]: number } = {};
          const activeJustSubmitted: { [key: string]: boolean } = {};
          
          Object.keys(parsedCooldowns).forEach(homeworkId => {
            const endTime = parsedCooldowns[homeworkId];
            const timeRemaining = Math.max(0, Math.floor((endTime - currentTime) / 1000));
            
            if (timeRemaining > 0) {
              activeCooldowns[homeworkId] = timeRemaining;
              activeJustSubmitted[homeworkId] = true;
            }
          });
          
          setCooldowns(activeCooldowns);
          setJustSubmitted(activeJustSubmitted);
          
          // Mettre à jour le localStorage pour supprimer les cooldowns expirés
          if (Object.keys(activeCooldowns).length !== Object.keys(parsedCooldowns).length) {
            const updatedStorage: { [key: string]: number } = {};
            Object.keys(activeCooldowns).forEach(homeworkId => {
              updatedStorage[homeworkId] = parsedCooldowns[homeworkId];
            });
            localStorage.setItem('homeworkCooldowns', JSON.stringify(updatedStorage));
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des cooldowns:', error);
        localStorage.removeItem('homeworkCooldowns');
      }
    };

    loadCooldownsFromStorage();
  }, []);

  // Vérification de l'authentification
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          router.push('/checkout');
        }
      } catch (error) {
        console.error('Erreur auth:', error);
        router.push('/checkout');
      }
    };
    fetchUser();
  }, [router]);

  // Récupération des devoirs
  const fetchHomeworks = async () => {
    try {
      const response = await fetch('/api/homework/mine');
      if (response.ok) {
        const data = await response.json();
        setHomeworks(
          data.sort((a: Homework, b: Homework) => a.chapterId - b.chapterId)
        );
      } else {
        toast.error('Erreur lors du chargement des devoirs');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des devoirs :', error);
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  // Récupération des envois de devoirs
  const fetchHomeworkSends = async () => {
    try {
      const response = await fetch('/api/homework/user-sends');
      if (response.ok) {
        const data = await response.json();
        setHomeworkSends(data.sends || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des envois :', error);
    }
  };

  useEffect(() => {
    fetchHomeworks();
    fetchHomeworkSends();
  }, []);

  // Timer pour cooldown
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns(prev => {
        const updated = { ...prev };
        let hasChanges = false;
        
        Object.keys(updated).forEach(key => {
          if (updated[key] > 0) {
            updated[key] -= 1;
            hasChanges = true;
            
            // Si le cooldown arrive à 0, le supprimer du localStorage et du statut justSubmitted
            if (updated[key] === 0) {
              try {
                const storedCooldowns = localStorage.getItem('homeworkCooldowns');
                if (storedCooldowns) {
                  const parsedCooldowns = JSON.parse(storedCooldowns);
                  delete parsedCooldowns[key];
                  localStorage.setItem('homeworkCooldowns', JSON.stringify(parsedCooldowns));
                }
                // Réinitialiser le statut justSubmitted quand le cooldown est terminé
                setJustSubmitted(prevJust => {
                  const newJust = { ...prevJust };
                  delete newJust[key];
                  return newJust;
                });
              } catch (error) {
                console.error('Erreur lors de la suppression du cooldown:', error);
              }
            }
          }
        });
        
        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sauvegarder un cooldown dans le localStorage
  const saveCooldownToStorage = (homeworkId: string, durationInSeconds: number) => {
    try {
      const endTime = Date.now() + (durationInSeconds * 1000);
      const storedCooldowns = localStorage.getItem('homeworkCooldowns');
      const cooldownsData = storedCooldowns ? JSON.parse(storedCooldowns) : {};
      
      cooldownsData[homeworkId] = endTime;
      localStorage.setItem('homeworkCooldowns', JSON.stringify(cooldownsData));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du cooldown:', error);
    }
  };

  // Soumission d'un devoir
  const handleSubmit = async (homeworkId: string) => {
    const type = submitType[homeworkId] || 'TEXT';
    const content = type === 'TEXT' ? textContent[homeworkId] : files[homeworkId];

    if (!content || (Array.isArray(content) && content.length === 0)) {
      toast.error('Veuillez remplir le contenu avant de soumettre');
      return;
    }

    setSubmitting(homeworkId);

    try {
      const formData = new FormData();
      formData.append('homeworkId', homeworkId);
      formData.append('type', type);
      if (type === 'TEXT') {
        formData.append('textContent', content as string);
      } else {
        (content as File[]).forEach((file) => formData.append('files', file));
      }

      const response = await fetch('/api/homework/submit', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Devoir soumis avec succès !');
        setJustSubmitted(prev => ({ ...prev, [homeworkId]: true }));
        fetchHomeworks();
        setTextContent(prev => ({ ...prev, [homeworkId]: '' }));
        setFiles(prev => ({ ...prev, [homeworkId]: [] }));

        // Lancer le cooldown de test: 2 minutes = 120 secondes
      const cooldownDuration = 1800;
        setCooldowns(prev => ({ ...prev, [homeworkId]: cooldownDuration }));
        saveCooldownToStorage(homeworkId, cooldownDuration);
      } else {
        const error = await response.json();
        toast.error(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur soumission:', error);
      toast.error('Erreur lors de la soumission');
    } finally {
      setSubmitting(null);
    }
  };

  // Supprimer un fichier de la liste
  const removeFile = (homeworkId: string, fileIndex: number) => {
    setFiles(prev => ({
      ...prev,
      [homeworkId]: prev[homeworkId].filter((_, idx) => idx !== fileIndex)
    }));
  };

  const renderFilePreview = (file: { name: string; url: string }, ext: string | undefined, idx: number) => {
    if (ext === 'mp3' || ext === 'wav') {
      return <audio key={idx} controls className="w-full rounded-lg" src={file.url} />;
    } else if (ext === 'mp4' || ext === 'mov') {
      return <video key={idx} controls className="w-full rounded-lg" src={file.url} />;
    } else if (ext === 'pdf' || ext === 'doc' || ext === 'docx' || ext === 'txt') {
      return (
        <a
          key={idx}
          href={file.url}
          target="_blank"
          className="text-blue-600 underline text-sm block"
        >
          📄 {file.name}
        </a>
      );
    } else if (ext && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <img key={idx} src={file.url} className="w-full rounded-lg max-h-64 object-contain" />;
    } else {
      return (
        <a key={idx} href={file.url} target="_blank" className="text-gray-600 text-sm block">
          📁 {file.name}
        </a>
      );
    }
  };

  // Formattage de la date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Chargement des devoirs...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
      <div className="flex-1 lg:ml-64">
        <DashboardHeader
          user={user}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          homeworkSends={homeworkSends}
        />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl mb-3 sm:mb-4">
                <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 px-4">
                Mes Devoirs
              </h1>
              <p className="text-gray-600 text-base sm:text-lg px-4">
                Retrouvez ici tous vos devoirs à compléter
              </p>
            </div>

            {homeworks.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun devoir disponible
                </h3>
                <p className="text-gray-600">
                  Les devoirs seront disponibles prochainement.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {homeworks.map((homework) => {
                  const isExpanded = expanded === homework.id;
                  const type = submitType[homework.id] || homework.submission?.type || 'TEXT';

                  // FIX: Vérifier si le devoir a réellement été soumis avec du contenu
                  const hasSubmission =
                    homework.submission &&
                    (
                      (homework.submission.type === 'TEXT' && homework.submission.textContent) ||
                      (homework.submission.type === 'FILE' &&
                        (homework.submission.fileUrls ||
                          (homework.submission.files && homework.submission.files.length > 0)))
                    );

                  const submissionStatus = homework.submission?.status;
                  const StatusConfig = submissionStatus ? statusConfig[submissionStatus] : null;

                  // Déterminer si le formulaire doit être affiché
                  const showForm = !hasSubmission && !justSubmitted[homework.id];
                  const showCooldownMessage = justSubmitted[homework.id] && !hasSubmission;

                  return (
                    <div
                      key={homework.id}
                      className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-blue-200 transition-all duration-300"
                    >
                      {/* En-tête du devoir */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-lg sm:rounded-xl">
                              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-white">
                                Chapitre {homework.chapterId}
                              </h3>
                              <p className="text-blue-100 text-xs sm:text-sm">
                                {homework.title}
                              </p>
                            </div>
                          </div>

                          {hasSubmission && StatusConfig && (
                            <div className="text-left sm:text-right">
                              <div className={`inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border ${StatusConfig.color} backdrop-blur-sm`}>
                                <span className="text-xs sm:text-sm font-semibold">{StatusConfig.label}</span>
                              </div>
                              {homework.submission?.correctedAt ? (
                                <p className="text-blue-100 text-xs mt-1">
                                  Corrigé le {formatDate(homework.submission.correctedAt)}
                                </p>
                              ) : (
                                <p className="text-blue-100 text-xs mt-1">
                                  Envoyé le {formatDate(homework.sentAt)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Contenu du devoir */}
                      <div className="p-4 sm:p-6">
                        {/* Instructions avec meilleure lisibilité */}
                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">📝 Instructions</h4>
                              <div className={`text-gray-800 text-xs sm:text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                                {homework.content.split('\n').map((line, idx) => (
                                  <p key={idx} className="mb-2">{line || '\u00A0'}</p>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => setExpanded(isExpanded ? null : homework.id)}
                              className="ml-2 flex-shrink-0 text-blue-600 text-xs sm:text-sm font-medium flex items-center hover:text-blue-800 transition-colors"
                            >
                              <span className="hidden sm:inline">{isExpanded ? 'Réduire' : 'Développer'}</span>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 ml-0 sm:ml-1" />
                              ) : (
                                <ChevronDown className="h-4 w-4 ml-0 sm:ml-1" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Message de confirmation après soumission avec cooldown */}
                        {showCooldownMessage && (
                          <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                            <div className="flex items-start space-x-2 sm:space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">
                                  Devoir bien reçu par le professeur !
                                </h4>
                                <p className="text-green-800 text-xs sm:text-sm mb-2">
                                  Vous avez normalement reçu une copie dans votre boîte mail. Le professeur vous répondra au plus vite.
                                </p>
                                <div className="flex items-start space-x-2 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-2 sm:px-3 py-2 mt-3">
                                  <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                  <p className="text-xs flex-1">
                                    {cooldowns[homework.id] > 0
                                      ? `Vous pourrez renvoyer dans ${Math.floor(cooldowns[homework.id] / 60)
                                        .toString()
                                        .padStart(2, '0')} : ${(cooldowns[homework.id] % 60).toString().padStart(2, '0')}`
                                      : 'Vous pouvez renvoyer votre devoir maintenant.'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Formulaire de soumission (caché pendant le cooldown) */}
                        {showForm && (
                          <div className="space-y-3 sm:space-y-4">
                            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                              <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">📤 Soumettre votre devoir</h4>

                              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-3 sm:mb-4">
                                <button
                                  onClick={() => setSubmitType(prev => ({ ...prev, [homework.id]: 'TEXT' }))}
                                  className={`flex-1 flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 transition-all text-sm ${type === 'TEXT'
                                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                    : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                                    }`}
                                >
                                  <Type className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                  <span className="truncate">Rédaction texte</span>
                                </button>

                                <button
                                  onClick={() => setSubmitType(prev => ({ ...prev, [homework.id]: 'FILE' }))}
                                  className={`flex-1 flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 transition-all text-sm ${type === 'FILE'
                                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                    : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                                    }`}
                                >
                                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                  <span className="truncate">Fichier / Audio / Image</span>
                                </button>
                              </div>

                              {type === 'TEXT' ? (
                                <textarea
                                  value={textContent[homework.id] || ''}
                                  onChange={(e) =>
                                    setTextContent((prev) => ({ ...prev, [homework.id]: e.target.value }))
                                  }
                                  placeholder="Rédigez votre devoir ici..."
                                  className="w-full h-32 sm:h-40 p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all text-black text-sm sm:text-base"
                                />
                              ) : (
                                <div>
                                  <input
                                    type="file"
                                    multiple
                                    onChange={(e) => {
                                      if (!e.target.files) return;
                                      const newFiles = Array.from(e.target.files);
                                      setFiles((prev) => ({
                                        ...prev,
                                        [homework.id]: [...(prev[homework.id] || []), ...newFiles],
                                      }));
                                      e.target.value = '';
                                    }}
                                    accept=".pdf,.doc,.docx,.txt,.mp3,.mp4,image/*"
                                    className="w-full p-3 sm:p-4 border border-gray-300 text-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-sm"
                                  />

                                  {files[homework.id] && files[homework.id].length > 0 && (
                                    <div className="mt-3 border border-gray-300 rounded-lg p-3 sm:p-4 bg-white">
                                      <p className="text-gray-800 font-semibold mb-2 text-xs sm:text-sm">Fichiers sélectionnés :</p>
                                      <ul className="space-y-2">
                                        {files[homework.id].map((file, index) => (
                                          <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg gap-2">
                                            <span className="text-xs sm:text-sm text-gray-700 truncate flex-1 min-w-0">{file.name}</span>
                                            <button
                                              onClick={() => removeFile(homework.id, index)}
                                              className="flex-shrink-0 p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                              title="Retirer ce fichier"
                                            >
                                              <X className="h-4 w-4" />
                                            </button>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}

                              <button
                                onClick={() => handleSubmit(homework.id)}
                                disabled={submitting === homework.id}
                                className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-3 sm:mt-4 text-sm sm:text-base"
                              >
                                {submitting === homework.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                                    <span>Soumission en cours...</span>
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span>Soumettre le devoir</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Rendu du devoir soumis */}
                        {hasSubmission && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                            {/* ... contenu existant pour rendu et feedback ... */}
                          </div>
                        )}

                        <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="break-words">Devoir reçu le {new Date(homework.sentAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
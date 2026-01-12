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
  Eye,
  Award,
  X,
} from 'lucide-react';
import DashboardHeader from '@/app/components/DashboardHeader';
import DashboardSidebar from '@/app/components/DashboardSidebar';

interface User {
  id: string;
  email: string;
  username: string | null;
  gender: 'HOMME' | 'FEMME' | null;
  isActive: boolean;
  accountType: 'ACTIVE' | 'INACTIVE' | 'PAID_LEGACY';
  subscriptionPlan?: 'SOLO' | 'COACHING' | null;
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

interface TajwidHomework {
  id: string;
  chapterId: number;
  title: string;
  content: string;
  createdAt: string;
  sentAt: string;
  emailSent: boolean;
  submission: Submission | null;
}

interface TajwidHomeworkSendData {
  id: string;
  sentAt: string;
  tajwidHomework: {
    id: string;
    chapterId: number;
    title: string;
  };
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

export default function DevoirsTajwidPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [homeworks, setHomeworks] = useState<TajwidHomework[]>([]);
  const [homeworkSends, setHomeworkSends] = useState<HomeworkSend[]>([]);
  const [tajwidHomeworkSends, setTajwidHomeworkSends] = useState<TajwidHomeworkSendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [submitType, setSubmitType] = useState<{ [key: string]: 'TEXT' | 'FILE' }>({});
  const [textContent, setTextContent] = useState<{ [key: string]: string }>({});
  const [files, setFiles] = useState<{ [key: string]: File[] }>({});
  const [justSubmitted, setJustSubmitted] = useState<{ [key: string]: boolean }>({});
  const [cooldowns, setCooldowns] = useState<{ [key: string]: number }>({});

  // Redirection vers devoirs si le module sélectionné est LECTURE
  const [moduleChecked, setModuleChecked] = useState(false);
  
  useEffect(() => {
    const savedModule = localStorage.getItem('selectedDashboardModule');
    if (savedModule !== 'TAJWID') {
      router.replace('/devoirs');
    } else {
      setModuleChecked(true);
    }
  }, [router]);

  useEffect(() => {
    const loadCooldownsFromStorage = () => {
      try {
        const storedCooldowns = localStorage.getItem('tajwidHomeworkCooldowns');
        if (storedCooldowns) {
          const parsedCooldowns = JSON.parse(storedCooldowns);
          const currentTime = Date.now();

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

          if (Object.keys(activeCooldowns).length !== Object.keys(parsedCooldowns).length) {
            const updatedStorage: { [key: string]: number } = {};
            Object.keys(activeCooldowns).forEach(homeworkId => {
              updatedStorage[homeworkId] = parsedCooldowns[homeworkId];
            });
            localStorage.setItem('tajwidHomeworkCooldowns', JSON.stringify(updatedStorage));
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des cooldowns:', error);
        localStorage.removeItem('tajwidHomeworkCooldowns');
      }
    };

    loadCooldownsFromStorage();
  }, []);

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

  const fetchHomeworks = async () => {
    try {
      const response = await fetch('/api/homework/tajwid/mine');
      if (response.ok) {
        const data = await response.json();
        setHomeworks(
          data.sort((a: TajwidHomework, b: TajwidHomework) => a.chapterId - b.chapterId)
        );
      } else {
        toast.error('Erreur lors du chargement des devoirs Tajwid');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des devoirs Tajwid:', error);
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const fetchHomeworkSends = async () => {
    try {
      // Tajwid
      const response = await fetch('/api/homework/tajwid/user-sends');
      if (response.ok) {
        const data = await response.json();
        setTajwidHomeworkSends(data.sends || []);
      }
      // Lecture (pour le header)
      const lectureResponse = await fetch('/api/homework/user-sends');
      if (lectureResponse.ok) {
        const lectureData = await lectureResponse.json();
        setHomeworkSends(lectureData.sends || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des envois:', error);
    }
  };

  useEffect(() => {
    fetchHomeworks();
    fetchHomeworkSends();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns(prev => {
        const updated = { ...prev };
        let hasChanges = false;

        Object.keys(updated).forEach(key => {
          if (updated[key] > 0) {
            updated[key] -= 1;
            hasChanges = true;

            if (updated[key] === 0) {
              try {
                const storedCooldowns = localStorage.getItem('tajwidHomeworkCooldowns');
                if (storedCooldowns) {
                  const parsedCooldowns = JSON.parse(storedCooldowns);
                  delete parsedCooldowns[key];
                  localStorage.setItem('tajwidHomeworkCooldowns', JSON.stringify(parsedCooldowns));
                }
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

  const saveCooldownToStorage = (homeworkId: string, durationInSeconds: number) => {
    try {
      const endTime = Date.now() + (durationInSeconds * 1000);
      const storedCooldowns = localStorage.getItem('tajwidHomeworkCooldowns');
      const cooldownsData = storedCooldowns ? JSON.parse(storedCooldowns) : {};

      cooldownsData[homeworkId] = endTime;
      localStorage.setItem('tajwidHomeworkCooldowns', JSON.stringify(cooldownsData));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du cooldown:', error);
    }
  };

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

      const response = await fetch('/api/homework/tajwid/submit', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Devoir Tajwid soumis avec succès !');
        setJustSubmitted(prev => ({ ...prev, [homeworkId]: true }));
        fetchHomeworks();
        setTextContent(prev => ({ ...prev, [homeworkId]: '' }));
        setFiles(prev => ({ ...prev, [homeworkId]: [] }));

        const cooldownDuration = 3;
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

  // Ne pas afficher tant que le module n'est pas vérifié
  if (!moduleChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Chargement des devoirs Tajwid...</p>
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
          tajwidHomeworkSends={tajwidHomeworkSends}
        />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-600 rounded-2xl mb-3 sm:mb-4">
                <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 px-4">
                Mes Devoirs Tajwid
              </h1>
              <p className="text-gray-600 text-base sm:text-lg px-4">
                Retrouvez ici tous vos devoirs Tajwid à compléter
              </p>
            </div>

            {homeworks.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun devoir Tajwid disponible
                </h3>
                <p className="text-gray-600">
                  Les devoirs Tajwid seront disponibles prochainement.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {homeworks.map((homework) => {
                  const isExpanded = expanded === homework.id;
                  const type = submitType[homework.id] || homework.submission?.type || 'TEXT';

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

                  const showForm = !hasSubmission && !justSubmitted[homework.id];
                  const showCooldownMessage = justSubmitted[homework.id] && !hasSubmission;

                  return (
                    <div
                      key={homework.id}
                      className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-green-200 transition-all duration-300"
                    >
                      <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-lg sm:rounded-xl">
                              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-white">
                                Chapitre {homework.chapterId}
                              </h3>
                              <p className="text-green-100 text-xs sm:text-sm">
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
                                <p className="text-green-100 text-xs mt-1">
                                  Corrigé le {formatDate(homework.submission.correctedAt)}
                                </p>
                              ) : (
                                <p className="text-green-100 text-xs mt-1">
                                  Envoyé le {formatDate(homework.sentAt)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 sm:p-6">
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
                              className="ml-2 flex-shrink-0 text-green-600 text-xs sm:text-sm font-medium flex items-center hover:text-green-800 transition-colors"
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

                        {showCooldownMessage && (
                          <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                            <div className="flex items-start space-x-2 sm:space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-green-900 text-sm sm:text-base">
                                  Votre devoir Tajwid a été bien envoyé !
                                </h4>
                              </div>
                            </div>
                          </div>
                        )}

                        {showForm && (
                          <div className="space-y-3 sm:space-y-4">
                            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                              <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">📤 Soumettre votre devoir</h4>

                              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-3 sm:mb-4">
                                <button
                                  onClick={() => setSubmitType(prev => ({ ...prev, [homework.id]: 'TEXT' }))}
                                  className={`flex-1 flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 transition-all text-sm ${type === 'TEXT'
                                    ? 'border-green-600 bg-green-50 text-green-700 shadow-sm'
                                    : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                                    }`}
                                >
                                  <Type className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                  <span className="truncate">Rédaction texte</span>
                                </button>

                                <button
                                  onClick={() => setSubmitType(prev => ({ ...prev, [homework.id]: 'FILE' }))}
                                  className={`flex-1 flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 transition-all text-sm ${type === 'FILE'
                                    ? 'border-green-600 bg-green-50 text-green-700 shadow-sm'
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
                                  className="w-full h-32 sm:h-40 p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all text-black text-sm sm:text-base"
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
                                    className="w-full p-3 sm:p-4 border border-gray-300 text-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-xs sm:text-sm"
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
                                className="w-full bg-green-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-3 sm:mt-4 text-sm sm:text-base"
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

                        {hasSubmission && (
                          <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                            <div className="flex items-start space-x-2 sm:space-x-3 mb-3">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-green-900 text-sm sm:text-base mb-2">
                                  ✅ Votre réponse
                                </h4>
                                {homework.submission?.type === 'TEXT' && homework.submission.textContent && (
                                  <div className="bg-white rounded-lg p-3 sm:p-4 text-gray-800 text-xs sm:text-sm whitespace-pre-wrap break-words">
                                    {homework.submission.textContent}
                                  </div>
                                )}
                                {homework.submission?.type === 'FILE' && homework.submission.files && (
                                  <div className="space-y-2">
                                    {homework.submission.files.map((file, idx) => {
                                      const ext = file.name.split('.').pop()?.toLowerCase();
                                      return renderFilePreview(file, ext, idx);
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>

                            {homework.submission?.feedback && (
                              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-green-200">
                                <div className="flex items-start space-x-2 sm:space-x-3">
                                  <Award className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">
                                      💬 Retour du professeur
                                    </h4>
                                    <div className="bg-white rounded-lg p-3 sm:p-4 text-gray-800 text-xs sm:text-sm whitespace-pre-wrap break-words">
                                      {homework.submission.feedback}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
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

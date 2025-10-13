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
        fetchHomeworks();
        setTextContent(prev => ({ ...prev, [homeworkId]: '' }));
        setFiles(prev => ({ ...prev, [homeworkId]: [] }));
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
    } else if (ext && ['jpg','jpeg','png','gif','webp'].includes(ext)) {
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
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Mes Devoirs
              </h1>
              <p className="text-gray-600 text-lg">
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

                  return (
                    <div
                      key={homework.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-blue-200 transition-all duration-300"
                    >
                      {/* En-tête du devoir */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                              <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">
                                Chapitre {homework.chapterId}
                              </h3>
                              <p className="text-blue-100 text-sm">
                                {homework.title}
                              </p>
                            </div>
                          </div>

                          {hasSubmission && StatusConfig && (
                            <div className="text-right">
                              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${StatusConfig.color} backdrop-blur-sm`}>
                                <span className="text-sm font-semibold">{StatusConfig.label}</span>
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
                      <div className="p-6">
                        {/* Instructions */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">📝 Instructions</h4>
                              <p className={`text-gray-800 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                                {homework.content}
                              </p>
                            </div>
                            <button
                              onClick={() => setExpanded(isExpanded ? null : homework.id)}
                              className="ml-4 text-blue-600 text-sm font-medium flex items-center hover:text-blue-800 transition-colors"
                            >
                              {isExpanded ? (
                                <>Réduire <ChevronUp className="h-4 w-4 ml-1" /></>
                              ) : (
                                <>Développer <ChevronDown className="h-4 w-4 ml-1" /></>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Formulaire ou rendu */}
                        {hasSubmission ? (
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                              <CheckCircle className="h-5 w-5 mr-2" />
                              Votre rendu soumis
                            </h4>

                            {/* Rendu texte */}
                            {homework.submission && homework.submission.type === 'TEXT' && homework.submission.textContent && (
                              <div className="bg-white rounded-lg p-4 border border-blue-100">
                                <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                                  {homework.submission.textContent}
                                </p>
                              </div>
                            )}

                            {/* Rendu fichiers */}
                            {homework.submission && homework.submission.type === 'FILE' && (
                              <div className="bg-white rounded-lg p-4 border border-blue-100 space-y-2">
                                {/* Gérer fileUrls (nouveau format) */}
                                {homework.submission.fileUrls && (
                                  <>
                                    {JSON.parse(homework.submission.fileUrls).map((file: { name: string; url: string }, idx: number) => {
                                      const ext = file.name.split('.').pop()?.toLowerCase();
                                      return renderFilePreview(file, ext, idx);
                                    })}
                                  </>
                                )}
                                
                                {/* Gérer files (ancien format) */}
                                {homework.submission.files && homework.submission.files.length > 0 && (
                                  <>
                                    {homework.submission.files.map((file, idx) => {
                                      const ext = file.name.split('.').pop()?.toLowerCase();
                                      return renderFilePreview(file, ext, idx);
                                    })}
                                  </>
                                )}
                                
                                {/* Message si aucun fichier trouvé */}
                                {(!homework.submission.fileUrls && (!homework.submission.files || homework.submission.files.length === 0)) && (
                                  <p className="text-gray-500 text-sm">Aucun fichier disponible</p>
                                )}
                              </div>
                            )}

                            {/* Feedback */}
                            {homework.submission?.feedback && (
                              <div className="mt-4 bg-white rounded-lg p-4 border border-green-200">
                                <h5 className="font-semibold text-green-900 mb-2 flex items-center">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Feedback du professeur
                                </h5>
                                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                                  {homework.submission.feedback}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                              <h4 className="font-semibold text-gray-900 mb-3">📤 Soumettre votre devoir</h4>

                              <div className="flex space-x-2 mb-4">
                                <button
                                  onClick={() => setSubmitType(prev => ({ ...prev, [homework.id]: 'TEXT' }))}
                                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all ${
                                    type === 'TEXT'
                                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                      : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                                  }`}
                                >
                                  <Type className="h-5 w-5" />
                                  <span>Rédaction texte</span>
                                </button>

                                <button
                                  onClick={() => setSubmitType(prev => ({ ...prev, [homework.id]: 'FILE' }))}
                                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all ${
                                    type === 'FILE'
                                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                      : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                                  }`}
                                >
                                  <BookOpen className="h-5 w-5" />
                                  <span>Fichier / Audio / Image</span>
                                </button>
                              </div>

                           {type === 'TEXT' ? (
  <textarea
    value={textContent[homework.id] || ''}
    onChange={(e) =>
      setTextContent((prev) => ({ ...prev, [homework.id]: e.target.value }))
    }
    placeholder="Rédigez votre devoir ici..."
    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all text-black"
  />
) : (
  <div>
    {!files[homework.id] || files[homework.id].length === 0 ? (
      <input
        type="file"
        multiple
        onChange={(e) => {
          if (!e.target.files) return;
          setFiles((prev) => ({
            ...prev,
            [homework.id]: Array.from(e.target.files),
          }));
        }}
        accept=".pdf,.doc,.docx,.txt,.mp3,.mp4,image/*"
        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    ) : (
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
        <p className="font-semibold mb-2">Fichiers sélectionnés :</p>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {files[homework.id].map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>

        {/* Bouton pour changer de fichier */}
        <button
          onClick={() =>
            setFiles((prev) => ({ ...prev, [homework.id]: [] }))
          }
          className="mt-3 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Changer les fichiers
        </button>
      </div>
    )}
  </div>
)}

                              <button
                                onClick={() => handleSubmit(homework.id)}
                                disabled={submitting === homework.id}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                              >
                                {submitting === homework.id ? (
                                  <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Soumission en cours...</span>
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-5 w-5" />
                                    <span>Soumettre le devoir</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Devoir reçu le {new Date(homework.sentAt).toLocaleDateString('fr-FR', {
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
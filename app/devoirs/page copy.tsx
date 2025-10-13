"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  BookOpen,
  Calendar,
  Loader2,
  ChevronDown,
  ChevronUp,
  Send,
  Mic,
  Type,
  CheckCircle,
  Clock,
  MessageSquare,
  Eye,
  Award,
} from 'lucide-react';

// Interfaces
interface User {
  id: string;
  email: string;
  username: string | null;
  gender: 'HOMME' | 'FEMME' | null;
  isActive: boolean;
}

interface Submission {
  type: 'TEXT' | 'AUDIO';
  textContent: string | null;
  audioUrl: string | null;
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
  submission: Submission;
}

const statusConfig = {
  PENDING: { 
    label: 'Envoyé', // Changé de "En attente de correction" à "Envoyé"
    color: 'bg-green-100 text-green-800 border-green-200', // Changé en vert pour "Envoyé"
    icon: Send, // Nouvelle icône pour "Envoyé"
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
    color: 'bg-purple-100 text-purple-800 border-purple-200', // Changé en violet pour différencier
    icon: Award,
    description: 'Votre devoir a été corrigé'
  },
};

export default function DevoirsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<string | null>(null);

  // États pour les soumissions
  const [submitType, setSubmitType] = useState<{ [key: string]: 'TEXT' | 'AUDIO' }>({});
  const [textContent, setTextContent] = useState<{ [key: string]: string }>({});
  const [audioUrl, setAudioUrl] = useState<{ [key: string]: string }>({});

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
      const response = await fetch('/api/homework/mine');
      if (response.ok) {
        const data = await response.json();
        setHomeworks(data.sort((a: Homework, b: Homework) => a.chapterId - b.chapterId));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des devoirs :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const handleSubmit = async (homeworkId: string) => {
    const type = submitType[homeworkId] || 'TEXT';
    const content = type === 'TEXT' ? textContent[homeworkId] : audioUrl[homeworkId];

    if (!content) {
      alert('Veuillez remplir le contenu avant de soumettre');
      return;
    }

    setSubmitting(homeworkId);

    try {
      const response = await fetch('/api/homework/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeworkId,
          type,
          textContent: type === 'TEXT' ? content : null,
          audioUrl: type === 'AUDIO' ? content : null,
        }),
      });

      if (response.ok) {
        alert('Devoir soumis avec succès !');
        fetchHomeworks(); // Recharger les devoirs
        setTextContent(prev => ({ ...prev, [homeworkId]: '' }));
        setAudioUrl(prev => ({ ...prev, [homeworkId]: '' }));
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur soumission:', error);
      alert('Erreur lors de la soumission');
    } finally {
      setSubmitting(null);
    }
  };

  // Fonction pour formater la date de correction
  const formatCorrectedDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour formater la date d'envoi
  const formatSubmissionDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Mes Devoirs</h1>
          <p className="text-gray-600 text-lg">Retrouvez ici tous vos devoirs à compléter</p>
        </div>

        {homeworks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun devoir disponible</h3>
            <p className="text-gray-600">Les devoirs seront disponibles prochainement.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {homeworks.map((homework) => {
              const isExpanded = expanded === homework.id;
              const type = submitType[homework.id] || homework.submission?.type || 'TEXT';
              const hasSubmission = homework.submission?.textContent || homework.submission?.audioUrl;
              const submissionStatus = homework.submission?.status;
              const StatusConfig = submissionStatus ? statusConfig[submissionStatus] : null;
              const StatusIcon = StatusConfig?.icon;

              return (
                <div key={homework.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-blue-200 transition-all duration-300">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Chapitre {homework.chapterId}</h3>
                          <p className="text-blue-100 text-sm">{homework.title}</p>
                        </div>
                      </div>
                      
                      {/* Badge de statut amélioré */}
                      {hasSubmission && StatusConfig && (
                        <div className="text-right">
                          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${StatusConfig.color} backdrop-blur-sm`}>
                            {StatusIcon ? <StatusIcon className="h-4 w-4" /> : null}
                            <span className="text-sm font-semibold">{StatusConfig.label}</span>
                          </div>
                          {homework.submission?.correctedAt ? (
                            <p className="text-blue-100 text-xs mt-1">
                              Corrigé le {formatCorrectedDate(homework.submission.correctedAt)}
                            </p>
                          ) : homework.submission && (
                            <p className="text-blue-100 text-xs mt-1">
                              Envoyé le {formatSubmissionDate(homework.submission.correctedAt || homework.sentAt)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Section description du devoir */}
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

                    {/* Section statut et informations */}
                    {hasSubmission && StatusConfig && (
                      <div className="mb-4">
                        <div className={`border-l-4 ${StatusConfig.color.split(' ')[1].replace('text-', 'border-')} pl-4 py-2`}>
                          <div className="flex items-center space-x-2 mb-1">
                            {StatusIcon ? <StatusIcon className="h-4 w-4" /> : null}
                            <span className="font-semibold text-gray-900">{StatusConfig.label}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{StatusConfig.description}</p>
                          
                          {homework.submission?.correctedAt ? (
                            <div className="flex items-center space-x-1 text-gray-500 text-xs mt-1">
                              <Calendar className="h-3 w-3" />
                              <span>Corrigé le {formatCorrectedDate(homework.submission.correctedAt)}</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-gray-500 text-xs mt-1">
                              <Calendar className="h-3 w-3" />
                              <span>Envoyé le {formatSubmissionDate(homework.sentAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Feedback du professeur */}
                    {homework.submission?.feedback && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                        <div className="flex items-start space-x-3">
                          <MessageSquare className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-green-900 mb-1">💬 Feedback du professeur</h4>
                            <p className="text-green-800 text-sm leading-relaxed">{homework.submission.feedback}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Affichage du rendu soumis */}
                    {hasSubmission ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Votre rendu soumis
                        </h4>
                        {homework.submission?.type === 'TEXT' ? (
                          <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                              {homework.submission.textContent}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <p className="text-gray-600 text-sm mb-2">🎧 Votre enregistrement audio :</p>
                            <audio 
                              controls 
                              className="w-full rounded-lg"
                              src={homework.submission.audioUrl || ''}
                            >
                              Votre navigateur ne supporte pas l'élément audio.
                            </audio>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Formulaire de soumission */
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
                              onClick={() => setSubmitType(prev => ({ ...prev, [homework.id]: 'AUDIO' }))}
                              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all ${
                                type === 'AUDIO' 
                                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                                  : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                              }`}
                            >
                              <Mic className="h-5 w-5" />
                              <span>Enregistrement audio</span>
                            </button>
                          </div>

                          {type === 'TEXT' ? (
                            <textarea
                              value={textContent[homework.id] || ''}
                              onChange={(e) => setTextContent(prev => ({ ...prev, [homework.id]: e.target.value }))}
                              placeholder="Rédigez votre devoir ici... Vous pouvez écrire en français ou en arabe selon les instructions du chapitre."
                              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all text-black"
                            />
                          ) : (
                            <div>
                              <input
                                type="text"
                                value={audioUrl[homework.id] || ''}
                                onChange={(e) => setAudioUrl(prev => ({ ...prev, [homework.id]: e.target.value }))}
                                placeholder="Collez l'URL de votre enregistrement audio (Google Drive, Dropbox, etc.)"
                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                              />
                              <p className="text-gray-600 text-xs mt-2">
                                💡 Vous pouvez uploader votre audio sur Google Drive, Dropbox ou tout autre service de stockage
                              </p>
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

                    {/* Date de réception */}
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
    </div>
  );
}
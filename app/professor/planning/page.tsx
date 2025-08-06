'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  User,
  Video,
  CheckCircle,
  XCircle,
  ArrowLeft,
  AlertTriangle,
  Users,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SessionData {
  id: string;
  scheduledAt: string;
  status: string;
  availabilityId?: string;
  cancellation?: {
    id: string;
    cancelledBy: string;
    customReason?: string;
    cancelledAt: string;
  };
  user: {
    email: string;
    username: string | null;
    gender: string;
  };
  zoomLink?: string;
}

interface CancellationForm {
  sessionId: string;
  customReason: string;
}

export default function ProfessorPlanningPage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [sessionToCancel, setSessionToCancel] = useState<SessionData | null>(null);
  const [cancelForm, setCancelForm] = useState<CancellationForm>({
    sessionId: '',
    customReason: ''
  });
  const [cancelLoading, setCancelLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/professor/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      } else if (response.status === 401) {
        router.push('/professor');
      } else {
        toast.error('Erreur lors du chargement');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cancelForm.customReason.trim()) {
      toast.error('Veuillez saisir un motif d\'annulation');
      return;
    }

    if (cancelForm.customReason.trim().length < 10) {
      toast.error('Le motif doit contenir au moins 10 caractères');
      return;
    }

    setCancelLoading(true);

    try {
      const response = await fetch('/api/sessions/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: cancelForm.sessionId,
          customReason: cancelForm.customReason.trim(),
          cancelledBy: 'PROFESSOR'
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Séance annulée avec succès');
        setShowCancelForm(false);
        setSessionToCancel(null);
        setCancelForm({ sessionId: '', customReason: '' });
        fetchSessions();
      } else {
        toast.error(result.error || 'Erreur lors de l\'annulation');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Cancel session error:', error);
    } finally {
      setCancelLoading(false);
    }
  };

  const canCancelSession = (session: SessionData) => {
    if (session.status !== 'SCHEDULED') return false;
    
    const sessionTime = new Date(session.scheduledAt);
    const now = new Date();
    const hoursUntil = (sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return hoursUntil >= 24; // 24h minimum
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'COMPLETED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'NO_SHOW': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'Programmée';
      case 'COMPLETED': return 'Terminée';
      case 'CANCELLED': return 'Annulée';
      case 'NO_SHOW': return 'Absence';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400 mx-auto mb-6"></div>
          <p className="text-white text-lg font-medium">Chargement du planning...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/professor')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 p-2 rounded-xl transition-all duration-300 text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Planning des Séances
                  </h1>
                  <p className="text-purple-200">Gérez vos séances programmées</p>
                </div>
              </div>
            </div>
            
            <div className="text-white">
              <div className="text-sm text-slate-300">Total des séances</div>
              <div className="text-2xl font-bold">{sessions.length}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {sessions.filter(s => s.status === 'SCHEDULED').length}
            </h3>
            <p className="text-slate-400 text-sm">Séances programmées</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="bg-green-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {sessions.filter(s => s.status === 'COMPLETED').length}
            </h3>
            <p className="text-slate-400 text-sm">Séances terminées</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="bg-red-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {sessions.filter(s => s.status === 'CANCELLED').length}
            </h3>
            <p className="text-slate-400 text-sm">Séances annulées</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <div className="bg-orange-500/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {sessions.filter(s => s.status === 'NO_SHOW').length}
            </h3>
            <p className="text-slate-400 text-sm">Absences</p>
          </div>
        </div>

        {/* Liste des séances */}
        {sessions.length > 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Calendar className="h-6 w-6 text-purple-400" />
              Toutes mes séances
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <div key={session.id} className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="h-5 w-5 text-purple-400" />
                    <div>
                      <h3 className="font-semibold text-white">
                        {session.user.username || 'Élève'}
                      </h3>
                      <p className="text-slate-400 text-sm">{session.user.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-300 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(session.scheduledAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(session.scheduledAt)}</span>
                    </div>
                  </div>

                  {/* Statut */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)} mb-4`}>
                    <div className={`w-2 h-2 rounded-full ${
                      session.status === 'COMPLETED' ? 'bg-green-400' :
                      session.status === 'SCHEDULED' ? 'bg-blue-400' :
                      session.status === 'CANCELLED' ? 'bg-red-400' :
                      'bg-orange-400'
                    }`}></div>
                    <span>{getStatusText(session.status)}</span>
                  </div>

                  {/* Motif d'annulation si applicable */}
                  {session.status === 'CANCELLED' && session.cancellation && (
                    <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <div className="text-red-400 text-xs font-medium mb-1">
                        Annulée par {session.cancellation.cancelledBy === 'STUDENT' ? 'l\'élève' : 'vous'}
                      </div>
                      <div className="text-red-300 text-xs">
                        Motif : {session.cancellation.customReason}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    {session.zoomLink && session.status === 'SCHEDULED' && (
                      <a
                        href={session.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Video className="h-4 w-4" />
                        Démarrer Zoom
                      </a>
                    )}
                    
                    {canCancelSession(session) && (
                      <button
                        onClick={() => {
                          setSessionToCancel(session);
                          setCancelForm({ sessionId: session.id, customReason: '' });
                          setShowCancelForm(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Aucune séance programmée
            </h3>
            <p className="text-slate-400 mb-6">
              Les séances apparaîtront ici une fois que les élèves auront réservé vos créneaux.
            </p>
            <button
              onClick={() => router.push('/professor/availability')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Gérer mes disponibilités
            </button>
          </div>
        )}
      </main>

      {/* Modal d'annulation */}
      {showCancelForm && sessionToCancel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Annuler la séance</h3>
              <button
                onClick={() => setShowCancelForm(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-white/5 rounded-xl">
              <div className="text-white font-semibold mb-2">
                Séance avec {sessionToCancel.user.username || 'Élève'}
              </div>
              <div className="text-slate-300 text-sm">
                {formatDate(sessionToCancel.scheduledAt)} à {formatTime(sessionToCancel.scheduledAt)}
              </div>
              <div className="text-slate-400 text-xs mt-1">
                {sessionToCancel.user.email}
              </div>
            </div>
            
            <form onSubmit={handleCancelSession} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Motif d'annulation *
                </label>
                <textarea
                  value={cancelForm.customReason}
                  onChange={(e) => setCancelForm(prev => ({ ...prev, customReason: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Décrivez le motif de votre annulation..."
                  rows={4}
                  required
                />
                <p className="text-slate-400 text-xs mt-1">
                  Minimum 10 caractères
                </p>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-yellow-400 text-lg">⚠️</div>
                  <div>
                    <h4 className="text-yellow-400 font-semibold text-sm mb-1">
                      Conditions d'annulation
                    </h4>
                    <p className="text-yellow-300 text-xs leading-relaxed">
                      • Annulation possible jusqu'à 24h avant la séance<br/>
                      • Le créneau sera remis à disposition<br/>
                      • L'élève pourra réserver un nouveau créneau
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCancelForm(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 border border-white/20"
                >
                  Garder la séance
                </button>
                <button
                  type="submit"
                  disabled={cancelLoading}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  {cancelLoading ? 'Annulation...' : 'Confirmer l\'annulation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
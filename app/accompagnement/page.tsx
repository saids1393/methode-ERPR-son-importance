'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  Video,
  CheckCircle,
  Lock,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  Zap,
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
    reason: {
      reason: string;
      category: string;
    };
    customReason?: string;
    cancelledAt: string;
  };
  professor: {
    name: string;
    gender: string;
  };
  zoomLink?: string;
}

interface AvailableSlot {
  id: string;
  availabilityId: string;
  professor: {
    id: string;
    name: string;
    email: string;
    gender: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  scheduledAt: string;
  isSpecific?: boolean;
}

interface CancellationReason {
  id: string;
  reason: string;
  category: string;
}

interface SessionsResponse {
  progress: {
    unlockedSessions: number;
    canBookSession: boolean;
    nextUnlockPage?: number;
  };
  sessions: SessionData[];
  bookedSessionsCount: number;
}

export default function AccompagnementPage() {
  const [data, setData] = useState<SessionsResponse | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [cancellationReasons, setCancellationReasons] = useState<CancellationReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [sessionToCancel, setSessionToCancel] = useState<SessionData | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSessions();
    fetchAvailableSlots();
    fetchCancellationReasons();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      if (response.ok) {
        const sessionData = await response.json();
        console.log('📊 Données de session reçues:', sessionData);
        setData(sessionData);
      } else if (response.status === 401) {
        router.push('/login');
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

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch('/api/sessions/available');
      if (response.ok) {
        const slotsData = await response.json();
        setAvailableSlots(slotsData.availableSlots || []);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const fetchCancellationReasons = async () => {
    try {
      const response = await fetch('/api/sessions/cancellation-reasons?category=STUDENT');
      if (response.ok) {
        const reasonsData = await response.json();
        setCancellationReasons(reasonsData.reasons || []);
      }
    } catch (error) {
      console.error('Error fetching cancellation reasons:', error);
    }
  };

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot) {
      toast.error('Veuillez sélectionner un créneau');
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          availabilityId: selectedSlot.availabilityId
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Séance réservée avec succès !');
        setShowBookingForm(false);
        setSelectedSlot(null);
        fetchSessions(); // Recharger les données
        fetchAvailableSlots(); // Recharger les créneaux
      } else {
        toast.error(result.error || 'Erreur lors de la réservation');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Booking error:', error);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionToCancel || !selectedReason) {
      toast.error('Veuillez sélectionner un motif');
      return;
    }

    // Vérifier si un motif personnalisé est requis
    const reason = cancellationReasons.find(r => r.id === selectedReason);
    if (reason?.reason.includes('Autre') && !customReason.trim()) {
      toast.error('Veuillez préciser le motif');
      return;
    }

    setCancelLoading(true);

    try {
      const response = await fetch('/api/sessions/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionToCancel.id,
          reasonId: selectedReason,
          customReason: customReason.trim() || null,
          cancelledBy: 'STUDENT'
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Séance annulée avec succès');
        setShowCancelForm(false);
        setSessionToCancel(null);
        setSelectedReason('');
        setCustomReason('');
        fetchSessions();
        fetchAvailableSlots();
      } else {
        toast.error(result.error || 'Erreur lors de l\'annulation');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Cancel error:', error);
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM
  };

  const canCancelSession = (session: SessionData) => {
    if (session.status !== 'SCHEDULED') return false;
    
    const sessionTime = new Date(session.scheduledAt);
    const now = new Date();
    const hoursUntil = (sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return hoursUntil >= 24; // 24h minimum
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400 mx-auto mb-6"></div>
          <p className="text-white text-lg font-medium">Chargement de vos accompagnements...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p>Erreur lors du chargement des données</p>
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  // Variables calculées après vérification de data
  const unlockedSessions = data.progress?.unlockedSessions ?? 0;
  console.log('🔓 Séances débloquées calculées:', unlockedSessions);
  console.log('📈 Progression complète:', data.progress);
  const canBookMore = data.progress?.unlockedSessions !== undefined
    ? data.bookedSessionsCount < data.progress.unlockedSessions
    : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Accompagnement Individuel
                </h1>
                <p className="text-blue-200">Séances personnalisées avec votre professeur</p>
              </div>
            </div>
            
            <Link
              href="/dashboard"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl transition-all duration-300 text-white"
            >
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Statut de progression */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Votre Progression
            </h2>
            <p className="text-slate-300 text-lg">
              Débloquez des séances d'accompagnement en progressant dans le cours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Séance 1 */}
            <div className={`p-6 rounded-2xl border-2 ${
              unlockedSessions >= 1
                ? 'bg-green-500/20 border-green-500/30'
                : 'bg-zinc-800/50 border-zinc-700'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {unlockedSessions >= 1 ? (
                  <CheckCircle className="h-6 w-6 text-green-400" />
                ) : (
                  <Lock className="h-6 w-6 text-zinc-400" />
                )}
                <h3 className="text-xl font-bold text-white">1ère Séance</h3>
              </div>
              <p className="text-slate-300 mb-2">
                Débloquée à la page 7
              </p>
              {unlockedSessions >= 1 ? (
                <span className="text-green-400 font-semibold">✓ Disponible</span>
              ) : (
                <span className="text-zinc-400">🔒 Verrouillée</span>
              )}
            </div>

            {/* Séance 2 */}
            <div className={`p-6 rounded-2xl border-2 ${
              unlockedSessions >= 2 
                ? 'bg-green-500/20 border-green-500/30' 
                : 'bg-zinc-800/50 border-zinc-700'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {unlockedSessions >= 2 ? (
                  <CheckCircle className="h-6 w-6 text-green-400" />
                ) : (
                  <Lock className="h-6 w-6 text-zinc-400" />
                )}
                <h3 className="text-xl font-bold text-white">2ème Séance</h3>
              </div>
              <p className="text-slate-300 mb-2">
                Débloquée à la page 17
              </p>
              {unlockedSessions >= 2 ? (
                <span className="text-green-400 font-semibold">✓ Disponible</span>
              ) : (
                <span className="text-zinc-400">🔒 Verrouillée</span>
              )}
            </div>

            {/* Séance 3 */}
            <div className={`p-6 rounded-2xl border-2 ${
              unlockedSessions >= 3 
                ? 'bg-green-500/20 border-green-500/30' 
                : 'bg-zinc-800/50 border-zinc-700'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {unlockedSessions >= 3 ? (
                  <CheckCircle className="h-6 w-6 text-green-400" />
                ) : (
                  <Lock className="h-6 w-6 text-zinc-400" />
                )}
                <h3 className="text-xl font-bold text-white">3ème Séance</h3>
              </div>
              <p className="text-slate-300 mb-2">
                Débloquée à la page 27
              </p>
              {unlockedSessions >= 3 ? (
                <span className="text-green-400 font-semibold">✓ Disponible</span>
              ) : (
                <span className="text-zinc-400">🔒 Verrouillée</span>
              )}
            </div>
          </div>

          {/* Message de progression */}
          {!data.progress?.canBookSession && (
            <div className="mt-8 bg-blue-500/20 border border-blue-500/30 rounded-2xl p-6 text-center">
              <Zap className="h-8 w-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Continuez votre apprentissage !
              </h3>
              <p className="text-blue-200 mb-4">
                Complétez jusqu'à la page 7 pour débloquer votre première séance d'accompagnement.
              </p>
              <Link
                href="/chapitres/0/introduction"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <BookOpen className="h-5 w-5" />
                Continuer le cours
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}

          {/* Bouton de réservation */}
          {data.progress?.canBookSession && canBookMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowBookingForm(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto"
              >
                <Calendar className="h-6 w-6" />
                Réserver une séance
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Séances réservées */}
        {data.sessions?.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Calendar className="h-6 w-6 text-blue-400" />
              Mes Séances Réservées
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.sessions?.map((session) => (
                <div key={session.id} className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="h-5 w-5 text-blue-400" />
                    <h3 className="font-semibold text-white">{session.professor.name}</h3>
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(session.scheduledAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(session.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        session.status === 'COMPLETED' ? 'bg-green-400' :
                        session.status === 'SCHEDULED' ? 'bg-blue-400' :
                        session.status === 'CANCELLED' ? 'bg-red-400' :
                        'bg-red-400'
                      }`}></div>
                      <span className="capitalize">
                        {session.status === 'SCHEDULED' ? 'Programmée' :
                         session.status === 'COMPLETED' ? 'Terminée' :
                         session.status === 'CANCELLED' ? 'Annulée' :
                         session.status.toLowerCase()}
                      </span>
                    </div>
                    
                    {/* Afficher le motif d'annulation si applicable */}
                    {session.status === 'CANCELLED' && session.cancellation && (
                      <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                        <div className="text-red-400 text-xs font-medium mb-1">
                          Annulée par {session.cancellation.cancelledBy === 'STUDENT' ? 'vous' : 'le professeur'}
                        </div>
                        <div className="text-red-300 text-xs">
                          Motif : {session.cancellation.reason.reason}
                          {session.cancellation.customReason && (
                            <span> - {session.cancellation.customReason}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {session.zoomLink && session.status === 'SCHEDULED' && (
                    <div className="mt-4">
                      <a
                        href={session.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors w-full justify-center"
                      >
                        <Video className="h-4 w-4" />
                        Rejoindre la séance Zoom
                      </a>
                    </div>
                  )}
                  
                  {/* Bouton d'annulation */}
                  {canCancelSession(session) && (
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          setSessionToCancel(session);
                          setShowCancelForm(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors w-full justify-center"
                      >
                        <X className="h-4 w-4" />
                        Annuler la séance
                      </button>
                    </div>
                  )}
                  
                  {!session.zoomLink && session.status === 'SCHEDULED' && (
                    <div className="mt-4">
                      <div className="bg-yellow-600/20 border border-yellow-500/30 text-yellow-300 px-4 py-2 rounded-lg text-sm text-center">
                        ⚠️ Lien Zoom en attente de configuration par le professeur
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal de réservation */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Réserver une séance</h3>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleBookSession} className="space-y-6">
                {availableSlots.length > 0 ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-4">
                      Créneaux disponibles
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                      {availableSlots.map((slot) => (
                        <div
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedSlot?.id === slot.id
                              ? 'border-blue-500 bg-blue-500/20'
                              : 'border-white/20 bg-white/5 hover:border-white/40'
                          }`}
                        >
                          <div className="text-white font-semibold mb-2">
                            {slot.professor.name}
                          </div>
                          <div className="text-slate-300 text-sm">
                            {formatDate(slot.date)}
                          </div>
                          <div className="text-slate-300 text-sm">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </div>
                          <div className="text-blue-400 text-xs mt-1">
                            ⏱️ {(() => {
                              const [startHour, startMin] = slot.startTime.split(':').map(Number);
                              const [endHour, endMin] = slot.endTime.split(':').map(Number);
                              const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
                              return `${Math.floor(duration / 60)}h${duration % 60 > 0 ? (duration % 60).toString().padStart(2, '0') : ''}`;
                            })()}
                          </div>
                          {slot.isSpecific && (
                            <div className="text-yellow-400 text-xs mt-1">
                              📅 Créneau ponctuel
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-slate-400 mb-4">
                      Aucun créneau disponible pour le moment
                    </div>
                    <div className="text-slate-500 text-sm">
                      Les professeurs ajoutent régulièrement de nouveaux créneaux
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 border border-white/20"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading || !selectedSlot}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
                  >
                    {bookingLoading ? 'Réservation...' : 'Réserver'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                  Séance avec {sessionToCancel.professor.name}
                </div>
                <div className="text-slate-300 text-sm">
                  {new Date(sessionToCancel.scheduledAt).toLocaleDateString('fr-FR')} à{' '}
                  {new Date(sessionToCancel.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              <form onSubmit={handleCancelSession} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Motif d'annulation *
                  </label>
                  <select
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Sélectionnez un motif</option>
                    {cancellationReasons.map((reason) => (
                      <option key={reason.id} value={reason.id} className="bg-slate-800">
                        {reason.reason}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Champ personnalisé si "Autre" est sélectionné */}
                {selectedReason && cancellationReasons.find(r => r.id === selectedReason)?.reason.includes('Autre') && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Précisez le motif *
                    </label>
                    <textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Décrivez brièvement le motif..."
                      rows={3}
                      required
                    />
                  </div>
                )}
                
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
                        • Vous pourrez réserver un nouveau créneau
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

        {/* Informations sur les règles */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Award className="h-6 w-6 text-yellow-400" />
            Comment ça marche ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Déblocage progressif</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Page 7 complétée → 1ère séance disponible</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Page 17 complétée → 2ème séance disponible</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Page 27 complétée → 3ème séance disponible</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Règles de réservation</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Maximum 3 séances par élève</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Espacement minimum de 2 jours entre séances</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Professeur assigné selon votre genre</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Annulation possible jusqu'à 24h avant</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
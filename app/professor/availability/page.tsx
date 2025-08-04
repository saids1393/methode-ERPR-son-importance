'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Availability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  specificDate?: string;
  maxSessions: number;
  isActive: boolean;
}

interface AvailabilityForm {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  specificDate: string;
}

const DAYS_OF_WEEK = [
  'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
];

export default function ProfessorAvailabilityPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AvailabilityForm>({
    dayOfWeek: 1, // Lundi par défaut
    startTime: '09:00',
    endTime: '10:00',
    isRecurring: true,
    specificDate: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      const response = await fetch('/api/professor/availability');
      if (response.ok) {
        const data = await response.json();
        setAvailabilities(data.availabilities || []);
      } else if (response.status === 401) {
        router.push('/professor');
      } else {
        toast.error('Erreur lors du chargement');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Error fetching availabilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (formData.startTime >= formData.endTime) {
      toast.error('L\'heure de fin doit être après l\'heure de début');
      return;
    }

    // Vérifier la durée (max 1 heure)
    const [startHour, startMin] = formData.startTime.split(':').map(Number);
    const [endHour, endMin] = formData.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const durationMinutes = endMinutes - startMinutes;

    if (durationMinutes > 60) {
      toast.error('La durée ne peut pas dépasser 1 heure');
      return;
    }

    if (durationMinutes < 30) {
      toast.error('La durée doit être d\'au moins 30 minutes');
      return;
    }

    if (!formData.isRecurring && !formData.specificDate) {
      toast.error('Veuillez sélectionner une date pour un créneau ponctuel');
      return;
    }

    setFormLoading(true);

    try {
      const response = await fetch('/api/professor/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          specificDate: formData.isRecurring ? null : formData.specificDate
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Disponibilité ajoutée avec succès !');
        setShowForm(false);
        resetForm();
        fetchAvailabilities();
      } else {
        toast.error(result.error || 'Erreur lors de l\'ajout');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Add availability error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette disponibilité ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/professor/availability?id=${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Disponibilité supprimée');
        fetchAvailabilities();
      } else {
        toast.error(result.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
      console.error('Delete availability error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '10:00',
      isRecurring: true,
      specificDate: '',
    });
    setEditingId(null);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90); // 3 mois à l'avance
    return maxDate.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400 mx-auto mb-6"></div>
          <p className="text-white text-lg font-medium">Chargement des disponibilités...</p>
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
                    Mes Disponibilités
                  </h1>
                  <p className="text-purple-200">Gérez vos créneaux d'accompagnement</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            >
              <Plus className="h-5 w-5" />
              Ajouter un créneau
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Liste des disponibilités */}
        {availabilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availabilities.map((availability) => (
              <div key={availability.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/20 w-10 h-10 rounded-xl flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {availability.isRecurring 
                          ? DAYS_OF_WEEK[availability.dayOfWeek]
                          : 'Créneau ponctuel'
                        }
                      </h3>
                      {availability.specificDate && (
                        <p className="text-slate-400 text-sm">
                          {new Date(availability.specificDate).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(availability.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="h-4 w-4" />
                    <span>{availability.startTime} - {availability.endTime}</span>
                    <span className="text-xs text-slate-400">
                      ({Math.floor((
                        (parseInt(availability.endTime.split(':')[0]) * 60 + parseInt(availability.endTime.split(':')[1])) -
                        (parseInt(availability.startTime.split(':')[0]) * 60 + parseInt(availability.startTime.split(':')[1]))
                      ) / 60)}h{(
                        (parseInt(availability.endTime.split(':')[0]) * 60 + parseInt(availability.endTime.split(':')[1])) -
                        (parseInt(availability.startTime.split(':')[0]) * 60 + parseInt(availability.startTime.split(':')[1]))
                      ) % 60 > 0 ? ((
                        (parseInt(availability.endTime.split(':')[0]) * 60 + parseInt(availability.endTime.split(':')[1])) -
                        (parseInt(availability.startTime.split(':')[0]) * 60 + parseInt(availability.startTime.split(':')[1]))
                      ) % 60).toString().padStart(2, '0') : ''})
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      availability.isRecurring ? 'bg-blue-400' : 'bg-yellow-400'
                    }`}></div>
                    <span className="text-slate-300 text-sm">
                      {availability.isRecurring ? 'Récurrent' : 'Ponctuel'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Aucune disponibilité configurée
            </h3>
            <p className="text-slate-400 mb-6">
              Ajoutez vos créneaux pour que les élèves puissent réserver des séances.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Ajouter ma première disponibilité
            </button>
          </div>
        )}
      </main>

      {/* Modal d'ajout/édition */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingId ? 'Modifier' : 'Ajouter'} une disponibilité
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type de créneau */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Type de créneau
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.isRecurring}
                      onChange={() => setFormData(prev => ({ ...prev, isRecurring: true }))}
                      className="text-purple-600"
                    />
                    <span className="text-white">Récurrent</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!formData.isRecurring}
                      onChange={() => setFormData(prev => ({ ...prev, isRecurring: false }))}
                      className="text-purple-600"
                    />
                    <span className="text-white">Ponctuel</span>
                  </label>
                </div>
              </div>

              {/* Jour de la semaine ou date spécifique */}
              {formData.isRecurring ? (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Jour de la semaine
                  </label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData(prev => ({ ...prev, dayOfWeek: parseInt(e.target.value) }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {DAYS_OF_WEEK.map((day, index) => (
                      <option key={index} value={index} className="bg-slate-800">
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Date spécifique
                  </label>
                  <input
                    type="date"
                    value={formData.specificDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, specificDate: e.target.value }))}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required={!formData.isRecurring}
                  />
                </div>
              )}

              {/* Heures */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Heure de début
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Heure de fin
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <p className="text-slate-400 text-xs mt-1">
                    Durée : 30 min minimum, 1h maximum
                  </p>
                </div>
              </div>

              {/* Info box */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-sm text-blue-200">
                    <p className="font-medium">Informations importantes :</p>
                    <ul className="space-y-1 text-xs">
                      <li>• <strong>Durée :</strong> Entre 30 minutes et 1 heure maximum</li>
                      <li>• <strong>Réservation :</strong> 1 élève par créneau, puis disparaît</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 border border-white/20"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Ajout...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Ajouter
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
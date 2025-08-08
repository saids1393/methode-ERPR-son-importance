'use client';

import { useEffect, useState, useRef } from 'react';

export function useSimpleTimer() {
  const [totalTime, setTotalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(0);
  const [isProfessorMode, setIsProfessorMode] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Détecter si on est en mode professeur
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Vérifier spécifiquement le cookie professor-course-token
      const cookies = document.cookie.split(';');
      const professorCookie = cookies.find(cookie => 
        cookie.trim().startsWith('professor-course-token=') && 
        cookie.trim() !== 'professor-course-token='
      );
      const isProfessor = !!professorCookie;
      console.log('⏱️ TIMER HOOK - Mode professeur détecté:', isProfessor);
      setIsProfessorMode(isProfessor);
    }
  }, []);
  // Charger le temps total depuis la DB
  const loadTotalTime = async () => {
    // Si c'est un professeur, ne pas charger le temps
    if (isProfessorMode) {
      return 0;
    }

    console.log('📥 Chargement du temps total...');
    try {
      const response = await fetch('/api/auth/time');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Temps chargé:', data.studyTimeSeconds);
        setTotalTime(data.studyTimeSeconds);
        return data.studyTimeSeconds;
      }
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
    }
    return 0;
  };

  // Sauvegarder le temps en DB
  const saveTime = async (timeToAdd: number) => {
    // Si c'est un professeur, ne pas sauvegarder le temps
    if (isProfessorMode) {
      return true;
    }

    if (timeToAdd <= 0) return;
    
    console.log('💾 ===== DÉBUT SAUVEGARDE =====');
    console.log('📊 Temps à ajouter:', timeToAdd, 'secondes');
    console.log('🌐 Envoi de la requête POST...');
    
    try {
      const response = await fetch('/api/auth/time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeToAdd }),
      });
      
      console.log('📡 Réponse reçue - status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SAUVEGARDE RÉUSSIE! Nouveau total:', data.studyTimeSeconds);
        setTotalTime(data.studyTimeSeconds);
        return true;
      } else {
        console.log('❌ Erreur HTTP:', response.status);
        const errorText = await response.text();
        console.log('❌ Détails erreur:', errorText);
      }
    } catch (error) {
      console.error('❌ ERREUR SAUVEGARDE:', error);
    }
    console.log('💾 ===== FIN SAUVEGARDE =====');
    return false;
  };

  // Démarrer le chrono
  const startTimer = () => {
    // Si c'est un professeur, ne pas démarrer le chrono
    if (isProfessorMode) {
      console.log('👨‍🏫 Mode professeur détecté - chrono désactivé');
      return;
    }

    console.log('🚀 ===== DÉMARRAGE DU CHRONO =====');
    console.log('📊 État actuel - isRunning:', isRunning);
    console.log('📊 currentSession:', currentSession);
    
    if (isRunning) {
      console.log('⚠️ CHRONO DÉJÀ EN COURS - ARRÊT DE LA FONCTION');
      return;
    }
    
    // Nettoyer les anciens intervalles
    console.log('🧹 Nettoyage des anciens intervalles...');
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    
    console.log('🔄 Mise à jour des états - setIsRunning(true)...');
    setIsRunning(true);
    console.log('🔄 setCurrentSession(0)...');
    setCurrentSession(0);
    console.log('🔄 Enregistrement du temps de démarrage...');
    startTimeRef.current = Date.now();
    console.log('⏰ Temps de démarrage enregistré:', new Date(startTimeRef.current).toLocaleTimeString());
    
    console.log('⚡ Création de l\'intervalle de mise à jour (1 seconde)...');
    // Mettre à jour l'affichage chaque seconde
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      console.log('⏱️ TICK - TEMPS SESSION:', elapsed, 'secondes');
      setCurrentSession(elapsed);
    }, 1000);
    
    console.log('💾 Création de l\'intervalle de sauvegarde (30 secondes)...');
    // Sauvegarder toutes les 30 secondes
    saveIntervalRef.current = setInterval(async () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      console.log('🔍 VÉRIFICATION SAUVEGARDE - elapsed:', elapsed, 'secondes');
      if (elapsed >= 30) {
        console.log('💾 ===== SAUVEGARDE AUTO DE', elapsed, 'SECONDES =====');
        const success = await saveTime(elapsed);
        if (success) {
          console.log('✅ SAUVEGARDE RÉUSSIE - RESET DU COMPTEUR');
          startTimeRef.current = Date.now(); // Reset le compteur
          setCurrentSession(0);
        } else {
          console.log('❌ ÉCHEC DE LA SAUVEGARDE');
        }
      }
    }, 30000);
    
    console.log('✅ ===== CHRONO DÉMARRÉ AVEC SUCCÈS - INTERVALLES CRÉÉS =====');
  };

  // Arrêter le chrono
  const stopTimer = async () => {
    // Si c'est un professeur, ne rien faire
    if (isProfessorMode) {
      return;
    }

    console.log('⏹️ ARRÊT DU CHRONO');
    
    if (!isRunning) return;
    
    // Sauvegarder le temps restant
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    if (elapsed > 0) {
      console.log('💾 Sauvegarde finale de', elapsed, 'secondes');
      await saveTime(elapsed);
    }
    
    // Nettoyer
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    
    setIsRunning(false);
    setCurrentSession(0);
  };


  // Nettoyer au démontage
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, []);

  // Formater le temps
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}min ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}min ${secs}s`;
    }
    return `${secs}s`;
  };

  const displayTime = totalTime + currentSession;

  return {
    totalTime: displayTime,
    formattedTime: formatTime(displayTime),
    isRunning,
    startTimer,
    stopTimer,
    refreshTime: loadTotalTime,
    isProfessorMode
  };
}
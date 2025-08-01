'use client';

import { useCallback, useRef } from 'react';
import { getAudioFileName } from '@/lib/audioMappings';

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playLetter = useCallback((letter: string) => {
    try {
      // Arrêter le son précédent s'il joue encore
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Nettoyer la lettre et obtenir le nom de fichier personnalisé
      const cleanLetter = letter.replace(/[ـَُِ]/g, '');
      const fileName = getAudioFileName(cleanLetter, 'letter');
      const soundPath = `/sounds/letters/${fileName}.mp3`;

      // Créer un nouveau élément audio
      audioRef.current = new Audio(soundPath);
      audioRef.current.volume = 0.7; // Volume à 70%
      
      // Jouer le son
      audioRef.current.play().catch(error => {
        console.warn(`Erreur lecture audio pour ${letter}:`, error);
      });
    } catch (error) {
      console.warn(`Erreur audio pour ${letter}:`, error);
    }
  }, []);

  const playVowel = useCallback((vowelLetter: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Obtenir le nom de fichier personnalisé pour la voyelle
      const fileName = getAudioFileName(vowelLetter, 'vowel');
      const soundPath = `/sounds/vowels/${fileName}.mp3`;

      audioRef.current = new Audio(soundPath);
      audioRef.current.volume = 0.7;
      
      audioRef.current.play().catch(error => {
        console.warn(`Erreur lecture audio pour ${vowelLetter}:`, error);
      });
    } catch (error) {
      console.warn(`Erreur audio pour ${vowelLetter}:`, error);
    }
  }, []);

  const playWord = useCallback((word: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Obtenir le nom de fichier personnalisé pour le mot
      const fileName = getAudioFileName(word, 'word');
      const soundPath = `/sounds/words/${fileName}.mp3`;

      audioRef.current = new Audio(soundPath);
      audioRef.current.volume = 0.7;
      
      audioRef.current.play().catch(error => {
        console.warn(`Erreur lecture audio pour ${word}:`, error);
      });
    } catch (error) {
      console.warn(`Erreur audio pour ${word}:`, error);
    }
  }, []);

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { playLetter, playVowel, playWord, stopSound };
}
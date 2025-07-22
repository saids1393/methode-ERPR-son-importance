"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type QuizQuestion = {
  question: string;
  choices: string[];
  correctAnswerIndex: number;
};

type QuizProps = {
  quiz: QuizQuestion[];
};

const Quiz: React.FC<QuizProps> = ({ quiz }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showRecap, setShowRecap] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(updatedAnswers);

    setTimeout(() => {
      if (currentQuestion < quiz.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setSubmitted(true);
      }
    }, 400);
  };

  const getScore = () =>
    quiz.reduce(
      (score, question, index) =>
        selectedAnswers[index] === question.correctAnswerIndex ? score + 1 : score,
      0
    );

  const handleRestart = () => {
    setSelectedAnswers([]);
    setCurrentQuestion(0);
    setSubmitted(false);
    setShowRecap(false);
  };

  const score = getScore();
  const percentage = Math.round((score / quiz.length) * 100);
  const isSuccess = percentage >= 75;
  const hasErrors = selectedAnswers.some(
    (answer, index) => answer !== quiz[index].correctAnswerIndex
  );

  return (
    <div className="font-arabic min-h-screen text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-center text-white"
        >
          Test de connaissances
        </motion.h1>

        {!submitted ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="p-6 bg-zinc-800 border border-zinc-700 rounded-2xl shadow-lg"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-neutral-200 mb-4">
                Question {currentQuestion + 1} sur {quiz.length}
              </h2>
              <p className="text-base sm:text-lg font-medium text-white mb-6">
                {quiz[currentQuestion].question}
              </p>

              <div className="space-y-4">
                {quiz[currentQuestion].choices.map((choice, index) => {
                  const isSelected = selectedAnswers[currentQuestion] === index;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all font-medium duration-300 ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-400 text-white"
                          : "bg-zinc-900 border-zinc-700 text-neutral-200 hover:bg-zinc-800"
                      }`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`text-center p-8 border rounded-2xl shadow-lg ${
              isSuccess
                ? "bg-emerald-700/10 border-emerald-600"
                : "bg-orange-700/10 border-orange-600"
            }`}
          >
            <p
              className={`text-2xl sm:text-3xl font-semibold mb-2 ${
                isSuccess ? "text-emerald-400" : "text-orange-400"
              }`}
            >
              {isSuccess
                ? "🎉 Excellent travail !"
                : "Tu peux faire encore mieux en jetant un coup d'œil aux difficultés dans ce chapitre !"}
            </p>

            <p className="text-xl sm:text-2xl text-white font-medium mb-4">
              Score : {score} / {quiz.length} ({percentage}%)
            </p>

            {!isSuccess && (
              <p className="text-base text-neutral-300 mb-4 max-w-md mx-auto">
                Ce n’est pas grave, continue à t’entraîner pour progresser !
              </p>
            )}

            {hasErrors && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRecap(!showRecap)}
                className="mt-4 mr-4 inline-block px-6 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-all"
              >
                {showRecap ? "Masquer les erreurs" : "Voir les erreurs"}
              </motion.button>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
              className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
            >
              Recommencer le quiz
            </motion.button>

            {showRecap && (
              <div className="mt-8 text-left space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">Récapitulatif :</h3>
                {quiz.map((question, index) => {
                  const userAnswer = selectedAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswerIndex;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        isCorrect
                          ? "border-emerald-500 bg-emerald-800/10"
                          : "border-rose-500 bg-rose-800/10"
                      }`}
                    >
                      <p className="text-white font-medium mb-1">
                        <span className="font-semibold">Question {index + 1} :</span>{" "}
                        {question.question}
                      </p>
                      <p
                        className={`${
                          isCorrect ? "text-emerald-400" : "text-rose-400"
                        } font-semibold`}
                      >
                        Ta réponse : {question.choices[userAnswer] || "Aucune réponse"}
                      </p>
                      {!isCorrect && (
                        <p className="text-emerald-300 font-medium">
                          Bonne réponse : {question.choices[question.correctAnswerIndex]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Quiz;

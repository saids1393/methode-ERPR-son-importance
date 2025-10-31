"use client";

import React from "react";
import PageNavigation from '@/app/components/PageNavigation';

const Page30 = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Salam je suis prêt pour l'évaluation, peut-on fixer une heure ensemble ?"
    );
    const phoneNumber = "201022767532";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <div className="font-arabic min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-white">
        {/* CARD */}
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
          {/* HEADER */}
          <div
            className="p-6 sm:p-8 text-center"
            style={{
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
            }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Évaluation Finale
            </h1>
            <p className="text-base sm:text-lg opacity-90">
              Félicitations pour avoir terminé le cours !
            </p>
          </div>

          {/* CONTENT */}
          <div className="p-6 sm:p-8 md:p-10 text-center">
            <div className="mb-8">
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto text-green-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
                Prêt pour l'évaluation ?
              </h2>
              <p className="text-base sm:text-lg mb-6 leading-relaxed opacity-90">
                Veuillez contacter le professeur via WhatsApp pour planifier votre évaluation finale.
              </p>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleWhatsAppClick}
              className="group relative inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Contacter via WhatsApp
            </button>

            <p className="text-xs sm:text-sm mt-6 opacity-80">
              Le professeur vous répondra dans les plus brefs délais
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      
      <PageNavigation currentChapter={11} currentPage={30} className="mt-6 mb-4" />

<footer className="bg-gray-900 text-white text-center p-4 sm:p-6 mt-6 font-semibold text-xs sm:text-sm">
        <div>Page 30</div>
        <div className="mt-1">© 2025 Tous droits réservés</div>
      </footer>
    </>
  );
};

export default Page30;





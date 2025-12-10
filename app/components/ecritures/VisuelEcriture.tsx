import Image from "next/image";

export default function VisuelEcriture() {
  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">

      <div className="flex justify-center items-center flex-1 w-full p-4 md:p-8">
        <div className="w-full max-w-6xl">
          <Image
            src="/img/EcritureBase.jpeg"
            alt="Visuel d'écriture arabe"
            className="rounded-lg shadow-lg w-full h-auto object-contain"
            width={1920}
            height={1080}
            priority
          />
        </div>
      </div>
    </div>
  );
}

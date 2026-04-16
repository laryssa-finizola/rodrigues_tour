import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[600px] grid grid-cols-[1fr_1.2fr] overflow-hidden">
      
      {/* Texto com fundo verde */}
      <div className="bg-[#2D5A27] relative flex items-center justify-center p-8 md:p-16 z-10">
        
        {/* Barra Lateral de Ícones*/}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-6">
           <img src="/icons-hero/destination.png" alt="Mapa" className="w-10 h-10 object-contain" />
           <img src="/icons-hero/hills.png" alt="Montanha" className="w-10 h-10 object-contain" />
           <img src="/icons-hero/tourist.png" alt="Pessoa" className="w-10 h-10 object-contain" />
           <img src="/icons-hero/travel.png" alt="Globo" className="w-10 h-10 object-contain" />
           <img src="/icons-hero/bus-tour.png" alt="Ônibus" className="w-10 h-10 object-contain" />
        </div>

        {/* Conteúdo Centralizado*/}
        <div className="text-blue-100 max-w-md text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase mb-2">
            Monte seu
          </h2>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] mb-6">
            Roteiro
          </h1>
          <div className="bg-white/95 py-2 px-6 inline-block">
            <p className="text-[#2D5A27] font-bold text-lg md:text-xl">
              A sua jornada, o seu tempo.
            </p>
          </div>
        </div>
      </div>

      {/* Imagem com Slider */}
      <div className="relative h-[40vh] md:h-full w-full">
        <Image 
          src="/gramado.jpg" 
          alt="Vista de Gramado"
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          priority
        />
        
        {/* Controles do Slider */}
        <button className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-md transition-all z-20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-md transition-all z-20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicadores (Dots) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          <span className="w-2.5 h-2.5 rounded-full bg-white/40 cursor-pointer"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-white cursor-pointer shadow-lg"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-white/40 cursor-pointer"></span>
        </div>
      </div>
    </section>
  );
}
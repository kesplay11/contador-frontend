import { useEffect, useState } from 'react';
import type { CounterStats } from './types';

// Definimos la interfaz para el estado del tiempo
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function App() {
  const [stats, setStats] = useState<CounterStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Estado para almacenar la cuenta regresiva
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const API_URL = 'http://localhost:3000/api/stats';
  
  // 1. FECHA OBJETIVO: Ajusta el año, mes (0-11) y día estimado de lanzamiento
  // Ejemplo: Noviembre 1, 2026 (Recuerda que en JS los meses van de 0 a 11, Noviembre es 10)
  const TARGET_DATE = new Date(2026, 10, 19, 0, 0, 0).getTime();

  // useEffect para cargar las visitas del backend
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data: CounterStats) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // useEffect para la lógica matemática del temporizador (corre cada 1 segundo)
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference <= 0) {
        // Si ya llegó la fecha, dejamos todo en 0
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Cálculos matemáticos usando milisegundos
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Calculamos de inmediato al montar para evitar el salto de 00 a la cifra real
    calculateTime();

    // Creamos el intervalo que actualiza el estado cada 1 segundo (1000ms)
    const intervalId = setInterval(calculateTime, 1000);

    // Limpieza del intervalo si el usuario cambia de página o se desmonta el componente
    return () => clearInterval(intervalId);
  }, [TARGET_DATE]);

  // Función auxiliar para agregar el cero a la izquierda si el número es menor a 10 (ej: "05" en vez de "5")
  const formatNumber = (num: number): string => num < 10 ? `0${num}` : `${num}`;

  return (
    <div 
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white font-sans selection:bg-pink-500"
      style={{ backgroundImage: `url('./src/assets/background.jpg')` }} 
    >
      {/* Capa de superposición oscura y opaca */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Contenido real */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between items-center px-4 py-8 bg-gradient-to-b from-black/40 via-transparent to-black/80">
        
        {/* ================= SECCIÓN 1 ================= */}
        <header className="w-full max-w-4xl text-center flex flex-col items-center mt-12 gap-4">
          
          {/* Contador de visitas de la DB */}
          <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-pink-500/30 text-xs tracking-widest text-pink-400 uppercase shadow-[0_0_15px_rgba(236,72,153,0.2)]">
            {loading ? "Cargando comunidad..." : `Visitas: ${stats?.total_visits || 0}`}
          </div>

          {/* Textos Principales de GTA 6 */}
          <div className="space-y-2 mt-4">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold drop-shadow-[0_2px_8px_rgba(34,211,238,0.5)]">
              Welcome Back to
            </p>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 drop-shadow-lg">
              Vice City
            </h1>
            <h2 className="text-xl md:text-2xl font-bold tracking-[0.2em] uppercase text-gray-300">
              Grand Theft Auto VI
            </h2>
          </div>
        </header>

        {/* ================= SECCIÓN 2 ================= */}
        <main className="w-full max-w-3xl text-center mb-16 space-y-6">
          
          <p className="text-sm md:text-base text-gray-400 tracking-wider uppercase">
            El temporizador ha comenzado. Falta menos para el caos.
          </p>

          {/* Contenedor de las 4 minicajas enlazadas al estado dinámico */}
          <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-xl mx-auto">
            
            {/* Caja: Días */}
            <div className="flex flex-col items-center justify-center bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-2xl">
              <span className="text-3xl md:text-5xl font-mono font-bold text-pink-500">{formatNumber(timeLeft.days)}</span>
              <span className="text-[10px] md:text-xs uppercase tracking-wider text-gray-400 mt-1">Días</span>
            </div>

            {/* Caja: Horas */}
            <div className="flex flex-col items-center justify-center bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-2xl">
              <span className="text-3xl md:text-5xl font-mono font-bold text-purple-400">{formatNumber(timeLeft.hours)}</span>
              <span className="text-[10px] md:text-xs uppercase tracking-wider text-gray-400 mt-1">Horas</span>
            </div>

            {/* Caja: Minutos */}
            <div className="flex flex-col items-center justify-center bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-2xl">
              <span className="text-3xl md:text-5xl font-mono font-bold text-cyan-400">{formatNumber(timeLeft.minutes)}</span>
              <span className="text-[10px] md:text-xs uppercase tracking-wider text-gray-400 mt-1">Min</span>
            </div>

            {/* Caja: Segundos */}
            <div className="flex flex-col items-center justify-center bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-2xl">
              <span className="text-3xl md:text-5xl font-mono font-bold text-yellow-400">{formatNumber(timeLeft.seconds)}</span>
              <span className="text-[10px] md:text-xs uppercase tracking-wider text-gray-400 mt-1">Seg</span>
            </div>

          </div>
        </main>

        {/* Footer sutil */}
        <footer className="text-[10px] text-gray-500 tracking-widest uppercase">
          No afiliado de ninguna manera con  Rockstar Games.
          Solo un fan emocionado por el lanzamiento de GTA 6.
          Kevin Systems and Incorporated.
        </footer>

      </div>
    </div>
  );
}

export default App;
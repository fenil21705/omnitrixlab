import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { OmnitrixLoader } from "@/components/OmnitrixLoader";
import { Button } from "@/components/ui/button";
import { ChevronRight, Dna, Radar, Orbit, ShieldCheck, Database, Activity, Cpu } from "lucide-react";
import omnitrixSymbol from "@/assets/omnitrix-symbol.png";
import omnitrixInit from "@/assets/audio/omnitrix-init.mp3";
import { useAliens } from "@/hooks/useAliens";

export const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { data: aliens } = useAliens();

  const [apiStatus, setApiStatus] = useState<"ONLINE" | "OFFLINE">("OFFLINE");

  useEffect(() => {
    // Check API Health
    const checkHealth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/`);
        if (res.ok) setApiStatus("ONLINE");
      } catch (e) {
        setApiStatus("OFFLINE");
      }
    };
    checkHealth();

    // Create audio element for background music during loading
    audioRef.current = new Audio(omnitrixInit);
    audioRef.current.volume = 0.3;

    // Auto-play music on load
    audioRef.current.play().catch(() => { });

    const timer = setTimeout(() => setIsLoading(false), 2500);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const features = [
    {
      icon: Dna,
      title: "Alien Database",
      description: "Access comprehensive biological profiles and capability stats for all scanned DNA samples.",
      path: "/gallery",
      delay: 0.1
    },
    {
      icon: Radar,
      title: "Similarity Analysis",
      description: "Utilize advanced cosine similarity algorithms to find matching or combat-countering alien species.",
      path: "/similarity",
      delay: 0.2
    },
    {
      icon: Orbit,
      title: "Clustering Lab",
      description: "Advanced K-Means clustering to group species by biological traits and combat parameters.",
      path: "/cluster",
      delay: 0.3
    },
  ];

  // System Stats
  const systemStats = [
    { label: "ALIENS SCANNED", value: aliens?.length || 62, icon: Database, color: "text-primary" },
    { label: "SYSTEM STATUS", value: apiStatus, icon: Activity, color: apiStatus === "ONLINE" ? "text-green-400" : "text-red-400" },
    { label: "SECURITY LEVEL", value: "LEVEL 5", icon: ShieldCheck, color: "text-primary" },
    { label: "AI CORE", value: "ACTIVE", icon: Cpu, color: "text-blue-400" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-background to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 hex-pattern opacity-30 pointer-events-none" />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
          >
            <OmnitrixLoader />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-grow flex flex-col"
          >

            {/* System Status Bar */}
            <div className="w-full border-b border-primary/20 bg-background/50 backdrop-blur-md sticky top-16 z-40">
              <div className="container mx-auto px-4 py-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {systemStats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                      className="flex items-center gap-3 justify-center md:justify-start"
                    >
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground font-orbitron tracking-widest">{stat.label}</span>
                        <span className="text-xs font-bold font-orbitron text-foreground">{stat.value}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="flex-grow flex flex-col items-center justify-center pt-20 pb-20 text-center px-4 relative">
              {/* Decorative Background Elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                className="mb-8 relative z-10"
              >
                <div className="relative inline-block group p-4">
                  {/* Outer Glow */}
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-500 animate-pulse" />

                  {/* Contrast Backing - Prevents blending with dark background */}
                  <div className="absolute inset-4 bg-black/80 rounded-full blur-md z-0" />

                  <motion.img
                    src={omnitrixSymbol}
                    alt="Omnitrix Symbol"
                    className="w-40 h-40 sm:w-56 sm:h-56 mx-auto relative z-10 drop-shadow-[0_0_25px_hsl(var(--primary)/0.5)]"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-3xl mx-auto space-y-4 mb-12 relative z-10"
              >
                <div>
                  <h1 className="text-5xl sm:text-7xl md:text-8xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/50 text-glow tracking-tighter mb-2">
                    OMNITRIX
                  </h1>
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-px bg-primary/50 w-12 sm:w-24" />
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-orbitron font-bold text-foreground tracking-[0.2em]">
                      DATA LAB
                    </h2>
                    <div className="h-px bg-primary/50 w-12 sm:w-24" />
                  </div>
                </div>

                <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                  Deciphering the genetic code of the cosmos. Access the specialized tools designed for analyzing, clustering, and simulating alien combat scenarios.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 justify-center relative z-10 mb-20"
              >
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => navigate("/gallery")}
                  className="group min-w-[200px] h-14 text-lg rounded-full"
                >
                  INITIALIZE SYSTEM
                  <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/similarity")}
                  className="group min-w-[200px] h-14 text-lg rounded-full border-primary/50 hover:bg-primary/10"
                >
                  RUN DIAGNOSTICS
                </Button>
              </motion.div>

              {/* Feature Grid */}
              <div className="container mx-auto max-w-6xl px-4 relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-2xl font-orbitron font-bold text-foreground">AVAILABLE MODULES</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: feature.delay }}
                      onClick={() => navigate(feature.path)}
                      className="group holo-card p-8 text-left cursor-pointer hover:bg-primary/5 transition-all duration-300 border border-primary/20 hover:border-primary/50 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <feature.icon className="w-24 h-24 text-primary transform rotate-12 translate-x-4 -translate-y-4" />
                      </div>

                      <feature.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="font-orbitron font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                        {feature.description}
                      </p>

                      <div className="mt-6 flex items-center text-primary text-xs font-orbitron tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                        Access Module <ChevronRight className="w-3 h-3 ml-1" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="w-full bg-black/40 border-y border-primary/20 py-16 mb-20 relative overflow-hidden mt-20">
              <div className="absolute inset-0 bg-primary/5 hex-pattern opacity-20" />
              <div className="container mx-auto px-4 relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-orbitron font-bold text-foreground flex items-center gap-3">
                    <Activity className="w-6 h-6 text-primary" />
                    RECENT INTERCEPTIONS
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-orbitron text-primary tracking-widest">LIVE DATA FEED</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {aliens?.slice(0, 6).map((alien, i) => (
                    <motion.div
                      key={alien.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-primary/30 bg-card cursor-pointer hover:border-primary/80 transition-colors"
                      onClick={() => navigate(`/gallery`)}
                    >
                      <img src={alien.image} alt={alien.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:grayscale-0 grayscale" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />

                      {/* Scan Line Effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000" />

                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex justify-between items-end mb-1">
                          <p className="text-xs font-orbitron text-primary font-bold">{alien.name}</p>
                          <span className="text-[10px] text-primary/60 font-mono">#{alien.id.substring(0, 3)}</span>
                        </div>
                        <div className="h-0.5 w-full bg-primary/20 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[70%]" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Architecture */}
            <div className="container mx-auto max-w-5xl px-4 text-center mb-24 relative z-10">
              <h3 className="text-xl font-orbitron font-bold text-muted-foreground mb-10 text-center uppercase tracking-widest flex items-center justify-center gap-4">
                <span className="h-px w-12 bg-primary/30"></span>
                Core System Architecture
                <span className="h-px w-12 bg-primary/30"></span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "REACT CORE", status: "OPERATIONAL", color: "text-blue-400" },
                  { name: "VITE BUNDLER", status: "OPTIMIZED", color: "text-purple-400" },
                  { name: "TAILWIND MATRIX", status: "ACTIVE", color: "text-cyan-400" },
                  { name: "PYTHON NEURAL NET", status: "CONNECTED", color: "text-yellow-400" }
                ].map((tech, i) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="p-6 border border-primary/20 rounded-lg bg-black/40 backdrop-blur-sm hover:bg-primary/5 transition-all group"
                  >
                    <div className={`w-3 h-3 rounded-full mb-4 mx-auto ${tech.color} shadow-[0_0_15px_currentColor] group-hover:scale-125 transition-transform`} />
                    <p className="font-orbitron font-bold text-sm text-foreground mb-2 tracking-wider">{tech.name}</p>
                    <p className="text-[10px] text-primary/60 font-mono border border-primary/20 rounded px-2 py-1 inline-block">{tech.status}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-primary/10 py-10 text-center relative z-10">
              <p className="text-primary/40 font-orbitron text-sm">
                OMNITRIX DATA LAB v2.0 • GALVAN PRIME NEURAL NETWORK
              </p>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { useEffect, useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Skills from "@/components/Skills";
import Resume from "@/components/Resume";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import ScorpionCursor from "@/components/ScorpionCursor";
import MusicPlayer, { MusicPlayerRef } from "@/components/MusicPlayer";
import MatrixBackground from "@/components/MatrixBackground";
import WelcomeModal from "@/components/WelcomeModal";

const Index = () => {
  const [showCursor, setShowCursor] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [websiteBlocked, setWebsiteBlocked] = useState(false);
  const musicPlayerRef = useRef<MusicPlayerRef>(null);

  useEffect(() => {
    // Set dark mode as default
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme !== "light") {
      document.documentElement.classList.add("dark");
    }

    // Enable custom cursor after loading
    const timer = setTimeout(() => {
      setShowCursor(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleAcceptMusic = () => {
    setShowWelcomeModal(false);
    musicPlayerRef.current?.play();
  };

  const handleDeclineMusic = () => {
    setWebsiteBlocked(true);
    setShowWelcomeModal(false);
    alert(
      "Mohon maaf, Anda harus memutar musik untuk melanjutkan. Silakan refresh halaman untuk memulai kembali."
    );
  };

  if (websiteBlocked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <MatrixBackground />
        <div className="z-10 text-center p-8">
          <p className="text-xl font-poppins text-foreground mb-4">
            Akses ditolak
          </p>
          <p className="text-muted-foreground">
            Silakan refresh halaman untuk memulai kembali.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <MatrixBackground />
      <WelcomeModal
        open={showWelcomeModal}
        onAccept={handleAcceptMusic}
        onDecline={handleDeclineMusic}
      />
      {!showWelcomeModal && (
        <>
          <LoadingScreen />
          {showCursor && <ScorpionCursor />}
          <Navigation />
          <main className="relative z-10">
            <Hero />
            <About />
            <Portfolio />
            <Skills />
            <Resume />
            <Blog />
            <Contact />
          </main>
          <Footer />
        </>
      )}
      <MusicPlayer ref={musicPlayerRef} />
    </div>
  );
};

export default Index;

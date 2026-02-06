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
 import { DayThemeProvider } from "@/hooks/useDayTheme";

 const IndexContent = () => {
  const [showCursor, setShowCursor] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showLockedMessage, setShowLockedMessage] = useState(false);
  const musicPlayerRef = useRef<MusicPlayerRef>(null);

  useEffect(() => {
    // Set dark mode as default
    document.documentElement.classList.add("dark");

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
    setShowLockedMessage(true);
  };

  return (
     <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
       {/* Solid background layer */}
       <div className="fixed inset-0 z-0 bg-background" />
      <MatrixBackground />
      <WelcomeModal
        open={showWelcomeModal || showLockedMessage}
        onAccept={handleAcceptMusic}
        onDecline={handleDeclineMusic}
        showLockedMessage={showLockedMessage}
      />
      {!showWelcomeModal && !showLockedMessage && (
        <>
          <LoadingScreen />
          <Navigation />
          <main className="relative z-10 bg-transparent">
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

 const Index = () => {
   return (
     <DayThemeProvider>
       <IndexContent />
     </DayThemeProvider>
   );
 };
 
export default Index;

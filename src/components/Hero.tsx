import { useEffect, useState } from "react";
import { ArrowDown, Download, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

const Hero = () => {
  const { t, language } = useLanguage();
  const [displayedText, setDisplayedText] = useState("");
  const roles = language === "id"
    ? [
        "Pengembang Fullstack",
        "Insinyur AI",
        "Pengembang Web3",
        "Pengembang Mobile",
        "Insinyur IoT",
        "Desainer UI/UX",
      ]
    : [
        "Fullstack Developer",
        "AI Engineer",
        "Web3 Developer",
        "Mobile Developer",
        "IoT Engineer",
        "UI/UX Designer",
      ];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    let currentIndex = 0;
    const currentRole = roles[currentRoleIndex];
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= currentRole.length) {
        setDisplayedText(currentRole.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [currentRoleIndex]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
         <div className="absolute inset-0 bg-background/90"></div>
      </div>

      {/* Animated Grid */}
       <div className="absolute inset-0 z-0 opacity-10">
         <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
               linear-gradient(to right, hsl(var(--primary) / 0.08) 1px, transparent 1px),
               linear-gradient(to bottom, hsl(var(--primary) / 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
        <div className="animate-fade-in">
          {/* Greeting */}
           <p className="text-primary text-base sm:text-lg md:text-xl font-poppins font-medium mb-4">
            {t("hero.greeting")}
          </p>

          {/* Name */}
           <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-orbitron font-bold mb-6 gradient-text">
            Fikih Sulaiman Pratama
          </h1>

          {/* Typing Effect */}
          <div className="h-12 sm:h-16 md:h-20 mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-poppins font-semibold text-foreground">
              <span className="text-secondary">{displayedText}</span>
              <span className="animate-blink text-primary">|</span>
            </h2>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-poppins text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            {t("hero.description")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto font-poppins text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-primary hover:bg-primary/90 box-glow-hover group"
            >
              <Briefcase className="mr-2 group-hover:scale-110 transition-transform" />
              {t("nav.hireMe")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/cv-fikih-sulaiman-pratama.pdf';
                link.download = 'CV-Fikih-Sulaiman-Pratama.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="w-full sm:w-auto font-poppins text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-primary text-primary hover:bg-primary/10 box-glow-hover group"
            >
              <Download className="mr-2 group-hover:scale-110 transition-transform" />
              {t("hero.downloadCV")}
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#about"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
           <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </a>
      </div>
    </section>
  );
};

export default Hero;

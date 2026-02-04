import { useEffect, useState } from "react";

type DayTheme = 
  | "monday" 
  | "tuesday" 
  | "wednesday" 
  | "thursday" 
  | "friday" 
  | "saturday" 
  | "sunday";

const dayThemes: Record<number, DayTheme> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

const themeNames: Record<DayTheme, string> = {
  monday: "Navy Blue",
  tuesday: "Dark Gray + Blue",
  wednesday: "Matrix Futuristik",
  thursday: "Charcoal + Emerald",
  friday: "Earth Tone Elegan",
  saturday: "Slate Soft Dark",
  sunday: "Soft Blue",
};

export const useDayTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<DayTheme>("wednesday");
  const [themeName, setThemeName] = useState<string>("Matrix Futuristik");

  useEffect(() => {
    const applyDayTheme = () => {
      try {
        const today = new Date().getDay();
        const theme = dayThemes[today] || "wednesday";
        
        // Remove all day theme classes
        document.documentElement.classList.remove(
          "theme-monday",
          "theme-tuesday",
          "theme-wednesday",
          "theme-thursday",
          "theme-friday",
          "theme-saturday",
          "theme-sunday"
        );
        
        // Add current day theme class
        document.documentElement.classList.add(`theme-${theme}`);
        
        setCurrentTheme(theme);
        setThemeName(themeNames[theme]);
      } catch (error) {
        // Fallback to Wednesday (Matrix theme) if error
        console.error("Error applying day theme:", error);
        document.documentElement.classList.add("theme-wednesday");
        setCurrentTheme("wednesday");
        setThemeName("Matrix Futuristik");
      }
    };

    applyDayTheme();

    // Check for day change every minute
    const interval = setInterval(() => {
      const today = new Date().getDay();
      const theme = dayThemes[today];
      if (theme !== currentTheme) {
        applyDayTheme();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [currentTheme]);

  return { currentTheme, themeName };
};

export default useDayTheme;

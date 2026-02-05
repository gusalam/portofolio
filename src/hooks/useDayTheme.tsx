 import { useEffect, useState, useCallback } from "react";

 export type DayTheme = 
  | "monday" 
  | "tuesday" 
  | "wednesday" 
  | "thursday" 
  | "friday" 
  | "saturday" 
  | "sunday";

 export const dayThemes: Record<number, DayTheme> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

 export const themeNames: Record<DayTheme, string> = {
  monday: "Navy Blue",
  tuesday: "Dark Gray + Blue",
  wednesday: "Matrix Futuristik",
  thursday: "Charcoal + Emerald",
  friday: "Earth Tone Elegan",
  saturday: "Slate Soft Dark",
  sunday: "Soft Blue",
};

 const THEME_STORAGE_KEY = "user-theme-preference";
 const AUTO_THEME_KEY = "auto";
 
 const getCurrentDayTheme = (): DayTheme => {
   const today = new Date().getDay();
   return dayThemes[today] || "wednesday";
 };
 
 const applyThemeClass = (theme: DayTheme) => {
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
   
   // Add current theme class
   document.documentElement.classList.add(`theme-${theme}`);
 };
 
export const useDayTheme = () => {
   const [currentTheme, setCurrentTheme] = useState<DayTheme>(getCurrentDayTheme);
   const [isAutoMode, setIsAutoMode] = useState<boolean>(true);
   const [lastCheckedDay, setLastCheckedDay] = useState<number>(new Date().getDay());

   // Apply theme and update state
   const applyTheme = useCallback((theme: DayTheme) => {
     try {
       applyThemeClass(theme);
       setCurrentTheme(theme);
     } catch (error) {
       console.error("Error applying theme:", error);
       // Fallback to Wednesday (Matrix theme)
       applyThemeClass("wednesday");
       setCurrentTheme("wednesday");
     }
   }, []);
 
   // Set manual theme override
   const setManualTheme = useCallback((theme: DayTheme | null) => {
     try {
       if (theme === null) {
         // Switch back to auto mode
         localStorage.setItem(THEME_STORAGE_KEY, AUTO_THEME_KEY);
         setIsAutoMode(true);
         const dayTheme = getCurrentDayTheme();
         applyTheme(dayTheme);
       } else {
         // Set manual override
         localStorage.setItem(THEME_STORAGE_KEY, theme);
         setIsAutoMode(false);
         applyTheme(theme);
       }
     } catch (error) {
       console.error("Error saving theme preference:", error);
     }
   }, [applyTheme]);
 
   // Initialize theme on mount
   useEffect(() => {
     const initializeTheme = () => {
      try {
         const savedPreference = localStorage.getItem(THEME_STORAGE_KEY);
         
         if (savedPreference && savedPreference !== AUTO_THEME_KEY) {
           // User has manual preference
           const isValidTheme = Object.values(dayThemes).includes(savedPreference as DayTheme);
           if (isValidTheme) {
             setIsAutoMode(false);
             applyTheme(savedPreference as DayTheme);
             return;
           }
         }
         
         // Auto mode - apply day-based theme
         setIsAutoMode(true);
         const dayTheme = getCurrentDayTheme();
         applyTheme(dayTheme);
      } catch (error) {
        console.error("Error applying day theme:", error);
         applyTheme("wednesday");
      }
    };

     initializeTheme();
   }, [applyTheme]);

   // Check for day change periodically (every 30 seconds)
   useEffect(() => {
     if (!isAutoMode) return;
 
    const interval = setInterval(() => {
       try {
         const currentDay = new Date().getDay();
         
         // Only update if day has actually changed
         if (currentDay !== lastCheckedDay) {
           setLastCheckedDay(currentDay);
           const newTheme = dayThemes[currentDay] || "wednesday";
           applyTheme(newTheme);
         }
       } catch (error) {
         console.error("Error checking day change:", error);
      }
     }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
   }, [isAutoMode, lastCheckedDay, applyTheme]);

   return { 
     currentTheme, 
     themeName: themeNames[currentTheme],
     isAutoMode,
     setManualTheme,
     allThemes: Object.values(dayThemes) as DayTheme[],
     themeNames
   };
};

export default useDayTheme;

import { Button } from "@/components/ui/button";
import { Play, LogOut } from "lucide-react";

interface WelcomeModalProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  showLockedMessage?: boolean;
}

const WelcomeModal = ({ open, onAccept, onDecline, showLockedMessage = false }: WelcomeModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative z-10 w-full max-w-md transform transition-all duration-500 ease-out animate-in fade-in zoom-in-95"
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 0, 0.3)',
          borderRadius: '24px',
          boxShadow: '0 0 40px rgba(0, 255, 0, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        }}
      >
        <div className="p-8 text-center">
          {/* Glowing accent line */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #00ff00, transparent)',
              boxShadow: '0 0 20px #00ff00',
            }}
          />

          {/* Title */}
          <h1 
            className="text-2xl md:text-3xl font-orbitron font-bold mb-4 mt-4"
            style={{
              background: 'linear-gradient(135deg, #00ff00, #00cc00, #88ff88)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(0, 255, 0, 0.5)',
            }}
          >
            Selamat Datang di Portofolio Tretan Developer
          </h1>

          {/* Description */}
          {!showLockedMessage ? (
            <p className="text-gray-400 font-poppins text-sm md:text-base mb-8 leading-relaxed">
              Untuk melanjutkan, silakan putar musik latar terlebih dahulu.
            </p>
          ) : (
            <div className="mb-8">
              <p className="text-red-400/80 font-poppins text-sm md:text-base leading-relaxed">
                Musik diperlukan untuk pengalaman penuh.
              </p>
              <p className="text-gray-500 font-poppins text-xs md:text-sm mt-2">
                Silakan refresh halaman jika ingin masuk kembali.
              </p>
            </div>
          )}

          {/* Buttons */}
          {!showLockedMessage && (
            <div className="flex flex-col gap-3">
              <Button
                onClick={onAccept}
                className="w-full py-6 text-base font-poppins font-semibold transition-all duration-300 group"
                style={{
                  background: 'linear-gradient(135deg, #00ff00, #00cc00)',
                  color: '#000',
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.4)',
                  border: 'none',
                }}
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Putar Musik & Masuk
              </Button>
              <Button
                variant="ghost"
                onClick={onDecline}
                className="w-full py-5 text-gray-400 hover:text-gray-300 hover:bg-white/5 font-poppins transition-all duration-300 border border-gray-700/50 hover:border-gray-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </Button>
            </div>
          )}

          {/* Decorative elements */}
          <div 
            className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full opacity-20 blur-2xl"
            style={{ background: '#00ff00' }}
          />
          <div 
            className="absolute -top-2 -left-2 w-16 h-16 rounded-full opacity-10 blur-2xl"
            style={{ background: '#00ff00' }}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;

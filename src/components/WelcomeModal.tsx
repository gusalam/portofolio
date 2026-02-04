import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Music, X } from "lucide-react";

interface WelcomeModalProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const WelcomeModal = ({ open, onAccept, onDecline }: WelcomeModalProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md border-primary/50 bg-background/95 backdrop-blur-md">
        <AlertDialogHeader className="text-center">
          <AlertDialogTitle className="text-2xl font-orbitron gradient-text text-glow-strong text-center">
            Selamat Datang di Portofolio Tretan Developer
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-center mt-4">
            Untuk pengalaman terbaik, website ini dilengkapi dengan musik latar.
            Apakah Anda ingin memutar musik?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            onClick={onAccept}
            className="flex-1 bg-primary hover:bg-primary/90 box-glow-hover font-poppins"
          >
            <Music className="mr-2 h-4 w-4" />
            Ya, Putar Musik
          </Button>
          <Button
            variant="outline"
            onClick={onDecline}
            className="flex-1 border-destructive text-destructive hover:bg-destructive/10 font-poppins"
          >
            <X className="mr-2 h-4 w-4" />
            Tidak
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WelcomeModal;

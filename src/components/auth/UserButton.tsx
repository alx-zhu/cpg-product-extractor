import { useState } from "react";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export const UserButton = () => {
  const { role } = useAuth();
  const [open, setOpen] = useState(false);

  if (role !== "guest") return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Sign in"
        title="Sign in"
      >
        <User className="w-4 h-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm p-0 overflow-hidden">
          <LoginForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

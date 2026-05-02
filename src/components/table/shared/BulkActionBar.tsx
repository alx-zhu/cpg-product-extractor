import { useState } from "react";
import { Download, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/utils/cn";
import type { ExtractedIngredientSpec } from "@/types/ingredientSpec";
import { useDeleteSpecs } from "@/hooks/useSpecs";

interface BulkActionBarProps {
  selectedSpecs: ExtractedIngredientSpec[];
  onClearSelection: () => void;
  onExport: (specs: ExtractedIngredientSpec[]) => void;
}

export function BulkActionBar({
  selectedSpecs,
  onClearSelection,
  onExport,
}: BulkActionBarProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteSpecs = useDeleteSpecs();

  const count = selectedSpecs.length;
  const isVisible = count > 0;

  const handleDelete = () => {
    deleteSpecs.mutate(selectedSpecs.map((s) => s.id), {
      onSuccess: () => {
        onClearSelection();
        setDeleteDialogOpen(false);
      },
    });
  };

  return (
    <>
      <div
        className={cn(
          "absolute bottom-4 left-1/2 -translate-x-1/2 z-30",
          "transition-all duration-200 ease-out",
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none",
        )}
      >
        <div className="flex items-center gap-3 bg-gray-900 text-white rounded-xl px-4 py-2.5 shadow-lg">
          <span className="text-sm font-medium whitespace-nowrap">
            {count} selected
          </span>

          <div className="w-px h-5 bg-white/20" />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 hover:text-white gap-1.5 h-8"
              onClick={() => onExport(selectedSpecs)}
            >
              <Download className="size-3.5" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-300 hover:bg-red-500/20 hover:text-red-200 gap-1.5 h-8"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>

          <div className="w-px h-5 bg-white/20" />

          <button
            onClick={onClearSelection}
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Clear selection"
          >
            <X className="size-4 text-white/60" />
          </button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {count} {count === 1 ? "spec" : "specs"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {count === 1
                ? "Are you sure you want to delete this spec? This action cannot be undone."
                : `Are you sure you want to delete these ${count} specs? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete {count === 1 ? "spec" : `${count} specs`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

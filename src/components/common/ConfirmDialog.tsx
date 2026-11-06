import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle } from
'../ui/AlertDialog';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}

// The buttons are plain Buttons, not the design system's AlertDialogAction/AlertDialogCancel:
// those call an undefined `setOpen` on click, throw, and never run their onClick.
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-2xl font-normal">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={() => {
              // Confirm first, then close: e.g. the unsaved-changes dialog must proceed with the
              // navigation before closing, or closing would cancel it
              onConfirm();
              onOpenChange(false);
            }}
            className={cn(destructive && 'bg-destructive text-white hover:bg-[#8a2f23]')}>

            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>);

}

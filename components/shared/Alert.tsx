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
import { FC, ReactNode } from "react";

type AlertProps = {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
};

const Alert: FC<AlertProps> = (props) => {
  const {
    open,
    title,
    description,
    onConfirm,
    onCancel,
    confirmLabel = "Continue",
    cancelLabel = "Cancel",
  } = props;
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;

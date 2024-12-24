import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Modal({
  title,
  open,
  setOpen,
  children,
}: {
  title?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) {
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>{title ?? 'Modal'}</DialogTitle>
          <DialogDescription /** TODO: add description by context */ />
        </DialogHeader>
        <div className="px-5 pb-5">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

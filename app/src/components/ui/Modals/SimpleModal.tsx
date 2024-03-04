import { useEffect, useState } from 'react';
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../button';

export default function SimpleModal({
  title,
  description,
  type,
}: {
  title: string;
  description: string;
  type: string;
}) {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-5">
          {type === 'error' ? (
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <ExclamationTriangleIcon
                className="h-5 w-5 text-red-600"
                aria-hidden="true"
              />
            </div>
          ) : (
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <CheckIcon
                className="h-5 w-5 text-green-600"
                aria-hidden="true"
              />
            </div>
          )}
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button className="w-full" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

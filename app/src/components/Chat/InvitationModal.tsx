import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { FilmIcon, LandPlotIcon, TreesIcon, UtensilsIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '../ui/label';
import customAxios from '@/utils/axios';

export const InvitationModal = ({ open, setOpen, matchId }) => {
  const [activity, setActivity] = useState<string>();

  const sendInvitation = async () => {
    try {
      if (!activity) return;
      await customAxios.post('/chat/invitation', {
        match_id: matchId,
        activity,
      });
      setOpen(false);
      toast.success('Invitation sent !');
    } catch (err) {
      if (err.response?.data?.message) toast.error(err.response.data.message);
      else toast.error('An error occurred');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <LandPlotIcon
              className="h-5 w-5 text-green-600"
              aria-hidden="true"
            />
          </div>
          <DialogTitle className="text-center">Send Invitation</DialogTitle>
        </DialogHeader>
        <RadioGroup
          className="flex flex-wrap justify-center gap-5 pt-2"
          id="images"
          onValueChange={(value) => setActivity(value)}
        >
          <Label className="bg-white dark:bg-gray-950 flex flex-col gap-3 justify-center items-center w-24 h-24 [&:has([data-state=checked])]:border-pink [&:has([data-state=checked])]:border-2 rounded-3xl cursor-pointer">
            <RadioGroupItem value="Dinner" className="sr-only" />
            <UtensilsIcon className="h-10 w-10 dark:text-white" />
            Dinner
          </Label>
          <Label className="bg-white dark:bg-gray-950 flex flex-col gap-3 justify-center items-center w-24 h-24 [&:has([data-state=checked])]:border-pink [&:has([data-state=checked])]:border-2 rounded-3xl cursor-pointer">
            <RadioGroupItem value="Movie" className="sr-only" />
            <FilmIcon className="h-10 w-10 dark:text-white" />
            Movie
          </Label>
          <Label className="bg-white dark:bg-gray-950 flex flex-col gap-3 justify-center items-center w-24 h-24 [&:has([data-state=checked])]:border-pink [&:has([data-state=checked])]:border-2 rounded-3xl cursor-pointer">
            <RadioGroupItem value="Park" className="sr-only" />
            <TreesIcon className="h-10 w-10 dark:text-white" />
            Park
          </Label>
        </RadioGroup>
        <DialogFooter className="mt-2">
          <Button className="w-full" onClick={sendInvitation}>
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

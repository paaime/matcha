'use client';

import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useEffect, useState } from 'react';

export default function Customization() {
  const [monted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();

  // const changeLanguage = (language) => {
  //   router.push(pathname, { locale: language });
  //   router.refresh();
  // };

  const changeTheme = (theme) => {
    setTheme(theme);
  };

  useEffect(() => setMounted(true), []);

  if (!monted) return null;

  return (
    <div className="space-y-6">
      {/* <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select
          onValueChange={changeLanguage}
          defaultValue={locale}
          name="language"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Language</SelectLabel>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          The language will be changed instantly.
        </p>
      </div> */}
      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <p className="text-sm text-muted-foreground">
          You can change the theme here.
        </p>
        <RadioGroup
          onValueChange={changeTheme}
          defaultValue={resolvedTheme}
          id="theme"
          className="grid max-w-md grid-cols-2 gap-8 pt-2"
        >
          <Label className="[&:has([data-state=checked])>div]:border-primary">
            <RadioGroupItem value="light" className="sr-only" />
            <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
              <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">
              Light
            </span>
          </Label>
          <Label className="[&:has([data-state=checked])>div]:border-primary">
            <RadioGroupItem value="dark" className="sr-only" />
            <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
              <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">
              Dark
            </span>
          </Label>
        </RadioGroup>
      </div>
    </div>
  );
}

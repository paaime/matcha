'use client';

import 'animate.css';
import Age from './Age';
import Gender from './Gender';
import Interests from './Interests';
import Pagination from './Pagination';
import Gallery from './Gallery';
import Bio from './Bio';
import { useState } from 'react';
import { ChevronLeftIcon } from 'lucide-react';
import { Button } from '../ui/button';
import SexualPreference from './SexualPreference';

export default function CompleteForm() {
  const [step, setStep] = useState(1);
  const goBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };
  return (
    <>
      <Button
        variant="outline"
        className="bg-transparent w-10 h-10 group"
        onClick={goBack}
      >
        <ChevronLeftIcon className={'text-black h-6 w-6 '} />
      </Button>
      {step === 1 && <Gender setStep={setStep} />}
      {step === 2 && <SexualPreference setStep={setStep} />}
      {step === 3 && <Age setStep={setStep} />}
      {step === 4 && <Interests setStep={setStep} />}
      {step === 5 && <Gallery setStep={setStep} />}
      {step === 6 && <Bio setStep={setStep} />}
      <Pagination step={step} />
    </>
  );
}

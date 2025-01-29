"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { PlanRenderer, PlanSkeleton } from "@/components/plan-renderer";
const questions = [
  "What destinations have you always wanted to visit?",
  "What's your travel budget range?",
  "What type of experiences do you prefer? (e.g., adventure, cultural, relaxation)",
  "Any dietary restrictions or preferences?",
  "What's your ideal travel pace? (slow vs packed)"
];

export function TravelForm() {
  const { register, handleSubmit, formState: { isValid } } = useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setLoading(true);
      try {
        const response = await fetch("/api/plan", {
          method: "POST",
          body: JSON.stringify({ answers: Object.values(data) })
        });
        const { plan } = await response.json();
        setPlan(plan);
      } finally {
        setLoading(false);
      }
    }
  };

  if (plan) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-12"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-600 mb-4">
          Your Adventure Awaits! 🌍
        </h2>
        <p className="text-gray-600 text-lg">
          Here is your personalized travel plan crafted just for you
        </p>
      </div>
      <PlanRenderer plan={plan} />
      <div className="mt-12 text-center">
        <Button 
          onClick={() => {
            setPlan(null);
            setCurrentStep(0);
          }}
          variant="outline"
          className="bg-white hover:bg-gray-50"
        >
          Start Over
        </Button>
      </div>
    </motion.div>
  );
  
  if (loading) return <PlanSkeleton />;

  return (
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-xl font-semibold">
          {questions[currentStep]}
        </h3>
        
        <Textarea
          {...register(`answer${currentStep}`, { required: true })}
          className="min-h-[120px]"
        />

        <div className="flex justify-between">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
            >
              Back
            </Button>
          )}
          
          <Button
            type="submit"
            disabled={!isValid || loading}
            className="ml-auto"
          >
            {currentStep === questions.length - 1 
              ? "Generate Plan" 
              : "Next"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
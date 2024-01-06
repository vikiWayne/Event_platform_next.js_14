"use client";

import { Button } from "@/components/ui/button";

type ErrorBoundaryProps = {
  reset: () => void;
};

const ErrorBoundary = (props: ErrorBoundaryProps) => {
  const { reset } = props;
  return (
    <div className="flex w-full p-14 h-full items-center justify-center flex-col gap-8">
      <p className="text-red-500">Sorry!! We are unable to load the form!</p>
      <Button onClick={reset} className="button" size="lg">
        Try Again
      </Button>
    </div>
  );
};

export default ErrorBoundary;

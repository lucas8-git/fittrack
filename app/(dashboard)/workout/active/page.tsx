'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ActiveWorkout } from '@/components';

export default function ActiveWorkoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workoutId = searchParams.get('id');

  if (!workoutId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-foreground">Workout not found</p>
      </div>
    );
  }

  return <ActiveWorkout workoutId={workoutId} />;
}

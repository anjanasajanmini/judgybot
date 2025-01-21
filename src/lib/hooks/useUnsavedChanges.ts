'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useUnsavedChanges(hasUnsavedChanges: boolean) {
    const router = useRouter();

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        const handleRouteChange = () => {
            if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
                throw 'routeChange aborted.';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handleRouteChange);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, [hasUnsavedChanges]);
} 
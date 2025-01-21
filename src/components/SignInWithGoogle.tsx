"use client";

import { useAuth } from '@/lib/contexts/AuthContext';
import Image from 'next/image';

export default function SignInWithGoogle() {
  const { signInWithGoogle } = useAuth();

  return (
    <button
      onClick={signInWithGoogle}
      className="flex items-center gap-2 px-6 py-3 bg-white text-gray-800 rounded-lg shadow hover:shadow-md transition-all border"
    >
      <Image
        src="/google.svg"
        alt="Google logo"
        width={20}
        height={20}
      />
      Sign in with Google
    </button>
  );
}

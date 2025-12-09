'use client';
import Link from 'next/link';

export default function CheckInSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
            <div className="text-center max-w-md w-full bg-dark-800 p-8 rounded-2xl border border-dark-700 shadow-2xl">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">✓</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Check-in Complete</h1>
                <p className="text-dark-300 mb-8">
                    Your vault is secure. The timer has been reset successfully.
                    Thank you for staying with us.
                </p>

                <Link
                    href="/dashboard"
                    className="block w-full btn-primary text-center py-3 rounded-xl"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
}

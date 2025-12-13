'use client';

import KipAvatar from '@/components/brand/KipAvatar';

export default function BrandKitPage() {
    return (
        <div className="min-h-screen bg-white p-20 grid grid-cols-2 gap-20">
            {/* 1. Healthy / Happy */}
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-2xl font-bold text-black">Healthy (Happy)</h2>
                <div className="p-10 border border-gray-100 rounded-xl bg-slate-50">
                    <KipAvatar seed="demo" health={100} size="xl" isCelebrating={true} />
                </div>
            </div>

            {/* 2. Neutral / Hungry */}
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-2xl font-bold text-black">Hungry (Neutral)</h2>
                <div className="p-10 border border-gray-100 rounded-xl bg-slate-50">
                    <KipAvatar seed="demo" health={60} size="xl" />
                </div>
            </div>

            {/* 3. Critical / Scared */}
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-2xl font-bold text-black">Critical (Scared)</h2>
                <div className="p-10 border border-gray-100 rounded-xl bg-slate-50">
                    <KipAvatar seed="demo" health={10} size="xl" />
                </div>
            </div>

            {/* 4. Ghost / Dead */}
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-2xl font-bold text-black">Ghost (Dead)</h2>
                <div className="p-10 border border-gray-100 rounded-xl bg-slate-50">
                    <KipAvatar seed="demo" health={0} isReleased={true} size="xl" />
                </div>
            </div>
        </div>
    );
}

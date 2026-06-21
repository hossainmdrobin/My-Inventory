import Link from 'next/link'
import React from 'react'

export default function NavBarSkeleton() {
    return (
        <header className="fixed top-0 left-0 z-50 w-full">
            <nav className="backdrop-blur-md bg-white/5 border-b border-white/10">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex h-16 items-center justify-between">
                        {/* Brand */}
                        <Link
                            href="/"
                            className="text-xl font-bold text-white tracking-wide"
                        >
                            Sathi Enterprise
                        </Link>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8"></div>

                        {/* Mobile Toggle */}
                        <div>
                            <button className='animate-pulse bg-white/5 opacity-0.2 w-20 h-6 ml-8 rounded'></button>
                            <button className='animate-pulse bg-white/5 opacity-0.2 w-20 h-6 ml-8 rounded'></button>
                            <button className='animate-pulse bg-white/5 opacity-0.2 w-20 h-6 ml-8 rounded'></button>
                            <button className='animate-pulse bg-white/5 opacity-0.2 w-20 h-6 ml-8 rounded'></button>

                        </div>

                    </div>
                </div>
            </nav>
        </header>
    )
}

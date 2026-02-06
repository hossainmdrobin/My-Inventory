"use client";
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6">
            {/* Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_60%)]" />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 max-w-4xl text-center"
            >
                {/* Brand Name */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight text-white"
                >
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        YourBrand
                    </span>
                </motion.h1>

                {/* Slogan */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-6 text-lg md:text-xl text-slate-300"
                >
                    Trusted Wholesale Partner for Quality Products at the Best Price
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button className="rounded-xl bg-blue-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-600">
                        Browse Products
                    </button>

                    <button className="rounded-xl border border-slate-500 px-8 py-3 font-semibold text-slate-200 transition hover:bg-slate-800">
                        Contact Wholesale
                    </button>
                </motion.div>
            </motion.div>
        </section>
    );
}

import { loginAction } from "@/actions/auth";
import Input from "@/reusable/Input";
import Link from "next/link";

export default function LoginForm() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-6">
                <form action={loginAction} className="space-y-4 text-white">
                    <h2 className="text-xl font-semibold text-center text-white">Welcome Back</h2>

                    <Input label="Email" name="email" type="email" placeholder="you@example.com" />
                    <Input label="Password" name="password" type="password" placeholder="••••••••" />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-semibold"
                    >
                        Login
                    </button>
                    <div className="text-center">Or</div>
                    <div className="text-center">
                        <Link href="/signup">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-semibold"
                            >
                                Signup
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
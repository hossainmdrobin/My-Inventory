import { signupAction } from "@/actions/auth";
import Input from "@/reusable/Input";
import Link from "next/link";

export default function SignupForm() {
    //   const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    //   function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    //     const file = e.target.files?.[0];
    //     if (!file) return;
    //     setPhotoPreview(URL.createObjectURL(file));
    //   }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-6">
                <form action={signupAction} className="space-y-4 text-white">
                    <h2 className="text-xl font-semibold text-center text-white">Create Account</h2>

                    {/* Profile Photo */}
                    {/* <div className="flex flex-col items-center gap-2">
        <div className="h-24 w-24 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
          {photoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-slate-400 text-sm">Photo</span>
          )}
        </div>

        <label className="text-sm cursor-pointer text-blue-400 hover:underline">
          Upload photo
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        </label>
      </div> */}

                    <Input label="Name" name="name" placeholder="Your full name" />
                    <Input label="Email" name="email" type="email" placeholder="you@example.com" />
                    <Input label="Phone Number" name="phone" type="tel" placeholder="+8801XXXXXXXXX" />
                    <Input label="Password" name="password" type="password" placeholder="••••••••" />
                    <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••" />

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 transition py-2 rounded-lg font-semibold"
                    >
                        Create Account
                    </button>
                    <div className="text-center">Or</div>
                    <div className="text-center">
                        <Link href="/login">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-semibold"
                            >
                                Login
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
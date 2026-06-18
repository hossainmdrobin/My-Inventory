"use server";

import { generateJWT, hashPassword, verifyPassword } from "@/auth";
import connectToDB from "@/db";
import User from "@/models/User";
import Institute from "@/models/Institute";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export const signupAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    await connectToDB();

    const exitingUser = await User.findOne({ email });
    if (exitingUser) {
        redirect("/app/auth?error=email_exists");
    }

    const institute = new Institute({})
    await institute.save();

    const hashedPass = await hashPassword(password);
    const newUser = new User({ institute: institute._id, email, password: hashedPass, name, phone });
    await newUser.save();
    const token = await generateJWT(email, newUser._id.toString());
    const cookieStore = await cookies();
    cookieStore.set("token", token, { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 30 });
    redirect("/app/dashboard");
}

export const loginAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await connectToDB();
    const user = await User.findOne({ email });
    if (!user) {
        redirect("/app/auth?error=invalid_credentials");
    }
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
        redirect("/app/auth?error=invalid_credentials");
    }
    const token = await generateJWT(email, user._id.toString());
    const cookieStore = await cookies();
    cookieStore.set("token", token, { path: "/", httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 30 });
    redirect("/app/dashboard");
}

export const logoutAction = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    redirect("/app/auth");
}

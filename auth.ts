

"use server";
import bcrypt from "bcrypt";
import { sign } from "crypto"
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";


interface CustomJWTPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}

const SECRETKEY = new TextEncoder().encode(process.env.JWT_SECRET || "myinventorysecret");

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    console.log(password, "Provided passsword");
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

export async function generateJWT(email: string, userId: string): Promise<string> {
    const token = await new SignJWT({ email, userId })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(SECRETKEY);
    return token;
}

export const verifyJWT = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    try {
        const { payload }: { payload: CustomJWTPayload } = await jwtVerify(token, SECRETKEY);
        return payload;
    } catch (error) {
        throw new Error("Invalid token");
    }
};

export const getSession = async () => {
    const payload = await verifyJWT();
    if (!payload) return null;
    if (payload && typeof payload.email === "string" && typeof payload.userId === "string") {
        return { email: payload.email, userId: payload.userId };
    }
    return null;
};
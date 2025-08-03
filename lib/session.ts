"use server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SECRET_KEY || "kutilabteam";
const key = new TextEncoder().encode(secretKey);

type SessionPayload = {
  id: string;
  nama_lengkap: string;
  email: string;
  role: string;
  expires: Date;
};

export async function encrypt(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(input: string | undefined = ""): Promise<any> {
  try {
    if (!input || input === "") {
      return null;
    }
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Failed to verify session! ", error);
    return null;
  }
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function createSession(user: {
  id: string;
  nama_lengkap: string;
  email: string;
  role: string;
}) {
  const sessionTime = Number(process.env.SESSION_TIME) || 1 * 60 * 60; // Default to 1 hour
  const expires = new Date(Date.now() + sessionTime * 1000);
  const session = await encrypt({ ...user, expires });
  const storeCookies = await cookies();

  storeCookies.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expires,
  });
}

export async function deleteSession() {
  const storeCookies = await cookies();
  storeCookies.set("session", "", { expires: new Date(0) });
}

/**
 * POST /api/register
 * Creates a new user account.
 * Password is hashed with bcrypt before storage — never stored in plain text.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Le prénom est requis").max(50),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Un compte avec cet email existe déjà." },
        { status: 409 }
      );
    }

    // Hash password — cost factor 12 (good balance security/performance)
    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: { name, email, password: hashed },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

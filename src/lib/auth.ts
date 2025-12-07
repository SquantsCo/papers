import { type NextAuthOptions } from "next-auth";
import { type Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcryptjs from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" },
        firstName: { label: "First Name", type: "text" },
        lastName: { label: "Last Name", type: "text" },
        isSignUp: { label: "Is Sign Up", type: "hidden" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const isSignUp = credentials.isSignUp === "true";

        if (isSignUp) {
          // Sign up flow
          const existingUser = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (existingUser) {
            throw new Error("Email already registered");
          }

          const existingUsername = await prisma.user.findUnique({
            where: { username: credentials.username || credentials.email },
          });

          if (existingUsername && credentials.username) {
            throw new Error("Username already taken");
          }

          // Hash password
          const hashedPassword = await bcryptjs.hash(credentials.password, 10);

          // Create verification token
          const verificationToken = Buffer.from(JSON.stringify({
            email: credentials.email,
            timestamp: Date.now(),
          })).toString("base64");

          // Create user with unverified email
          const user = await prisma.user.create({
            data: {
              email: credentials.email,
              username: credentials.username || credentials.email,
              password: hashedPassword,
              firstName: credentials.firstName,
              lastName: credentials.lastName,
              emailVerified: false,
              emailVerificationToken: verificationToken,
              emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
              authProvider: "email",
            },
          });

          // Send verification email (you'll need to implement this)
          await sendVerificationEmail(user.email, verificationToken);

          throw new Error("Verification email sent. Please check your inbox.");
        }

        // Login flow
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email first");
        }

        if (!user.password) {
          throw new Error("This account uses OAuth. Please use the OAuth provider to sign in.");
        }

        const isPasswordValid = await bcryptjs.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          image: user.profilePhoto,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),

    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async session({ session, user }): Promise<Session> {
      if (session.user) {
        (session.user as any).id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
        if (dbUser) {
          session.user.image = dbUser.profilePhoto;
        }
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = (user as any).id;
      }
      if (account && (account.provider === "google" || account.provider === "azure-ad")) {
        // Update user with OAuth provider info
        await prisma.user.update({
          where: { id: user.id },
          data: {
            emailVerified: true,
            authProvider: account.provider,
            ...(account.provider === "google" && { googleId: account.providerAccountId }),
            ...(account.provider === "azure-ad" && { microsoftId: account.providerAccountId }),
          },
        });
      }
      return token;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  secret: process.env.NEXTAUTH_SECRET,
};

async function sendVerificationEmail(email: string, token: string) {
  // Import nodemailer dynamically to avoid issues
  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.default.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "mcsurendar2explore@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER || "mcsurendar2explore@gmail.com",
    to: email,
    subject: "Verify your Squants email address",
    html: `
      <h2>Welcome to Squants!</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationUrl}" style="background-color: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Verify Email
      </a>
      <p>Or copy this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create this account, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email:", error);
    // In development, we'll just log it
  }
}

import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { UserModel } from "@/lib/Model/user";
import { DBConnect } from "../../dbconnect";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

async function login(credentials) {
  try {
    DBConnect();
    const { email, password } = credentials;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    } else {
      const isValidPassword = await bcryptjs.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid credentials");
      }

      return user;
    }
  } catch (e) {
    throw new Error("Something went wrong.");
  }
}

export const authOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        try {
          const user = await login(credentials);
          return user;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.email;
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.userId = token.userId;
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
    async csrf({ token, request }) {
      // Ignore CSRF token for logout route
      if (request.url.endsWith("/api/auth/logout")) {
        return false;
      }

      return NextAuth.csrf()(token, request);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

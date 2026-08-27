import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Connexion",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Mot de passe",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        // ADMIN
        if (
          email === process.env.ADMIN_EMAIL?.toLowerCase() &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "admin",
            name: "Administrateur",
            email: process.env.ADMIN_EMAIL,
            role: "ADMIN",
          };
        }

        // CLIENT
        if (
          email === process.env.CLIENT_EMAIL?.toLowerCase() &&
          password === process.env.CLIENT_PASSWORD
        ) {
          return {
            id: "client-1",
            name: "Client",
            email: process.env.CLIENT_EMAIL,
            role: "CLIENT",
          };
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

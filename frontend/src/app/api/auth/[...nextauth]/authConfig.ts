import {
  CLIENT_ID_GOOGLE, CLIENT_SECRET_GOOGLE, NEXT_SECRET,
} from '@/config/global';
import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';

export const authConfig: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: CLIENT_ID_GOOGLE,
      clientSecret: CLIENT_SECRET_GOOGLE,
    }),
  ],
  secret: NEXT_SECRET,
  callbacks: {
    async session({ session }) {
      if (!session.user) return session;

      if (!session.user.email || !session.user.name || !session.user.image) return session;

      const user = await prisma.user.upsert({
        where: {
          email: session.user.email,
        },
        create: {
          email: session.user.email,
          username: session.user.name,
          image: session.user.image,
        },
        update: {
        },
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
};

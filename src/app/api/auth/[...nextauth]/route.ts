import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

console.log("Auth route", process.env.GOOGLE_CLIENT_ID);
console.log("Auth route", process.env.GOOGLE_CLIENT_SECRET);
console.log("Auth route", process.env.AUTH_SECRET);

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

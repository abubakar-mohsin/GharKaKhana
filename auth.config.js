module.exports = {
  providers: [
    {
      id: "google",
      name: "Google",
      type: "oauth",
      version: "2.0",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        url: "https://accounts.google.com/o/oauth2/auth",
        params: {
          scope: "email profile",
        },
      },
      accessTokenUrl: "https://oauth2.googleapis.com/token",
      requestTokenUrl: "",
      profile: (profile) => {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/forbidden",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Assuming user role is set during sign-in
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
};
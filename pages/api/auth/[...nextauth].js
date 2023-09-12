import NextAuth from "next-auth";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const client = new ApolloClient({
  uri: "https://graphql.anilist.co",
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

// import clientPromise from "../../../lib/mongodb";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

export const authOptions = {
  // Configure one or more authentication providers
  // adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    {
      id: "AniListProvider",
      name: "AniList",
      type: "oauth",
      token: "https://anilist.co/api/v2/oauth/token",
      authorization: {
        url: "https://anilist.co/api/v2/oauth/authorize",
        params: { scope: "", response_type: "code" },
      },
      userinfo: {
        url: process.env.GRAPHQL_ENDPOINT,
        async request(context) {
          const { data } = await client.query({
            query: gql`
              query {
                Viewer {
                  id
                  name
                  avatar {
                    large
                    medium
                  }
                  bannerImage
                  mediaListOptions {
                    animeList {
                      customLists
                    }
                  }
                }
              }
            `,
            context: {
              headers: {
                Authorization: "Bearer " + context.tokens.access_token,
              },
            },
          });

          const userLists = data.Viewer.mediaListOptions.animeList.customLists;

          let custLists = userLists || [];

          if (!userLists?.includes("Watched using Moopa")) {
            custLists.push("Watched using Moopa");
            const fetchGraphQL = async (query, variables) => {
              const response = await fetch("https://graphql.anilist.co/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: context.tokens.access_token
                    ? `Bearer ${context.tokens.access_token}`
                    : undefined,
                },
                body: JSON.stringify({ query, variables }),
              });
              return response.json();
            };

            const customLists = async (lists) => {
              const setList = `
                  mutation($lists: [String]){
                    UpdateUser(animeListOptions: { customLists: $lists }){
                      id
                    }
                  }
                `;
              const data = await fetchGraphQL(setList, { lists });
              return data;
            };

            await customLists(custLists);
          }

          return {
            token: context.tokens.access_token,
            name: data.Viewer.name,
            sub: data.Viewer.id,
            image: data.Viewer.avatar,
            list: data.Viewer.mediaListOptions.animeList.customLists,
          };
        },
      },
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      profile(profile) {
        return {
          token: profile.token,
          id: profile.sub,
          name: profile?.name,
          image: profile.image,
          list: profile?.list,
          version: "1.0.1",
        };
      },
    },
  ],
  session: {
    //Sets the session to use JSON Web Token
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token;
      return session;
    },
  },
};

export default NextAuth(authOptions);

import SocialMediaService from "./src/app/services/socialMedia";

const socialMedia = new SocialMediaService({
  facebook: {
    accessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN!,
    pageId: process.env.FACEBOOK_PAGE_ID!,
  },
  twitter: {
    apiKey: process.env.TWITTER_API_KEY!,
    apiSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessTokenSecret: process.env.TWITTER_ACCESS_SECRET!,
  },
  instagram: {
    accessToken: process.env.INSTAGRAM_GRAPH_ACCESS_TOKEN!,
    instagramBusinessId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!,
  }
});

export default socialMedia;

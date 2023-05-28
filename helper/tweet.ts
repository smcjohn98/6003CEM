import TwitterApi from 'twitter-api-v2';
import { config } from '../config';

const twitterV2Client = new TwitterApi({
  appKey: config.twitterApiKey,
  appSecret: config.twitterApiSecret,
  accessToken: config.twitterAccessToken,
  accessSecret: config.twitterAccessTokenSecret,
});


const postTweet = async (imageName:string | null | undefined, petName:string) => {
  try {
    if(!imageName){
      const tweetResponse = await twitterV2Client.v2.tweet({ text: `New Pet ${petName} is available for adoption.`});
      console.log('Tweet posted succeed:', tweetResponse);
    }
    else{
      const response = await twitterV2Client.v1.uploadMedia(`./images/${imageName}`)
      console.log(response)
  
      const tweetResponse = await twitterV2Client.v2.tweet({ text: `New Pet ${petName} is available for adoption.`, media:{media_ids:[response]}});
      console.log('Tweet posted succeed:', tweetResponse);
    }
  } catch (error) {
    console.log('Failed to post tweet:', error);
  }
};

export { postTweet }
import { Event } from '../types/Event';
import { TwitterApi } from 'twitter-api-v2';

interface SocialMediaConfig {
    facebook?: {
        accessToken: string;
        pageId: string;
    };
    twitter?: {
        apiKey: string;
        apiSecret: string;
        accessToken: string;
        accessTokenSecret: string;
    };
    instagram?: {
        accessToken: string;
        instagramBusinessId: string;
    };
}

class SocialMediaService {
    private config: SocialMediaConfig;

    constructor(config: SocialMediaConfig) {
        this.config = config;
    }

    async publishToFacebook(event: Event): Promise<boolean> {
        if (!this.config.facebook) {
            throw new Error('Configuration Facebook manquante');
        }

        try {
            const response = await fetch(`https://graph.facebook.com/${this.config.facebook.pageId}/feed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `${event.title}\n\n${event.description}\n\n📅 ${event.date}\n📍 ${event.location}`,
                    access_token: this.config.facebook.accessToken,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error?.message || 'Erreur lors de la publication sur Facebook');
            }

            return true;
        } catch (error) {
            console.error('Erreur Facebook:', error);
            throw error;
        }
    }

    async publishToTwitter(event: Event): Promise<boolean> {
        if (!this.config.twitter) {
            throw new Error('Configuration Twitter manquante');
        }

        try {
            const twitterClient = new TwitterApi({
                appKey: this.config.twitter.apiKey,
                appSecret: this.config.twitter.apiSecret,
                accessToken: this.config.twitter.accessToken,
                accessSecret: this.config.twitter.accessTokenSecret,
            });

            const tweetText = `${event.title}\n\n${event.description}\n\n📅 ${event.date} 📍 ${event.location}`;
            const tweet = await twitterClient.v2.tweet(tweetText);

            console.log('Tweet publié :', tweet.data.id);
            return true;
        } catch (error) {
            console.error('Erreur Twitter:', error);
            throw error;
        }
    }

    async publishToInstagram(event: Event): Promise<boolean> {
        if (!this.config.instagram) {
            throw new Error('Configuration Instagram manquante');
        }

        try {
            // Étape 1 : Créer un conteneur de média (texte uniquement, pas d’image ici)
            const creationResponse = await fetch(`https://graph.facebook.com/v19.0/${this.config.instagram.instagramBusinessId}/media`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    caption: `${event.title}\n\n${event.description}\n\n📅 ${event.date} 📍 ${event.location}`,
                    access_token: this.config.instagram.accessToken,
                }),
            });

            const creationData = await creationResponse.json();

            if (!creationResponse.ok || !creationData.id) {
                throw new Error(creationData.error?.message || 'Erreur création conteneur Instagram');
            }

            // Étape 2 : Publier le conteneur
            const publishResponse = await fetch(`https://graph.facebook.com/v19.0/${this.config.instagram.instagramBusinessId}/media_publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    creation_id: creationData.id,
                    access_token: this.config.instagram.accessToken,
                }),
            });

            const publishData = await publishResponse.json();

            if (!publishResponse.ok || !publishData.id) {
                throw new Error(publishData.error?.message || 'Erreur publication Instagram');
            }

            console.log('Publication Instagram réussie :', publishData.id);
            return true;
        } catch (error) {
            console.error('Erreur Instagram:', error);
            throw error;
        }
    }

    async publishEvent(event: Event, platforms: string[]): Promise<boolean[]> {
        const publishPromises = platforms.map(platform => {
            switch (platform) {
                case 'facebook':
                    return this.publishToFacebook(event);
                case 'twitter':
                    return this.publishToTwitter(event);
                case 'instagram':
                    return this.publishToInstagram(event);
                default:
                    return Promise.reject(new Error(`Plateforme non supportée: ${platform}`));
            }
        });

        return Promise.all(publishPromises);
    }
}

export default SocialMediaService;

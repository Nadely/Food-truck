import { Event } from '../types/Event';

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
                    message: `${event.title}\n\n${event.description}\n\nDate: ${event.date}\nLieu: ${event.location}`,
                    access_token: this.config.facebook.accessToken,
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la publication sur Facebook');
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

        // Note: Cette implémentation nécessite l'API Twitter v2
        try {
            // Ici, vous devrez implémenter l'authentification OAuth 1.0a pour Twitter
            // et utiliser l'API Twitter v2 pour publier le tweet
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
            // Note: La publication sur Instagram nécessite l'API Instagram Graph
            // et un compte Business Instagram lié à une page Facebook
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

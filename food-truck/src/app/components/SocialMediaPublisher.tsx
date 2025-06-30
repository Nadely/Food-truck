'use client';

import { useState } from 'react';
import { Event } from '../types/Event';

interface SocialMediaPublisherProps {
    event: Event;
    onPublish: (platforms: string[]) => Promise<void>;
}

export default function SocialMediaPublisher({ event, onPublish }: SocialMediaPublisherProps) {
    const [isPublishing, setIsPublishing] = useState(false);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

    const handlePlatformToggle = (platform: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    };

    const handlePublish = async () => {
        if (selectedPlatforms.length === 0) {
            alert('Veuillez sélectionner au moins une plateforme');
            return;
        }

        setIsPublishing(true);
        try {
            await onPublish(selectedPlatforms);
            alert('Événement publié avec succès !');
        } catch (error) {
            alert('Erreur lors de la publication : ' + error.message);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Publier sur les réseaux sociaux</h3>

            <div className="space-y-2 mb-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={selectedPlatforms.includes('facebook')}
                        onChange={() => handlePlatformToggle('facebook')}
                        className="rounded"
                    />
                    <span>Facebook</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={selectedPlatforms.includes('twitter')}
                        onChange={() => handlePlatformToggle('twitter')}
                        className="rounded"
                    />
                    <span>Twitter</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={selectedPlatforms.includes('instagram')}
                        onChange={() => handlePlatformToggle('instagram')}
                        className="rounded"
                    />
                    <span>Instagram</span>
                </label>
            </div>

            <button
                onClick={handlePublish}
                disabled={isPublishing || selectedPlatforms.length === 0}
                className={`w-full py-2 px-4 rounded ${
                    isPublishing || selectedPlatforms.length === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
                {isPublishing ? 'Publication en cours...' : 'Publier'}
            </button>
        </div>
    );
}

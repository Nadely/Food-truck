"use client";

import { useState } from 'react';

type EventType = 'fermeture' | 'rupture' | 'vacances' | 'soiree';

const eventTypes = {
    fermeture: {
        label: 'Fermeture Exceptionnelle',
        defaultMessage: 'Nous sommes exceptionnellement fermes',
        icon: '🚫'
    },
    rupture: {
        label: 'Rupture de Stock',
        defaultMessage: 'Certains produits sont temporairement indisponibles',
        icon: '📦'
    },
    vacances: {
        label: 'En Vacances',
        defaultMessage: 'Nous sommes en vacances',
        icon: '🌴'
    },
    soiree: {
        label: 'Soiree Privee',
        defaultMessage: 'Le restaurant est reserve pour une soiree privee',
        icon: '🎉'
    }
};

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
};

const Evenements = () => {
    const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventData, setEventData] = useState({
        type: '' as EventType,
        title: '',
        description: '',
        date: '',
        endDate: '',
        networks: {
            facebook: false,
            instagram: false,
            twitter: false
        }
    });

    const handleEventSelect = (type: EventType) => {
        setSelectedEvent(type);
        setEventData(prev => ({
            ...prev,
            type,
            title: eventTypes[type].label,
            description: eventTypes[type].defaultMessage
        }));
        setIsModalOpen(true);
    };

    const handleNetworkToggle = (network: 'facebook' | 'instagram' | 'twitter') => {
        setEventData(prev => ({
            ...prev,
            networks: {
                ...prev.networks,
                [network]: !prev.networks[network]
            }
        }));
    };

    const handlePublish = async () => {
        // TODO: Implémenter la logique de publication sur les réseaux sociaux
        console.log('Publication de l\'événement:', eventData);
        setIsModalOpen(false);
        // Réinitialiser les données après la publication
        setEventData({
            type: '' as EventType,
            title: '',
            description: '',
            date: '',
            endDate: '',
            networks: {
                facebook: false,
                instagram: false,
                twitter: false
            }
        });
        setSelectedEvent(null);
    };

    return (
        <div className="text-white style-pen p-6">
            <h1 className="text-3xl font-bold mb-8 text-center">Publier un Evenement</h1>

            <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
                {Object.entries(eventTypes).map(([type, { label, icon }]) => (
                    <button
                        key={type}
                        onClick={() => handleEventSelect(type as EventType)}
                        className={`
                            p-6 rounded-lg text-center transition-all h-60 w-60
                            ${selectedEvent === type ? 'bg-green-600 border-2 border-green-300' : 'border-2 border-white hover:bg-green-500 hover:border-2 hover:border-green-300'}
                        `}
                    >
                        <div className="text-4xl mb-2 w-30 h-30">{icon}</div>
                        <div className="font-semibold">{label}</div>
                    </button>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Configurer la publication</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2">Titre</label>
                        <input
                            type="text"
                            value={eventData.title}
                            onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Description</label>
                        <textarea
                            value={eventData.description}
                            onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full p-2 rounded bg-gray-700 text-white h-24"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Date de debut</label>
                            <input
                                type="datetime-local"
                                value={eventData.date}
                                onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
                                className="w-full p-2 rounded bg-gray-700 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Date de fin</label>
                            <input
                                type="datetime-local"
                                value={eventData.endDate}
                                onChange={(e) => setEventData(prev => ({ ...prev, endDate: e.target.value }))}
                                className="w-full p-2 rounded bg-gray-700 text-white"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2">Publier sur</label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => handleNetworkToggle('facebook')}
                                className={`flex-1 px-3 py-2 rounded ${
                                    eventData.networks.facebook
                                    ? 'bg-blue-600'
                                    : 'bg-gray-700'
                                }`}
                            >
                                Facebook
                            </button>
                            <button
                                type="button"
                                onClick={() => handleNetworkToggle('instagram')}
                                className={`flex-1 px-3 py-2 rounded ${
                                    eventData.networks.instagram
                                    ? 'bg-pink-600'
                                    : 'bg-gray-700'
                                }`}
                            >
                                Instagram
                            </button>
                            <button
                                type="button"
                                onClick={() => handleNetworkToggle('twitter')}
                                className={`flex-1 px-3 py-2 rounded ${
                                    eventData.networks.twitter
                                    ? 'bg-blue-400'
                                    : 'bg-gray-700'
                                }`}
                            >
                                Twitter
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handlePublish}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6"
                    >
                        Publier
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Evenements;

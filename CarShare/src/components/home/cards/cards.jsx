import React, { useEffect, useState } from 'react';
import './cards.css';
import { Link } from "react-router-dom";
import { Like } from "../../../services/like.jsx";
import { DeleteLike } from "../../../services/deletelike.jsx";

export function Cards({ cards = [] }) {
    const [currentImageIndexes, setCurrentImageIndexes] = useState({});
    const [likedCards, setLikedCards] = useState({});


    useEffect(() => {
        const fetchLikes = async () => {
            const sessionCookie = document.cookie;
            const token = sessionCookie.split('=')[1];

            try {
                const sendlike = await Like({ token });
                const initialLikes = {};


                cards.forEach((card) => {
                    initialLikes[card.id] = Array.isArray(sendlike) && sendlike.includes(card.id);
                });


                setLikedCards(initialLikes);
            } catch (error) {
                console.error("Error al obtener los 'likes':", error);
            }
        };

        if (cards.length > 0) {
            fetchLikes();
        }
    }, [cards]);

    const toggleLike = async (cardId) => {
        const sessionCookie = document.cookie;
        const token = sessionCookie.split('=')[1];

        const isCurrentlyLiked = likedCards[cardId];

        try {
            const response = isCurrentlyLiked
                ? await DeleteLike({ id: cardId, token })
                : await Like({ id: cardId, token });

            if (response.status === 'success') {

                setLikedCards((prevLikes) => ({
                    ...prevLikes,
                    [cardId]: !isCurrentlyLiked
                }));
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error("Error al alternar el 'like':", error);
        }
    };

    const nextImage = (index) => {
        setCurrentImageIndexes((prevIndexes) => {
            const totalImages = cards[index]?.images.length || 0;
            if (totalImages === 0) return prevIndexes;
            return {
                ...prevIndexes,
                [index]: (prevIndexes[index] + 1) % totalImages
            };
        });
    };

    const prevImage = (index) => {
        setCurrentImageIndexes((prevIndexes) => {
            const totalImages = cards[index]?.images.length || 0;
            if (totalImages === 0) return prevIndexes;
            return {
                ...prevIndexes,
                [index]: (prevIndexes[index] - 1 + totalImages) % totalImages
            };
        });
    };

    return (
        <div className="cards">
            {cards.length === 0 ? (
                <div>No hay coches disponibles</div>
            ) : (
                cards.map((card, index) => {
                    const totalImages = card.images.length;
                    const currentImageIndex = currentImageIndexes[index] !== undefined ? currentImageIndexes[index] : 0;
                    const isLiked = likedCards[card.id]; // Obtén el estado de "like" para la tarjeta actual

                    const priceDisplay = card.listing_type === 'alquiler'
                        ? `${(card.price / 1).toFixed(2)}€ /día`
                        : `${card.price}€`;

                    return (
                        <div className="card" key={card.id}>
                            <Link to={`/details?id=${card.id}&places=${card.places}&listing_type=${card.listing_type}&image=${card.images}&description=${card.description}&doors=${card.doors}&state=${card.state}&price=${card.price}&make_name=${card.make_name}&model_name=${card.model_name}&year=${card.year}&fuel_type=${card.fuel_type}&transmission=${card.transmission}&cv=${card.cv}&mileage=${card.mileage}&user=${card.user_id}&user_name=${card.user_name}&user_image=${card.user_image}`}
                                  className="card-link">
                                <div className="carousel">
                                    {totalImages > 0 && (
                                        <img
                                            className="car-image"
                                            src={card.images[currentImageIndex]}
                                            alt={`${card.make_name} ${card.model_name}`}
                                        />
                                    )}
                                    {totalImages > 1 && (
                                        <>

                                        </>
                                    )}
                                </div>
                                <div className="card-content">
                                    <div className="title-like-container">
                                        <h3 className="car-title">{`${card.make_name} ${card.model_name} ${card.year}`}</h3>
                                        <button
                                            className={`like-button ${isLiked ? 'liked' : ''}`}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                toggleLike(card.id);
                                            }}
                                        >
                                            <ion-icon name={isLiked ? "heart" : "heart-empty"}></ion-icon>
                                        </button>
                                    </div>
                                    <h2 className="price">{priceDisplay}</h2>
                                    <p className="car-details">{`${card.fuel_type} · ${card.transmission} · ${card.cv} cv · ${card.year} · ${card.mileage} km`}</p>
                                </div>
                            </Link>
                        </div>
                    );
                })
            )}
        </div>
    );
}

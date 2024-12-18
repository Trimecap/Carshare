import React, { useEffect, useState } from 'react';
import './like.css';
import { Link } from "react-router-dom";
import { Like } from "../../services/like.jsx";
import { DeleteLike } from "../../services/deletelike.jsx";

export function Likepage() {
    const [currentImageIndexes, setCurrentImageIndexes] = useState({});
    const [likedCards, setLikedCards] = useState({});
    const [cars, setCars] = useState([]);

    useEffect(() => {
        const sessionCookie = document.cookie;
        const token = sessionCookie.split('=')[1];
        const fetchCars = async () => {
            const response = await fetch('http://152.228.163.56/proyecto/BackEnd/ApiRest/CarsListingLike.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });
            const data = await response.json();

            const processedCars = data.map(car => {
                const imagesArray = Array.isArray(car.images) ? car.images : JSON.parse(car.images);
                return { ...car, images: imagesArray };
            });
            console.log(processedCars);
            setCars(processedCars);
        };

        fetchCars();
    }, []);

    useEffect(() => {
        const fetchLikes = async () => {
            const sessionCookie = document.cookie;
            const token = sessionCookie.split('=')[1];

            try {
                const sendlike = await Like({ token });
                const initialLikes = {};

                cars.forEach((car) => {
                    initialLikes[car.id] = Array.isArray(sendlike) && sendlike.includes(car.id);
                });

                setLikedCards(initialLikes);
            } catch (error) {
                console.error("Error al obtener los 'likes':", error);
            }
        };

        if (cars.length > 0) {
            fetchLikes();
        }
    }, [cars]);

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
            const totalImages = cars[index]?.images.length || 0;
            if (totalImages === 0) return prevIndexes;
            return {
                ...prevIndexes,
                [index]: (prevIndexes[index] + 1) % totalImages
            };
        });
    };

    const prevImage = (index) => {
        setCurrentImageIndexes((prevIndexes) => {
            const totalImages = cars[index]?.images.length || 0;
            if (totalImages === 0) return prevIndexes;
            return {
                ...prevIndexes,
                [index]: (prevIndexes[index] - 1 + totalImages) % totalImages
            };
        });
    };

    return (
        <div className="cards">
            {cars.length === 0 ? (
                <div>No hay coches disponibles</div>
            ) : (
                cars.map((car, index) => {
                    const totalImages = car.images.length;
                    const currentImageIndex = currentImageIndexes[index] !== undefined ? currentImageIndexes[index] : 0;
                    const isLiked = likedCards[car.id];

                    const priceDisplay = car.listing_type === 'alquiler'
                        ? `${(car.price / 1).toFixed(2)}€ /día`
                        : `${car.price}€`;

                    return (
                        <div className="card" key={car.id}>
                            <Link to={`/details?id=${car.id}&places=${car.places}&image=${car.images}&description=${car.description}&doors=${car.doors}&state=${car.state}&price=${car.price}&make_name=${car.make_name}&model_name=${car.model_name}&year=${car.year}&fuel_type=${car.fuel_type}&transmission=${car.transmission}&cv=${car.cv}&mileage=${car.mileage}&user=${car.user_id}&user_name=${car.user_name}&user_image=${car.user_image}`}
                                  className="card-link">
                                <div className="carousel">
                                    {totalImages > 0 && (
                                        <img
                                            className="car-image"
                                            src={car.images[currentImageIndex]}
                                            alt={`${car.make_name} ${car.model_name}`}
                                        />
                                    )}
                                    {totalImages > 1 && (
                                        <>
                                            <button
                                                className="carousel-button prev-button"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    prevImage(index);
                                                }}
                                            >
                                                &lt;
                                            </button>
                                            <button
                                                className="carousel-button next-button"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    nextImage(index);
                                                }}
                                            >
                                                &gt;
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="card-content">
                                    <div className="title-like-container">
                                        <h3 className="car-title">{`${car.make_name} ${car.model_name} ${car.year}`}</h3>
                                        <button
                                            className={`like-button ${isLiked ? 'liked' : ''}`}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                toggleLike(car.id);
                                            }}
                                        >
                                            <ion-icon name={isLiked ? "heart" : "heart-empty"}></ion-icon>
                                        </button>
                                    </div>
                                    <h2 className="price">{priceDisplay}</h2>
                                    <p className="car-details">{`${car.fuel_type} · ${car.transmission} · ${car.cv} cv · ${car.year} · ${car.mileage} km`}</p>
                                </div>
                            </Link>
                        </div>
                    );
                })
            )}
        </div>
    );
}

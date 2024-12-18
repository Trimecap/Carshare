import { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import './carddetails.css';
import { Like } from "../../services/like.jsx";
import {DeleteLike} from "../../services/deletelike.jsx";
import { Link } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';

export function CarDetail() {
    const [searchParams] = useSearchParams();
    const params = Object.fromEntries([...searchParams]);

    const [isLiked, setIsLiked] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [reservedDates, setReservedDates] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [isValidRange, setIsValidRange] = useState(false);
    const [Profileimage, setProfileimage] = useState(null);

    const images = params.image.split(',');

    useEffect(() => {
        fetch(`http://152.228.163.56/proyecto/BackEnd/ApiRest/bookings.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: params.id }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta de la API:', data);
                setReservedDates(data);
            })
            .catch(error => console.error('Error fetching reserved dates:', error));
    }, [params.id]);

    useEffect(() => {
        fetch(`http://152.228.163.56/proyecto/BackEnd/ApiRest/PerfilAnuncio.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: params.id }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta de la API:', data.profile_image);
                setProfileimage(data.profile_image);

            })
            .catch(error => console.error('Error fetching reserved dates:', error));
    }, [params.id]);

    const isDateDisabled = (date) => {

        const dateToCheck = new Date(date).setHours(0, 0, 0, 0);


        return reservedDates.some(({ start_date, end_date }) => {
            const startDate = new Date(start_date).setHours(0, 0, 0, 0);
            const endDate = new Date(end_date).setHours(0, 0, 0, 0);


            return dateToCheck >= startDate && dateToCheck <= endDate;
        });
    };


    const validateRange = (range) => {
        if (!range || range.length !== 2) return false;
        const [start, end] = range;


        return reservedDates.some(({ start_date, end_date }) => {
            const reservedStart = new Date(start_date);
            const reservedEnd = new Date(end_date);


            return (
                (start >= reservedStart && start <= reservedEnd) ||
                (end >= reservedStart && end <= reservedEnd) ||
                (start <= reservedStart && end >= reservedEnd)
            );
        });
    };

    const handleDateChange = (range) => {
        if (validateRange(range)) {
            alert('El rango seleccionado interfiere con una reserva existente.');
            setDateRange(null);
            setIsValidRange(false);
        } else {
            setDateRange(range);
            setIsValidRange(true);
        }
    };

    const handleReserve = () => {
        const sessionCookie = document.cookie;
        const token = sessionCookie.split('=')[1];

        if (dateRange && isValidRange) {
            const [startDate, endDate] = dateRange;

            // Convertir las fechas a YYYY-MM-DD sin afectar la zona horaria
            const formatDate = (date) => {
                return date.toLocaleDateString('en-CA');
            };

            fetch(`http://152.228.163.56/proyecto/BackEnd/ApiRest/insertBookings.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: params.id,
                    start_date: formatDate(startDate),
                    end_date: formatDate(endDate),
                    token: token,
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    alert('Reserva realizada con éxito.');
                    setDateRange(null);
                    setIsValidRange(false);
                })
                .catch(error => console.error('Error al realizar la reserva:', error));
        } else {
            alert('Selecciona un rango válido antes de reservar.');
        }
    };

    const toggleLike = async () => {

        const currentLikedState = isLiked;
        const sessionCookie = document.cookie;
        const token = sessionCookie.split('=')[1];

        console.log(`Sending request with ID: ${params.id}, Token: ${token}`);

        try {
            const sendlike = currentLikedState
                ? await DeleteLike({ id: params.id, token })
                : await Like({ id: params.id, token });

            console.log(sendlike);


            if (sendlike.status === 'success') {
                setIsLiked(!currentLikedState);
            } else {
                console.error(sendlike.message);
            }
        } catch (error) {
            console.error("Error al enviar 'like' o 'delete':", error);

            setIsLiked(currentLikedState);
        }
    };

    useEffect(() => {
        const fetchLikes = async () => {
            const sessionCookie = document.cookie;
            const token = sessionCookie.split('=')[1];

            try {
                const sendlike = await Like({ token });
                if (Array.isArray(sendlike) && sendlike.includes(params.id)) {
                    setIsLiked(true);
                }
            } catch (error) {
                console.error("Error al obtener los 'likes':", error);
            }
        };
        fetchLikes();
    }, [params.id]);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };
    const navigate = useNavigate();
    const handleClickConversation = async () => {


        const userId = params.user;  // Valor de params.user
        const sessionCookie = document.cookie;
        const token = sessionCookie.split('=')[1];
        const adId = params.id;


        const url = 'http://152.228.163.56/proyecto/BackEnd/ApiRest/CreateConversation.php';


        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, token, adId }),
            });


            if (response.ok) {
                const data = await response.json();
                console.log('Respuesta del servidor:', data);
                navigate(`/chat?conversationId=${data}`);
            } else {
                console.error('Error en la solicitud', response.status);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
        }
    };

    return (
        <div className="card-container">
            <div className="profile-section">
                <div className="profile-info">
                    <img
                        src={Profileimage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'}
                        alt="Imagen de perfil"
                        style={{width: '50px', height: '50px', borderRadius: '50%'}}
                    />
                    <span className="profile-name">{params.user_name}</span>
                </div>
                <div className="actions">
                    <button
                        className={`action-button ${isLiked ? 'liked' : ''}`}
                        aria-label="Likepage"
                        onClick={toggleLike}
                    >
                        <ion-icon name={isLiked ? "heart" : "heart-empty"}></ion-icon>
                    </button>
                    <button  onClick={handleClickConversation} className="action-button" aria-label="chat">
                            <ion-icon name="chatbubbles"></ion-icon>
                        </button>
                </div>
            </div>
            <div className="image-container">
                <img
                    src={images[currentImageIndex]} // Mostrar la imagen actual
                    alt={`${params.make_name} ${params.model_name} ${params.year}`}
                    className="image"
                />
                <button className="carousel-button2 prev-button2" onClick={prevImage}>&lt;</button>
                <button className="carousel-button2 next-button2" onClick={nextImage}>&gt;</button>
            </div>
            <div className="info-container">
                <h2 className="title">{params.price} €</h2>
                <h3 className="subtitle">{`${params.make_name} ${params.model_name} ${params.year}`}</h3>
                <div className="details">
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#29363d"
                             viewBox="0 0 24 24" part="inner-svg">
                            <g clip-path="url(#a)">
                                <path
                                    d="M12 9c-.89 0-1.48.388-1.834.624a.75.75 0 1 1-.832-1.248l.007-.005c.4-.267 1.307-.871 2.659-.871 1.352 0 2.259.604 2.659.871l.007.005a.75.75 0 1 1-.832 1.248C13.48 9.388 12.889 9 12 9Z"></path>
                                <path fill-rule="evenodd"
                                      d="M6.885 4.762a2.235 2.235 0 0 1-.209-1.382l.146-.873A3 3 0 0 1 9.78 0h4.438a3 3 0 0 1 2.96 2.507l.145.873c.082.494-.003.972-.21 1.382a3.75 3.75 0 0 1 2.229 2.458l.193.677c.456-1.227.714-2.603.714-4.147a.75.75 0 0 1 1.5 0c0 2.484-.6 4.585-1.583 6.355l.45 1.578c.27.942.27 1.942 0 2.884l-.24.845.05-.036c1.487-1.082 3.573-.02 3.573 1.82v2.7c0 .35-.081.694-.238 1.006l-.927 1.854A2.25 2.25 0 0 1 20.823 24H3.177a2.25 2.25 0 0 1-2.012-1.244l-.927-1.854A2.25 2.25 0 0 1 0 19.896v-2.7c0-1.84 2.086-2.902 3.573-1.82l.05.037-.24-.846a5.25 5.25 0 0 1 0-2.884L4.656 7.22a3.75 3.75 0 0 1 2.228-2.458Zm1.416-2.009A1.5 1.5 0 0 1 9.781 1.5h4.438a1.5 1.5 0 0 1 1.48 1.253l.145.874a.75.75 0 0 1-.74.873H8.896a.75.75 0 0 1-.74-.873l.145-.874Zm10.247 7.144L17.9 7.632A2.25 2.25 0 0 0 15.737 6H8.263a2.25 2.25 0 0 0-2.164 1.632l-1.275 4.463a3.75 3.75 0 0 0 0 2.06l.397 1.389a.75.75 0 0 1 .007.024L5.586 17l.042.078.048.097c2.537-.423 6.056-1.43 9-3.407 1.519-1.02 2.877-2.29 3.872-3.871Zm-5.69 6.614c.904-.428 1.8-.924 2.654-1.498 1.323-.888 2.553-1.966 3.565-3.264l.099.346a3.751 3.751 0 0 1 0 2.06l-.397 1.389-.005.017-.002.007L18.414 17a1.583 1.583 0 0 0-.042.078l-.083.167c-.192-.055-.395-.11-.61-.161-1.193-.29-2.786-.522-4.82-.573Zm-8.572 1.238.012.025a3.537 3.537 0 0 0-.642.39.75.75 0 0 0 .937 1.172c.186-.148.828-.491 2.08-.795C7.898 18.245 9.651 18 12 18c2.349 0 4.102.245 5.327.541 1.252.304 1.894.646 2.08.795a.75.75 0 1 0 .936-1.172 3.532 3.532 0 0 0-.641-.39l.012-.025 1.595-1.16a.75.75 0 0 1 1.191.607v2.7a.75.75 0 0 1-.08.335l-.926 1.854a.75.75 0 0 1-.671.415H3.177a.75.75 0 0 1-.67-.415l-.928-1.854a.75.75 0 0 1-.079-.335v-2.7a.75.75 0 0 1 1.191-.607l1.595 1.16Z"
                                      clip-rule="evenodd"></path>
                            </g>
                            <defs>
                                <clipPath id="a">
                                    <path d="M0 0h24v24H0z"></path>
                                </clipPath>
                            </defs>
                        </svg>
                        {params.places} plazas
                    </p>
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#29363d"
                             viewBox="0 0 24 24" part="inner-svg">
                            <path
                                d="M6.75 9.75A.75.75 0 0 1 7.5 9H15a.75.75 0 0 1 0 1.5H7.5a.75.75 0 0 1-.75-.75Zm.75 9a.75.75 0 0 0 0 1.5H15a.75.75 0 0 0 0-1.5H7.5Z"></path>
                            <path fill-rule="evenodd"
                                  d="M3.75 3a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v4.19l2.78 2.78a.75.75 0 1 1-1.06 1.06l-1.72-1.72v5.38l2.78 2.78a.75.75 0 1 1-1.06 1.06l-1.72-1.72V21a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-4.19l-1.72 1.72a.75.75 0 0 1-1.06-1.06l2.78-2.78V9.31l-1.72 1.72A.75.75 0 1 1 .97 9.97l2.78-2.78V3Zm13.5 0a1.5 1.5 0 0 0-1.5-1.5v.75a.75.75 0 0 1-1.5 0V1.5h-6v.75a.75.75 0 0 1-1.5 0V1.5A1.5 1.5 0 0 0 5.25 3v18a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5V3Z"
                                  clip-rule="evenodd"></path>
                        </svg>
                        {params.doors} puertas
                    </p>
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#29363d"
                             viewBox="0 0 24 24" part="inner-svg">
                            <g clip-path="url(#a)">
                                <path
                                    d="M9.75 4.5c0 .414-.84.75-1.875.75C6.839 5.25 6 4.914 6 4.5s.84-.75 1.875-.75c1.036 0 1.875.336 1.875.75Z"></path>
                                <path fill-rule="evenodd"
                                      d="M12.624 10.834a.75.75 0 0 0-1.248 0l-2.017 3.025a3.174 3.174 0 1 0 5.282 0l-2.017-3.025Zm-2.017 3.857L12 12.602l1.393 2.09a1.674 1.674 0 1 1-2.786 0Z"
                                      clip-rule="evenodd"></path>
                                <path fill-rule="evenodd"
                                      d="M1.905 2.71C1.308 3.115.75 3.706.75 4.5v15c0 .795.558 1.386 1.155 1.79.624.42 1.477.77 2.464 1.053 1.985.566 4.682.907 7.631.907s5.646-.34 7.63-.907c.988-.282 1.84-.632 2.465-1.054.597-.403 1.155-.994 1.155-1.789v-15c0-.795-.558-1.386-1.155-1.79-.624-.42-1.477-.77-2.464-1.052C17.646 1.09 14.949.75 12 .75s-5.646.34-7.63.908c-.988.282-1.84.631-2.465 1.053Zm.84 1.244c-.465.314-.495.512-.495.546 0 .034.03.232.495.546.439.297 1.123.593 2.036.854 1.816.519 4.369.85 7.219.85 2.85 0 5.403-.331 7.219-.85.913-.26 1.597-.557 2.036-.854.465-.314.495-.512.495-.546 0-.034-.03-.232-.495-.546-.439-.297-1.123-.593-2.036-.854-1.816-.519-4.369-.85-7.219-.85-2.85 0-5.403.331-7.219.85-.913.26-1.597.557-2.036.854ZM21.75 19.5v-3.248c-.731.414-1.705.757-2.825 1.025a.75.75 0 1 1-.35-1.458c1.11-.267 1.965-.589 2.524-.924.603-.361.651-.604.651-.645v-3.248c-.731.414-1.705.757-2.825 1.025a.75.75 0 1 1-.35-1.458c1.11-.267 1.965-.589 2.524-.924.603-.361.651-.604.651-.645V6.502c-.579.328-1.303.607-2.12.84-1.984.567-4.681.908-7.63.908s-5.646-.34-7.63-.908c-.817-.233-1.541-.512-2.12-.84V9c0 .041.048.284.651.645.559.335 1.414.657 2.524.924a.75.75 0 1 1-.35 1.458c-1.12-.268-2.094-.61-2.825-1.025v3.248c0 .041.048.284.651.645.559.335 1.414.657 2.524.924a.75.75 0 1 1-.35 1.458c-1.12-.268-2.094-.61-2.825-1.025V19.5c0 .034.03.232.495.546.439.297 1.123.593 2.036.854 1.816.519 4.369.85 7.219.85 2.85 0 5.403-.331 7.219-.85.913-.26 1.597-.557 2.036-.854.465-.314.495-.512.495-.546Z"
                                      clip-rule="evenodd"></path>
                            </g>
                            <defs>
                                <clipPath id="a">
                                    <path d="M0 0h24v24H0z"></path>
                                </clipPath>
                            </defs>
                        </svg>
                        {params.fuel_type}
                    </p>
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#29363d"
                             viewBox="0 0 24 24" part="inner-svg">
                            <g clip-path="url(#a)">
                                <path d="M14.775 9.968a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"></path>
                                <path fill-rule="evenodd"
                                      d="M5.25 16.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-.75 2.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z"
                                      clip-rule="evenodd"></path>
                                <path fill-rule="evenodd"
                                      d="M13.353 1.229 9.618 4.963a2.11 2.11 0 0 0 0 2.983l1.627 1.628-3.929 3.929a.751.751 0 0 1-.75.187l-.016-.005-.016-.004A5.25 5.25 0 0 0 .847 15.87l-.004.006a5.25 5.25 0 0 0-.002 5.703 5.25 5.25 0 0 0 9.51-4.131l-.004-.019-.006-.018a.75.75 0 0 1 .183-.749l3.904-3.904 1.624 1.625a2.11 2.11 0 0 0 2.983 0l4.347-4.345a2.11 2.11 0 0 0 0-2.983L16.948.618a2.11 2.11 0 0 0-2.983 0l-.59.589-.01.01-.012.012Zm1.672.45a.61.61 0 0 1 .862 0l6.435 6.436a.61.61 0 0 1 0 .861l-.073.073-7.294-7.3.07-.07Zm-1.13 1.13 7.293 7.3-.505.506-7.294-7.3.505-.506Zm4.08 10.513 1.647-1.647-7.294-7.3-1.65 1.649a.61.61 0 0 0 0 .861l6.435 6.437a.61.61 0 0 0 .862 0Zm-9.597 1.24a2.25 2.25 0 0 1-2.232.568A3.75 3.75 0 0 0 2.1 16.693a3.75 3.75 0 0 0 .002 4.072l.002.003a3.75 3.75 0 0 0 6.798-2.934 2.25 2.25 0 0 1 .558-2.23l.002-.002 3.197-3.197-1.062-1.062-3.219 3.22Z"
                                      clip-rule="evenodd"></path>
                            </g>
                            <defs>
                                <clipPath id="a">
                                    <path d="M0 0h24v24H0z"></path>
                                </clipPath>
                            </defs>
                        </svg>
                        {params.cv} cv
                    </p>
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#29363d"
                             viewBox="0 0 24 24" part="inner-svg">
                            <g clip-path="url(#a)">
                                <path
                                    d="M6.75 9a.75.75 0 0 1 .75.75v1.5h3.75v-1.5a.75.75 0 0 1 1.5 0v1.5h3a.75.75 0 0 0 .75-.75v-.75a.75.75 0 0 1 1.5 0v.75a2.25 2.25 0 0 1-2.25 2.25h-3v1.5a.75.75 0 0 1-1.5 0v-1.5H7.5v1.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 6.75 9Zm6-3a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0V6ZM12 16.5a.75.75 0 0 1 .75.75V18a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75ZM7.5 6A.75.75 0 0 0 6 6v.75a.75.75 0 0 0 1.5 0V6Zm9.75-.75A.75.75 0 0 1 18 6v.75a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm-9.75 12a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75Z"></path>
                                <path fill-rule="evenodd"
                                      d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm0 1.5a10.5 10.5 0 1 1 0 21 10.5 10.5 0 0 1 0-21Z"
                                      clip-rule="evenodd"></path>
                            </g>
                            <defs>
                                <clipPath id="a">
                                    <path d="M0 0h24v24H0z"></path>
                                </clipPath>
                            </defs>
                        </svg>
                        {params.transmission}
                    </p>
                </div>
                <div className="details">
                    {params.description}
                </div>
                {/* Renderizar el calendario solo si es de alquiler */}
                {params.listing_type === 'alquiler' && (
                    <div className="rental-calendar">
                        <h3>Selecciona una fecha para reservar</h3>
                        <Calendar
                            selectRange={true}
                            onChange={handleDateChange}
                            value={dateRange}
                            tileDisabled={({ date, view }) =>
                                view === "month" && isDateDisabled(date)
                            }
                        />
                        {isValidRange && (
                            <button onClick={handleReserve} className="reserve-button">
                                Reservar
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

import React, {useEffect, useState} from 'react';
import './Profile.css';

export function Profile ()  {
    const [activeTab, setActiveTab] = useState('anuncios');
    const [profilePhoto, setProfilePhoto] = useState('https://via.placeholder.com/150');
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState({});
    const [publications, setPublications] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [reservas, setReservas] = useState([]);
    useEffect(() => {
        const sessionCookie = document.cookie;
        const token = sessionCookie.split('=')[1];

        const fetchUser = async () => {
            try {
                const response = await fetch('http://152.228.163.56/proyecto/BackEnd/ApiRest/User.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log(data);
                setUser(data.user)
                setPublications(data.listings)
                setBookings(data.bookings)
                setProfilePhoto(data.user.profile_image);
                setReservas(data.reservas)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUser();
    }, []);





    const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 1048576) {
                setErrorMessage('La imagen no debe superar 1 MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64Image = e.target.result;
                setProfilePhoto(base64Image);
                setErrorMessage('');
                console.log(base64Image);

                try {
                    const sessionCookie = document.cookie;
                    const token = sessionCookie.split('=')[1];
                    const response = await fetch('http://152.228.163.56/proyecto/BackEnd/ApiRest/ImageUser.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            image: base64Image,
                            token: token
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Error al subir la imagen');
                    }

                    const result = await response.json();
                    console.log('Respuesta del backend:', result);
                } catch (error) {
                    console.error('Error al enviar la imagen:', error);
                    setErrorMessage('Hubo un error al subir la imagen. Inténtalo de nuevo.');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteLisiting = async (carListingId) => {
        try {
            const response = await fetch(`http://152.228.163.56/proyecto/BackEnd/ApiRest/DeletePublication.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ carListingId })
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el anuncio');
            }


            setPublications(publications.filter(publication => publication.car_listing_id !== carListingId));
        } catch (error) {
            console.error('Error eliminando el anuncio:', error);
        }
    };

    const handleDeleteBooking = async (BookingId) => {
        try {
            const response = await fetch(`http://152.228.163.56/proyecto/BackEnd/ApiRest/DeleteBooking.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ BookingId })
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el anuncio');
            }

            setBookings(bookings.filter(booking => booking.id !== BookingId));
        } catch (error) {
            console.error('Error eliminando el anuncio:', error);
        }
    };

    const handleDeleteReserva = async (BookingId) => {
        try {
            const response = await fetch(`http://152.228.163.56/proyecto/BackEnd/ApiRest/DeleteBooking.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ BookingId })
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el anuncio');
            }

            setReservas(reservas.filter(reserva => reserva.booking_id !== BookingId));
        } catch (error) {
            console.error('Error eliminando el anuncio:', error);
        }
    };


    return (
        <div className="profile-container">
            {/* Sección de encabezado */}
            <div className="profile-header">
                <div className="profile-photo-container" onClick={() => document.getElementById('photo-upload').click()}>
                    <img
                        src={profilePhoto || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'}
                        alt="Foto de perfil"
                        className="profile-photo"
                    />
                    <label htmlFor="photo-upload" className="edit-icon">
                        <i className="ion-icon ion-md-create"></i>
                    </label>
                    <input
                        type="file"
                        id="photo-upload"
                        style={{ display: 'none' }}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                    />
                </div>
                <div className="profile-info">
                    <h2>{user.username}</h2>
                </div>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {/* Sección de pestañas */}
            <div className="tabs-container">
                <div className="tabs-header">
                    <button
                        className={activeTab === 'anuncios' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('anuncios')}
                    >
                        Anuncios
                    </button>
                    <button
                        className={activeTab === 'tusReservas' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('tusReservas')}
                    >
                        Tus Reservas
                    </button>
                    <button
                        className={activeTab === 'reservasRecibidas' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('reservasRecibidas')}
                    >
                        Reservas Recibidas
                    </button>
                </div>

                {/* Contenido de las pestañas */}
                <div className="tabs-content">
                    {activeTab === 'anuncios' && (
                        <div>
                            {publications.map((publication) => {

                                const carImages = JSON.parse(publication.car_images);

                                return (
                                    <div key={publication.car_listing_id} className="publication-item">
                                        <div className="conversation-image">
                                            <img
                                                src={carImages[0] || 'default-image.png'}
                                                alt="Producto"
                                            />
                                        </div>
                                        <div className="conversation-details">
                                            <div className="conversation-user">
                                                {`${publication.make} ${publication.model}`}
                                            </div>
                                        </div>
                                        <button className="delete-btn"
                                                onClick={() => handleDeleteLisiting(publication.car_listing_id)}>
                                            <ion-icon name="trash"></ion-icon>
                                        </button>
                                    </div>
                                );
                            })}

                        </div>
                    )}
                    {activeTab === 'tusReservas' && (
                        <div>
                            {bookings.map((booking) => {

                                const bookingImages = JSON.parse(booking.booking_car_images);

                                return (
                                    <div key={booking.id} className="publication-item">
                                        <div className="conversation-image">
                                            <img
                                                src={bookingImages[0] || 'default-image.png'}
                                                alt="Producto"
                                            />
                                        </div>
                                        <div className="conversation-details">
                                            <div className="conversation-user">
                                                {`${booking.booking_start_date} - ${booking.booking_end_date}`}
                                            </div>
                                        </div>
                                        <button className="delete-btn"
                                                onClick={() => handleDeleteBooking(booking.id)}>
                                            <ion-icon name="trash"></ion-icon>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {activeTab === 'reservasRecibidas' && (
                        <div>
                            {reservas.map((reserva) => {

                                const reservaImages = JSON.parse(reserva.listing_image);

                                return (
                                    <div key={reserva.booking_id} className="publication-item">
                                        <div className="conversation-image">
                                            <img
                                                src={reservaImages[0] || 'default-image.png'}
                                                alt="Producto"
                                            />
                                        </div>
                                        <div className="conversation-details">
                                            <div className="conversation-user">
                                                {`${reserva.start_date} - ${reserva.end_date}`}
                                            </div>
                                        </div>
                                        <button className="delete-btn"
                                                onClick={() => handleDeleteReserva(reserva.booking_id)}>
                                            <ion-icon name="trash"></ion-icon>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};



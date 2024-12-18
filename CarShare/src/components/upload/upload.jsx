import { useState, useEffect } from "react";
import { Uploadcar } from "../../services/uploadcar.jsx";
import {useNavigate} from "react-router-dom";
import './upload.css';

export function Upload() {
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedMakeID, setSelectedMakeID] = useState('');
    const [selectedModelID, setSelectedModelID] = useState('');
    const [formData, setFormData] = useState({
        year: '',
        price: '',
        listing_type: 'venta',
        mileage: '',
        fuel_type: 'Gasolina',
        transmission: 'manual',
        places: '',
        cv: '',
        doors: '',
        description: '',
        images: [],
        state: 'nuevo'
    });
    const [descriptionLength, setDescriptionLength] = useState(0);
    const maxDescriptionLength = 600;
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const newImages = Array.from(e.target.files);
        setFormData({
            ...formData,
            images: [...formData.images, ...newImages]
        });
    };

    const handleRemoveImage = (index) => {
        const updatedImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: updatedImages });
    };

    const handleDescriptionChange = (e) => {
        const { value } = e.target;
        if (value.length <= maxDescriptionLength) {
            setFormData({ ...formData, description: value });
            setDescriptionLength(value.length);
        }
    };

    useEffect(() => {
        const fetchMakes = async () => {
            const response = await fetch(`http://152.228.163.56/proyecto/BackEnd/ApiRest/FiltersMake.php`);
            const data = await response.json();
            setMakes(data);
        };
        fetchMakes();
    }, []);

    useEffect(() => {
        const fetchModels = async () => {
            if (selectedMakeID) {
                const response = await fetch(`http://152.228.163.56/proyecto/BackEnd/ApiRest/FiltersModels.php?MakeId=${selectedMakeID}`);
                const data2 = await response.json();
                setModels(data2);
            }
        };
        fetchModels();
    }, [selectedMakeID]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMakeChange = (e) => {
        const selectedMake = e.target.value;
        setSelectedMakeID(selectedMake);
        setFormData({ ...formData, make_id: selectedMake });
        setSelectedModelID('');
    };

    const handleModelChange = (e) => {
        const selectedModel = e.target.value;
        setSelectedModelID(selectedModel);
        setFormData({ ...formData, model_id: selectedModel });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        const sessionCookie = document.cookie;
        const token = sessionCookie.split('=')[1];
        console.log("Token obtenido:", token);

        if (!token) {
            console.error("Token no disponible");
            return;
        }


        const formDataToSend = new FormData();


        for (const key in formData) {
            if (key !== 'images') {  // No incluyas imágenes aquí, las añadiremos después
                formDataToSend.append(key, formData[key]);
            }
        }


        formDataToSend.append('token', token);


        formData.images.forEach((image, index) => {
            formDataToSend.append(`images[${index}]`, image);
        });


        for (const [key, value] of formDataToSend.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const result = await Uploadcar(formDataToSend);
            console.log(result);
            navigate('/');
        } catch (error) {
            console.error('Error en Uploadcar:', error);
        }
    };


    return (
        <div className="upload-container">
            <h2>Subir un coche</h2>
            <form onSubmit={handleSubmit} className="upload-form" encType="multipart/form-data">
                {/* Select de Marca */}
                <div className="form-group">
                    <label htmlFor="make_id">Marca:</label>
                    <select name="make_id" value={selectedMakeID} onChange={handleMakeChange} required>
                        <option value="">Selecciona una marca</option>
                        {makes.map((make) => (
                            <option key={make.id} value={make.id}>{make.make_name}</option>
                        ))}
                    </select>
                </div>

                {/* Select de Modelo */}
                <div className="form-group">
                    <label htmlFor="model_id">Modelo:</label>
                    <select name="model_id" value={selectedModelID} onChange={handleModelChange} required>
                        <option value="">Selecciona un modelo</option>
                        {models.map((model) => (
                            <option key={model.id} value={model.id}>{model.model_name}</option>
                        ))}
                    </select>
                </div>

                {/* Otros campos */}
                <div className="form-group">
                    <label htmlFor="year">Año:</label>
                    <input type="number" name="year" value={formData.year} onChange={handleInputChange} required/>
                </div>

                <div className="form-group">
                    <label htmlFor="price">Precio:</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required/>
                </div>

                <div className="form-group">
                    <label htmlFor="mileage">Kilometraje:</label>
                    <input type="number" name="mileage" value={formData.mileage} onChange={handleInputChange} required/>
                </div>


                <div className="form-group">
                    <label htmlFor="fuel_type">Tipo de combustible:</label>
                    <select name="fuel_type" value={formData.fuel_type} onChange={handleInputChange} required>
                        <option value="Gasolina">Gasolina</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electrico">Eléctrico</option>
                        <option value="Hibrido">Híbrido</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="transmission">Transmisión:</label>
                    <select name="transmission" value={formData.transmission} onChange={handleInputChange} required>
                        <option value="Manual">Manual</option>
                        <option value="Automatico">Automática</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="fuel_type">Estado del vehiculo:</label>
                    <select name="state" value={formData.state} onChange={handleInputChange} required>
                        <option value="nuevo">Nuevo</option>
                        <option value="usado">Usado</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="fuel_type">Tipo de anuncio:</label>
                    <select name="listing_type" value={formData.listing_type} onChange={handleInputChange} required>
                        <option value="venta">Venta</option>
                        <option value="alquiler">Alquiler</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="places">Número de plazas:</label>
                    <input type="number" name="places" value={formData.places} onChange={handleInputChange} required/>
                </div>

                <div className="form-group">
                    <label htmlFor="cv">Potencia (CV):</label>
                    <input type="number" name="cv" value={formData.cv} onChange={handleInputChange} required/>
                </div>

                <div className="form-group">
                    <label htmlFor="doors">Número de puertas:</label>
                    <input type="number" name="doors" value={formData.doors} onChange={handleInputChange} required/>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Descripción:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        maxLength={maxDescriptionLength}
                        required
                    />
                    <small>{descriptionLength}/{maxDescriptionLength} caracteres</small>
                </div>

                {/* Campo de arrastrar y soltar para las imágenes */}
                <div className="form-group">
                    <label htmlFor="images">Imágenes:</label>
                    <div className="drag-drop-area">
                        <p>Arrastra y suelta tus imágenes aquí o haz clic para seleccionarlas</p>
                        <input
                            type="file"
                            name="images"
                            multiple
                            onChange={handleFileChange}
                            className="file-input"
                        />
                    </div>

                    {/* Mostrar previsualización de las imágenes seleccionadas */}
                    <div className="image-preview">
                        {formData.images.length > 0 && formData.images.map((image, index) => (
                            <div key={index} className="image-item">
                                <img src={URL.createObjectURL(image)} alt={`Imagen ${index + 1}`}
                                     className="image-preview-item"/>
                                <button type="button" onClick={() => handleRemoveImage(index)}>Eliminar</button>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="upload-button">Subir coche</button>
            </form>
        </div>
    );
}

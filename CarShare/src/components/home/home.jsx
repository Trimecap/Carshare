import React, { useEffect, useState } from 'react';
import { FilterSection } from './filtersection/filtersection.jsx';
import {Navbarsection} from "./navbarsection/navbarsection.jsx";

export function Home () {
    const [cars, setCars] = useState([]);
    const [selectedMakeID, setSelectedMakeID] = useState('');
    const [selectedModelID, setSelectedModelID] = useState('');
    const [selectedOption, setSelectedOption] = useState('comprar');

    useEffect(() => {
        const fetchCars = async () => {
            const response = await fetch('http://152.228.163.56/proyecto/BackEnd/ApiRest/CarsListing.php');
            const data = await response.json();

            const processedCars = data.map(car => {
                const imagesArray = JSON.parse(car.images);
                return { ...car, images: imagesArray };
            });

            setCars(processedCars);
        };

        fetchCars();
    }, []);

    const filteredCars = cars.filter(car => {
        const matchesMake = selectedMakeID ? car.make_id === selectedMakeID : true;
        const matchesModel = selectedModelID ? car.model_id === selectedModelID : true;
        const matchesOption = selectedOption === 'alquilar' ? car.listing_type === 'alquiler' : car.listing_type === 'venta';
        return matchesMake && matchesModel && matchesOption;
    });

    return (
        <>
            <FilterSection
                selectedMakeID={selectedMakeID}
                setSelectedMakeID={setSelectedMakeID}
                selectedModelID={selectedModelID}
                setSelectedModelID={setSelectedModelID}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                filteredCars={filteredCars}
            />
        </>
    );
}


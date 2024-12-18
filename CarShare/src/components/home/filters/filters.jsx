import React, { useEffect, useState } from 'react';
import './filters.css';

export function Filters({ selectedMakeID, setSelectedMakeID, selectedModelID, setSelectedModelID, selectedOption, setSelectedOption }) {
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [isMakeOpen, setIsMakeOpen] = useState(false);
    const [isModelOpen, setIsModelOpen] = useState(false);

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

    const handleMakeSelect = (makeID) => {
        setSelectedMakeID(makeID);
        setIsMakeOpen(false);
        setSelectedModelID('');
        setModels([]);
    };

    const handleModelSelect = (modelID) => {
        setSelectedModelID(modelID);
        setIsModelOpen(false);
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className="filters-container">
            <div className="filter-buttons">
                <button
                    className={`filter-btn ${selectedOption === 'comprar' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('comprar')}
                >
                    Comprar
                </button>
                <button
                    className={`filter-btn ${selectedOption === 'alquilar' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('alquilar')}
                >
                    Alquilar
                </button>
            </div>

            <div className="select-menu">
                <div className="select-btn" onClick={() => setIsMakeOpen(!isMakeOpen)}>
                    <span className="sBtn-text">{selectedMakeID ? makes.find(make => make.id === selectedMakeID)?.make_name : 'Marca'}</span>
                </div>
                {isMakeOpen && (
                    <ul className="options">
                        <li className="option" onClick={() => handleMakeSelect("")}>
                            Marca
                        </li>
                        {makes.map(make => (
                            <li
                                className="option"
                                key={make.id}
                                onClick={() => handleMakeSelect(make.id)}
                            >
                                {make.make_name}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="select-btn" onClick={() => setIsModelOpen(!isModelOpen)}>
                    <span className="sBtn-text">{selectedModelID ? models.find(model => model.id === selectedModelID)?.model_name : '--Selecciona modelo--'}</span>
                </div>
                {isModelOpen && selectedMakeID && (
                    <ul className="options">
                        {models.map(model => (
                            <li
                                className="option"
                                key={model.id}
                                onClick={() => handleModelSelect(model.id)}
                            >
                                {model.model_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

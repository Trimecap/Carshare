import React from 'react';
import { Filters } from '../filters/filters.jsx';
import { Cards } from "../cards/cards.jsx";
import './filtersection.css';

export function FilterSection({ selectedMakeID, setSelectedMakeID, selectedModelID, setSelectedModelID, selectedOption, setSelectedOption, filteredCars }) {
    return (
        <div>
        <div className="filters-section">
            <div className="content">
                <h1>¿Cuál es tu siguiente movimiento?</h1>
                <Filters
                    selectedMakeID={selectedMakeID}
                    setSelectedMakeID={setSelectedMakeID}
                    selectedModelID={selectedModelID}
                    setSelectedModelID={setSelectedModelID}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                />
            </div>

        </div>
        <Cards cards={filteredCars} />
        </div>
    );
}

// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import ItemInput from './components/ItemInput';
import ComparisonResult from './components/ComparisonResult';
import './App.css';

function App() {
    const resultRef = useRef(null);

    const [unitType, setUnitType] = useState('volume');
    const [baseline, setBaseline] = useState('A');

    const [itemA, setItemA] = useState({ price: '', quantity: '', unit: 'L' });
    const [itemB, setItemB] = useState({ price: '', quantity: '', unit: 'oz' });
    const [comparisonInput, setComparisonInput] = useState(null);
    const [hasCompared, setHasCompared] = useState(false);

    useEffect(() => {
        const defaultUnit =
            unitType === 'volume' ? 'L' :
            unitType === 'weight' ? 'g' :
            'count';

        setItemA((prev) => ({ ...prev, unit: defaultUnit }));
        setItemB((prev) => ({ ...prev, unit: defaultUnit }));
    }, [unitType]);

    const volumeUnits = ['L', 'ml', 'oz', 'qt'];
    const weightUnits = ['g', 'kg', 'oz', 'lb'];
    const countUnits = ['count']; // just one option for now
    const unitOptions =
        unitType === 'volume' ? volumeUnits :
        unitType === 'weight' ? weightUnits :
                countUnits;

    const isValidInput = (item) => {
        return (
            typeof item.price === 'number' &&
            !isNaN(item.price) &&
            item.price > 0 &&
            typeof item.quantity === 'number' &&
            !isNaN(item.quantity) &&
            item.quantity > 0 &&
            item.unit
        );
    };

    const handleCompare = () => {

        if (!isValidInput(itemA) || !isValidInput(itemB)) {
            alert("Please fill in all fields with valid numbers.");
            return;
        }

        setComparisonInput({
            itemA: { ...itemA },
            itemB: { ...itemB },
            unitType,
            baseline,
        });
        setHasCompared(true);

        // Scroll after render completes
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    };

    return (
        <div className="container">
            <h1>Grocery Unit Price Comparator</h1>

            <div className="card">
                <label>Unit Type: </label>
                <select value={unitType} onChange={(e) => setUnitType(e.target.value)}>
                    <option value="volume">Volume</option>
                    <option value="weight">Weight</option>
                    <option value="count">Count</option>
                </select>
            </div>

            <div className="item-grid">
                <ItemInput label="A" itemData={itemA} onChange={setItemA} unitOptions={unitOptions} />
                <ItemInput label="B" itemData={itemB} onChange={setItemB} unitOptions={unitOptions} />
            </div>

            <div className="card">
                <label>Compare using: </label>
                <select value={baseline} onChange={(e) => setBaseline(e.target.value)}>
                    <option value="A">Item A's unit</option>
                    <option value="B">Item B's unit</option>
                </select>
            </div>

            {/* Compare Button */}
            <button onClick={handleCompare}>Compare Prices</button>

            {/* Conditional rendering */}
            {hasCompared && comparisonInput && (
                <div ref={resultRef}>
                    <ComparisonResult
                        itemA={comparisonInput.itemA}
                        itemB={comparisonInput.itemB}
                        unitType={comparisonInput.unitType}
                        baseline={comparisonInput.baseline}
                    />
                </div>
            )}
        </div>
    );
}

export default App;

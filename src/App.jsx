// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import ItemInput from './components/ItemInput';
import ComparisonResult from './components/ComparisonResult';
import './App.css';

function App() {
    const resultRef = useRef(null);

    const [unitType, setUnitType] = useState('volume');
    const [baseline, setBaseline] = useState(0);
    const [inputErrors, setInputErrors] = useState([{}, {}]);
    const [hasTriedCompare, setHasTriedCompare] = useState(false);
    const [items, setItems] = useState([
        { price: '', quantity: '', unit: 'L' },
        { price: '', quantity: '', unit: 'oz' }
    ]);
    const [comparisonInput, setComparisonInput] = useState(null);
    const [hasCompared, setHasCompared] = useState(false);

    useEffect(() => {
        const defaultUnit =
            unitType === 'volume' ? 'L' :
                unitType === 'weight' ? 'g' :
                    'count';

        setItems((prevItems) =>
            prevItems.map((item) => ({
                ...item,
                unit: defaultUnit
            }))
        );
    }, [unitType]);

    const volumeUnits = ['L', 'ml', 'oz', 'qt', 'gal'];
    const weightUnits = ['g', 'kg', 'oz', 'lb'];
    const countUnits = ['count']; // just one option for now
    const unitOptions =
        unitType === 'volume' ? volumeUnits :
        unitType === 'weight' ? weightUnits :
                countUnits;

    const validateItem = (item) => {
        const errors = {};
        if (item.price === '' || isNaN(item.price) || item.price <= 0) {
            errors.price = "Enter a valid price";
        }
        if (item.quantity === '' || isNaN(item.quantity) || item.quantity <= 0) {
            errors.quantity = "Enter a valid quantity";
        }
        if (!item.unit) {
            errors.unit = "Select a unit";
        }
        return errors;
    };

    const handleCompare = () => {
        setHasTriedCompare(true);

        const allErrors = items.map(validateItem);
        setInputErrors(allErrors);

        const hasErrors = allErrors.some((err) => Object.keys(err).length > 0);
        if (hasErrors) return;

        setComparisonInput({
            items: [...items],
            unitType,
            baseline,
        });

        setHasCompared(true);

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
                {items.map((item, index) => (
                    <ItemInput
                        key={index}
                        label={`Item ${index + 1}`}
                        itemData={item}
                        onChange={(updatedItem) => {
                            const newItems = [...items];
                            newItems[index] = updatedItem;
                            setItems(newItems);
                        }}
                        unitOptions={unitOptions}
                        errors={inputErrors[index] || {}}
                        showErrors={hasTriedCompare}
                    />
                ))}
            </div>

            <div className="card">
                <label>Compare using: </label>
                <select value={baseline} onChange={(e) => setBaseline(Number(e.target.value))}>
                    {items.map((item, index) => (
                        <option key={index} value={index}>
                            Item {index + 1}'s unit
                        </option>
                    ))}
                </select>
            </div>

            {/* Compare Button */}
            <button onClick={handleCompare}>Compare Prices</button>

            {/* Conditional rendering */}
            {hasCompared && comparisonInput && (
                <div ref={resultRef}>
                    <ComparisonResult
                        items={comparisonInput.items}
                        unitType={comparisonInput.unitType}
                        baseline={comparisonInput.baseline}
                    />
                </div>
            )}
        </div>
    );
}

export default App;

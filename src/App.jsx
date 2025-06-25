// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import ItemInput from './components/ItemInput';
import ComparisonResult from './components/ComparisonResult';
import './App.css';

function App() {
    const resultRef = useRef(null);
    const lastItemRef = useRef(null);

    const [unitType, setUnitType] = useState('volume');
    const [baseline, setBaseline] = useState(0);
    const [inputErrors, setInputErrors] = useState([{}, {}]);
    const [hasTriedCompare, setHasTriedCompare] = useState(false);
    const [items, setItems] = useState([
        { price: '', quantity: '', count: 1, unit: 'L' },
        { price: '', quantity: '', count: 1, unit: 'oz' }
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
        });

        setHasCompared(true);

        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    };

    const addNewItem = () => {
        const defaultUnit =
            unitType === 'volume' ? 'L' :
                unitType === 'weight' ? 'g' :
                    'count';

        setItems((prevItems) => {
            const newItems = [
                ...prevItems,
                { price: '', quantity: '', unit: defaultUnit }
            ];

            // scroll to new item after render
            setTimeout(() => {
                lastItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

            return newItems;
        });

        // also add a placeholder error object
        setInputErrors((prevErrors) => [...prevErrors, {}]);
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
                        onRemove={() => {
                            if (items.length > 2) {
                                const newItems = items.filter((_, i) => i !== index);
                                setItems(newItems);
                                setInputErrors((prev) => prev.filter((_, i) => i !== index));
                            }
                        }}
                        canRemove={index > 1}
                        ref={index === items.length - 1 ? lastItemRef : null}
                    />
                ))}
            </div>

            <button onClick={addNewItem}>
                ➕ Add Item
            </button>

            {/* Compare Button */}
            <button onClick={handleCompare}>Compare Prices</button>

            {/* Conditional rendering */}
            {hasCompared && comparisonInput && (
                <div ref={resultRef}>
                    <ComparisonResult
                        items={comparisonInput.items}
                        unitType={comparisonInput.unitType}
                        baseline={baseline}
                        setBaseline={setBaseline}
                    />
                </div>
            )}
        </div>
    );
}

export default App;

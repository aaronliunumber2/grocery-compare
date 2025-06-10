// src/components/ItemInput.jsx
import React from 'react';

function ItemInput({ label, itemData, onChange, unitOptions, errors = {}, showErrors }) {
    const handleChange = (field, value) => {
        onChange({
            ...itemData,
            [field]: value
        });
    };

    return (
        <div className="card">
            <h2>{label}</h2>

            <div>
                <label>Price ($): </label>
                <input
                    type="number"
                    value={itemData.price}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                />
                {showErrors && errors.price && (
                    <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.price}</div>
                )}
            </div>

            <div>
                <label>Quantity: </label>
                <input
                    type="number"
                    value={itemData.quantity}
                    onChange={(e) => handleChange('quantity', parseFloat(e.target.value))}
                />
                {showErrors && errors.quantity && (
                    <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.quantity}</div>
                )}
            </div>

            <label>Unit</label>
            <select
                value={itemData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
            >
                {unitOptions.map((u) => (
                    <option key={u} value={u}>
                        {u === 'count' ? 'Each' : u} {/* Display-friendly name */}
                    </option>
                ))}
            </select>
            {showErrors && errors.unit && (
                <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.unit}</div>
            )}
        </div>
    );
}

export default ItemInput;

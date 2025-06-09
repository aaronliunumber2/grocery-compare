// src/components/ItemInput.jsx
import React from 'react';

function ItemInput({ label, itemData, onChange, unitOptions }) {
    const handleChange = (field, value) => {
        onChange({
            ...itemData,
            [field]: value
        });
    };

    return (
        <div className="card">
            <h2>Item {label}</h2>

            <div>
                <label>Price ($): </label>
                <input
                    type="number"
                    value={itemData.price}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                />
            </div>

            <div>
                <label>Quantity: </label>
                <input
                    type="number"
                    value={itemData.quantity}
                    onChange={(e) => handleChange('quantity', parseFloat(e.target.value))}
                />
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
        </div>
    );
}

export default ItemInput;

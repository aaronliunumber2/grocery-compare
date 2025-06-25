import React, { forwardRef } from 'react';

const ItemInput = forwardRef(function ItemInput(props, ref) {
    const {
        label,
        itemData,
        onChange,
        unitOptions,
        errors = {},
        showErrors,
        onRemove,
        canRemove
    } = props;

    const handleChange = (field, value) => {
        onChange({
            ...itemData,
            [field]: value
        });
    };

    return (
        <div className="card" ref={ref}>
            <h2>{label}</h2>

            <div>
                <label>Price ($)</label>
                <input
                    type="number"
                    value={itemData.price}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value) || '')}
                />
                {showErrors && errors.price && (
                    <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.price}</div>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                <div>
                    <label>Count</label>
                    <input
                        type="number"
                        value={itemData.count}
                        onChange={(e) => handleChange('count', parseInt(e.target.value) || '')}
                    />
                    {showErrors && errors.count && (
                        <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.count}</div>
                    )}
                </div>

                <span style={{ fontSize: '1.5rem' }}>×</span>

                <div>
                    <label>Amount</label>
                    <input
                        type="number"
                        value={itemData.quantity}
                        onChange={(e) => handleChange('quantity', parseFloat(e.target.value) || '')}
                    />
                    {showErrors && errors.quantity && (
                        <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.quantity}</div>
                    )}
                </div>


                <div>
                    <label>Unit</label>
                    <select
                        value={itemData.unit}
                        onChange={(e) => handleChange('unit', e.target.value)}
                    >
                        {unitOptions.map((u) => (
                            <option key={u} value={u}>
                                {u === 'count' ? 'Each' : u === 'gal' ? 'Gallon' : u}
                            </option>
                        ))}
                    </select>
                    {showErrors && errors.unit && (
                        <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.unit}</div>
                    )}
                </div>
            </div>



            {canRemove && (
                <button
                    style={{
                        backgroundColor: 'red',
                        color: 'white',
                        marginTop: '0.75rem',
                        padding: '0.5rem',
                        width: '100%',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                    onClick={onRemove}
                >
                    ❌ Remove
                </button>
            )}
        </div>
    );
});

export default ItemInput;

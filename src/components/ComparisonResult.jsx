import React from 'react';

const conversionRates = {
    volume: {
        L: 1000,
        ml: 1,
        oz: 29.5735,
        qt: 946.353,
    },
    weight: {
        g: 1,
        kg: 1000,
        oz: 28.3495,
        lb: 453.592,
    },
    count: {
        count: 1, // no conversion needed
    },
};

function formatSmartPrice(value) {
    const roundedToFour = parseFloat(value.toFixed(4));
    const roundedToTwo = parseFloat(value.toFixed(2));
    return roundedToFour === roundedToTwo
        ? roundedToTwo.toFixed(2)
        : roundedToFour.toString();
}

function ComparisonResult({ items, unitType, baseline }) {
    const units = conversionRates[unitType];

    const isValid = (item) =>
        !isNaN(item.price) &&
        !isNaN(item.quantity) &&
        item.unit in units;

    if (!items.every(isValid)) {
        return <p>Fill out all item fields correctly to compare.</p>;
    }

    // Determine baseline unit
    const baselineItem = items[baseline];
    const baselineUnit = baselineItem.unit;
    const baselineUnitValue = units[baselineUnit];
    const unitLabel = unitType === 'count' ? 'each' : baselineUnit;

    // Normalize and convert each item to baseline unit
    const normalizedItems = items.map((item, index) => {
        let pricePerUnit;

        if (unitType === 'count') {
            pricePerUnit = item.price / item.quantity;
        } else {
            const qtyInBase = item.quantity * units[item.unit];
            const basePrice = item.price / qtyInBase;
            pricePerUnit = basePrice * baselineUnitValue;
        }

        return {
            index,
            label: `Item ${index + 1}`,
            raw: item,
            pricePerUnit,
        };
    });

    // Find the cheapest price
    const minPrice = Math.min(...normalizedItems.map((i) => i.pricePerUnit));

    // Identify tied items
    const tiedItems = normalizedItems.filter(i => i.pricePerUnit === minPrice);
    const isTie = tiedItems.length > 1;

    return (
        <div className="card" style={{ marginTop: '1rem' }}>
            <h2>Comparison Result</h2>
            <p>Normalized to: <strong>per {unitLabel}</strong></p>

            <ul>
                {normalizedItems.map((item) => (
                    <li key={item.index}>
                        <strong>{item.label}:</strong> ${formatSmartPrice(item.pricePerUnit)} per {unitLabel}
                        {item.pricePerUnit === minPrice && (
                            <span style={{ color: 'green', marginLeft: '0.5rem' }}>← Best value</span>
                        )}
                    </li>
                ))}
            </ul>

            <h3>
                {isTie ? (
                    <>
                        {tiedItems.map((item, i) => (
                            <span key={item.index}>
                                {item.label}{i < tiedItems.length - 1 ? ', ' : ''}
                            </span>
                        ))}{" "}
                        are tied for the best value.
                    </>
                ) : (
                    <>
                        {tiedItems[0].label} is the best value.
                    </>
                )}
            </h3>
            {!isTie &&normalizedItems.length > 1 && (
                <div style={{ marginTop: '1rem' }}>
                    {normalizedItems.map((item) => {
                        if (item.pricePerUnit === minPrice) return null;

                        const diff = item.pricePerUnit - minPrice;
                        const percent = ((diff / minPrice) * 100).toFixed(2);

                        return (
                            <p key={item.index}>
                                {item.label} is <strong>${formatSmartPrice(diff)}</strong> more per {unitLabel} ({percent}%)
                                than the best value.
                            </p>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ComparisonResult;

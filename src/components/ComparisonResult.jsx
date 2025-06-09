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

    if (roundedToFour === roundedToTwo) {
        return roundedToTwo.toFixed(2); // Show only 2 decimals
    } else {
        return roundedToFour.toString(); // Show full 4-digit precision
    }
}

function ComparisonResult({ itemA, itemB, unitType, baseline }) {
    const units = conversionRates[unitType];

    const isValid = (item) =>
        !isNaN(item.price) &&
        !isNaN(item.quantity) &&
        item.unit in units;

    if (!isValid(itemA) || !isValid(itemB)) {
        return <p>Fill out all item fields correctly to compare.</p>;
    }

    let priceAConverted, priceBConverted, unitLabel;

    if (unitType === 'count') {
        priceAConverted = itemA.price / itemA.quantity;
        priceBConverted = itemB.price / itemB.quantity;
        unitLabel = 'each';
    } else {
        // normalize to base units
        const baseQtyA = itemA.quantity * units[itemA.unit];
        const baseQtyB = itemB.quantity * units[itemB.unit];

        const basePriceA = itemA.price / baseQtyA;
        const basePriceB = itemB.price / baseQtyB;

        const baselineUnit = baseline === 'A' ? itemA.unit : itemB.unit;
        const baselineUnitValue = units[baselineUnit];

        priceAConverted = basePriceA * baselineUnitValue;
        priceBConverted = basePriceB * baselineUnitValue;
        unitLabel = baselineUnit;
    }

    const cheaper =
        priceAConverted < priceBConverted ? 'Item A' :
            priceBConverted < priceAConverted ? 'Item B' :
                'Neither';

    const diff = Math.abs(priceAConverted - priceBConverted);
    const percent = ((diff / Math.min(priceAConverted, priceBConverted)) * 100).toFixed(2);

    return (
        <div className="card" style={{ marginTop: '1rem' }}>
            <h2>Comparison Result</h2>
            <p>Normalized to: <strong>per {unitLabel}</strong></p>

            <ul>
                <li>Item A: ${formatSmartPrice(priceAConverted)} per {unitLabel}</li>
                <li>Item B: ${formatSmartPrice(priceBConverted)} per {unitLabel}</li>
            </ul>

            <h3>
                {cheaper === 'Neither'
                    ? 'Both items cost the same per unit.'
                    : `${cheaper} is the better deal`}
            </h3>

            {cheaper !== 'Neither' && (
                <p>
                    Difference: ${formatSmartPrice(diff)} per {unitLabel} ({percent}%)
                </p>
            )}
        </div>
    );
}

export default ComparisonResult;

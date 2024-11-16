
import React from 'react';

const ScannedDataTable = ({ data }) => {
    if (!data) return null;

    return (
        <div className="overflow-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-gray-600">Field</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-gray-600">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(data).map((key) => (
                        <tr key={key} className="border-b">
                            <td className="py-2 px-4 text-gray-800 font-semibold">{key}</td>
                            <td className="py-2 px-4 text-gray-700">{data[key]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScannedDataTable;
import React from "react";
import "./Table.css";

const Table = ({ tableData, onDragDrop }) => {
    const handleDragStart = (e, row, col) => {
        e.dataTransfer.setData("source", JSON.stringify({ row, col }));
    };

    const handleDrop = (e, row, col) => {
        const source = JSON.parse(e.dataTransfer.getData("source"));
        onDragDrop(source, { row, col });
    };

    const allowDrop = (e) => e.preventDefault();

    return (
        <div className="table-container">
            <table>
                <tbody>
                    {tableData.boxes.map((row, rowIndex) => (
                        <tr key={`row-${rowIndex}`}>
                            {row.map((box, colIndex) => (
                                <td
                                    key={`cell-${rowIndex}-${colIndex}`}
                                    onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                                    onDragOver={allowDrop}
                                >
                                    <div
                                        className="box"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, rowIndex, colIndex)}
                                        style={{ backgroundColor: box.color }}
                                    >
                                        {box.id}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;

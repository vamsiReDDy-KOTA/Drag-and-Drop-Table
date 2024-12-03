import React, { useState, useCallback } from "react";
import Table from "./components/Table";
import "./App.css";

const App = () => {
  const [actions, setActions] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [tableData, setTableData] = useState({
    rows: 3,
    columns: 3,
    boxes: Array.from({ length: 3 }, (_, rowIndex) =>
      Array.from({ length: 3 }, (_, colIndex) => ({
        id: (rowIndex * 3 + colIndex + 1) * 100,
        color: getRandomColor(),
      }))
    ),
  });

  const handleAddRow = useCallback(() => {
    const newRow = Array.from({ length: tableData.columns }, () => ({
      id: getNextBoxId(tableData.boxes),
      color: getRandomColor(),
    }));
    const newTableData = {
      ...tableData,
      rows: tableData.rows + 1,
      boxes: [...tableData.boxes, newRow],
    };
    updateHistory("addRow", { prevData: tableData }, newTableData);
    setTableData(newTableData);
  }, [tableData]);

  const handleDragDrop = useCallback(
    (source, destination) => {
      const newTableData = structuredClone(tableData);
      const sourceBox = newTableData.boxes[source.row][source.col];
      const destBox = newTableData.boxes[destination.row][destination.col];
      newTableData.boxes[source.row][source.col] = destBox;
      newTableData.boxes[destination.row][destination.col] = sourceBox;
      updateHistory("dragDrop", { source, destination }, newTableData);
      setTableData(newTableData);
    },
    [tableData]
  );

  const updateHistory = (type, data, newTableData) => {
    setActions((prev) => [...prev, { type, data, newTableData }]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (actions.length === 0) return;
    const lastAction = actions.pop();
    setRedoStack((prev) => [lastAction, ...prev]);
    setActions([...actions]);
    setTableData(lastAction.data.prevData || tableData);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const lastRedo = redoStack.shift();
    setActions((prev) => [...prev, lastRedo]);
    setRedoStack([...redoStack]);
    setTableData(lastRedo.newTableData);
  };

  return (
    <div className="App">
      <h1>Drag-and-Drop Table</h1>
      <div className="buttons">
        <button onClick={handleAddRow}>Add Row</button>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleRedo}>Redo</button>
      </div>
      <Table tableData={tableData} onDragDrop={handleDragDrop} />
    </div>
  );
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  return "#" + Array.from({ length: 6 })
    .map(() => letters[Math.floor(Math.random() * 16)])
    .join("");
};

const getNextBoxId = (boxes) => {
  const ids = boxes.flat().map((box) => box.id);
  return Math.max(...ids) + 100;
};

export default App;

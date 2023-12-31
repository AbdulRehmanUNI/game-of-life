import React, { useState, useCallback, useRef } from "react";
import produce from "immer";


const numRows = 30;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const App = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <>
        <h1 style={{
            textAlign: 'center',
            fontFamily: "'Press Start 2P', cursive",
            marginTop: '20px'
            }}>
            The Game of Life
        </h1>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '20px'
            }}>
            <button
                style={{
                padding: '10px 20px',
                fontSize: '16px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#4CAF50',
                color: 'white',
                cursor: 'pointer'
                }}
                onClick={() => {
                setRunning(!running);
                if (!running) {
                    runningRef.current = true;
                    runSimulation();
                }
                }}
                >
                {running ? "Stop" : "Start"}
            </button>
            <button
                style={{
                padding: '10px 20px',
                fontSize: '16px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#4CAF50',
                color: 'white',
                cursor: 'pointer'
                }}
                onClick={() => {
                const rows = [];
                for (let i = 0; i < numRows; i++) {
                    rows.push(
                    Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
                    );
                }

                setGrid(rows);
                }}
                >
                Seed
            </button>
            <button
                style={{
                padding: '10px 20px',
                fontSize: '16px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#4CAF50',
                color: 'white',
                cursor: 'pointer'
                }}
                onClick={() => {
                setGrid(generateEmptyGrid());
                }}
                >
                Clear
            </button>
        </div>
        
        <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}    
        >
            
        <div
            style={{
            display: "grid",
            backgroundColor: '#D3D3D3', // This is light grey, adjust as needed
            gridTemplateColumns: `repeat(${numCols}, 15px)`
            }}
        >
            {grid.map((rows, i) =>
            rows.map((col, k) => (
                <div
                key={`${i}-${k}`}
                onClick={() => {
                    const newGrid = produce(grid, gridCopy => {
                    gridCopy[i][k] = grid[i][k] ? 0 : 1;
                    });
                    setGrid(newGrid);
                }}
                style={{
                    width: 15,
                    height: 15,
                    backgroundColor: grid[i][k] ? "green" : undefined,
                    border: "solid 1px black"
                }}
                />
            ))
            )}
        </div>
        </div>
        <footer style={{
            textAlign: 'center',
            fontFamily: "'Press Start 2P', cursive",
            marginTop: '20px'
            }}>
            <a href="https://github.com/AbdulRehmanUNI" target="_blank" rel="noopener noreferrer">Github</a>
            <span> | </span>
            <a href="https://www.linkedin.com/in/theabdulrehmankhan/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </footer>
    </>
  );
};

export default App;
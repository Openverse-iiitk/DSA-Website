
import React, { useState, useMemo } from 'react';
import '@xyflow/react/dist/style.css';
import { ReactFlow, MiniMap, Controls, Background, useReactFlow } from '@xyflow/react';
import { memo } from 'react';

// Example memory pool size
const MEMORY_POOL_SIZE = 8;
const MEMORY_ADDRESSES = Array(MEMORY_POOL_SIZE * 2).fill().map((_, i) => `0x${(i * 100).toString(16).toUpperCase().padStart(3, '0')}`);

const initialValues = [42, 99]; // Example values

const pointerNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const valueNames = ['x', 'y', 'z', 'w', 'v', 'u', 't', 's'];
const pointerColors = [
  '#ff69b4', // pink
  '#7ec8ff', // blue
  '#ffd700', // gold
  '#32cd32', // green
  '#ff6347', // tomato
  '#ba55d3', // purple
  '#ffa500', // orange
  '#00ced1', // teal
];

const theme = {
  bg: '#181A20',
  card: '#232A34',
  accent: '#0077ff',
  accentLight: '#7ec8ff',
  border: '#0077ff',
  text: '#fff',
  inputBg: '#232A34',
  inputBorder: '#444',
  nodeBg: '#222',
  nodeBorder: '#0077ff',
  pointerBorder: '#ff69b4',
  edge: '#ff69b4',
  codeBg: '#181A20',
  codeText: '#7ec8ff',
};


const buttonBase = {
  color: theme.text,
  border: 'none',
  borderRadius: 6,
  padding: '4px 10px',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  transition: 'background 0.2s, box-shadow 0.2s',
  boxShadow: '0 1px 4px #0002',
  outline: 'none',
  minWidth: 110,
  height: 32,
  margin: '0 4px',
  letterSpacing: 0.5,
};

const addressBtnStyle = {
  ...buttonBase,
  background: '#0077ff',
  boxShadow: '0 0 0 2px #7ec8ff',
};
const valueBtnStyle = {
  ...buttonBase,
  background: theme.card,
  boxShadow: buttonBase.boxShadow,
};

const PointersVisualizer = () => {
  // State for memory pool and pointers
  const [values, setValues] = useState(initialValues);
  const [customValue, setCustomValue] = useState('');
  const [mode, setMode] = useState('address'); // 'address' or 'value'
  const [activePointer, setActivePointer] = useState(0); // index of pointer
  const [pointers, setPointers] = useState([0]); // array of indices into values

  // Memory pool: values first, then pointers
  // Each entry: { type: 'value'|'pointer', name, address, value }
  const memoryPool = [
    ...values.map((val, idx) => ({
      type: 'value',
      name: valueNames[idx] || `val${idx}`,
      address: MEMORY_ADDRESSES[idx],
      value: val,
    })),
    ...pointers.map((valIdx, pIdx) => ({
      type: 'pointer',
      name: pointerNames[pIdx] || `ptr${pIdx}`,
      address: MEMORY_ADDRESSES[values.length + pIdx],
      value: MEMORY_ADDRESSES[valIdx], // pointer value is address it points to
      pointsTo: valueNames[valIdx] || `val${valIdx}`,
      color: pointerColors[pIdx % pointerColors.length],
    })),
    // Add extra cells to fill up the memory stick
    ...Array(MEMORY_POOL_SIZE * 2 - (values.length + pointers.length)).fill().map((_, idx) => ({
      type: 'free',
      name: '',
      address: MEMORY_ADDRESSES[values.length + pointers.length + idx],
      value: '',
    })),
  ];

  // Add custom value to memory pool
  const handleAddValue = () => {
    if (customValue.trim() !== '' && values.length < MEMORY_POOL_SIZE) {
      setValues([...values, customValue.trim()]);
      setCustomValue('');
    }
  };

  // Add new pointer
  const handleAddPointer = () => {
    if (pointers.length < values.length) {
      setPointers([...pointers, 0]);
    }
  };

  // Change pointer target
  const handlePointerChange = (pIdx, valIdx) => {
    const newPointers = [...pointers];
    newPointers[pIdx] = valIdx;
    setPointers(newPointers);
  };

  // Build ReactFlow nodes and edges - responsive dimensions
  const canvasWidth = Math.min(1200, window.innerWidth * 0.8);
  const canvasHeight = Math.min(520, window.innerHeight * 0.4);
  const nodeWidth = Math.max(80, Math.min(120, canvasWidth * 0.1));
  const nodeHeight = Math.max(60, Math.min(80, canvasHeight * 0.15));
  const totalWidth = values.length * nodeWidth + (values.length - 1) * 40;
  const startX = Math.max((canvasWidth - totalWidth) / 2, 20);
  const centerY = canvasHeight / 2 - nodeHeight / 2;

  // Value nodes
  const rfValueNodes = values.map((val, idx) => ({
    id: `val-${idx}`,
    data: {
      label: (
        <div style={{
          padding: 8,
          borderRadius: 6,
          background: theme.nodeBg,
          color: theme.text,
          border: `1.5px solid ${theme.border}`,
        }}>
          <div style={{ color: theme.accentLight, fontWeight: 'bold' }}>{valueNames[idx] || `val${idx}`}</div>
          <div>Address: <span style={{ color: theme.accentLight }}>{MEMORY_ADDRESSES[idx]}</span></div>
          <div>Value: <span style={{ color: theme.accentLight }}>{val}</span></div>
        </div>
      ),
    },
    position: {
      x: startX + idx * (nodeWidth + 40),
      y: centerY,
    },
    style: {
      width: nodeWidth,
      height: nodeHeight,
      border: `1.5px solid ${theme.border}`,
      background: theme.nodeBg,
      color: theme.text,
    },
  }));

  // Pointer nodes (above value nodes, fixed horizontal positions)
  const pointerSpacing = nodeWidth + 40;
  const POINTER_VALUE_VERTICAL_GAP = 70; // Increased vertical gap between pointer and value blocks
  const rfPointerNodes = pointers.map((valIdx, pIdx) => ({
    id: `ptr-${pIdx}`,
    data: {
      label: (
        <div style={{
          padding: 8,
          borderRadius: 6,
          background: theme.card,
          color: theme.text,
          border: `2px solid ${pointerColors[pIdx % pointerColors.length]}`,
        }}>
          <div style={{ color: pointerColors[pIdx % pointerColors.length], fontWeight: 'bold' }}>{pointerNames[pIdx] || `ptr${pIdx}`}</div>
          <div>Address: <span style={{ color: pointerColors[pIdx % pointerColors.length] }}>{MEMORY_ADDRESSES[values.length + pIdx]}</span></div>
          <div>Value: <span style={{ color: pointerColors[pIdx % pointerColors.length] }}>{MEMORY_ADDRESSES[valIdx]}</span></div>
          <div style={{ fontSize: 13, color: pointerColors[pIdx % pointerColors.length], marginTop: 2 }}>Points to: {valueNames[valIdx] || `val${valIdx}`}</div>
        </div>
      ),
    },
    position: {
      x: startX + pIdx * pointerSpacing,
      y: centerY - 120 - POINTER_VALUE_VERTICAL_GAP,
    },
    style: {
      width: nodeWidth,
      height: nodeHeight,
      border: `2px solid ${pointerColors[pIdx % pointerColors.length]}`,
      background: theme.card,
      color: theme.text,
    },
  }));

  // Custom edge type to offset arrows
  const OffsetEdge = memo(({ id, sourceX, sourceY, targetX, targetY, style, markerEnd, label, labelBgStyle, data }) => {
    // Default straight line edge rendering
    const path = `M${sourceX},${sourceY} L${targetX},${targetY}`;
    return (
      <g>
        <path
          id={id}
          d={path}
          fill="none"
          stroke={style?.stroke || '#0077ff'}
          strokeWidth={2}
          markerEnd={markerEnd ? `url(#${id}-arrow)` : undefined}
        />
        {markerEnd && (
          <marker
            id={`${id}-arrow`}
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L8,4 L0,8 L3,4 Z" fill={markerEnd.color || '#0077ff'} />
          </marker>
        )}
        {label && (
          <foreignObject x={(sourceX + targetX) / 2 - 20} y={(sourceY + targetY) / 2 - 24} width={60} height={24}>
            <div style={{ ...labelBgStyle, textAlign: 'center', fontSize: 13 }}>{label}</div>
          </foreignObject>
        )}
      </g>
    );
  });

  // Edges: pointer to value (unique color, offset to avoid overlap)
  const rfEdges = pointers.map((valIdx, pIdx) => ({
    id: `e-ptr${pIdx}-val${valIdx}`,
    source: `ptr-${pIdx}`,
    target: `val-${valIdx}`,
    animated: true,
    style: { stroke: pointerColors[pIdx % pointerColors.length], strokeWidth: 3 },
    markerEnd: {
      type: 'arrowclosed',
      color: pointerColors[pIdx % pointerColors.length],
    },
    type: 'offset',
    data: { offset: pIdx },
    label: pointerNames[pIdx],
    labelBgStyle: { fill: pointerColors[pIdx % pointerColors.length], color: '#fff', fontWeight: 'bold', borderRadius: 6, padding: '2px 6px' },
  }));

  // Example code snippets for all pointers
  const codeByAddress = `#include <stdio.h>\n\nvoid foo(int *p) {\n    *p = 123;\n}\n\n// Memory Pool\n${values.map((v, idx) => `int ${valueNames[idx]} = ${v}; // Address: ${MEMORY_ADDRESSES[idx]}`).join('\n')}
${pointers.map((valIdx, pIdx) => `int *${pointerNames[pIdx]} = &${valueNames[valIdx]}; // Address: ${MEMORY_ADDRESSES[values.length + pIdx]}, Value: ${MEMORY_ADDRESSES[valIdx]}`).join('\n')}\n\n// Usage\n${pointers.map((valIdx, pIdx) => `foo(${pointerNames[pIdx]});`).join(' ')}\n\n// Print values\n${values.map((v, idx) => `printf("%d ", ${valueNames[idx]});`).join(' ')} // Output: ${values.join(' ')} `;
  const codeByValue = `#include <stdio.h>\n\nvoid foo(int v) {\n    v = 123;\n}\n\n// Memory Pool\n${values.map((v, idx) => `int ${valueNames[idx]} = ${v}; // Address: ${MEMORY_ADDRESSES[idx]}`).join('\n')}
${pointers.map((valIdx, pIdx) => `int *${pointerNames[pIdx]} = &${valueNames[valIdx]}; // Address: ${MEMORY_ADDRESSES[values.length + pIdx]}, Value: ${MEMORY_ADDRESSES[valIdx]}`).join('\n')}\n\n// Usage\n${pointers.map((valIdx, pIdx) => `foo(${valueNames[valIdx]});`).join(' ')}\n\n// Print values\n${values.map((v, idx) => `printf("%d ", ${valueNames[idx]});`).join(' ')} // Output: ${values.join(' ')} `;

  return (
    <div className="visualization" style={{ background: theme.bg, borderRadius: 16, padding: 36, boxShadow: '0 4px 32px #0005', maxWidth: 2200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      {/* Home button top left */}
      <a href="/" style={{ position: 'absolute', top: 24, left: 32, background: theme.accent, color: theme.text, borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 18, textDecoration: 'none', boxShadow: '0 2px 8px #0003', border: `2px solid ${theme.accentLight}`, letterSpacing: 1, transition: 'background 0.2s', zIndex: 10 }}>Home</a>
      <h2 style={{ color: theme.accentLight, marginBottom: 18, fontWeight: 800, letterSpacing: 1.5, fontSize: 32, textShadow: '0 2px 8px #0006', textAlign: 'center' }}>Pointers Visualization</h2>
      <div className="controls" style={{ marginBottom: 22, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', background: theme.card, borderRadius: 12, padding: '20px 22px 12px 22px', boxShadow: '0 2px 12px #0002', border: `1px solid ${theme.border}`, maxWidth: '95%', width: '100%', justifyContent: 'center' }}>
        <button
          onClick={() => {
            if (pointers.length < valueNames.length) {
              setPointers([...pointers, 0]);
              setActivePointer(pointers.length); // select the newly added pointer
            }
          }}
          style={{ ...buttonBase, background: theme.accent, boxShadow: '0 0 0 2px ' + theme.accentLight }}
        >
          Add Pointer
        </button>
        <input
          type="text"
          value={customValue}
          onChange={e => setCustomValue(e.target.value)}
          placeholder="Add custom value"
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            border: `1.2px solid ${theme.inputBorder}`,
            background: theme.inputBg,
            color: theme.text,
            fontSize: 14,
            fontWeight: 500,
            outline: 'none',
            boxShadow: '0 1px 4px #0002',
            transition: 'border 0.2s',
            minWidth: 120,
            height: 32,
            margin: '0 4px',
          }}
          onFocus={e => (e.target.style.border = `1.2px solid ${theme.accent}`)}
          onBlur={e => (e.target.style.border = `1.2px solid ${theme.inputBorder}`)}
        />
        <button onClick={handleAddValue} style={{ ...buttonBase, background: theme.accent, boxShadow: '0 0 0 2px ' + theme.accentLight }}>Add Value</button>
        <span style={{ color: theme.text, fontWeight: 500, fontSize: 14, marginLeft: 8 }}>Active Pointer:</span>
        <select value={activePointer} onChange={e => setActivePointer(Number(e.target.value))} style={{ background: theme.card, color: theme.text, border: `1.2px solid ${theme.border}`, borderRadius: 6, fontWeight: 600, fontSize: 14, padding: '4px 10px', marginLeft: 4, height: 32 }}>
          {pointers.map((_, idx) => (
            <option key={idx} value={idx}>{pointerNames[idx] || idx}</option>
          ))}
        </select>
        <span style={{ color: theme.text, fontWeight: 500, fontSize: 14, marginLeft: 8 }}>Points to:</span>
        <select value={pointers[activePointer]} onChange={e => handlePointerChange(activePointer, Number(e.target.value))} style={{ background: theme.nodeBg, color: theme.text, border: `1.2px solid ${theme.border}`, borderRadius: 6, fontWeight: 600, fontSize: 14, padding: '4px 10px', marginLeft: 4, height: 32 }}>
          {values.map((_, idx) => (
            <option key={idx} value={idx}>{valueNames[idx] || 'val'+idx}</option>
          ))}
        </select>
      </div>
      {/* Main 3-panel layout: code | visualization | info */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'flex-start', justifyContent: 'center', width: '100%', maxWidth: '95vw', margin: '0 auto', flexWrap: 'wrap' }}>
        {/* Code Panel (Left) */}
        <div className="code-section" style={{ background: theme.card, borderRadius: 14, padding: 24, color: theme.text, minWidth: '300px', maxWidth: '500px', boxShadow: '0 2px 16px #0003', border: `1.5px solid ${theme.border}`, flex: '1 1 400px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          <h3 style={{ color: theme.accentLight, marginBottom: 12, fontWeight: 700, fontSize: 20 }}>Code Example</h3>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <button onClick={() => setMode('address')} style={{ ...buttonBase, background: theme.accent, boxShadow: '0 0 0 2px ' + theme.accentLight, minWidth: 180, fontSize: 16, padding: '8px 18px' }}>Call by Address</button>
            <button onClick={() => setMode('value')} style={{ ...buttonBase, background: theme.accent, boxShadow: '0 0 0 2px ' + theme.accentLight, minWidth: 180, fontSize: 16, padding: '8px 18px' }}>Call by Value</button>
          </div>
          <pre style={{ background: theme.codeBg, color: theme.codeText, borderRadius: 8, padding: 20, fontSize: 15, fontWeight: 500, boxShadow: '0 2px 8px #0002', border: `1px solid ${theme.border}`, marginBottom: 16, minHeight: 180, maxWidth: 540, overflowX: 'visible', whiteSpace: 'pre-wrap' }}>
            {mode === 'address' ? codeByAddress : codeByValue}
          </pre>
        </div>
        {/* Visualization Panel (Center) */}
        <div className="visualization-area" style={{ background: '#181A20', borderRadius: 12, padding: '20px', flex: '1 1 auto', minWidth: '300px', maxWidth: '90vw', boxShadow: '0 2px 16px #0003', border: `1.5px solid ${theme.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="pointer-flow-display" style={{ height: canvasHeight, width: '100%', maxWidth: canvasWidth, background: '#181A20', borderRadius: 10, marginBottom: 24, boxShadow: '0 2px 12px #0002', border: `1px solid ${theme.border}` }}>
            <ReactFlow
              nodes={[...rfValueNodes, ...rfPointerNodes]}
              edges={rfEdges}
              fitView={true}
              panOnDrag={true}
              zoomOnScroll={true}
              zoomOnPinch={true}
              zoomOnDoubleClick={true}
              minZoom={0.5}
              maxZoom={2}
              style={{ width: '100%', height: '100%', background: '#181A20', borderRadius: 8 }}
              edgeTypes={{ offset: OffsetEdge }}
            >
              <MiniMap nodeColor={n => n.style?.background || '#222'} maskColor="#181A20" />
              <Controls showInteractive={false} style={{ background: '#232A34', color: '#fff', boxShadow: '0 2px 8px #000', borderRadius: 8, border: '1px solid #222' }} />
              <Background color="#232A34" gap={16} />
              <style>{`
                .react-flow__controls-button {
                  background: #232A34 !important;
                  color: #fff !important;
                  border: 1px solid #222 !important;
                }
                .react-flow__controls-button:hover {
                  background: #0077ff !important;
                  color: #fff !important;
                }
              `}</style>
            </ReactFlow>
          </div>
          {/* Memory Pool Display */}
          <div className="memory-section" style={{ marginTop: 0, width: '100%' }}>
            <h3 style={{ color: theme.accentLight, marginBottom: 10, fontWeight: 600 }}>Memory Pool</h3>
            <div className="memory-grid" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
              {memoryPool.map((cell, idx) => (
                <div key={cell.address} style={{
                  background:
                    cell.type === 'pointer' ? theme.card :
                    cell.type === 'value' ? theme.nodeBg : '#181A20',
                  color: theme.text,
                  borderRadius: 8,
                  border:
                    cell.type === 'pointer' ? `2px solid ${cell.color}` :
                    cell.type === 'value' ? `1.5px solid ${theme.border}` : `1.5px dashed #444`,
                  padding: '12px 10px',
                  minWidth: 120,
                  textAlign: 'center',
                  marginBottom: 10,
                  boxShadow:
                    cell.type === 'pointer' ? `0 0 0 2px ${cell.color}` :
                    cell.type === 'value' ? (idx < values.length ? '0 0 0 2px ' + theme.accentLight : 'none') : 'none',
                  fontWeight: cell.type === 'free' ? 400 : 600,
                  opacity: cell.type === 'free' ? 0.6 : 1,
                  position: 'relative',
                }}>
                  {cell.type === 'pointer' && (
                    <>
                      <div style={{ fontSize: 15, marginBottom: 2, fontWeight: 700 }}>Pointer: {cell.name}</div>
                      <div style={{ fontSize: 14, marginBottom: 2 }}>Address: <span style={{ color: theme.accentLight }}>{cell.address}</span></div>
                      <div style={{ fontSize: 14, marginBottom: 2 }}>Value: <span style={{ color: cell.color }}>{cell.value}</span></div>
                      <div style={{ fontSize: 13, color: cell.color, marginTop: 2 }}>Points to: {cell.pointsTo}</div>
                    </>
                  )}
                  {cell.type === 'value' && (
                    <>
                      <div style={{ fontSize: 15, marginBottom: 2, fontWeight: 700 }}>Value: {cell.name}</div>
                      <div style={{ fontSize: 14, marginBottom: 2 }}>Address: <span style={{ color: theme.accentLight }}>{cell.address}</span></div>
                      <div style={{ fontSize: 14, marginBottom: 2 }}>Value: <span style={{ color: theme.accentLight }}>{cell.value}</span></div>
                    </>
                  )}
                  {cell.type === 'free' && (
                    <>
                      <div style={{ fontSize: 15, marginBottom: 2, fontWeight: 600, color: '#888' }}>Free</div>
                      <div style={{ fontSize: 14, marginBottom: 2 }}>Address: <span style={{ color: '#888' }}>{cell.address}</span></div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Info Panel (Right) */}
        <div className="info-panel" style={{ background: theme.card, borderRadius: 14, padding: '26px 22px', color: theme.text, minWidth: 280, maxWidth: 340, boxShadow: '0 2px 16px #0003', border: `1.5px solid ${theme.border}`, fontSize: 15, fontWeight: 500, display: 'flex', flexDirection: 'column', gap: 18, alignSelf: 'stretch', height: '100%' }}>
          <h3 style={{ color: theme.accentLight, marginBottom: 8, fontWeight: 700, fontSize: 22 }}>How to Use</h3>
          <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
            <li>Add values to the memory pool using <span style={{ color: theme.accentLight }}>Add Value</span>.</li>
            <li>Add pointers using <span style={{ color: theme.accentLight }}>Add Pointer</span>. Each pointer gets a unique color.</li>
            <li>Select the active pointer and change which value it points to using the dropdowns.</li>
            <li>Switch between <span style={{ color: theme.accentLight }}>Call by Address</span> and <span style={{ color: theme.accentLight }}>Call by Value</span> to see the difference in code and behavior.</li>
            <li>Observe the arrows and colors in the visualization to understand pointer relationships.</li>
          </ul>
          <h4 style={{ color: theme.accentLight, marginTop: 10, fontWeight: 600, fontSize: 17 }}>Pointer Notes</h4>
          <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
            <li>Pointers store memory addresses and can be used to modify values directly.</li>
            <li>Call by address allows functions to change the original value via pointers.</li>
            <li>Call by value passes a copy, so changes do not affect the original variable.</li>
            <li>Multiple pointers can point to the same value, and each pointer can be changed independently.</li>
            <li>Pointer visualization helps you see how memory and references work in C.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};


export default PointersVisualizer;

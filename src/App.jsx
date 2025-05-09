import { useState } from 'react';
import './App.css';
import CodeViewer from './components/CodeViewer';
import LinkedListVisualizer from './components/LinkedListVisualizer';
import DiySection from './components/DiySection';
import DoublyLinkedListExplanation from './components/DoublyLinkedListExplanation';
import { generateCppCode } from './utils/codeGenerator';
import Split from 'react-split';

function App() {
  const [nodes, setNodes] = useState([]);
  const [code, setCode] = useState(generateCppCode([]));
  const [highlightedLine, setHighlightedLine] = useState(null); // Add state to store the highlighted line

  const updateNodesAndCode = (newNodes) => {
    setNodes(newNodes);
    const newCode = generateCppCode(newNodes);
    setCode(newCode);

    // Set the highlighted line to the new line that was added
    const newLine = newNodes.length; // Assuming the new node corresponds to the last line of code
    setHighlightedLine(newLine);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>C++ Doubly Linked List Visualization</h1>
      </header>

      <div className="split-container">
        <Split
          className="split-view"
          sizes={[50, 50]}
          minSize={200}
          gutterSize={10}
        >
          <div className="panel panel-left">
            <h2>C++ Implementation</h2>
            <CodeViewer code={code} highlightedLine={highlightedLine} />
          </div>
          <div className="panel panel-right">
            <h2>Interactive Visualization</h2>
            <LinkedListVisualizer nodes={nodes} onNodesChange={updateNodesAndCode} />
            <DoublyLinkedListExplanation />
            <DiySection code={code} />
          </div>
        </Split>
      </div>
    </div>
  );
}

export default App;

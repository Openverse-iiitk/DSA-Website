import { BLOCK_TYPES, NODE_SHAPES } from '../types';

// Convert blocks to React Flow nodes and edges
export const generateFlowchartData = (blocks) => {
  if (!blocks || blocks.length === 0) {
    return { nodes: [], edges: [] };
  }

  const nodes = [];
  const edges = [];
  let nodeIdCounter = 0;
  let yPosition = 50;
  const NODE_HEIGHT = 80;
  const NODE_SPACING = 150;
  const BRANCH_SPACING = 300;

  // Helper function to create a node
  const createNode = (block, x = 300, y = yPosition) => {
    nodeIdCounter++;
    const nodeId = `node-${nodeIdCounter}`;
    
    let nodeType = 'default';
    let style = {};
    let data = { label: '' };

    // Dark theme colors with better contrast
    const darkColors = {
      start: '#22c55e',
      stop: '#ef4444', 
      assign: '#3b82f6',
      print: '#8b5cf6',
      if: '#f59e0b',
      while: '#06b6d4',
      background: '#1f2937',
      text: '#f9fafb'
    };

    switch (block.type) {
      case BLOCK_TYPES.START:
        nodeType = 'input';
        style = { 
          background: darkColors.start, 
          color: darkColors.text, 
          borderRadius: '50%',
          width: 120,
          height: 80,
          border: '2px solid #374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold'
        };
        data.label = 'START';
        break;
      
      case BLOCK_TYPES.STOP:
        nodeType = 'output';
        style = { 
          background: darkColors.stop, 
          color: darkColors.text, 
          borderRadius: '50%',
          width: 120,
          height: 80,
          border: '2px solid #374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold'
        };
        data.label = 'STOP';
        break;
      
      case BLOCK_TYPES.ASSIGN:
        style = { 
          background: darkColors.assign, 
          color: darkColors.text,
          borderRadius: '8px',
          width: 180,
          height: 80,
          border: '2px solid #374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '500',
          padding: '8px'
        };
        data.label = block.value || 'Assignment';
        break;
      
      case BLOCK_TYPES.PRINT:
        style = { 
          background: darkColors.print, 
          color: darkColors.text,
          borderRadius: '8px',
          width: 180,
          height: 80,
          border: '2px solid #374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '500',
          padding: '8px'
        };
        data.label = `Print: ${block.value || 'value'}`;
        break;
      
      case BLOCK_TYPES.INCREMENT:
        style = { 
          background: '#10b981', // emerald-500
          color: darkColors.text,
          borderRadius: '8px',
          width: 180,
          height: 80,
          border: '2px solid #374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '500',
          padding: '8px'
        };
        data.label = `${block.value || 'variable'}++`;
        break;
      
      case BLOCK_TYPES.DECREMENT:
        style = { 
          background: '#f97316', // orange-500
          color: darkColors.text,
          borderRadius: '8px',
          width: 180,
          height: 80,
          border: '2px solid #374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '500',
          padding: '8px'
        };
        data.label = `${block.value || 'variable'}--`;
        break;
      
      case BLOCK_TYPES.INPUT:
        style = { 
          background: '#ec4899', // pink-500
          color: darkColors.text,
          borderRadius: '8px',
          width: 180,
          height: 80,
          border: '2px solid #374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '500',
          padding: '8px'
        };
        data.label = `Input: ${block.value || 'variable'}`;
        break;
      
      case BLOCK_TYPES.IF:
        style = { 
          background: darkColors.if, 
          color: darkColors.text,
          width: 140,
          height: 140,
          border: '2px solid #374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '500',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          padding: '20px'
        };
        data.label = block.value || 'condition';
        // Add source handles for different connection points
        data.sourceHandles = [
          { id: 'true', position: 'left', style: { background: '#22c55e' } },
          { id: 'false', position: 'right', style: { background: '#ef4444' } }
        ];
        break;
      
      case BLOCK_TYPES.WHILE:
        style = { 
          background: darkColors.while, 
          color: darkColors.text,
          width: 140,
          height: 140,
          border: '2px solid #374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '500',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          padding: '20px'
        };
        data.label = block.value || 'condition';
        break;
      
      default:
        break;
    }

    const node = {
      id: nodeId,
      type: nodeType,
      position: { x, y },
      data,
      style,
      sourcePosition: 'bottom',
      targetPosition: 'top'
    };

    nodes.push(node);
    return { nodeId, nextY: y + NODE_SPACING };
  };

  // Helper function to create a placeholder node
  const createPlaceholderNode = (placeholderType, parentBlockId, branchType, x = 300, y = yPosition) => {
    nodeIdCounter++;
    const nodeId = `placeholder-${nodeIdCounter}`;
    
    // Create better labels based on placeholder context
    let label;
    switch (placeholderType) {
      case 'if-true':
        label = 'Click to add block to TRUE branch';
        break;
      case 'if-false':
        label = 'Click to add block to FALSE branch';
        break;
      case 'while-body':
        label = 'Click to add block to LOOP body';
        break;
      default:
        label = `Click to add ${branchType} block`;
    }
    
    const data = {
      label,
      placeholderType,
      parentBlockId,
      branchType
    };
    
    const style = {
      background: '#374151',
      color: '#9ca3af',
      border: '2px dashed #6b7280',
      borderRadius: '8px',
      width: 180,
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      fontStyle: 'italic',
      cursor: 'pointer',
      opacity: 0.8,
      transition: 'all 0.2s ease',
      textAlign: 'center',
      padding: '4px'
    };

    const node = {
      id: nodeId,
      type: 'default',
      position: { x, y },
      data,
      style,
      sourcePosition: 'bottom',
      targetPosition: 'top'
    };

    nodes.push(node);
    return { nodeId, nextY: y + NODE_SPACING };
  };

  // Helper function to create an edge
  const createEdge = (sourceId, targetId, label = '', sourceHandle = null, targetHandle = null) => {
    const edgeId = `edge-${sourceId}-${targetId}-${label || 'default'}`;
    const edge = {
      id: edgeId,
      source: sourceId,
      target: targetId,
      type: 'smoothstep',
      animated: true,
      label,
      style: { 
        stroke: '#6b7280', 
        strokeWidth: 2 
      },
      sourceHandle,
      targetHandle
    };
    
    if (label) {
      edge.labelStyle = { 
        fill: '#f9fafb', 
        fontWeight: 'bold', 
        fontSize: '12px',
        background: '#1f2937',
        padding: '2px 6px',
        borderRadius: '4px'
      };
      edge.labelBgStyle = { 
        fill: '#1f2937', 
        fillOpacity: 0.9,
        rx: 4
      };
    }
    
    edges.push(edge);
    return edgeId;
  };

  // Process blocks sequentially with proper branching
  const processBlocks = (blockList, startY = 50) => {
    let currentY = startY;
    const processedNodes = [];
    
    for (let i = 0; i < blockList.length; i++) {
      const block = blockList[i];
      const { nodeId, nextY } = createNode(block, 300, currentY);
      processedNodes.push(nodeId);
      
      // Connect to previous node if exists
      if (i > 0) {
        createEdge(processedNodes[i - 1], nodeId);
      }
      
      // Handle special block types
      if (block.type === BLOCK_TYPES.IF) {
        currentY = handleIfBlock(block, nodeId, nextY);
      } else if (block.type === BLOCK_TYPES.WHILE) {
        currentY = handleWhileBlock(block, nodeId, nextY);
      } else {
        currentY = nextY;
      }
    }
    
    return processedNodes;
  };

  // Handle IF block branching
  const handleIfBlock = (block, ifNodeId, startY) => {
    let maxY = startY;
    
    // True branch (left side)
    if (block.children && block.children.length > 0) {
      const trueBranchNodes = processBranch(block.children, 150, startY, 'True');
      if (trueBranchNodes.length > 0) {
        createEdge(ifNodeId, trueBranchNodes[0], 'True', 'true');
        const lastTrueNode = trueBranchNodes[trueBranchNodes.length - 1];
        const lastTrueNodeY = nodes.find(n => n.id === lastTrueNode)?.position.y || startY;
        maxY = Math.max(maxY, lastTrueNodeY + NODE_SPACING);
        
        // Add placeholder at the end of true branch for adding more blocks
        const truePlaceholder = createPlaceholderNode('if-true', block.id, 'true', 150, lastTrueNodeY + NODE_SPACING);
        createEdge(lastTrueNode, truePlaceholder.nodeId);
        maxY = Math.max(maxY, truePlaceholder.nextY);
      }
    } else {
      // Create placeholder for true branch
      const truePlaceholder = createPlaceholderNode('if-true', block.id, 'true', 150, startY);
      createEdge(ifNodeId, truePlaceholder.nodeId, 'True', 'true');
      maxY = Math.max(maxY, truePlaceholder.nextY);
    }
    
    // False branch (right side)
    if (block.elseChildren && block.elseChildren.length > 0) {
      const falseBranchNodes = processBranch(block.elseChildren, 450, startY, 'False');
      if (falseBranchNodes.length > 0) {
        createEdge(ifNodeId, falseBranchNodes[0], 'False', 'false');
        const lastFalseNode = falseBranchNodes[falseBranchNodes.length - 1];
        const lastFalseNodeY = nodes.find(n => n.id === lastFalseNode)?.position.y || startY;
        maxY = Math.max(maxY, lastFalseNodeY + NODE_SPACING);
        
        // Add placeholder at the end of false branch for adding more blocks
        const falsePlaceholder = createPlaceholderNode('if-false', block.id, 'false', 450, lastFalseNodeY + NODE_SPACING);
        createEdge(lastFalseNode, falsePlaceholder.nodeId);
        maxY = Math.max(maxY, falsePlaceholder.nextY);
      }
    } else {
      // Create placeholder for false branch
      const falsePlaceholder = createPlaceholderNode('if-false', block.id, 'false', 450, startY);
      createEdge(ifNodeId, falsePlaceholder.nodeId, 'False', 'false');
      maxY = Math.max(maxY, falsePlaceholder.nextY);
    }
    
    return maxY;
  };

  // Handle WHILE block looping
  const handleWhileBlock = (block, whileNodeId, startY) => {
    let maxY = startY;
    
    // Loop body
    if (block.children && block.children.length > 0) {
      const loopBodyNodes = processBranch(block.children, 300, startY, 'True');
      if (loopBodyNodes.length > 0) {
        createEdge(whileNodeId, loopBodyNodes[0], 'True');
        
        const lastLoopNode = loopBodyNodes[loopBodyNodes.length - 1];
        const lastLoopNodeY = nodes.find(n => n.id === lastLoopNode)?.position.y || startY;
        maxY = Math.max(maxY, lastLoopNodeY + NODE_SPACING);
        
        // Add placeholder at the end of loop body for adding more blocks
        const bodyPlaceholder = createPlaceholderNode('while-body', block.id, 'body', 300, lastLoopNodeY + NODE_SPACING);
        createEdge(lastLoopNode, bodyPlaceholder.nodeId);
        
        // Create loop back edge from placeholder to while condition
        createEdge(bodyPlaceholder.nodeId, whileNodeId, 'Loop Back');
        maxY = Math.max(maxY, bodyPlaceholder.nextY);
      }
    } else {
      // Create placeholder for loop body
      const bodyPlaceholder = createPlaceholderNode('while-body', block.id, 'body', 300, startY);
      createEdge(whileNodeId, bodyPlaceholder.nodeId, 'True');
      
      // Create loop back edge from placeholder
      createEdge(bodyPlaceholder.nodeId, whileNodeId, 'Loop Back');
      maxY = Math.max(maxY, bodyPlaceholder.nextY);
    }
    
    return maxY;
  };

  // Process a branch of blocks (for if/while children)
  const processBranch = (branchBlocks, xOffset, startY) => {
    const branchNodes = [];
    let currentY = startY;
    
    for (let i = 0; i < branchBlocks.length; i++) {
      const block = branchBlocks[i];
      const { nodeId, nextY } = createNode(block, xOffset, currentY);
      branchNodes.push(nodeId);
      
      // Connect to previous node in branch
      if (i > 0) {
        createEdge(branchNodes[i - 1], nodeId);
      }
      
      // Handle nested control structures
      if (block.type === BLOCK_TYPES.IF) {
        currentY = handleIfBlock(block, nodeId, nextY);
      } else if (block.type === BLOCK_TYPES.WHILE) {
        currentY = handleWhileBlock(block, nodeId, nextY);
      } else {
        currentY = nextY;
      }
    }
    
    return branchNodes;
  };

  // Process all blocks
  processBlocks(blocks);

  return { nodes, edges };
};

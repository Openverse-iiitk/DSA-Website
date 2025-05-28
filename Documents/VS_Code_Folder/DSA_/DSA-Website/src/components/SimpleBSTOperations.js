// Simple BST operations for TreeVisualizer.jsx
// This file contains more robust implementations of BST operations

/**
 * Creates a deep copy of a tree to avoid mutating the original
 */
export const copyTree = (tree) => {
  if (!tree) return null;
  return JSON.parse(JSON.stringify(tree));
};

/**
 * Simpler, more robust BST delete operation
 */
export const simpleBSTDelete = (root, value) => {
  try {
    const results = [];
    let currentStep = "";
    
    // Create a deep copy of the tree to avoid mutating the original
    const treeCopy = root ? JSON.parse(JSON.stringify(root)) : null;
    
    // Handle empty tree case
    if (!treeCopy || treeCopy.name === "") {
      currentStep = "Tree is empty, nothing to delete";
      results.push({
        tree: { name: "", children: [] },
        step: currentStep,
        line: 2,
        animationDelay: 0
      });
      return { tree: { name: "", children: [] }, results };
    }
    
    // Track if value was found in the tree
    let valueFound = false;
    
    // Initial step: start the search
    currentStep = `Searching for node with value ${value} to delete`;
    results.push({
      tree: JSON.parse(JSON.stringify(treeCopy)),
      step: currentStep,
      line: 1,
      animationDelay: 0
    });
    
    /**
     * Helper function to find minimum value node in a subtree
     */
    const findMinValue = (node) => {
      if (!node || !node.children) return null;
      
      let current = node;
      
      // Traverse left as far as possible to find minimum
      while (current.children && current.children[0]) {
        current = current.children[0];
      }
      
      return current.name;
    };
    
    /**
     * Helper function to remove a node at a specific path in the tree
     * Returns the modified tree
     */
    const removeNodeAtPath = (tree, path) => {
      if (!tree || path.length === 0) return tree;
      
      if (path.length === 1) {
        // Directly modifying the root
        const childIndex = path[0] === 'left' ? 0 : 1;
        if (!tree.children || !tree.children[childIndex]) {
          return tree;
        }
        tree.children[childIndex] = null;
        return tree;
      }
      
      // Non-root node
      const traverseAndRemove = (node, currentPath, pathIndex) => {
        if (!node || !node.children) return;
        
        if (pathIndex === path.length - 1) {
          // Found the parent of the node to remove
          const finalDirection = path[pathIndex];
          const childIndex = finalDirection === 'left' ? 0 : 1;
          node.children[childIndex] = null;
          return;
        }
        
        // Continue traversing
        const direction = path[pathIndex];
        const childIndex = direction === 'left' ? 0 : 1;
        
        if (node.children[childIndex]) {
          traverseAndRemove(node.children[childIndex], path, pathIndex + 1);
        }
      };
      
      traverseAndRemove(tree, path, 0);
      return tree;
    };
    
    /**
     * Search for node and delete it
     * Returns an object with:
     * - modified: whether the tree was modified
     * - tree: the modified tree
     * - found: whether the value was found
     * - path: path to the deleted node
     */
    const searchAndDelete = (tree, value) => {
      if (!tree) return { modified: false, tree: null, found: false, path: [] };
      
      const search = (node, path = []) => {
        if (!node) return { found: false, path };
        
        const nodeValue = parseInt(node.name);
        
        // Add current node to visualization
        node.highlight = true;
        results.push({
          tree: JSON.parse(JSON.stringify(treeCopy)),
          step: `Examining node ${nodeValue}`,
          line: 6,
          animationDelay: path.length * 0.3
        });
        node.highlight = false;
        
        // Case: Found the node to delete
        if (nodeValue === value) {
          valueFound = true;
          node.highlight = true;
          node.toDelete = true;
          
          results.push({
            tree: JSON.parse(JSON.stringify(treeCopy)),
            step: `Found node with value ${value} to delete`,
            line: 20,
            animationDelay: path.length * 0.3 + 0.3
          });
          
          return { found: true, path };
        }
        
        // Search left subtree
        if (value < nodeValue) {
          currentStep = `${value} < ${nodeValue}, searching left subtree`;
          results.push({
            tree: JSON.parse(JSON.stringify(treeCopy)),
            step: currentStep,
            line: 9,
            animationDelay: path.length * 0.3 + 0.2
          });
          
          if (node.children && node.children[0]) {
            return search(node.children[0], [...path, 'left']);
          } else {
            results.push({
              tree: JSON.parse(JSON.stringify(treeCopy)),
              step: `Left child doesn't exist, ${value} not found in this path`,
              line: 11,
              animationDelay: path.length * 0.3 + 0.3
            });
            return { found: false, path };
          }
        }
        
        // Search right subtree
        if (value > nodeValue) {
          currentStep = `${value} > ${nodeValue}, searching right subtree`;
          results.push({
            tree: JSON.parse(JSON.stringify(treeCopy)),
            step: currentStep,
            line: 14,
            animationDelay: path.length * 0.3 + 0.2
          });
          
          if (node.children && node.children[1]) {
            return search(node.children[1], [...path, 'right']);
          } else {
            results.push({
              tree: JSON.parse(JSON.stringify(treeCopy)),
              step: `Right child doesn't exist, ${value} not found in this path`,
              line: 16,
              animationDelay: path.length * 0.3 + 0.3
            });
            return { found: false, path };
          }
        }
        
        return { found: false, path };
      };
      
      // Search for the node to delete
      const { found, path } = search(tree);
      
      if (!found) {
        return { modified: false, tree, found, path };
      }
      
      // Get the node to delete and its parent
      let nodeToDelete = tree;
      let parent = null;
      let parentDirection = null;
      
      // Special case: deleting the root node
      if (path.length === 0) {
        if (!nodeToDelete.children || 
            (!nodeToDelete.children[0] && !nodeToDelete.children[1])) {
          // Root with no children - delete the entire tree
          results.push({
            tree: { name: "", children: [] },
            step: `Deleted root node ${value}, tree is now empty`,
            line: 25,
            animationDelay: 0.5
          });
          return { modified: true, tree: { name: "", children: [] }, found: true, path };
        }
        
        if (!nodeToDelete.children[0]) {
          // Root with only right child
          results.push({
            tree: nodeToDelete.children[1],
            step: `Deleted root node ${value} and replaced with right child`,
            line: 28,
            animationDelay: 0.5
          });
          return { modified: true, tree: nodeToDelete.children[1], found: true, path };
        }
        
        if (!nodeToDelete.children[1]) {
          // Root with only left child
          results.push({
            tree: nodeToDelete.children[0],
            step: `Deleted root node ${value} and replaced with left child`,
            line: 33,
            animationDelay: 0.5
          });
          return { modified: true, tree: nodeToDelete.children[0], found: true, path };
        }
        
        // Root with two children - special case
        const successor = findMinValue(nodeToDelete.children[1]);
        
        results.push({
          tree: JSON.parse(JSON.stringify(tree)),
          step: `Found successor ${successor} for root node ${value}`,
          line: 41,
          animationDelay: 0.8
        });
        
        nodeToDelete.name = successor;
        
        results.push({
          tree: JSON.parse(JSON.stringify(tree)),
          step: `Replaced root value ${value} with successor ${successor}`,
          line: 42,
          animationDelay: 1.0
        });
        
        // Now we need to delete the successor from the right subtree
        const { modified, tree: updatedTree } = searchAndDelete(tree, parseInt(successor));
        return { modified: true, tree: updatedTree, found: true, path };
      }
      
      // For non-root nodes, traverse to the parent
      for (let i = 0; i < path.length - 1; i++) {
        parent = nodeToDelete;
        const direction = path[i];
        const childIndex = direction === 'left' ? 0 : 1;
        nodeToDelete = nodeToDelete.children[childIndex];
      }
      
      // The last element in the path tells us which child of parent is the node to delete
      parentDirection = path[path.length - 1];
      const childIndex = parentDirection === 'left' ? 0 : 1;
      nodeToDelete = parent.children[childIndex];
      
      // Case 1: Node has no children
      if (!nodeToDelete.children || 
          (!nodeToDelete.children[0] && !nodeToDelete.children[1])) {
        results.push({
          tree: JSON.parse(JSON.stringify(tree)),
          step: `Node ${value} is a leaf node, simply removing it`,
          line: 23,
          animationDelay: path.length * 0.3 + 0.4
        });
        
        // Set the child to null
        parent.children[childIndex] = null;
        return { modified: true, tree, found: true, path };
      }
      
      // Case 2: Node has only right child
      if (!nodeToDelete.children[0]) {
        results.push({
          tree: JSON.parse(JSON.stringify(tree)),
          step: `Node ${value} has only right child, replacing with right child`,
          line: 28,
          animationDelay: path.length * 0.3 + 0.4
        });
        
        parent.children[childIndex] = nodeToDelete.children[1];
        return { modified: true, tree, found: true, path };
      }
      
      // Case 3: Node has only left child
      if (!nodeToDelete.children[1]) {
        results.push({
          tree: JSON.parse(JSON.stringify(tree)),
          step: `Node ${value} has only left child, replacing with left child`,
          line: 33,
          animationDelay: path.length * 0.3 + 0.4
        });
        
        parent.children[childIndex] = nodeToDelete.children[0];
        return { modified: true, tree, found: true, path };
      }
      
      // Case 4: Node has two children
      results.push({
        tree: JSON.parse(JSON.stringify(tree)),
        step: `Node ${value} has two children, finding successor`,
        line: 39,
        animationDelay: path.length * 0.3 + 0.4
      });
      
      const successor = findMinValue(nodeToDelete.children[1]);
      
      results.push({
        tree: JSON.parse(JSON.stringify(tree)),
        step: `Found successor ${successor} for node ${value}`,
        line: 41,
        animationDelay: path.length * 0.3 + 0.8
      });
      
      nodeToDelete.name = successor;
      
      results.push({
        tree: JSON.parse(JSON.stringify(tree)),
        step: `Replaced node value ${value} with successor ${successor}`,
        line: 42,
        animationDelay: path.length * 0.3 + 1.0
      });
      
      // Now we need to delete the successor from the right subtree
      const newPath = [...path, 'right'];
      const { modified, tree: updatedTree } = searchAndDelete(tree, parseInt(successor));
      return { modified: true, tree: updatedTree, found: true, path };
    };
    
    // Perform the delete operation
    const { modified, tree: newTree, found } = searchAndDelete(treeCopy, value);
    
    // Show results based on whether the value was found
    if (!found) {
      results.push({
        tree: treeCopy,
        step: `Value ${value} was not found in the tree`,
        line: 48,
        animationDelay: results.length * 0.2
      });
      
      return { tree: treeCopy, results };
    }
    
    // Final state after deletion
    const finalTree = newTree || { name: "", children: [] };
    
    results.push({
      tree: finalTree,
      step: `Successfully deleted ${value} from the tree`,
      line: 50,
      animationDelay: results.length * 0.2
    });
    
    return { tree: finalTree, results };
  } catch (error) {
    // Error handling
    console.error("Error in simpleBSTDelete:", error);
    
    // Return a safe result that won't crash the application
    return {
      tree: root || { name: "", children: [] },
      results: [{
        tree: root || { name: "", children: [] },
        step: `Error deleting node: ${error.message}`,
        line: 1,
        animationDelay: 0
      }]
    };
  }
};

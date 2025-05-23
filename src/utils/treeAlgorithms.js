export const AVLAlgorithm = {
  createNode: (value, left = null, right = null) => ({
    value,
    left,
    right,
    height: 1
  }),

  getHeight: (node) => node ? node.height : 0,

  getBalance: (node) => node ? AVLAlgorithm.getHeight(node.left) - AVLAlgorithm.getHeight(node.right) : 0,

  rightRotate: (y) => {
    const x = y.left;
    const T2 = x.right;
    
    x.right = y;
    y.left = T2;
    
    y.height = Math.max(AVLAlgorithm.getHeight(y.left), AVLAlgorithm.getHeight(y.right)) + 1;
    x.height = Math.max(AVLAlgorithm.getHeight(x.left), AVLAlgorithm.getHeight(x.right)) + 1;
    
    return x;
  },

  leftRotate: (x) => {
    const y = x.right;
    const T2 = y.left;
    
    y.left = x;
    x.right = T2;
    
    x.height = Math.max(AVLAlgorithm.getHeight(x.left), AVLAlgorithm.getHeight(x.right)) + 1;
    y.height = Math.max(AVLAlgorithm.getHeight(y.left), AVLAlgorithm.getHeight(y.right)) + 1;
    
    return y;
  },

  insert: (root, value) => {
    if (!root) return AVLAlgorithm.createNode(value);
    
    if (value < root.value) {
      root.left = AVLAlgorithm.insert(root.left, value);
    } else if (value > root.value) {
      root.right = AVLAlgorithm.insert(root.right, value);
    } else {
      return root; // Duplicate values not allowed
    }
    
    root.height = 1 + Math.max(AVLAlgorithm.getHeight(root.left), AVLAlgorithm.getHeight(root.right));
    const balance = AVLAlgorithm.getBalance(root);
    
    // Left Left Case
    if (balance > 1 && value < root.left.value) {
      return AVLAlgorithm.rightRotate(root);
    }
    
    // Right Right Case
    if (balance < -1 && value > root.right.value) {
      return AVLAlgorithm.leftRotate(root);
    }
    
    // Left Right Case
    if (balance > 1 && value > root.left.value) {
      root.left = AVLAlgorithm.leftRotate(root.left);
      return AVLAlgorithm.rightRotate(root);
    }
    
    // Right Left Case
    if (balance < -1 && value < root.right.value) {
      root.right = AVLAlgorithm.rightRotate(root.right);
      return AVLAlgorithm.leftRotate(root);
    }
    
    return root;
  },

  minValueNode: (node) => {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  },

  delete: (root, value) => {
    if (!root) return root;
    
    if (value < root.value) {
      root.left = AVLAlgorithm.delete(root.left, value);
    } else if (value > root.value) {
      root.right = AVLAlgorithm.delete(root.right, value);
    } else {
      if (!root.left || !root.right) {
        const temp = root.left ? root.left : root.right;
        if (!temp) {
          return null;
        } else {
          root = temp;
        }
      } else {
        const temp = AVLAlgorithm.minValueNode(root.right);
        root.value = temp.value;
        root.right = AVLAlgorithm.delete(root.right, temp.value);
      }
    }
    
    if (!root) return root;
    
    root.height = 1 + Math.max(AVLAlgorithm.getHeight(root.left), AVLAlgorithm.getHeight(root.right));
    const balance = AVLAlgorithm.getBalance(root);
    
    // Rebalancing same as insert
    if (balance > 1 && AVLAlgorithm.getBalance(root.left) >= 0) {
      return AVLAlgorithm.rightRotate(root);
    }
    
    if (balance > 1 && AVLAlgorithm.getBalance(root.left) < 0) {
      root.left = AVLAlgorithm.leftRotate(root.left);
      return AVLAlgorithm.rightRotate(root);
    }
    
    if (balance < -1 && AVLAlgorithm.getBalance(root.right) <= 0) {
      return AVLAlgorithm.leftRotate(root);
    }
    
    if (balance < -1 && AVLAlgorithm.getBalance(root.right) > 0) {
      root.right = AVLAlgorithm.rightRotate(root.right);
      return AVLAlgorithm.leftRotate(root);
    }
    
    return root;
  },

  search: (root, value) => {
    if (!root) return false;
    if (root.value === value) return true;
    if (value < root.value) return AVLAlgorithm.search(root.left, value);
    return AVLAlgorithm.search(root.right, value);
  },

  inorder: (root, result = []) => {
    if (root) {
      AVLAlgorithm.inorder(root.left, result);
      result.push(root.value);
      AVLAlgorithm.inorder(root.right, result);
    }
    return result;
  },

  preorder: (root, result = []) => {
    if (root) {
      result.push(root.value);
      AVLAlgorithm.preorder(root.left, result);
      AVLAlgorithm.preorder(root.right, result);
    }
    return result;
  },

  postorder: (root, result = []) => {
    if (root) {
      AVLAlgorithm.postorder(root.left, result);
      AVLAlgorithm.postorder(root.right, result);
      result.push(root.value);
    }
    return result;
  },

  levelOrder: (root) => {
    const result = [];
    if (!root) return result;
    
    const queue = [root];
    while (queue.length) {
      const node = queue.shift();
      result.push(node.value);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    return result;
  },

  createSampleTree: () => {
    let tree = null;
    const values = [10, 20, 30, 40, 50, 25];
    values.forEach(val => {
      tree = AVLAlgorithm.insert(tree, val);
    });
    return tree;
  }
};

export const RedBlackAlgorithm = {
  COLOR: {
    RED: 'RED',
    BLACK: 'BLACK'
  },

  createNode: (value, color, left = null, right = null, parent = null) => ({
    value,
    color,
    left,
    right,
    parent
  }),

  // Red-Black tree implementation would be similar but with color properties
  // and different balancing operations
  // Implementing the full Red-Black tree would be quite extensive
  // This is a simplified version for visualization purposes

  insert: (root, value) => {
    // Simplified insertion for visualization
    // Actual implementation would need to handle color changes and rotations
    if (!root) {
      return RedBlackAlgorithm.createNode(value, RedBlackAlgorithm.COLOR.BLACK);
    }
    
    // Actual implementation would be more complex with proper balancing
    // This is just for visualization
    let node = root;
    let parent = null;
    
    while (node) {
      parent = node;
      if (value < node.value) {
        node = node.left;
      } else {
        node = node.right;
      }
    }
    
    const newNode = RedBlackAlgorithm.createNode(
      value, 
      RedBlackAlgorithm.COLOR.RED, 
      null, 
      null, 
      parent
    );
    
    if (value < parent.value) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }
    
    // Here we would normally call fixInsert(newNode)
    // But for simplicity, we'll just return the tree
    
    return root;
  },

  search: (root, value) => {
    if (!root) return false;
    if (root.value === value) return true;
    if (value < root.value) return RedBlackAlgorithm.search(root.left, value);
    return RedBlackAlgorithm.search(root.right, value);
  },

  // Similar traversal methods as AVL
  inorder: AVLAlgorithm.inorder,
  preorder: AVLAlgorithm.preorder,
  postorder: AVLAlgorithm.postorder,
  levelOrder: AVLAlgorithm.levelOrder,

  createSampleTree: () => {
    // Create a sample Red-Black tree
    const root = RedBlackAlgorithm.createNode(13, RedBlackAlgorithm.COLOR.BLACK);
    root.left = RedBlackAlgorithm.createNode(8, RedBlackAlgorithm.COLOR.RED, null, null, root);
    root.right = RedBlackAlgorithm.createNode(17, RedBlackAlgorithm.COLOR.RED, null, null, root);
    
    root.left.left = RedBlackAlgorithm.createNode(1, RedBlackAlgorithm.COLOR.BLACK, null, null, root.left);
    root.left.right = RedBlackAlgorithm.createNode(11, RedBlackAlgorithm.COLOR.BLACK, null, null, root.left);
    
    root.right.left = RedBlackAlgorithm.createNode(15, RedBlackAlgorithm.COLOR.BLACK, null, null, root.right);
    root.right.right = RedBlackAlgorithm.createNode(25, RedBlackAlgorithm.COLOR.BLACK, null, null, root.right);
    
    root.right.right.left = RedBlackAlgorithm.createNode(22, RedBlackAlgorithm.COLOR.RED, null, null, root.right.right);
    
    return root;
  }
};
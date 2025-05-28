import React from 'react';
import { motion } from 'framer-motion';

const TreeFooter = () => {
  return (
    <motion.div 
      className="tree-footer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <p>
        <strong>Binary Search Tree (BST)</strong> is a special type of binary tree where the left child of a node contains a value less than the node's value, and the right child contains a value greater than the node's value.
      </p>
      <p>
        BSTs provide efficient operations for searching, insertion, and deletion with an average time complexity of O(log n).
      </p>
      <p>
        They are widely used in applications requiring fast lookups, insertions, and deletions like database indexing, priority queues, and more.
      </p>
    </motion.div>
  );
};

export default TreeFooter;

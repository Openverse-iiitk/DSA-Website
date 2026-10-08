// Block types for the algorithm builder
export const BLOCK_TYPES = {
  START: 'start',
  ASSIGN: 'assign', 
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
  INPUT: 'input',
  IF: 'if',
  WHILE: 'while',
  PRINT: 'print',
  STOP: 'stop'
};

// Block object structure with enhanced logic
export const createBlock = (type, value = '', children = []) => {
  const block = {
    id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    value,
    children,
    state: BLOCK_STATES.COMPLETE,
    groupId: null, // For tracking while loop groups
    branchType: null, // 'true', 'false', or null
    isPlaceholder: false,
    parentBlockId: null,
    level: 0
  };

  // For IF blocks, always initialize else branch
  if (type === BLOCK_TYPES.IF) {
    block.elseChildren = [];
    block.state = BLOCK_STATES.COMPLETE;
  }

  // For WHILE blocks, ensure proper loop structure
  if (type === BLOCK_TYPES.WHILE) {
    block.children = [];
    block.state = BLOCK_STATES.COMPLETE;
    block.groupId = `while_${Date.now()}`;
  }

  return block;
};

// Block states for tracking completion
export const BLOCK_STATES = {
  COMPLETE: 'complete',
  INCOMPLETE: 'incomplete',
  PENDING_ELSE: 'pending_else',
  PENDING_END: 'pending_end'
};

// Node shape mapping for flowchart visualization
export const NODE_SHAPES = {
  [BLOCK_TYPES.START]: 'circle',
  [BLOCK_TYPES.STOP]: 'circle',
  [BLOCK_TYPES.ASSIGN]: 'rectangle',
  [BLOCK_TYPES.INCREMENT]: 'rectangle',
  [BLOCK_TYPES.DECREMENT]: 'rectangle',
  [BLOCK_TYPES.INPUT]: 'rectangle',
  [BLOCK_TYPES.PRINT]: 'rectangle',
  [BLOCK_TYPES.IF]: 'diamond',
  [BLOCK_TYPES.WHILE]: 'diamond'
};

// Available block types for UI controls
export const AVAILABLE_BLOCKS = [
  { type: BLOCK_TYPES.START, label: 'Start', description: 'Algorithm start point', category: 'control' },
  { type: BLOCK_TYPES.ASSIGN, label: 'Assign', description: 'Variable assignment (x = 5)', category: 'operation' },
  { type: BLOCK_TYPES.INCREMENT, label: 'Increment', description: 'Increment variable (x++)', category: 'operation' },
  { type: BLOCK_TYPES.DECREMENT, label: 'Decrement', description: 'Decrement variable (x--)', category: 'operation' },
  { type: BLOCK_TYPES.INPUT, label: 'Input', description: 'Get user input', category: 'io' },
  { type: BLOCK_TYPES.PRINT, label: 'Print', description: 'Output statement', category: 'io' },
  { type: BLOCK_TYPES.IF, label: 'If Statement', description: 'Conditional with true/false branches', category: 'control' },
  { type: BLOCK_TYPES.WHILE, label: 'While Loop', description: 'Loop with condition', category: 'control' },
  { type: BLOCK_TYPES.STOP, label: 'Stop', description: 'Algorithm end point', category: 'control' }
];

// Block categories for organized UI
export const BLOCK_CATEGORIES = {
  control: { label: 'Control Flow', color: '#f59e0b' },
  operation: { label: 'Operations', color: '#3b82f6' },
  io: { label: 'Input/Output', color: '#8b5cf6' }
};

// Validation rules for block combinations
export const BLOCK_RULES = {
  [BLOCK_TYPES.START]: {
    maxCount: 1, // Only one START per main sequence
    requires: [],
    conflicts: []
  },
  [BLOCK_TYPES.STOP]: {
    maxCount: null, // Allow multiple STOP blocks in different branches
    requires: [], // Remove START requirement to allow STOP in branches
    conflicts: []
  },
  [BLOCK_TYPES.IF]: {
    canFollowDirectly: [BLOCK_TYPES.START, BLOCK_TYPES.ASSIGN, BLOCK_TYPES.INCREMENT, BLOCK_TYPES.DECREMENT, BLOCK_TYPES.INPUT, BLOCK_TYPES.PRINT],
    requiresCompletion: false
  },
  [BLOCK_TYPES.WHILE]: {
    canFollowDirectly: [BLOCK_TYPES.START, BLOCK_TYPES.ASSIGN, BLOCK_TYPES.INCREMENT, BLOCK_TYPES.DECREMENT, BLOCK_TYPES.INPUT, BLOCK_TYPES.PRINT],
    requiresCompletion: false
  },
  [BLOCK_TYPES.ASSIGN]: {
    maxCount: null,
    requires: [],
    conflicts: []
  },
  [BLOCK_TYPES.INCREMENT]: {
    maxCount: null,
    requires: [],
    conflicts: []
  },
  [BLOCK_TYPES.DECREMENT]: {
    maxCount: null,
    requires: [],
    conflicts: []
  },
  [BLOCK_TYPES.INPUT]: {
    maxCount: null,
    requires: [],
    conflicts: []
  },
  [BLOCK_TYPES.PRINT]: {
    maxCount: null,
    requires: [],
    conflicts: []
  }
};

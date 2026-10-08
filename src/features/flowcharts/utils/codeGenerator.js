import { BLOCK_TYPES } from '../types';

// C Code Generator with enhanced block support
export const generateCCode = (blocks) => {
  if (!blocks || blocks.length === 0) {
    return '// No blocks to generate code';
  }

  let code = '';
  let indentLevel = 0;
  const usedVariables = new Set();

  // Helper function to add indentation
  const indent = (level) => '    '.repeat(level);

  // Helper function to extract variables from expressions
  const extractVariables = (expression) => {
    if (!expression) {
      return;
    }
    const matches = expression.match(/[a-zA-Z_][a-zA-Z0-9_]*/g);
    if (matches) {
      matches.forEach(variable => {
        if (!['printf', 'scanf', 'int', 'float', 'char', 'double'].includes(variable)) {
          usedVariables.add(variable);
        }
      });
    }
  };

  // Pre-scan for variable declarations
  const scanForVariables = (blockList) => {
    blockList.forEach(block => {
      switch (block.type) {
        case BLOCK_TYPES.ASSIGN:
        case BLOCK_TYPES.INCREMENT:
        case BLOCK_TYPES.DECREMENT:
        case BLOCK_TYPES.INPUT:
          extractVariables(block.value);
          break;
        case BLOCK_TYPES.IF:
        case BLOCK_TYPES.WHILE:
          extractVariables(block.value);
          break;
      }
      if (block.children) {
        scanForVariables(block.children);
      }
      if (block.elseChildren) {
        scanForVariables(block.elseChildren);
      }
    });
  };

  scanForVariables(blocks);

  // Add variable declarations
  if (usedVariables.size > 0) {
    code += 'int ' + Array.from(usedVariables).join(', ') + ';\n';
  }

  // Generate code for each block with enhanced logic
  const generateBlockCode = (blockList, level = 0) => {
    for (let i = 0; i < blockList.length; i++) {
      const block = blockList[i];
      
      switch (block.type) {
        case BLOCK_TYPES.START:
          // Start block doesn't generate code
          break;
        
        case BLOCK_TYPES.ASSIGN:
          code += indent(level) + block.value + ';\n';
          break;
        
        case BLOCK_TYPES.INCREMENT:
          code += indent(level) + `${block.value}++;\n`;
          break;
        
        case BLOCK_TYPES.DECREMENT:
          code += indent(level) + `${block.value}--;\n`;
          break;
        
        case BLOCK_TYPES.INPUT:
          code += indent(level) + `scanf("%d", &${block.value});\n`;
          break;
        
        case BLOCK_TYPES.IF:
          code += indent(level) + `if (${block.value}) {\n`;
          if (block.children && block.children.length > 0) {
            generateBlockCode(block.children, level + 1);
          }
          code += indent(level) + '}';
          
          // Handle else branch
          if (block.elseChildren && block.elseChildren.length > 0) {
            code += ' else {\n';
            generateBlockCode(block.elseChildren, level + 1);
            code += indent(level) + '}';
          }
          code += '\n';
          break;
        
        case BLOCK_TYPES.WHILE:
          code += indent(level) + `while (${block.value}) {\n`;
          if (block.children && block.children.length > 0) {
            generateBlockCode(block.children, level + 1);
          }
          code += indent(level) + '}\n';
          break;
        
        case BLOCK_TYPES.PRINT:
          {
          // Handle different print formats
          let printValue = block.value;
          if (usedVariables.has(printValue)) {
            code += indent(level) + `printf("%d\\n", ${printValue});\n`;
          } else if (printValue.includes('"')) {
            code += indent(level) + `printf(${printValue});\n`;
          } else {
            code += indent(level) + `printf("${printValue}\\n");\n`;
          }
          break;
          }
        
        case BLOCK_TYPES.ELSE:
        case BLOCK_TYPES.END_IF:
        case BLOCK_TYPES.END_WHILE:
          // These are handled by their parent blocks
          break;
        
        case BLOCK_TYPES.STOP:
          // Stop block doesn't generate code
          break;
        
        default:
          break;
      }
    }
  };

  generateBlockCode(blocks, indentLevel);
  
  return code.trim();
};

// Enhanced Pseudocode Generator
export const generatePseudocode = (blocks) => {
  if (!blocks || blocks.length === 0) {
    return '// No blocks to generate pseudocode';
  }

  let pseudocode = '';
  let indentLevel = 0;

  // Helper function to add indentation
  const indent = (level) => '    '.repeat(level);

  // Generate pseudocode for each block with enhanced logic
  const generateBlockPseudocode = (blockList, level = 0) => {
    for (let i = 0; i < blockList.length; i++) {
      const block = blockList[i];
      
      switch (block.type) {
        case BLOCK_TYPES.START:
          pseudocode += indent(level) + 'START\n';
          break;
        
        case BLOCK_TYPES.ASSIGN:
          pseudocode += indent(level) + `SET ${block.value}\n`;
          break;
        
        case BLOCK_TYPES.INCREMENT:
          pseudocode += indent(level) + `INCREMENT ${block.value}\n`;
          break;
        
        case BLOCK_TYPES.DECREMENT:
          pseudocode += indent(level) + `DECREMENT ${block.value}\n`;
          break;
        
        case BLOCK_TYPES.INPUT:
          pseudocode += indent(level) + `INPUT ${block.value}\n`;
          break;
        
        case BLOCK_TYPES.IF:
          pseudocode += indent(level) + `IF ${block.value} THEN\n`;
          if (block.children && block.children.length > 0) {
            generateBlockPseudocode(block.children, level + 1);
          }
          if (block.elseChildren && block.elseChildren.length > 0) {
            pseudocode += indent(level) + 'ELSE\n';
            generateBlockPseudocode(block.elseChildren, level + 1);
          }
          pseudocode += indent(level) + 'ENDIF\n';
          break;
        
        case BLOCK_TYPES.WHILE:
          pseudocode += indent(level) + `WHILE ${block.value} DO\n`;
          if (block.children && block.children.length > 0) {
            generateBlockPseudocode(block.children, level + 1);
          }
          pseudocode += indent(level) + 'ENDWHILE\n';
          break;
        
        case BLOCK_TYPES.PRINT:
          pseudocode += indent(level) + `OUTPUT ${block.value}\n`;
          break;
        
        case BLOCK_TYPES.ELSE:
        case BLOCK_TYPES.END_IF:
        case BLOCK_TYPES.END_WHILE:
          // These are handled by their parent blocks
          break;
        
        case BLOCK_TYPES.STOP:
          pseudocode += indent(level) + 'STOP\n';
          break;
        
        default:
          break;
      }
    }
  };

  generateBlockPseudocode(blocks, indentLevel);
  
  return pseudocode.trim();
};

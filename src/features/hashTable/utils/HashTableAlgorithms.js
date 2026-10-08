// HashTableAlgorithms.js - Hash Table algorithms and utilities

class HashTable {
  constructor(size = 11) {
    this.size = size;
    this.table = new Array(size).fill(null);
    this.animationSteps = [];
    this.currentHashFunction = 'division';
    this.currentCollisionMethod = 'linear';
  }

  // Hash Functions
  divisionMethod(key) {
    return key % this.size;
  }

  midSquareMethod(key) {
    const squared = key * key;
    const squaredStr = squared.toString();
    const mid = Math.floor(squaredStr.length / 2);
    
    // Extract middle digits
    let extracted = '';
    if (squaredStr.length === 1) {
      extracted = squaredStr;
    } else if (squaredStr.length === 2) {
      extracted = squaredStr;
    } else {
      const start = Math.max(0, mid - 1);
      const end = Math.min(squaredStr.length, mid + 2);
      extracted = squaredStr.substring(start, end);
    }
    
    return parseInt(extracted) % this.size;
  }

  foldingMethod(key) {
    const keyStr = key.toString();
    let sum = 0;
    
    // Split into groups of 2 digits and sum them
    for (let i = 0; i < keyStr.length; i += 2) {
      const group = keyStr.substring(i, i + 2);
      sum += parseInt(group);
    }
    
    return sum % this.size;
  }

  // Get hash value based on current hash function
  hash(key) {
    switch (this.currentHashFunction) {
      case 'division':
        return this.divisionMethod(key);
      case 'midSquare':
        return this.midSquareMethod(key);
      case 'folding':
        return this.foldingMethod(key);
      default:
        return this.divisionMethod(key);
    }
  }

  // Secondary hash function for double hashing
  hash2(key) {
    return 7 - (key % 7); // Common choice: prime smaller than table size
  }

  // Collision Resolution Methods
  linearProbe(hash, attempt) {
    return (hash + attempt) % this.size;
  }

  quadraticProbe(hash, attempt) {
    return (hash + attempt * attempt) % this.size;
  }

  doubleHashProbe(hash, attempt, key) {
    return (hash + attempt * this.hash2(key)) % this.size;
  }

  // Get next probe position
  getProbePosition(hash, attempt, key) {
    switch (this.currentCollisionMethod) {
      case 'linear':
        return this.linearProbe(hash, attempt, key);
      case 'quadratic':
        return this.quadraticProbe(hash, attempt, key);
      case 'double':
        return this.doubleHashProbe(hash, attempt, key);
      default:
        return this.linearProbe(hash, attempt, key);
    }
  }

  // Insert with animation steps
  insert(key, value = null) {
    this.animationSteps = [];
    const displayValue = value || key;
    
    // Step 1: Calculate initial hash
    const initialHash = this.hash(key);
    this.animationSteps.push({
      type: 'hash_calculation',
      key: key,
      hash: initialHash,
      method: this.currentHashFunction,
      description: `Computing hash for key ${key} using ${this.getHashMethodName()}: ${this.getHashCalculationDetails(key, initialHash)}`
    });

    let attempt = 0;
    let position = initialHash;
    
    // Step 2: Try to insert
    while (attempt < this.size) {
      if (attempt > 0) {
        position = this.getProbePosition(initialHash, attempt, key);
        this.animationSteps.push({
          type: 'collision_resolution',
          key: key,
          position: position,
          attempt: attempt,
          method: this.currentCollisionMethod,
          description: `Collision detected! Using ${this.getCollisionMethodName()}: attempt ${attempt}, new position = ${position}`
        });
      }

      this.animationSteps.push({
        type: 'check_position',
        key: key,
        position: position,
        attempt: attempt,
        isEmpty: this.table[position] === null,
        description: `Checking position ${position}: ${this.table[position] === null ? 'empty' : 'occupied by ' + this.table[position]}`
      });

      if (this.table[position] === null) {
        // Found empty slot
        this.table[position] = displayValue;
        this.animationSteps.push({
          type: 'insert_success',
          key: key,
          position: position,
          value: displayValue,
          attempt: attempt,
          description: `Successfully inserted ${key} at position ${position} after ${attempt} probes`
        });
        return this.animationSteps;
      } else if (this.table[position] === displayValue) {
        // Key already exists
        this.animationSteps.push({
          type: 'duplicate_key',
          key: key,
          position: position,
          description: `Key ${key} already exists at position ${position}`
        });
        return this.animationSteps;
      }

      attempt++;
    }

    // Table is full
    this.animationSteps.push({
      type: 'table_full',
      key: key,
      description: `Cannot insert ${key}: Hash table is full`
    });
    return this.animationSteps;
  }

  // Search with animation steps
  search(key) {
    this.animationSteps = [];
    
    // Step 1: Calculate initial hash
    const initialHash = this.hash(key);
    this.animationSteps.push({
      type: 'hash_calculation',
      key: key,
      hash: initialHash,
      method: this.currentHashFunction,
      description: `Computing hash for key ${key} using ${this.getHashMethodName()}: ${this.getHashCalculationDetails(key, initialHash)}`
    });

    let attempt = 0;
    let position = initialHash;
    
    // Step 2: Search
    while (attempt < this.size) {
      if (attempt > 0) {
        position = this.getProbePosition(initialHash, attempt, key);
        this.animationSteps.push({
          type: 'collision_resolution',
          key: key,
          position: position,
          attempt: attempt,
          method: this.currentCollisionMethod,
          description: `Key not at expected position. Using ${this.getCollisionMethodName()}: attempt ${attempt}, checking position = ${position}`
        });
      }

      this.animationSteps.push({
        type: 'check_position',
        key: key,
        position: position,
        attempt: attempt,
        isEmpty: this.table[position] === null,
        isMatch: this.table[position] == key,
        description: `Checking position ${position}: ${this.table[position] === null ? 'empty' : this.table[position] == key ? 'found!' : 'contains ' + this.table[position]}`
      });

      if (this.table[position] === null) {
        // Empty slot found - key doesn't exist
        this.animationSteps.push({
          type: 'search_not_found',
          key: key,
          position: position,
          description: `Key ${key} not found: reached empty slot at position ${position}`
        });
        return { found: false, steps: this.animationSteps };
      } else if (this.table[position] == key) {
        // Key found
        this.animationSteps.push({
          type: 'search_found',
          key: key,
          position: position,
          attempt: attempt,
          description: `Key ${key} found at position ${position} after ${attempt} probes`
        });
        return { found: true, steps: this.animationSteps, position: position };
      }

      attempt++;
    }

    // Searched entire table
    this.animationSteps.push({
      type: 'search_not_found',
      key: key,
      description: `Key ${key} not found: searched entire table`
    });
    return { found: false, steps: this.animationSteps };
  }

  // Delete with animation steps
  delete(key) {
    this.animationSteps = [];
    const searchResult = this.search(key);
    
    if (searchResult.found) {
      const position = searchResult.position;
      this.table[position] = null;
      this.animationSteps.push({
        type: 'delete_success',
        key: key,
        position: position,
        description: `Successfully deleted key ${key} from position ${position}`
      });
    }
    
    return this.animationSteps;
  }

  // Helper methods for descriptions
  getHashMethodName() {
    switch (this.currentHashFunction) {
      case 'division': return 'Division Method';
      case 'midSquare': return 'Mid Square Method';
      case 'folding': return 'Folding Method';
      default: return 'Division Method';
    }
  }

  getCollisionMethodName() {
    switch (this.currentCollisionMethod) {
      case 'linear': return 'Linear Probing';
      case 'quadratic': return 'Quadratic Probing';
      case 'double': return 'Double Hashing';
      default: return 'Linear Probing';
    }
  }

  getHashCalculationDetails(key, result) {
    switch (this.currentHashFunction) {
      case 'division':
        return `${key} % ${this.size} = ${result}`;
      case 'midSquare':
        {
        const squared = key * key;
        return `${key}² = ${squared}, extract middle → ${result}`;
        }
      case 'folding':
        {
        const keyStr = key.toString();
        let parts = [];
        for (let i = 0; i < keyStr.length; i += 2) {
          parts.push(keyStr.substring(i, i + 2));
        }
        return `fold(${parts.join('+')}) % ${this.size} = ${result}`;
        }
      default:
        return `${key} % ${this.size} = ${result}`;
    }
  }

  // Clear table
  clear() {
    this.table = new Array(this.size).fill(null);
    this.animationSteps = [];
  }

  // Resize table
  resize(newSize) {
    const oldTable = [...this.table];
    this.size = newSize;
    this.table = new Array(newSize).fill(null);
    return oldTable;
  }

  // Get table state
  getTableState() {
    return this.table.map((value, index) => ({
      index,
      value,
      isEmpty: value === null
    }));
  }

  // Get load factor
  getLoadFactor() {
    const occupied = this.table.filter(slot => slot !== null).length;
    return (occupied / this.size * 100).toFixed(1);
  }

  // Set hash function
  setHashFunction(method) {
    this.currentHashFunction = method;
  }

  // Set collision resolution method
  setCollisionMethod(method) {
    this.currentCollisionMethod = method;
  }
}

export default HashTable;

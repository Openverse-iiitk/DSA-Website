/**
 * Klee's Algorithm Implementation
 * 
 * This module contains the core logic for Klee's algorithm to find
 * the length of the union of line segments.
 */

/**
 * Represents an event point in the sweep line algorithm
 */
export class EventPoint {
  constructor(x, type, segmentId) {
    this.x = x;              // x-coordinate of the event
    this.type = type;        // 'start' or 'end'
    this.segmentId = segmentId; // reference to the segment
  }
}

/**
 * Represents a line segment
 */
export class LineSegment {
  constructor(id, start, end, y) {
    this.id = id;
    this.start = Math.min(start, end); // ensure start <= end
    this.end = Math.max(start, end);
    this.y = y;
    this.length = this.end - this.start;
  }
}

/**
 * Main Klee's Algorithm implementation
 */
export class KleeAlgorithm {
  constructor(segments) {
    this.segments = segments;
    this.events = [];
    this.totalLength = 0;
    this.animationSteps = [];
    this.activeSegments = new Set();
  }

  /**
   * Generate all event points from segments
   */
  generateEvents() {
    this.events = [];
    
    this.segments.forEach(segment => {
      this.events.push(new EventPoint(segment.start, 'start', segment.id));
      this.events.push(new EventPoint(segment.end, 'end', segment.id));
    });

    // Sort events by x-coordinate, with 'start' events before 'end' events at same x
    this.events.sort((a, b) => {
      if (a.x !== b.x) {
        return a.x - b.x;
      }
      // If same x-coordinate, process 'start' events before 'end' events
      if (a.type === 'start' && b.type === 'end') {
        return -1;
      }
      if (a.type === 'end' && b.type === 'start') {
        return 1;
      }
      return 0;
    });

    return this.events;
  }

  /**
   * Generate animation steps for visualization
   */
  generateAnimationSteps() {
    this.animationSteps = [];
    this.activeSegments.clear();
    this.totalLength = 0;

    let currentX = null;
    let unionIntervals = [];

    // Sort events first
    this.generateEvents();

    this.events.forEach((event) => {
      // If we have active segments and moved to a new x-coordinate, 
      // add the length of the covered interval
      if (this.activeSegments.size > 0 && currentX !== null && event.x > currentX) {
        const intervalLength = event.x - currentX;
        this.totalLength += intervalLength;
        
        // Add this interval to our union tracking
        unionIntervals.push({
          start: currentX,
          end: event.x,
          length: intervalLength
        });
      }

      currentX = event.x;

      // Create animation step before processing the event
      const stepBefore = {
        type: 'sweep_to',
        x: event.x,
        activeSegments: new Set(this.activeSegments),
        totalLength: this.totalLength,
        event: event,
        unionIntervals: [...unionIntervals],
        message: `🔍 Sweep line moves to x = ${event.x.toFixed(1)}`,
        explanation: this.activeSegments.size > 0 
          ? `Currently covering ${this.activeSegments.size} segment(s). Union length so far: ${this.totalLength.toFixed(1)}`
          : 'No segments are currently active.'
      };
      this.animationSteps.push(stepBefore);

      // Process the event
      if (event.type === 'start') {
        const wasEmpty = this.activeSegments.size === 0;
        this.activeSegments.add(event.segmentId);

        const stepAfter = {
          type: 'process_event',
          x: event.x,
          activeSegments: new Set(this.activeSegments),
          totalLength: this.totalLength,
          event: event,
          unionIntervals: [...unionIntervals],
          message: `▶️ Started segment S${event.segmentId}`,
          explanation: wasEmpty 
            ? `🎯 First active segment! Starting to track union from x = ${event.x.toFixed(1)}`
            : `📈 Added to existing coverage. ${this.activeSegments.size} segments now active.`
        };
        this.animationSteps.push(stepAfter);
        
      } else {
        this.activeSegments.delete(event.segmentId);
        const nowEmpty = this.activeSegments.size === 0;

        const stepAfter = {
          type: 'process_event',
          x: event.x,
          activeSegments: new Set(this.activeSegments),
          totalLength: this.totalLength,
          event: event,
          unionIntervals: [...unionIntervals],
          message: `⏹️ Ended segment S${event.segmentId}`,
          explanation: nowEmpty
            ? `🏁 No more active segments. Union interval complete!`
            : `📉 Still ${this.activeSegments.size} segment(s) active, continuing coverage.`
        };
        this.animationSteps.push(stepAfter);
      }
    });

    // Final step showing completion
    this.animationSteps.push({
      type: 'complete',
      x: currentX,
      activeSegments: new Set(),
      totalLength: this.totalLength,
      unionIntervals: [...unionIntervals],
      message: `✅ Algorithm Complete!`,
      explanation: `Found ${unionIntervals.length} union interval(s) with total length: ${this.totalLength.toFixed(1)}`
    });

    return this.animationSteps;
  }

  /**
   * Calculate the total length of union (final result)
   */
  calculateTotalLength() {
    this.generateEvents();
    
    let totalLength = 0;
    const activeSegments = new Set();
    let lastActiveStart = null;

    this.events.forEach(event => {
      if (event.type === 'start') {
        if (activeSegments.size === 0) {
          lastActiveStart = event.x;
        }
        activeSegments.add(event.segmentId);
      } else {
        activeSegments.delete(event.segmentId);
        if (activeSegments.size === 0 && lastActiveStart !== null) {
          totalLength += event.x - lastActiveStart;
          lastActiveStart = null;
        }
      }
    });

    this.totalLength = totalLength;
    return totalLength;
  }

  /**
   * Get segments that should be highlighted at a given x position
   */
  getActiveSegmentsAtX(x) {
    return this.segments.filter(segment => 
      segment.start <= x && x <= segment.end
    );
  }

  /**
   * Validate segments (ensure they have positive length)
   */
  static validateSegments(segments) {
    return segments.filter(segment => segment.start !== segment.end);
  }
}

/**
 * Utility functions for segment operations
 */
export const SegmentUtils = {
  /**
   * Generate random segments for demo purposes
   */
  generateRandomSegments(count = 5, minX = 50, maxX = 750, y = 200) {
    const segments = [];
    
    for (let i = 0; i < count; i++) {
      const start = Math.random() * (maxX - minX - 100) + minX;
      const length = Math.random() * 150 + 50; // Random length between 50-200
      const end = start + length;
      
      segments.push(new LineSegment(i, start, end, y));
    }
    
    return segments;
  },

  /**
   * Convert canvas coordinates to algorithm coordinates
   */
  canvasToAlgorithm(canvasX, canvasWidth, algorithmMin = 0, algorithmMax = 800) {
    return (canvasX / canvasWidth) * (algorithmMax - algorithmMin) + algorithmMin;
  },

  /**
   * Convert algorithm coordinates to canvas coordinates
   */
  algorithmToCanvas(algorithmX, canvasWidth, algorithmMin = 0, algorithmMax = 800) {
    return ((algorithmX - algorithmMin) / (algorithmMax - algorithmMin)) * canvasWidth;
  },

  /**
   * Format number for display
   */
  formatNumber(num, decimals = 1) {
    return Number(num).toFixed(decimals);
  }
};

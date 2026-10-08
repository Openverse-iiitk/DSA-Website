import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateArithmeticExpression } from '../src/features/flowcharts/utils/arithmeticExpression.js';

test('evaluates arithmetic with precedence, parentheses, decimals, and unary signs', () => {
  assert.equal(evaluateArithmeticExpression('2 + 3 * 4'), 14);
  assert.equal(evaluateArithmeticExpression('(2 + 3) * 4'), 20);
  assert.equal(evaluateArithmeticExpression('-2.5 + +4'), 1.5);
});

test('rejects malformed expressions and JavaScript input', () => {
  for (const expression of ['2 +', '(2 * 3', '2 ** 3', '1 / 0', 'globalThis.alert(1)']) {
    assert.throws(() => evaluateArithmeticExpression(expression), expression);
  }
});

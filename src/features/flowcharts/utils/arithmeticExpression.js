export const evaluateArithmeticExpression = (expression) => {
  const tokens = expression.match(/\d+(?:\.\d+)?|[()+\-*/]/g) || [];
  if (tokens.join('') !== expression.replace(/\s/g, '')) {
    throw new Error('Unsupported arithmetic expression');
  }

  let index = 0;
  const parsePrimary = () => {
    const token = tokens[index++];
    if (token === '+' || token === '-') {
      const value = parsePrimary();
      return token === '-' ? -value : value;
    }
    if (token === '(') {
      const value = parseSum();
      if (tokens[index++] !== ')') throw new Error('Unclosed parenthesis');
      return value;
    }
    if (token === undefined || token === ')') {
      throw new Error('Expected a number');
    }
    return Number(token);
  };

  const parseProduct = () => {
    let value = parsePrimary();
    while (tokens[index] === '*' || tokens[index] === '/') {
      const operator = tokens[index++];
      const right = parsePrimary();
      value = operator === '*' ? value * right : value / right;
    }
    return value;
  };

  const parseSum = () => {
    let value = parseProduct();
    while (tokens[index] === '+' || tokens[index] === '-') {
      const operator = tokens[index++];
      const right = parseProduct();
      value = operator === '+' ? value + right : value - right;
    }
    return value;
  };

  const result = parseSum();
  if (index !== tokens.length || !Number.isFinite(result)) {
    throw new Error('Invalid arithmetic expression');
  }
  return result;
};

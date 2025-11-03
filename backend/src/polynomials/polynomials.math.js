import { parse, evaluate } from 'mathjs';

export function calcularGrado(expresion) {
  try {
    const node = parse(expresion);
    let maxExp = 0;
    node.traverse((n) => {
      if (n.isSymbolNode && n.name === 'x') {
        maxExp = Math.max(maxExp, 1);
      }
      if (n.isOperatorNode && n.op === '^') {
        const [base, exp] = n.args;
        if (base?.isSymbolNode && base.name === 'x' && exp?.isConstantNode) {
          const val = Number(exp.value);
          if (!Number.isNaN(val)) maxExp = Math.max(maxExp, val);
        }
      }
    });
    return maxExp;
  } catch (e) {
    throw new Error('Expresión inválida');
  }
}

export function generarPuntos(expresion, { xMin = -10, xMax = 10, paso = 0.5 } = {}) {
  if (!(xMax > xMin)) throw new Error('El rango es inválido');
  const puntos = [];
  for (let x = xMin; x <= xMax + 1e-12; x = Number((x + paso).toFixed(12))) {
    const y = evaluate(expresion, { x });
    if (Number.isFinite(y)) {
      puntos.push({ x: Number(x.toFixed(6)), y: Number(Number(y).toFixed(6)) });
    } else {
      puntos.push({ x: Number(x.toFixed(6)), y: null });
    }
  }
  return puntos;
}

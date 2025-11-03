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

export function generarPuntos(expresion, { xMin = -10, xMax = 10, paso } = {}) {
  if (!(xMax > xMin)) throw new Error('El rango es inválido');
  // Objetivo: curvas suaves por defecto con muchos puntos, pero sin exceder límites
  const span = xMax - xMin;
  const minPts = 2000;   // mínimo recomendado de puntos para suavidad
  const maxPts = 10000;  // techo de seguridad para rendimiento y tamaño de respuesta

  // Si no llega `paso`, calcula uno para ~4000 puntos (entre min y max)
  const pasoProvided = Number(paso) > 0;
  let step = pasoProvided ? Number(paso) : span / 4000;

  // Si el paso lo define el usuario, respetarlo salvo que genere demasiados puntos (cap superior)
  // Si no lo define, asegurar al menos minPts y como máximo maxPts
  let estimated = Math.ceil(span / step) + 1;
  if (!pasoProvided && estimated < minPts) {
    step = span / minPts;
    estimated = minPts;
  }
  if (estimated > maxPts) {
    step = span / maxPts;
  }
  const puntos = [];
  for (let x = xMin; x <= xMax + 1e-12; x = Number((x + step).toFixed(12))) {
    const y = evaluate(expresion, { x });
    if (Number.isFinite(y)) {
      puntos.push({ x: Number(x.toFixed(6)), y: Number(Number(y).toFixed(6)) });
    } else {
      puntos.push({ x: Number(x.toFixed(6)), y: null });
    }
  }
  return puntos;
}

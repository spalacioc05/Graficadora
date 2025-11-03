import { calcularGrado, generarPuntos } from './polynomials.math';

describe('polynomials.math', () => {
  it('calcula grado correctamente', () => {
    expect(calcularGrado('x^3 + 2*x + 1')).toBe(3);
    expect(calcularGrado('5')).toBe(0);
    expect(calcularGrado('x*x + x')).toBe(1); // sin potencia explícita, detecta presencia de x
  });

  it('genera puntos en el rango', () => {
    const puntos = generarPuntos('x^2', { xMin: -1, xMax: 1, paso: 1 });
    expect(puntos).toEqual([
      { x: -1, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]);
  });

  it('lanza error en rango inválido', () => {
    expect(() => generarPuntos('x', { xMin: 5, xMax: 1 })).toThrow();
  });
});

import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock Plotly to avoid canvas and URL APIs in JSDOM
vi.mock('react-plotly.js', () => ({ default: () => null }));

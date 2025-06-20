// Documents have dimension in real physiscal metrics

// We store all dimension in a base unit and display it in a user selected unit
// the base unit is a tenth of a milimeter
export const UNITS_PER_MM = 10;

export const units = {
  mm: { title: "mm", factor: 1 * UNITS_PER_MM, precision: 1 },
  cm: { title: "cm", factor: 10 * UNITS_PER_MM, precision: 2 },
  in: { title: "inch", factor: 25.4 * UNITS_PER_MM, precision: 2 },
};

export const baseToUnit = (value, unit) => {
  const precision = 10 ** units[unit].precision;
  return Math.round((value / units[unit].factor) * precision) / precision;
};

export const unitToBase = (value, unit) => {
  return Math.round(value * units[unit].factor);
};

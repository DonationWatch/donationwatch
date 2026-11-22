type Projection = {
  project: (point: [number, number]) => [number, number];
  unproject: (point: [number, number]) => [number, number];
};

export interface LambertConformalConicParams {
  phi1: number; // 1st standard parallel (degrees)
  phi2: number; // 2nd standard parallel (degrees)
  phi0: number; // latitude of origin (degrees)
  lambda0: number; // central meridian (degrees)
  R?: number; // Earth radius in meters (optional)
}

const deg2rad = (deg: number): number => (deg * Math.PI) / 180;
const rad2deg = (rad: number): number => (rad * 180) / Math.PI;

export function createLambertConformalConicProjection({
  phi1,
  phi2,
  phi0,
  lambda0,
  R = 6371000,
}: LambertConformalConicParams): Projection {
  // Convert parameters to radians
  const phi1Rad = deg2rad(phi1);
  const phi2Rad = deg2rad(phi2);
  const phi0Rad = deg2rad(phi0);
  const lambda0Rad = deg2rad(lambda0);

  // Precompute constants
  const n =
    Math.log(Math.cos(phi1Rad) / Math.cos(phi2Rad)) /
    Math.log(
      Math.tan(Math.PI / 4 + phi2Rad / 2) / Math.tan(Math.PI / 4 + phi1Rad / 2),
    );
  const F =
    (Math.cos(phi1Rad) * Math.pow(Math.tan(Math.PI / 4 + phi1Rad / 2), n)) / n;
  const rho0 = (R * F) / Math.pow(Math.tan(Math.PI / 4 + phi0Rad / 2), n);

  return {
    project: (point: [number, number]): [number, number] => {
      const [lon, lat] = point;
      const lambda = deg2rad(lon);
      const phi = deg2rad(lat);
      const rho = (R * F) / Math.pow(Math.tan(Math.PI / 4 + phi / 2), n);
      const theta = n * (lambda - lambda0Rad);
      return [
        rho * Math.sin(theta),
        // Invert y-axis
        -(rho0 - rho * Math.cos(theta)),
      ];
    },
    unproject: (point: [number, number]): [number, number] => {
      const [x, y] = point;
      // Invert y-axis
      const yInverted = -y;
      const rho = Math.sign(n) * Math.sqrt(x * x + yInverted * yInverted);
      const theta = Math.atan2(x, yInverted);
      const phi = 2 * Math.atan(Math.pow((R * F) / rho, 1 / n)) - Math.PI / 2;
      const lambda = lambda0Rad + theta / n;
      return [rad2deg(lambda), rad2deg(phi)];
    },
  };
}

// Empty stub file to prevent bundling unused packages on Cloudflare Workers
export class Pool {
  constructor() {
    console.warn("pg stub: Pool constructor called");
  }
}

export function createPool() {
  console.warn("mysql2 stub: createPool called");
  return {};
}

export default {};

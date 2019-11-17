class KabutoError extends Error {
  constructor(message: any) {
    const msg = `[Kabuto:error] ${message}`;
    super(msg);
  }
}

export default KabutoError;

import { IFeatureFlagProvider } from "./IFeatureFlagProvider";

export class InMemoryFeatureFlagProvider implements IFeatureFlagProvider {
  private flags: Map<string, boolean>;

  constructor(initialFlags?: Record<string, boolean>) {
    this.flags = new Map(Object.entries(initialFlags || {}));
  }

  isEnabled(featureName: string, _context?: unknown): boolean {
    return this.flags.get(featureName) ?? false;
  }

  // Apenas para uso interno/admin no MVP
  setFlag(featureName: string, enabled: boolean) {
    this.flags.set(featureName, enabled);
  }
}

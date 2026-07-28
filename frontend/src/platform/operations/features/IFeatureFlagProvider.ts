export interface IFeatureFlagProvider {
  isEnabled(featureName: string, context?: unknown): Promise<boolean> | boolean;
}

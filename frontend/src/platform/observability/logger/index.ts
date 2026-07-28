import { ConsoleLogger } from "./ConsoleLogger";
import { ILogger } from "./ILogger";

export * from "./ILogger";
export * from "./MaskingService";

// Default instance exported for convenience
export const logger: ILogger = new ConsoleLogger();

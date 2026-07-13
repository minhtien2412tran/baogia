/** Schedule UI work outside the synchronous effect body (React Compiler lint). */
export function scheduleUi(fn: () => void): void {
  queueMicrotask(fn);
}

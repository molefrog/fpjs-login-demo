/**
 * A utility function that resolves after `ms` milliseconds.
 *
 * @param ms Wait time in milliseconds
 * @returns Promise<unknown>
 */
export function delay(ms: number): Promise<unknown> {
  return new Promise((resolve, _) => {
    setTimeout(resolve, ms)
  })
}

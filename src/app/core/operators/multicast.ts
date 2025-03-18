import { MonoTypeOperatorFunction, ReplaySubject, ShareConfig, share } from "rxjs";

/**
 * Customized share pipe operator to multicast an Observable.
 */
export function multicast<T>(options: ShareConfig<T> = {}): MonoTypeOperatorFunction<T> {
   return share({
      connector: options.connector ?? (() => new ReplaySubject<T>(1)),
      resetOnComplete: options.resetOnComplete ?? true,
      resetOnError: options.resetOnError ?? true,
      resetOnRefCountZero: options.resetOnRefCountZero ?? true
   });
}

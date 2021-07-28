import { FunctionalComponent, h, Fragment } from "preact";
import { useCallback } from "preact/compat";
import { useTimer } from "~/hooks/useTimer";
import { JSXInternal } from "preact/src/jsx";

export const App: FunctionalComponent = () => {
  const [
    { seconds },
    { start, stop, reset, setInitialSeconds }
  ] = useTimer();

  const handleChangeInitialSeconds = useCallback((e: JSXInternal.TargetedEvent<HTMLInputElement>) => {
    setInitialSeconds(Number(e.currentTarget.value));
  }, [setInitialSeconds]);

  return (
    <Fragment>
      <div>
        <input
          type="number"
          placeholder="initialSeconds"
          onInput={handleChangeInitialSeconds}
        />
      </div>
      <div>
        <div>
          {seconds}
        </div>
        <div>
          <button onClick={start}>start</button>
          <button onClick={stop}>stop</button>
          <button onClick={reset}>reset</button>
        </div>
      </div>
    </Fragment>
  )
}

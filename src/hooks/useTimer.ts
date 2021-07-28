import { useCallback, useEffect, useReducer } from "preact/hooks";
import { passedSeconds } from "~/utils/time";

type State = {
  startedDate: Date;
  currentDate: Date;
  timer?: NodeJS.Timer;
  initialSeconds: number;
  restSeconds: number;
}

const initialState: State = {
  startedDate: new Date(),
  currentDate: new Date(),
  initialSeconds: 0,
  restSeconds: 0,
}

type Action = {
  type: "START";
  payload: Pick<State, "timer">;
} | {
  type: "STOP";
} | {
  type: "RESET";
} | {
  type: "SET_CURRENT_DATE";
} | {
  type: "SET_INITIAL_SECONDS";
  payload: Pick<State, "initialSeconds">;
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
  case "START":
    return {
      ...state,
      ...action.payload,
      restSeconds: state.restSeconds - passedSeconds(state.startedDate, state.currentDate),
      startedDate: new Date(),
      currentDate: new Date()
    }
  case "STOP":
    return {
      ...state,
      timer: undefined
    }
  case "RESET":
    return {
      ...state,
      ...initialState,
      initialSeconds: state.initialSeconds,
      restSeconds: state.initialSeconds
    }
  case "SET_CURRENT_DATE":
    return {
      ...state,
      currentDate: new Date()
    }
  case "SET_INITIAL_SECONDS":
    return {
      ...state,
      ...action.payload,
      restSeconds: action.payload.initialSeconds
    }
  }
}

type Props = {
  initialSeconds?: number;
  onExpire?: () => void;
}

export const useTimer = ({
  initialSeconds = 0,
  onExpire
}: Props = {}) => {
  const[state, dispatch] = useReducer<State, Action>(reducer, {
    ...initialState,
    initialSeconds,
  });

  const startTimer = useCallback(
    () => setInterval(() => dispatch({ type: "SET_CURRENT_DATE" }), 100),
    []
  )

  const stop = useCallback(() => {
    if (!state.timer) {
      return;
    }

    clearInterval(state.timer);
    dispatch({ type: "STOP" });
  }, [state.timer]);

  const start = useCallback(() => {
    if (state.timer) {
      return;
    }

    const timer = startTimer();
    dispatch({ type: "START", payload: { timer }});
  }, [state.timer, startTimer]);

  const reset = useCallback(() => {
    if (state.timer) {
      return;
    }

    dispatch({ type: "RESET" });
  }, [state.timer]);

  const setInitialSeconds = useCallback((initialSeconds: number) => {
    dispatch({ type: "SET_INITIAL_SECONDS", payload: { initialSeconds }});
  }, []);

  useEffect(() => {
    if (state.timer && passedSeconds(state.startedDate, state.currentDate) >= state.restSeconds) {
      stop();
      onExpire && onExpire();
    }
  }, [state.timer, state.currentDate, state.startedDate, state.restSeconds, stop, onExpire]);

  return [{
    seconds: Math.ceil(state.restSeconds - passedSeconds(state.startedDate, state.currentDate)),
    isRunning: !!state.timer
  }, {
    start, stop, reset, setInitialSeconds
  }] as const;
}

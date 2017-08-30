const actionListeners = {};

export function addListener(name, handler) {
  if (!actionListeners[name]) {
    actionListeners[name] = [handler];
  } else {
    actionListeners[name].push(handler);
  }
  const len = actionListeners[name].length;
  let removed = false;
  return function removeListener(actionName) {
    if (removed) return;
    if (!(actionName in actionListeners)) return;
    actionListeners[actionName].splice(len - 1, 1);
    removed = true;
  };
}

export function removeAllListener(name) {
  delete actionListeners[name];
}

export function onAction(action) {
  const name = action.type;
  if (name in actionListeners) {
    const listeners = actionListeners[name];
    for (let i = 0; i < listeners.length; i++) {
      const ret = listeners[i](action);
      if (ret === false) return false;
    }
  }
}

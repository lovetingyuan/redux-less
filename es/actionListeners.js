var actionListeners = {};

export function addListener(name, handler) {
  if (!actionListeners[name]) {
    actionListeners[name] = [handler];
  } else {
    actionListeners[name].push(handler);
  }
  var len = actionListeners[name].length;
  var removed = false;
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
  var name = action.type;
  if (name in actionListeners) {
    var listeners = actionListeners[name];
    for (var i = 0; i < listeners.length; i++) {
      var ret = listeners[i](action);
      if (ret === false) return false;
    }
  }
}
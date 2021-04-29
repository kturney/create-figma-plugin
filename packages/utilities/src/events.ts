export type EventHandler = {
  name: string
  handler: (...args: any) => void
}

const eventHandlers: Record<string, EventHandler> = {}

let currentId = 0

/**
 * Registers an event `handler` for the given event `name`.
 *
 * @returns Returns a function for deregistering the `handler`.
 * @category Events
 */
export function on<E extends EventHandler>(
  name: E['name'],
  handler: E['handler']
): () => void {
  const id = `${currentId}`
  currentId += 1
  eventHandlers[id] = { handler, name }
  return function () {
    delete eventHandlers[id]
  }
}

/**
 * Registers an event `handler` that will run at most once for the given
 * event `name`.
 *
 * @returns Returns a function for deregistering the `handler`.
 * @category Events
 */
export function once<E extends EventHandler>(
  name: E['name'],
  handler: E['handler']
): () => void {
  let done = false
  return on(name, function (...args) {
    if (done === true) {
      return
    }
    done = true
    handler(...args)
  })
}

/**
 * Calling `emit` in the main context invokes the event handler for the
 * matching event `name` in your UI. Correspondingly, calling `emit` in your
 * UI invokes the event handler for the matching event `name` in the main
 * context.
 *
 * All `args` passed after `name` will be directly
 * [applied](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
 * on the event handler.
 *
 * @category Events
 */
export const emit =
  typeof window === 'undefined'
    ? function <E extends EventHandler>(
        name: E['name'],
        ...args: Parameters<E['handler']>
      ) {
        figma.ui.postMessage([name, ...args])
      }
    : function <E extends EventHandler>(
        name: E['name'],
        ...args: Parameters<E['handler']>
      ) {
        window.parent.postMessage(
          {
            pluginMessage: [name, ...args]
          },
          '*'
        )
      }

function invokeEventHandler(name: string, args: Array<unknown>) {
  for (const id in eventHandlers) {
    if (eventHandlers[id].name === name) {
      eventHandlers[id].handler.apply(null, args)
    }
  }
}

if (typeof window === 'undefined') {
  figma.ui.onmessage = function ([name, ...args]: [
    string,
    Array<unknown>
  ]): void {
    invokeEventHandler(name, args)
  }
} else {
  window.onmessage = function (event: MessageEvent): void {
    if (typeof event.data.pluginMessage === 'undefined') {
      return
    }
    const [name, ...args]: [string, Array<unknown>] = event.data.pluginMessage
    invokeEventHandler(name, args)
  }
}

export namespace Windows {
    export function proxyGlobalField<T = any>(
        name: string,
        options: {
            // onWrite可以修改写入的值
            onWrite: (value: T | undefined) => T | undefined,
            // onRead可以用来打断点...
            onRead?: (value: T | undefined) => void
        },
    ) {
        const _window = window as StringAnyObject
        const name_origin = `${name}_origin`
        _window[name_origin] = _window[name]
        let value: T | undefined = undefined
        Object.defineProperty(_window, name, {
            configurable: true,
            enumerable: true,
            get: () => {
                options?.onRead?.(value)
                return value
            },
            set: (val) => {
                value = options.onWrite(val)
            }
        })
        if (_window[name_origin]) {
            _window[name] = _window[name_origin]
        }
    }
}
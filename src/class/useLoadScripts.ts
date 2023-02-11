const loadScript = (script: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        let element: any = document.querySelector(`script[src='${script}']`)
        if (!element) {
            element = document.createElement('script')
            element.type = 'text/javascript'
            element.src = script
            element.async = true
        } else if (element.hasAttribute('data-loaded')) {
            resolve()
            return;
        }

        element.addEventListener('error', () => reject())
        element.addEventListener('abort', () => reject())
        element.addEventListener('load', () => {
            element.setAttribute('data-loaded', true)
            resolve();
        })

        document.head.appendChild(element);
    })
}
export default function useLoadScript(scripts: string[]) {
    return Promise.all(scripts.map(script => loadScript(script)));
}
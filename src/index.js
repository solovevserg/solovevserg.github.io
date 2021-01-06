import './styles/styles.scss'
import './scripts/load-script';

const scriptsLoadQueue = [
    [{
        src: 'https://cdn.jsdelivr.net/gh/cferdinandi/gumshoe@4.0.0/dist/gumshoe.polyfills.min.js',
        callback: () => {
            console.log('Done', Gumshoe)
        }
    }]
]

async function loadScript(src) {
    return new Promise((resolve, reject) => {
        const scriptElement = document.createElement('script')
        scriptElement.src = src;
        scriptElement.onload = resolve;
        scriptElement.onerror = reject;
        document.body.appendChild(scriptElement)
    })
}

async function loadScripts(queue) {
    for (const group of queue) {
            const promises = [];
            for (const script of group) {
                const promise = loadScript(script.src);
                promise.then(script.callback);
                promises.push(promise);
            }
        await Promise.all(promises);
    }
}

async function main() {
    loadScripts(scriptsLoadQueue)
}

main();
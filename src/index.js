import './styles/styles.scss'
import './scripts/load-script';

const scriptsLoadQueue = [
    [{
        src: 'https://cdn.jsdelivr.net/gh/cferdinandi/gumshoe@4.0.0/dist/gumshoe.polyfills.min.js',
        callback: () => {
            var spy = new Gumshoe('aside a');
            console.log(spy);
            document.addEventListener('gumshoeActivate', function (event) {

                const link = event.detail.link;
                console.log(link);

                const isDark = link && ['#welcome', '#skills'].some(anchor => link.hash.includes(anchor));
                document.body.classList.toggle('dark', isDark)

            }, false);
        },
    },
    {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/d3/5.0.0/d3.min.js',
        callback: () => {

            // Code inspired by Michael Freeman
            // https://observablehq.com/@mkfreeman/creating-generative-art
            
            function startCircles(selector) {

                const colorScale = d3.interpolateRgb("#C58BFE", "#63F6FF")

                function generateAnimatedCircles(container, numCircles) {
                    container.selectAll("circles")
                        .data(d3.range(numCircles))
                        .enter()
                        .append("circle")
                        .attr("cx", (d) => Math.random() * 50 + 50 + '%')
                        .attr("cy", (d) => Math.random() * 100 + '%')
                        .attr("r", 0)
                        .attr("fill", d => colorScale(Math.random()))
                        .transition()
                        .duration(2000)
                        .delay((d) => Math.random() * 5000)
                        .attr("r", (d) => Math.random() * 50)
                }

                const svg = d3.select(selector);
                const g = svg.append("g").attr("transform", "translate(50, 50)")
                generateAnimatedCircles(g, 3)
                setInterval(function () {
                    g.selectAll("circle")
                        .data([])
                        .exit()
                        .transition()
                        .delay((d) => Math.random() * 5000)
                        .duration(2000)
                        .style("opacity", 0)
                        .remove()
                    generateAnimatedCircles(g, 3)
                }, 2000)
            }
            startCircles('.geometry-front-layer svg')
            startCircles('.geometry-back-layer svg')

        }
    }
    ]
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


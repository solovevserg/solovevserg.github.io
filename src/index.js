import './styles/styles.scss'
import './scripts/load-script';


function startDrawingCircles() {

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

function buildGraph(skillsTree, graph = { nodes: [], links: [] }, deep = 1) {
    graph.nodes.push({ size: 3 + 8 / deep, ...skillsTree });
    for (const child of skillsTree.children || []) {
        graph.links.push({
            source: skillsTree.name,
            target: child.name
        });
        buildGraph(child, graph, deep + 1);
    };
    return graph;
}

async function renderSkills() {
    const skillsTree = await fetch('/data/skills-tree.json').then(r => r.json());
    const graph = buildGraph(skillsTree);
    console.log(graph);
    const drag = simulation => {

        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    const links = graph.links.map(d => Object.create(d));
    const nodes = graph.nodes.map(d => Object.create(d));

    const coeff = Math.sqrt(innerWidth) / 15
    const width = window.innerWidth / coeff;
    const heigh = window.innerHeight / coeff;

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.name))
        .force("charge", d3.forceManyBody())
        .force("collide", d3.forceCollide(d => d.size))
        .force("center", d3.forceCenter(0, 0));

    const svg = d3.select("svg.skills-tree")
        .attr("viewBox", [-width / 2, -heigh / 2, width, heigh]);

    window.addEventListener('resize', () => {

        const coeff = Math.sqrt(innerWidth) / 15
        const width = window.innerWidth / coeff;
        const heigh = window.innerHeight / coeff;
        svg.attr("viewBox", [-width / 2, -heigh / 2, width, heigh]);
    })
    // .attr("viewBox", [-0, 0, width / 2, heigh / 2]);

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 3);

    const node = svg.append("g")
        .selectAll(".node")
        .data(nodes)
        .join("g")
        .attr('class', 'node')
        .call(drag(simulation))
    // .on("mouseover", mouseover)
    // .on("mouseout", mouseout);

    node.append('circle')
        .attr("r", d => d.size)
        .style("fill", "var(--contrast)")

    node.append("image")
        .attr('href', d => d.imageSrc)
        .attr('width', d => d.size)
        .attr('height', d => d.size)
        .attr('transform', d => `translate(${-d.size / 2}, ${-d.size / 2})`)

    node.append("text")
        .text(d => d.name)
        .attr('x', 6)
        .attr('y', 3)
        .style("fill", "var(--contrast)")
        .style("font-size", d => d.size)



    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);


        node
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
    });

    // invalidation.then(() => simulation.stop());

    console.log(graph);
    return svg.node();
}

const scriptsLoadQueue = [
    [{
        src: 'https://cdn.jsdelivr.net/gh/cferdinandi/gumshoe@4.0.0/dist/gumshoe.polyfills.min.js',
        callback: () => {
            var spy = new Gumshoe('aside a', {
                offset: window.innerHeight / 3 
            });
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
        src: 'https://cdnjs.cloudflare.com/ajax/libs/d3/6.0.0/d3.min.js',
        callback: () => {
            startDrawingCircles()
            renderSkills();
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


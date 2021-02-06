const svgHeight = 400
const svgWidth = 1000

const margin = {
    top: 50,
    right: 50,
    bottom: 70,
    left: 50
    }

const chartHeight = svgHeight - margin.top - margin.bottom
const chartWidth = svgWidth - margin.left - margin.right

const colorMorning = "#000000"
const colorEvening = "#0000FF"

const parseDate = d3.timeParse("%d-%b")
const formatDate = d3.timeFormat("%d-%b-%Y")

const svg = d3.select("body").append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

const chartG = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

d3.csv("mojoData.csv").then(data => {

    const x = d3.scaleTime()
        .domain(d3.extent(data.map(d => parseDate(d.date))))
        .range([0,chartWidth])

    const yMorning = d3.scaleLinear()
        .domain([0, d3.max(data.map((d) => parseInt(d.morning))),
        ])
        .range([chartHeight, 0])

    const yEvening = d3.scaleLinear()
        .domain([0, d3.max(data.map((d) => parseInt(d.evening))),
        ])
        .range([chartHeight, 0])


    const yAxisMorning = d3.axisLeft(yMorning)
    const yAxisEvening = d3.axisRight(yEvening)
    const xAxis = d3.axisBottom(x).tickFormat(formatDate);

    chartG.append("g")
    .attr("stroke", colorMorning)
    .call(yAxisMorning);

    chartG.append("g")
    .attr("stroke", colorEvening)
    .attr("transform", `translate(${chartWidth}, 0)`)
    .call(yAxisEvening);

    chartG.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    const lineMorning = d3.line()
        .x(d => x(parseDate(d.date)))
        .y(d => yMorning(d.morning));

    const lineEvening = d3.line()
        .x(d => x(parseDate(d.date)))
        .y(d => yEvening(d.evening));

    chartG.append("path")
        .attr("d", lineMorning(data))
        .attr("fill", "none")
        .attr("stroke", colorMorning);

    chartG.append("path")
        .attr("d", lineEvening(data))
        .attr("fill", "none")
        .attr("stroke", colorEvening);

        const labelArea = svg
            .append("g")
            .attr("transform", `translate(${svgWidth / 2}, ${svgHeight - margin.bottom + 40})`)

        labelArea.append("text")
            .attr("stroke", colorMorning)
            .text("Morning")

        labelArea.append("text")
            .attr("stroke", colorEvening)
            .attr("dy", 20)
            .text("Evening")




})
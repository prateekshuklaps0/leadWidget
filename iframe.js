class LoadWidget {
    constructor(widgetId) {
        const urlParams = new URLSearchParams(window.location.search);
        const iframe = document.getElementById(widgetId);
        if (!iframe) return console.warn(`Couldn't load iframe with id : '${widgetId}'`);
        iframe.setAttribute("frameBorder", "0")
        // let iFrameSrc = `https://lead.mastersunion.org/widget/${widgetId}`;
        let iFrameSrc = `http://localhost:7001/${widgetId}`;
        if (urlParams.toString()) {
            iFrameSrc += "?" + urlParams.toString();
        }
        iframe.src = iFrameSrc;
    }
}

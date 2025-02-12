class LoadWidget {
    constructor(widgetId) {
        const checkAndLoad = () => {
            const iframe = document.getElementById(widgetId);
            if (!iframe) {
                setTimeout(checkAndLoad, 100);
                return;
            }
            iframe.setAttribute("frameBorder", "0");
            let iFrameSrc = `https://lead.mastersunion.org/widget/${widgetId}`;
            // let iFrameSrc = `http://localhost:7001/widget/${widgetId}`;
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.toString()) {
                iFrameSrc += "?" + urlParams.toString();
            }
            iframe.src = iFrameSrc;
            window.addEventListener("message", event => {
                if (event.data?.type === "REDIRECT" && event.data?.url) {
                    window.location.href = event.data.url;
                }
            });
        };
        document.addEventListener("DOMContentLoaded", checkAndLoad);
    }
}

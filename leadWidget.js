class LoadWidget{constructor(e){this.widgetId=e,this.iframeLoaded=!1,this.init()}init(){document.addEventListener("DOMContentLoaded",(()=>this.loadIframe()));new MutationObserver((()=>{this.iframeLoaded||this.loadIframe()})).observe(document.body,{childList:!0,subtree:!0}),window.loadWidgetListener||(window.loadWidgetListener=!0,window.addEventListener("message",this.handleMessage))}loadIframe(){const e=document.getElementById(this.widgetId);if(!e||this.iframeLoaded)return;this.iframeLoaded=!0,e.setAttribute("frameBorder","0");let t=`https://lead.mastersunion.org/widget/${this.widgetId}`;const d=new URLSearchParams(window.location.search);d.append("widgetHostURL",window.location.href),e.src=`${t}?${d.toString()}`}handleMessage(e){"REDIRECT"===e.data?.type&&e.data?.url&&(window.location.href=e.data.url)}}

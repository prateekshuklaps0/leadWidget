class initIframe{constructor(t){this.widgetId=t;const e=new URLSearchParams(window.location.search),o=document.getElementById(t);let c="http://localhost:7001/widget/";c+=t,e.toString()&&(c+="?"+e.toString()),o.src=c}}

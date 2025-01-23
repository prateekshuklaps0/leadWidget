class LeadWidget{constructor(e){this.encrypted=e;const t=document.createElement("link");t.rel="stylesheet",t.href="leadWidget.css",document.head.appendChild(t),this.loadFilestackScript().then((()=>this.initializeWidget())).catch((e=>console.error("Error loading Filestack script:",e)))}loadFilestackScript(){return new Promise(((e,t)=>{if(window.filestack)return void e();const i=document.createElement("script");i.src="//static.filestackapi.com/filestack-js/3.x.x/filestack.min.js",i.onload=()=>{e()},i.onerror=()=>{t(new Error("Failed to load Filestack script"))},document.head.appendChild(i)}))}initializeWidget(){const e=JSON.parse(window.atob(this.encrypted));for(let t in e)this[t]=e[t];this.iFrameDiv=document.querySelector(`.frame-${this.widgetData?.uuid}`),this.resErrorElement=document.createElement("p"),this.iframeInit()}fieldInpVals={};fieldErrors={};handleUpload=async({accept:e}={})=>new Promise(((t,i)=>{filestack.init(this.fileStackKey).picker({accept:e||["image/*",".pdf"],maxFiles:1,uploadInBackground:!1,maxSize:2097152,onUploadDone:e=>{e?.filesFailed?.length>0&&i(new Error("Error uploading files :",e?.filesFailed)),e?.filesUploaded?.length>0&&0==e?.filesFailed?.length&&t(e?.filesUploaded)}}).open()}));createElement=(e,t={},i={})=>{const r=document.createElement(e);Object.assign(r.style,t);for(const e in i)r.setAttribute(e,i[e]);return r};showError=(e,t)=>{e.classList.add("visible"),e.textContent=t};createLabel=({text:e,styles:t={},...i})=>{const r=this.createElement("label",t,{...i});return r.textContent=e,r};createButton=({text:e,styles:t={},onClick:i,...r})=>{const s=this.createElement("button",t,{...r});return s.textContent=e,s.onclick=i,s};createParagraph=(e,t={},i={})=>{const r=this.createElement("p",t);r.textContent=e;for(const e in i)r.setAttribute(e,i[e]);return r};getFieldType=e=>{switch(e){case"telephone":case"phone":return"number";case"calendar":return"date";case"textbox":return"text";case"dropdown":return"select";case"fileUpload":return"file";default:return e}};createRadioInp=e=>{const t=this.createElement("div",{},{class:"radio-cont-div"});return t.innerHTML=e?.options?.map((t=>`<div class="radio-options-cont">\n            <input type="radio" name="${e?.uuid}" value="${t?.uuid}" id="${t?.uuid}" class="radio-opts">\n             <label for="${t?.uuid}" >${t?.label}</label>\n            </div>`)).join(""),t.onchange=e=>{const{name:t,value:i}=e.target;this.fieldInpVals={...this.fieldInpVals,[t]:i},this.resErrorElement.innerHTML="",this.resErrorElement.removeAttribute("class")},t};createCheckboxInp=e=>{const t=this.createElement("div",{},{class:"radio-cont-div"});return t.innerHTML=e?.options?.map((t=>`<div class="radio-options-cont">\n            <input type="checkbox" name="${e?.uuid}" value="${t?.uuid}" id="${t?.uuid}" class="checkbox-opts">\n            <label for="${t?.uuid}" >${t?.label}</label>\n            </div>`)).join(""),t.onchange=e=>{const{name:t,value:i,checked:r}=e.target;this.fieldInpVals={...this.fieldInpVals,[t]:r?[...this.fieldInpVals[t]||[],i]:[...(this.fieldInpVals[t]||[]).filter((e=>e!=i))]},this.resErrorElement.innerHTML="",this.resErrorElement.removeAttribute("class")},t};createSelectInp=e=>{const t=this.createElement("select",{},{name:e?.uuid||"",placeholder:e?.placeholder||"Select Option",required:e?.isRequired||!1});return t.innerHTML=`<option value="" class="slct-placeholder">${e?.placeholder||"Select Option"}</option>\n${e?.options?.map((e=>`<option value="${e?.uuid}">${e?.label}</option>`)).join("")}`,t.onchange=e=>{const{name:t,value:i}=e.target;this.fieldInpVals={...this.fieldInpVals,[t]:i},this.resErrorElement.innerHTML="",this.resErrorElement.removeAttribute("class")},t};createInput(e,t){const i="textarea"==t,r=this.createElement(i?"textarea":"input",{},{type:t,name:e?.uuid||"",placeholder:e?.placeholder||"",required:e?.isRequired||!1});return r.onchange=e=>{const{name:t,value:i}=e.target;this.fieldInpVals={...this.fieldInpVals,[t]:i},this.resErrorElement.innerHTML="",this.resErrorElement.removeAttribute("class")},r}createFileInp=e=>{const t=this.createElement("input",{},{type:"file",name:e?.uuid||"",placeholder:e?.placeholder||"",required:e?.isRequired||!1});return t.onchange=e=>{const{name:t,value:i}=e.target;this.fieldInpVals={...this.fieldInpVals,[t]:{fileName:i,value:i}},this.resErrorElement.innerHTML="",this.resErrorElement.removeAttribute("class")},t};showFieldErrors=()=>{for(let e in this.fieldErrors){const t=this.fieldErrors[e],i=document.querySelector(`[class="field-item-div ${e}"]`);if(i){return void(i.querySelector(".field-error").innerHTML=t)}console.error(`No field element found for field ${e}`)}};renderFields(){const e=this.createElement("div",{},{class:"fields-Cont"});return Array.isArray(this.fieldsData)?(this.fieldsData.forEach(((t,i)=>{const r=this.getFieldType(t?.type),s=this.createElement("div",{},{class:`${"file"==r?"custom-file-upload":"field-item-div"} ${t?.uuid}`}),a=this.createParagraph(t?.placeholder||"Choose File",{},{}),n=this.createElement("span",{},{});n.innerHTML="Browse",n.addEventListener("click",(async e=>{e.stopPropagation(),await this.handleUpload().then((e=>{a.innerHTML=e[0]?.filename||"",a.append(n);const i=`https://filestack.mastersunion.org/${e[0]?.key}`;this.fieldInpVals[t?.uuid]={filename:e[0]?.filename||"",url:i}})).catch((e=>{console.log("fieldUpload error :",e)}))})),a.append(n);const l=this.createLabel({text:t?.label||""});if(t?.isRequired){const e=this.createElement("span");e.innerHTML=" *",l.append(e)}let o;o="radio"==r?this.createRadioInp(t):"checkbox"==r?this.createCheckboxInp(t):"select"==r?this.createSelectInp(t):"file"==r?this.createFileInp(t):["textarea","text","number","email","date"].includes(r)?this.createInput(t,r):"otp"==r?this.createInput(t,"number"):this.createInput(t,r);const c=this.createElement("span",{},{class:"field-error"});"file"==r?s.append(l,a,o,c):s.append(l,o,c),e.appendChild(s)})),e):console.error("`this.fieldsData` is not an array or is :",this.fieldsData)}async sendRequest(e){return await fetch(`${this.submitApiData?.api_Url_origin}${this.submitApiData?.api_Url}`,{method:this.submitApiData?.method?.toUpperCase(),headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":this.submitApiData?.api_Url_origin,"Access-Control-Allow-Methods":"POST, GET","Access-Control-Allow-Headers":"pragma","Access-Control-Max-Age":1728e3},body:JSON.stringify(e)})}async iframeInit(){const e=this.renderFields(),t=this.createButton({text:"Submit",type:"submit",class:"iframeBtn"});t.addEventListener("click",(async()=>{const e=this.fieldsData?.map((e=>{let t={fieldUuid:e?.uuid,label:e?.label};const i=this.getFieldType(e?.type);return["select","radio"].includes(i)?t.selectedOptions=e?.options?.filter((t=>t.uuid==this.fieldInpVals[e?.uuid])):"file"==i?(t.value=(this.fieldInpVals[e?.uuid]||{})?.url,t.filename=(this.fieldInpVals[e?.uuid]||{})?.filename):"checkbox"==i?t.selectedOptions=(this.fieldInpVals[e?.uuid]||[]).map((t=>e?.options?.find((e=>e?.uuid==t)))):t.value=(this.fieldInpVals[e?.uuid]||"").trim(),t})),i={theme:this.theme||"",widgetType:this.widgetType||"",formData:this.formData||{},programData:this.programData||{},thankYouPageData:this.thankYouPageData||{},widgetData:this.widgetData||{},fieldsData:e};t.innerHTML='<span class="submit-widget-loader"></span>',this.resErrorElement.innerHTML="",this.resErrorElement.removeAttribute("class");try{const e=await this.sendRequest(i),t=await e.json();if(!e?.ok)return console.log("Error while submitting widget data :",t),this.resErrorElement.innerHTML=t?.message||"Something went wrong",void this.resErrorElement.setAttribute("class","res-error");console.log("Widget Submitted Successfully :",t?.data);const{programSlug:r,formId:s,userId:a,token:n}=t?.data||{},l=this.thankYouPageData?.isRedirect?this.thankYouPageData?.websiteUrl:`${this.submitApiData?.lead_link_domain}${this.submitApiData?.lead_link_subroute}/${r}/${s}?t=0&token=${n}`;console.log("reDirectUrl",l),window.location.href=l}catch(e){console.log("Failed to submit widget data :",e),this.resErrorElement.innerHTML=e||"Something went wrong",this.resErrorElement.setAttribute("class","res-error")}finally{t.innerHTML="Submit"}}));const i=this.createElement("div",{},{class:"submit-widget-btn-cont"});i.append(t),this.iFrameDiv.classList="iFrameWidgetDiv "+("tetr"==this.theme?"tetr-widget":"MU dark"==this.theme?"mu-dark-widget":"mu-light-widget"),this.iFrameDiv.append(e,i,this.resErrorElement),this.showFieldErrors(),console.log(this.theme,"widget iframe loaded")}}

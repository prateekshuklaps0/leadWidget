class LeadWidget{constructor(e){const t=document.createElement("link");t.rel="stylesheet",t.href="https://lead-widget.vercel.app/leadWidget.css",document.head.appendChild(t);const i=JSON.parse(window.atob(e));for(let e in i)this[e]=i[e];this.iFrameDiv=document.querySelector(`.frame-${this.widgetData?.uuid}`),this.resErrorElement=document.createElement("p"),this.iframeInit()}fieldInpVals={};createElement=(e,t={},i={})=>{const s=document.createElement(e);Object.assign(s.style,t);for(const e in i)s.setAttribute(e,i[e]);return s};showError=(e,t)=>{e.classList.add("visible"),e.textContent=t};createLabel=({text:e,styles:t={},...i})=>{const s=this.createElement("label",t,{...i});return s.textContent=e,s};createButton=({text:e,styles:t={},onClick:i,...s})=>{const r=this.createElement("button",t,{...s});return r.textContent=e,r.onclick=i,r};createParagraph=(e,t={},i={})=>{const s=this.createElement("p",t);s.textContent=e;for(const e in i)s.setAttribute(e,i[e]);return s};getFieldType=e=>{switch(e){case"telephone":case"phone":return"number";case"calendar":return"date";case"textbox":return"text";case"dropdown":return"select";case"fileUpload":return"file";default:return e}};createRadioInp=e=>{const t=this.createElement("div",{},{class:"radio-cont-div"});return t.innerHTML=e?.options?.map((t=>`<div class="radio-options-cont"><input type="radio" name="${e?.uuid}" value="${t?.uuid}" id="" class="radio-opts"><p>${t?.label}</p></div>`)).join(""),t.onchange=e=>{const{name:t,value:i}=e.target;this.fieldInpVals={...this.fieldInpVals,[t]:i},this.resErrorElement.innerHTML="",this.resErrorElement.removeAttribute("class")},t};createCheckboxInp=e=>{const t=this.createElement("div",{},{class:"radio-cont-div"});return t.innerHTML=e?.options?.map((t=>`<div class="radio-options-cont"><input type="checkbox" name="${e?.uuid}" value="${t?.uuid}" id="" class="checkbox-opts"><p>${t?.label}</p></div>`)).join(""),t.onchange=e=>{const{name:t,value:i,checked:s}=e.target;this.fieldInpVals={...this.fieldInpVals,[t]:s?[...this.fieldInpVals[t]||[],i]:[...(this.fieldInpVals[t]||[]).filter((e=>e!=i))]},this.resErrorElement.innerHTML="",this.resErrorElement.removeAttribute("class")},t};createSelectInp=e=>{const t=this.createElement("select",{},{name:e?.uuid||"",placeholder:e?.placeholder||"Select Option",required:e?.isRequired||!1});return t.innerHTML=`<option value="">${e?.placeholder||"Select Option"}</option>\n${e?.options?.map((e=>`<option value="${e?.uuid}">${e?.label}</option>`)).join("")}`,t.onchange=e=>{const{name:t,value:i}=e.target;this.fieldInpVals={...this.fieldInpVals,[t]:i},this.resErrorElement.innerHTML="",this.resErrorElement.removeAttribute("class")},t};createInput(e,t){const i="textarea"==t,s=this.createElement(i?"textarea":"input",{},{type:t,name:e?.uuid||"",placeholder:e?.placeholder||"",required:e?.isRequired||!1});return s.onchange=e=>{const{name:t,value:i}=e.target;this.fieldInpVals={...this.fieldInpVals,[t]:i},this.resErrorElement.innerHTML="",this.resErrorElement.removeAttribute("class")},s}createFileInp=e=>{const t=this.createElement("input",{},{type:"file",name:e?.uuid||"",placeholder:e?.placeholder||"",required:e?.isRequired||!1});return t.onchange=e=>{const{name:t,value:i}=e.target;this.fieldInpVals={...this.fieldInpVals,[t]:{fileName:i,value:i}},this.resErrorElement.innerHTML="",this.resErrorElement.removeAttribute("class")},t};renderFields(){const e=this.createElement("div",{},{class:"fields-Cont"});return Array.isArray(this.fieldsData)?(this.fieldsData.forEach(((t,i)=>{const s=this.createElement("div",{},{class:"field-item-div"}),r=this.createLabel({text:t?.label||""});if(t?.isRequired){const e=this.createElement("span");e.innerHTML=" *",r.append(e)}let n;const a=this.getFieldType(t?.type);"radio"==a?n=this.createRadioInp(t):"checkbox"==a?n=this.createCheckboxInp(t):"select"==a?n=this.createSelectInp(t):"file"==a?n=this.createFileInp(t):["textarea","text","number","email","date"].includes(a)?n=this.createInput(t,a):"otp"==a?n=this.createInput(t,"number"):(console.log("field",t),n=this.createInput(t,a)),s.append(r,n),e.appendChild(s)})),e):console.error("`this.fieldsData` is not an array or is :",this.fieldsData)}async sendRequest(e){return await fetch(`${this.submitApiData?.api_Url_origin}${this.submitApiData?.api_Url}`,{method:this.submitApiData?.method?.toUpperCase(),headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":this.submitApiData?.api_Url_origin,"Access-Control-Allow-Methods":"POST, GET","Access-Control-Allow-Headers":"pragma","Access-Control-Max-Age":1728e3},body:JSON.stringify(e)})}async iframeInit(){const e=this.renderFields(),t=this.createButton({text:"Submit",type:"submit",class:"iframeBtn"});t.addEventListener("click",(async()=>{const e=this.fieldsData?.map((e=>{let t={fieldUuid:e?.uuid,label:e?.label};const i=this.getFieldType(e?.type);return["select","radio"].includes(i)?t.selectedOptions=e?.options?.filter((t=>t.uuid==this.fieldInpVals[e?.uuid])):"file"==i?t.value=this.fieldInpVals[e?.uuid]||{}:"checkbox"==i?t.selectedOptions=(this.fieldInpVals[e?.uuid]||[]).map((t=>e?.options?.find((e=>e?.uuid==t)))):t.value=(this.fieldInpVals[e?.uuid]||"").trim(),t})),i={theme:this.theme||"",formData:this.formData||{},programData:this.programData||{},thankYouPageData:this.thankYouPageData||{},widgetData:this.widgetData||{},fieldsData:e};console.log("payload",JSON.stringify(i,null,2)),t.innerHTML='<span class="submit-widget-loader"></span>',this.resErrorElement.innerHTML="",this.resErrorElement.removeAttribute("class");try{const e=await this.sendRequest(i),t=await e.json();if(!e?.ok)return console.log("Error while submitting widget data :",t),this.resErrorElement.innerHTML=t?.message||"Something went wrong",void this.resErrorElement.setAttribute("class","res-error");console.log("Widget Submitted Successfully :",t)}catch(e){console.log("Failed to submit widget data :",e),this.resErrorElement.innerHTML=e||"Something went wrong",this.resErrorElement.setAttribute("class","res-error")}finally{t.innerHTML="Submit"}}));const i=this.createElement("div",{},{class:"submit-widget-btn-cont"});i.append(t),this.iFrameDiv.classList="iFrameWidgetDiv "+("tetr"==this.theme?"tetr-widget":"MU dark"==this.theme?"mu-dark-widget":"mu-light-widget"),this.iFrameDiv.append(e,i,this.resErrorElement),console.log(this.theme,"Widget iframe loaded")}}

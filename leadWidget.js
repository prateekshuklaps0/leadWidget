class LeadWidget {
    constructor(encrypted) {
        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = `https://lead-widget.vercel.app/leadWidget.css`;
        // css.href = `leadWidget.css`
        document.head.appendChild(css)

        const parsedData = JSON.parse(window.atob(encrypted));

        // console.log("parsedData", parsedData);

        for (let key in parsedData) {
            this[key] = parsedData[key]
        };

        this.iFrameDiv = document.querySelector(`.frame-${this.widgetData?.uuid}`);

        this.resErrorElement = document.createElement("p")
        this.resErrorElement.setAttribute("class", "res-error")

        this.iframeInit()
    }

    fieldInpVals = {}

    // To create a DOM element with specified styles and attributes
    createElement = (tag, styles = {}, attributes = {}) => {
        const element = document.createElement(tag);
        Object.assign(element.style, styles);
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        return element;
    }

    // To show error message
    showError = (element, message) => {
        element.classList.add("visible");
        element.textContent = message;
    }

    // To create and append a label with specified text and styles
    createLabel = ({ text, styles = {}, ...rest }) => {
        const label = this.createElement("label", styles, { ...rest });
        label.textContent = text;
        return label;
    }

    // To create and append a button with specified text and styles
    createButton = ({ text, styles = {}, onClick, ...rest }) => {
        const button = this.createElement("button", styles, { ...rest });
        button.textContent = text;
        button.onclick = onClick;
        return button;
    }

    // To create and append a paragraph with specified text and styles
    createParagraph = (text, styles = {}, attributes = {}) => {
        const paragraph = this.createElement("p", styles);
        paragraph.textContent = text;
        for (const key in attributes) {
            paragraph.setAttribute(key, attributes[key]);
        }
        return paragraph;
    }

    // To manipulate field types
    getFieldType = type => {
        switch (type) {
            case "telephone": case "phone":
                return "number";
            case "calendar":
                return "date";
            case "textbox":
                return "text";
            case "dropdown":
                return "select";
            case "fileUpload":
                return "file";
            default: return type;
        }
    }

    // To create radio tag
    createRadioInp = field => {
        const radioCont = this.createElement("div", {}, { class: `radio-cont-div` });
        radioCont.innerHTML = field?.options?.map(option => `<input type="radio" name="${field?.uuid}" value="${option?.uuid}" id="" class="radio-opts"><p>${option?.label}</p>`).join("")
        radioCont.onchange = e => {
            const { name, value } = e.target
            this.fieldInpVals = { ...this.fieldInpVals, [name]: value }
            this.resErrorElement.innerHTML = ""
        }
        return radioCont
    }

    // To create checkbox tag
    createCheckboxInp = field => {
        const checkboxCont = this.createElement("div", {}, { class: `radio-cont-div` });
        checkboxCont.innerHTML = field?.options?.map(option => `<input type="checkbox" name="${field?.uuid}" value="${option?.uuid}" id="" class="checkbox-opts"><p>${option?.label}</p>`).join("")
        checkboxCont.onchange = e => {
            const { name, value, checked } = e.target
            this.fieldInpVals = { ...this.fieldInpVals, [name]: checked ? [...(this.fieldInpVals[name] || []), value] : [...(this.fieldInpVals[name] || []).filter(item => item != value)] }
            this.resErrorElement.innerHTML = ""
        }
        return checkboxCont
    }

    // To create select tag
    createSelectInp = field => {
        const selectCont = this.createElement("select", {}, {
            name: field?.uuid || "",
            placeholder: field?.placeholder || "Select Option",
            required: field?.isRequired || false,
        })
        selectCont.innerHTML = `<option value="">${field?.placeholder || "Select Option"}</option>
${field?.options?.map(option => `<option value="${option?.uuid}">${option?.label}</option>`).join("")}`
        selectCont.onchange = e => {
            const { name, value } = e.target
            this.fieldInpVals = { ...this.fieldInpVals, [name]: value }
            this.resErrorElement.innerHTML = ""
        }
        return selectCont
    }

    // To create input tag based on field type
    createInput(field, type) {
        const isTextarea = type == "textarea"
        const inp = this.createElement(isTextarea ? "textarea" : "input", {}, {
            type,
            name: field?.uuid || "",
            placeholder: field?.placeholder || "",
            required: field?.isRequired || false,
        })
        inp.onchange = e => {
            const { name, value } = e.target
            this.fieldInpVals = { ...this.fieldInpVals, [name]: value }
            this.resErrorElement.innerHTML = ""
        }
        return inp
    }

    // To create file upload input
    createFileInp = field => {
        const fileInp = this.createElement("input", {}, {
            type: "file",
            name: field?.uuid || "",
            placeholder: field?.placeholder || "",
            required: field?.isRequired || false,
        });
        fileInp.onchange = e => {
            const { name, value } = e.target
            this.fieldInpVals = { ...this.fieldInpVals, [name]: { fileName: value, value } }
            this.resErrorElement.innerHTML = ""
        }
        return fileInp
    }

    // To render input fields
    renderFields() {
        const fieldsContainer = this.createElement("div", {}, { class: "fields-Cont", })
        if (!Array.isArray(this.fieldsData)) return console.error("`this.fieldsData` is not an array or is :", this.fieldsData);

        this.fieldsData.forEach((field, index) => {
            const fieldElement = this.createElement("div", {}, { class: `field-item-div` });

            const label = this.createLabel({ text: field?.label || "" });

            let input;
            const fieldType = this.getFieldType(field?.type)
            if (fieldType == "radio") {
                input = this.createRadioInp(field);
            } else if (fieldType == "checkbox") {
                input = this.createCheckboxInp(field);
            } else if (fieldType == "select") {
                input = this.createSelectInp(field);
            } else if (fieldType == "file") {
                input = this.createFileInp(field);
            } else if (["textarea", "text", "number", "email", "date"].includes(fieldType)) {
                input = this.createInput(field, fieldType);
            } else if (fieldType == "otp") {
                input = this.createInput(field, "number");
            } else {
                console.log("field", field);
                input = this.createInput(field, fieldType);
            }


            fieldElement.append(label, input);

            fieldsContainer.appendChild(fieldElement);
        });

        return fieldsContainer
    }

    // iFrame initialization ----------------------------------------------------------------------
    async iframeInit() {
        // Div containing fields
        const divContainingFields = this.renderFields();

        // Submit button
        const submitButton = this.createButton({
            text: "Submit",
            type: "submit",
            class: "iframeBtn"
        });

        // handle widget response submit
        const handleSubmit = async () => {
            const fieldpayload = this.fieldsData?.map((item) => {
                let obj = {
                    fieldUuid: item?.uuid,
                    label: item?.label,
                }
                const fieldType = this.getFieldType(item?.type)
                if (["select", "radio"].includes(fieldType)) {
                    obj.selectedOptions = item?.options?.filter((ite) => ite.uuid == this.fieldInpVals[item?.uuid])
                } else if (fieldType == "file") {
                    obj.value = this.fieldInpVals[item?.uuid] || {}
                } else if (fieldType == "checkbox") {
                    obj.selectedOptions = (this.fieldInpVals[item?.uuid] || []).map(ite => item?.options?.find((op) => op?.uuid == ite))
                } else {
                    obj.value = (this.fieldInpVals[item?.uuid] || "").trim()
                }

                return obj
            })

            const payload = {
                theme: this.theme || "",
                formData: this.formData || {},
                programData: this.programData || {},
                thankYouPageData: this.thankYouPageData || {},
                widgetData: this.widgetData || {},
                fieldsData: fieldpayload,
            }

            // console.log("payload", JSON.stringify(payload, null, 2))
            // console.log("fieldInpVals", this.fieldInpVals)
            // console.log("fieldsData", this.fieldsData)

            submitButton.innerHTML = `<span class="loader"></span>`
            this.resErrorElement.innerHTML = ""
            try {
                const res = await fetch(`${this.submitApiData?.api_Url_origin}${this.submitApiData?.api_Url}`, {
                    method: this.submitApiData?.method?.toUpperCase(),
                    headers: {
                        "Content-Type": "application/json",
                        'Access-Control-Allow-Origin': this.submitApiData?.api_Url_origin,
                        'Access-Control-Allow-Methods': "POST, GET",
                        'Access-Control-Allow-Headers': 'pragma',
                        'Access-Control-Max-Age': 1728000
                    },
                    body: JSON.stringify(payload),
                })
                if (!res.ok) {
                    console.log("!response.ok error :", res);
                    this.resErrorElement.innerHTML = res?.type == "cors" ? "Given email already exists!" : "Something went wrong while submitting the data!"
                    throw new Error(res?.message || res?.statusText);
                }
                const data = await res.json()

                console.log("Widget data submitted :", data?.data)

                const { programSlug, formId, userId } = data?.data || {}

                const reDirectUrl = this.thankYouPageData?.isRedirect ? this.thankYouPageData?.websiteUrl :
                    `${this.submitApiData?.lead_link_domain}${this.submitApiData?.lead_link_subroute}/${programSlug}/${formId}?t=0&u=${userId}`

                // console.log("reDirectUrl", reDirectUrl);

                window.location.href = reDirectUrl

                submitButton.innerHTML = "Submit"
            } catch (error) {
                console.log("Failed to submit widget data :", error)
                submitButton.innerHTML = "Submit"
            }
        }

        submitButton.addEventListener("click", handleSubmit)

        this.iFrameDiv.classList = "iFrameWidgetDiv"

        this.iFrameDiv.append(divContainingFields, submitButton, this.resErrorElement);

        console.log("Widget iframe loaded",);
    }
}

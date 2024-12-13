class LeadWidget {
    constructor(encrypted) {
        const css = document.createElement("link");
        css.rel = "stylesheet";
        // css.href = `https://lead-widget.vercel.app/leadWidget.css` || `leadWidget.css`;
        // css.href = `leadWidget.css`

        const parsedData = JSON.parse(window.atob(encrypted));

        console.log("parsedData", parsedData);

        for (let key in parsedData) {
            this[key] = parsedData[key]
        };

        this.iFrameDiv = document.querySelector(`.frame-${this.widgetData?.uuid}`);

        this.iframeInit()
    }

    fieldInpVals = {}

    // Function to create a DOM element with specified styles and attributes
    createElement = (tag, styles = {}, attributes = {}) => {
        const element = document.createElement(tag);
        Object.assign(element.style, styles);
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        return element;
    }

    // Function to show error message
    showError = (element, message) => {
        element.classList.add("visible");
        element.textContent = message;
    }

    // Function to create and append a label with specified text and styles
    createLabel = ({ text, styles = {}, ...rest }) => {
        const label = this.createElement("label", styles, { ...rest });
        label.textContent = text;
        return label;
    }

    // Function to create and append a button with specified text and styles
    createButton = ({ text, styles = {}, onClick, ...rest }) => {
        const button = this.createElement("button", styles, { ...rest });
        button.textContent = text;
        button.onclick = onClick;
        return button;
    }

    // Function to create and append a paragraph with specified text and styles
    createParagraph = (text, styles = {}, attributes = {}) => {
        const paragraph = this.createElement("p", styles);
        paragraph.textContent = text;
        for (const key in attributes) {
            paragraph.setAttribute(key, attributes[key]);
        }
        return paragraph;
    }

    // to manipulate field types
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

    // to create radio tag
    createRadioInp = field => {
        const radioCont = this.createElement("div", {}, { class: `radio-cont-div` });
        radioCont.innerHTML = field?.options?.map(option => `<input type="radio" name="${field?.uuid}" value="${option?.uuid}" id="" class="radio-opts"><p>${option?.label}</p>`).join("")
        radioCont.onchange = e => {
            const { name, value } = e.target
            this.fieldInpVals = { ...this.fieldInpVals, [name]: value }
        }
        return radioCont
    }

    // to create checkbox tag
    createCheckboxInp = field => {
        const checkboxCont = this.createElement("div", {}, { class: `radio-cont-div` });
        checkboxCont.innerHTML = field?.options?.map(option => `<input type="checkbox" name="${field?.uuid}" value="${option?.uuid}" id="" class="checkbox-opts"><p>${option?.label}</p>`).join("")
        checkboxCont.onchange = e => {
            const { name, value } = e.target
            this.fieldInpVals = { ...this.fieldInpVals, [name]: value }
        }
        return checkboxCont
    }

    // to create select tag
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
        }
        return selectCont
    }

    // function to create input tag based on field type
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
        }
        return inp
    }

    // to create file upload input
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
        }
        return fileInp
    }


    handleSubmitbtn = () => {
        const fieldpayload = this.fieldsData?.map((item) => {
            let obj = {
                fieldUuid: item?.uuid,
            }
            const fieldType = this.getFieldType(item?.type)
            if (["select", "radio"].includes(fieldType)) {
                obj.selectedOptions = item?.options?.filter((ite) => ite.uuid == this.fieldInpVals[item?.uuid])
            } else if (fieldType == "file") {
                obj.value = this.fieldInpVals[item?.uuid] || {}
            } else {
                obj.value = (this.fieldInpVals[item?.uuid] || "").trim()
            }

            return obj
        })
        const payload = {
            fieldData: fieldpayload,
        }
        console.log("payload", payload)
        // console.log("fieldInpVals", this.fieldInpVals)
        // console.log("fieldsData", this.fieldsData)
    }

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
        // submit button handler


        // Div containing fields
        const divContainingFields = this.renderFields();

        // Submit button
        const submitButton = this.createButton({
            text: "Submit",
            type: "submit",
            onClick: this.handleSubmitbtn,
            class: "iframeBtn"
        });

        this.iFrameDiv.classList = "iFrameWidgetDiv"

        this.iFrameDiv.append(divContainingFields, submitButton);

        console.log("Initializing LeadWidget", this.fieldsData,);
    }
}

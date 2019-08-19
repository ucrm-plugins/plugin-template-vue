import { dynamicField } from "./consts";
import { inlineFromCSS } from "./helpers";


export default function(editor, opt = {})
{




    // Define a component with `textable` property
    // noinspection SpellCheckingInspection
    editor.DomComponents.addType("var-placeholder", {

        model: {

            defaults: {


                textable: true,
                placeholder: "DYNAMIC",

                droppable: false,

                traits: [
                    {
                        type: "select",
                        label: "Object",
                        name: "field-object",
                        options: [
                            "admin",
                            "user",
                            "ticket",
                            "job",
                        ],
                    },
                    {
                        type: "select",
                        label: "Property",
                        name: "field-property",
                        options: [
                            "firstName",
                            "lastName",
                        ],
                    },



                ],

                attributes: {

                    "field-object": "user",
                    "field-property": "firstName",

                }

            },




            toHTML: function()
            {

                //return `{% ${this.get('placeholder')} %}`;
                const attributes = this.getAttributes();
                return `{% ${attributes["field-object"]}.${attributes["field-property"]} %}`;
            },

        },

        // The view below it's just an example of creating a different UX
        view: {

            tagName: "span",

            events: {
                "change": "updatePlaceholder",
            },

            // Update the model once the select is changed
            updatePlaceholder(e) {
                this.model.set({ placeholder: e.target.value });
                this.updateProps();
            },

            // When we blur from a TextComponent, all its children components are
            // flattened via innerHTML and parsed by the editor. So to keep the state
            // of our props in sync with the model so we need to expose props in the HTML
            updateProps() {
                const { el, model } = this;
                el.setAttribute("data-gjs-placeholder",  model.get("placeholder"));
            },

            onRender: function()
            {
                const { model, el } = this;
                const placeholder = model.get("placeholder");
                const select = document.createElement("select");
                const options = [ "DYNAMIC", "DYNAMIC2", "DYNAMIC3" ];

                select.innerHTML = options.map(
                    function(option)
                    {
                        return `
                            <option value="${option}" ${option === placeholder ? 'selected' : ''}>
                                ${option}
                            </option>
                        `.minify();
                    }
                ).join("");

                while (el.firstChild)
                    el.removeChild(el.firstChild);

                el.appendChild(select);

                //select.setAttribute("class", "dynamic-field");

                const style = inlineFromCSS(dynamicField.styles);

                select.setAttribute("style", style);



                this.updateProps();
            },
        }
    });


    editor.on("component:selected", function()
    {
        const selected = this.getEditor().getSelected();

        if(selected.attributes.type === "var-placeholder")
        {
            const openSmBtn = editor.Panels.getButton('views', 'open-tm');
            openSmBtn.set('active', 1);
        }

    });





}

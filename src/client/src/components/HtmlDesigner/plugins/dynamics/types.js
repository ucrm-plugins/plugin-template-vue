import { dynamicField } from "./consts";
import { inlineFromCSS } from "./helpers";


export default function(editor, opt = {})
{
    const defaultType = editor.DomComponents.getType("default");

    /**
     *
     * @param {Object} styleObj
     * @returns {string}
     */
    const styleObjectToString = function(styleObj)
    {
        let styles = [];

        Object.keys(styleObj).forEach(function(key)
        {
            styles.push(`${key}:${styleObj[key]}`);
        });

        return styles.join(";");
    };



    // Define a component with `textable` property...
    editor.DomComponents.addType("dynamic-field",
    {



        isType: function(value)
        {
            if(value && value.type === "dynamic-field")
                return value;
        },


        // Setup the component's model.
        model:  {

            // Set the model defaults.
            defaults: {

                // Is allowed to be dropped inside a text component.
                textable: true,

                // Can not have anything else dropped inside of itself.
                droppable: false,

                style: {
                    display: "inline-block",
                },

                // Define the component's traits.
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

                // Set default values for the same traits.
                attributes: {
                    "field-object": "user",
                    "field-property": "firstName",
                },





            },


            /**
             *
             * @returns {string}
             */
            toHTML: function()
            {

                const attributes = this.getAttributes();
                const styles = styleObjectToString(this.getStyle());

                return `
                    <div style="${styles}">
                        {% ${attributes["field-object"]}.${attributes["field-property"]} %}
                    </div>
                `;
            },



        },


        // The view below it's just an example of creating a different UX
        view: /* editor.DomComponents.getType("default").view.extend( */
        {
            tagName: "div",

            init: function()
            {
                let self = this;

                /*

                // Get the current model styles, likely none at the moment!
                let style = this.model.getStyle();

                // Merge the "common" styles with the current model styles.
                style = Object.assign({ display: "inline-block" }, style);

                // Assign the combined styles to the model.
                this.model.setStyle(style);

                */

                this.listenTo(this.model, "change:attributes", function()
                {
                    //console.log("attribute changed!");
                });

                this.listenTo(this.model, "change:style", function(model, style)
                {
                    self.render();
                    //this.$el.css("background-color", "lightblue");
                })
            },

            render: function ()
            {
                // Apply the defaults!
                defaultType.view.prototype.render.apply(this, arguments);

                const {model, el} = this;

                const attributes = model.getAttributes();
                const fieldObject = attributes["field-object"];
                const fieldProperty = attributes["field-property"];

                const $el = $(el);
                $el.html(`${fieldObject}.${fieldProperty}`);
                $el.css("background-color", "lightblue");
                //$el.css("border-radius", "0.25rem");





                return this;

            },

        } //)

    });


    editor.on("component:selected", function()
    {
        const selected = editor.getSelected();

        if(selected.attributes.type === "dynamic-field")
        {
            const openSmBtn = editor.Panels.getButton('views', 'open-tm');
            openSmBtn.set('active', 1);
        }

    });




}

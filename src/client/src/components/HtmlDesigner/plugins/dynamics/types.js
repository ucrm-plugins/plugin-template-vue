import { dynamicField } from "./consts";
import { inlineFromCSS } from "./helpers";


export default function(editor, opt = {})
{
    const defaultType = editor.DomComponents.getType("default");


    // Define a component with `textable` property
    // noinspection SpellCheckingInspection
    editor.DomComponents.addType("var-placeholder",
    {
        //isComponent: (el) => el.tagName === "DIV",

        model:  {

            defaults: {

                textable: true,

                droppable: false,

                traits: [
                    {
                        type: "select",
                        label: "Container",
                        name: "field-container",
                        options: [
                            "none",
                            "div",
                            "span",
                            "p",
                        ],
                    },
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

                class: "dynamics-field",

                attributes: {


                    "field-container": "div",
                    "field-object": "user",
                    "field-property": "firstName",

                },


            },




            toHTML: function()
            {
                const attributes = this.getAttributes();


                if(attributes["field-container"] === "none")
                    return `{% ${attributes["field-object"]}.${attributes["field-property"]} %}`;

                const open = `<${attributes["field-container"]}>`;
                const close = `</${attributes["field-container"]}>`;

                return `${open}{% ${attributes["field-object"]}.${attributes["field-property"]} %}${close}`.minify();
            },

        },


        // The view below it's just an example of creating a different UX
        view: /* editor.DomComponents.getType("default").view.extend( */
        {
            tagName: "div",

            init: function()
            {
                //this.model.attributes.style
                //console.log();




                //console.log(this.model);

                this.listenTo(this.model, "change:attributes", function()
                {
                    //console.log("attribute changed!");

                });

                let self = this;

                this.listenTo(this.model, "change:style", function()
                {
                    //console.log("style changed!");
                    //self.render();

                    //const style = this.model.get("style");
                    //this.model.set("style", "display:inline; " + style)

                    const style = this.$el.attr("style");
                    console.log(style);


                    this.$el.attr("style", "display:inline-block;" + (style !== "" ? " " : "") + style);

                    //const component = editor.getSelected();
                    //component.setStyle(style);

                    //console.log();

                })
            },

            render: function ()
            {
                // Apply the defaults!
                defaultType.view.prototype.render.apply(this); //, arguments);

                const {model, el} = this;
                const attributes = model.getAttributes();

                const fieldObject = attributes["field-object"];
                const fieldProperty = attributes["field-property"];

                const $el = $(el);
                $el.html(`${fieldObject}.${fieldProperty}`);
                $el.attr("style", "display:inline-block;");

                return this;

            },

        } //)

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

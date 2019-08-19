
import { dynamicField } from "./consts";


export default function(editor, options = {})
{
    const opts = options;
    const components = editor.DomComponents;
    const defaultType = components.getType('default');
    const textType = components.getType('text');
    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;
    const textModel = textType.model;
    const textView = textType.view;
    const classPrefix = opts.fieldClassPrefix;


    editor.on("component:selected", function()
    {
        const selected = this.getEditor().getSelected();

        if(selected.attributes.type === "dynamic-field")
        {
            const openSmBtn = editor.Panels.getButton('views', 'open-tm');
            openSmBtn.set('active', 1);
        }

    });

    //const COMPONENT_NAME = 'dynamic-field';

    components.addType(dynamicField.name, {

        model: defaultModel.extend(
            {
                defaults: {
                    ...defaultModel.prototype.defaults,
                    /*
                    startfrom: opts.startTime,
                    endText: opts.endText,
                    */

                    droppable: false,

                    textable: 1,

                    /*
                    fieldObject: options.fieldObjectDefault,
                    fieldProperty: options.fieldPropertyDefault,
                    */

                    traits: [
                        {
                            type: "select",
                            label: "Object",
                            name: "field-object",
                            options: [
                                { id: "admin", name: "Admin" },
                                { id: "user", name: "User", selected: true },
                                { id: "ticket", name: "Ticket" },
                                { id: "job", name: "Job" },
                            ],
                            //changeProp: 1,
                        },
                        {
                            type: "select",
                            label: "Property",
                            name: "field-property",
                            options: [
                                { id: "firstName", name: "First Name" },
                                { id: "lastName", name: "LastName" },
                            ],
                            //changeProp: 1,
                        },

                    ],


                    attributes: {

                        "field-object": options.fieldObjectDefault,
                        "field-property": options.fieldPropertyDefault,

                    },




                    /*
                    script: function()
                    {
                    }
                    */
                },
                toHTML: function()
                {
                    //return "{% " + this.attributes.fieldObject + "." + this.attributes.fieldProperty + " %}";

                    const attributes = this.getAttributes();
                    return `{% ${attributes["field-object"]}.${attributes["field-property"]} %}`;
                },
            },
            {
                /**
                 *
                 * @param {HTMLElement} el
                 * @return {Object}
                 */
                isComponent: function(el)
                {
                    if (el.getAttribute && el.getAttribute("data-gjs-type") === dynamicField.name)
                    {
                        return {
                            type: dynamicField.name
                        };
                    }
                },
            }
        ),


        /*
        view: defaultView.extend({


            init: function()
            {
                this.listenTo(this.model, "change:object change:property", this.updateScript);
                const comps = this.model.get("components");

                // Add a basic countdown template if it's not yet initialized
                if (!comps.length)
                {
                    comps.reset();

                    comps.add(`
                        <span data-js="${classPrefix}" class="${classPrefix}-cont">
                            
                            <!--
                            <div class="${classPrefix}-block">
                                <div data-js="${classPrefix}-day" class="${classPrefix}-digit"></div>
                                <div class="${classPrefix}-label">${opts.labelDays}</div>
                            </div>
                            <div class="${classPrefix}-block">
                                <div data-js="${classPrefix}-hour" class="${classPrefix}-digit"></div>
                                <div class="${classPrefix}-label">${opts.labelHours}</div>
                            </div>
                            <div class="${classPrefix}-block">
                                <div data-js="${classPrefix}-minute" class="${classPrefix}-digit"></div>
                                <div class="${classPrefix}-label">${opts.labelMinutes}</div>
                            </div>
                            <div class="${classPrefix}-block">
                                <div data-js="${classPrefix}-second" class="${classPrefix}-digit"></div>
                                <div class="${classPrefix}-label">${opts.labelSeconds}</div>
                            </div>
                            -->
                        </span>
                        <span data-js="${classPrefix}-end-text" class="${classPrefix}-end-text"></span>
                    `);

                }

            },
            updateScript: function()
            {
                const selected = this.model;

                //console.log(selected);
                //const comps = this.model.get("components"); //.where({ name: "dynamic-field" });
                //console.log(comps);

                //const component = editor.getSelected();
                //console.log("Test");
                //let object = component.getTrait("field-object");
                //object.set("options", options.fieldDefaultObject);
            }


        }),

         */
    });
}

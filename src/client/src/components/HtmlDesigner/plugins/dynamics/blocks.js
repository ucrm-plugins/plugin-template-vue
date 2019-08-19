import { dynamicField } from "./consts";

export default function(editor, opt = {})
{

    // Use the component in blocks
    editor.BlockManager.add("data-field", {
        label: "Data Field",
        category: "Dynamics",
        select: true,
        content: {
            type: "dynamic-field",
        },
        attributes: {
            class: "fa fa-database",
        }
    });

}

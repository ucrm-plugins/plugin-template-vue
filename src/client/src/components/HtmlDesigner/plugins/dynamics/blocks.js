import { dynamicField } from "./consts";

export default function(editor, opt = {})
{

    // Use the component in blocks
    editor.BlockManager.add("simple-block", {
        label: "Data Field",
        category: "Dynamics",
        select: true,
        content: {
            type: "var-placeholder",

        },
        attributes: {
            class: "fa fa-database",
        }
    });

}

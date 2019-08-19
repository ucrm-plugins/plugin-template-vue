import { dynamicField } from "./consts";

export default function(editor, opt = {})
{

    // Use the component in blocks
    editor.BlockManager.add("simple-block", {
        label: "Data Field",
        category: "Dynamics",
        select: true,
        content: {
            type: "var-placeholder"
        },
    });





    const c = opt;
    const bm = editor.BlockManager;
    const pfx = c.fieldClassPrefix;


    const style = c.defaultStyle ? `
        <style>
            .${pfx}
            {
                height: 100px;
                background-color: blue;
                text-align: center;
                font-family: Helvetica, serif;
            }
            
            .${pfx}-block
            {
                display: inline-block;
                margin: 0 10px;
                padding: 10px;
            }
        
            .${pfx}-digit
            {
                font-size: 5rem;
            }
        
            .${pfx}-end-text
            {
                font-size: 5rem;
            }
        
            .${pfx}-cont, .${pfx}-block
            {
              display: inline-block;
            }
        </style>` : "";

    if (c.blocks.indexOf(dynamicField.name) >= 0)
    {
        bm.add(dynamicField.name, {
            label: c.fieldLabel,
            category: c.fieldCategory,
            select: true,
            attributes: {
                class: "fa fa-clock-o",
            },
            content:
                `
                <span class="${pfx}" data-gjs-type="${dynamicField.name}">Object.Property</span>
                ${style}
                `
            }
        );
    }
}

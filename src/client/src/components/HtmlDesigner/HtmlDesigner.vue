<template>

    <!-- CONTAINER -->
    <div
        :id="'html-designer-' + this._uid + '-container'"
        class="h-100">

        <!-- MOBILE -->
        <div
            class="h-100 d-flex d-sm-none justify-content-center align-items-center">

            <div
                class="w-75 alert alert-warning text-center">
                This editor is not supported on devices with a screen width of less than 576 pixels!
            </div>

        </div>

        <!-- DESIGNER -->
        <div
            :id="'html-designer-' + this._uid + '-editor'"
            class="h-100 d-none d-sm-block border border-dark"
            v-html="value">
        </div>

    </div>

</template>

<script>

    import grapesjs from "grapesjs";
    import "grapesjs-preset-webpage"

    import "./plugins/dynamics"


    export default {
        name: "HtmlDesigner",

        components: {
        },

        props: {

            value: String,

        },

        watch: {

            value: function(current, previous)
            {


            },

        },


        data () {
            return {

                editor: null,

            }
        },

        computed: {

        },

        mounted: function()
        {




            // noinspection JSUnresolvedFunction
            this.editor = grapesjs.init({

                container: "#html-designer-" + this._uid + "-editor",
                fromElement: true,
                //height: "100%",
                //width: "auto",
                storageManager: { type: null },
                panels: null,

                styleManager: {},

                plugins: [
                    'gjs-preset-webpage',
                    "dynamics",
                ],

                pluginsOpts: {

                    'gjs-preset-webpage': {
                        // options
                        blocks: [
                        ],

                        blocksBasicOpts: {
                            // Include all blocks by default!
                        },

                        navbarOpts: {
                            // Hide all navbar blocks, as they are not supported in email messages.
                            blocks: []
                        },

                        countdownOpts: {
                            // Hide all countdown blocks, as they are not supported in email messages.
                            blocks: []
                        },

                        formsOpts: {
                            // Hide all form blocks, as they are not supported in email messages.
                            blocks: []
                        },

                    }
                },

                blocks: [


                ]





            })
            .on("load", function(editor)
            {
                // Show borders by default
                editor.Panels.getButton('options', 'sw-visibility').set('active', 1);
            });


            this.editor.BlockManager.add(
                "dynamic-field",
                {
                    label: "Data Field",
                    category: "Dynamic",
                    //content: "{%  %}",
                    select: true,



                }
            );




            $(function()
            {
                /*
                $(".gjs-radio-item-label[for='float-none']")
                    .text("")
                    .addClass("gjs-sm-icon")
                    .addClass("fa")
                    .addClass("fa-times");
                $(".gjs-radio-item-label[for='float-left']")
                    .text("")
                    .addClass("gjs-sm-icon")
                    .addClass("fa")
                    .addClass("fa-align-left");
                $(".gjs-radio-item-label[for='float-right']")
                    .text("")
                    .addClass("gjs-sm-icon")
                    .addClass("fa")
                    .addClass("fa-align-right");
                */



                $(".gjs-pn-buttons span.gjs-pn-btn")
                    .attr("data-toggle", "popover")
                    .attr("data-placement", "bottom")
                    .attr("data-trigger", "hover");

                $(".gjs-pn-buttons span.gjs-pn-btn[class*='fa-desktop']")
                    .attr("data-content", "Desktop");
                $(".gjs-pn-buttons span.gjs-pn-btn[class*='fa-tablet']")
                    .attr("data-content", "Tablet");
                $(".gjs-pn-buttons span.gjs-pn-btn[class*='fa-mobile']")
                    .attr("data-content", "Mobile");

                $(".gjs-pn-buttons span.gjs-pn-btn[class*='fa-square-o']")
                    .attr("data-content", "Show Borders");
                $(".gjs-pn-buttons span.gjs-pn-btn[class*='fa-eye']")
                    .attr("data-content", "Preview");
                $(".gjs-pn-buttons span.gjs-pn-btn[class*='fa-arrows-alt']")
                    .attr("data-content", "Fullscreen");
                $(".gjs-pn-buttons span.gjs-pn-btn[class*='fa-code']")
                    .attr("data-content", "Export");
                $(".gjs-pn-buttons span.gjs-pn-btn[class*='fa-undo']")
                    .attr("data-content", "Undo");
                $(".gjs-pn-buttons span.gjs-pn-btn[class*='fa-repeat']")
                    .attr("data-content", "Redo");
                $(".gjs-pn-buttons span.gjs-pn-btn[class*='fa-download']")
                    .attr("data-content", "Import");
                $(".gjs-pn-buttons span.gjs-pn-btn[class*='fa-trash']")
                    .attr("data-content", "Clear Canvas");

                $(".gjs-pn-buttons span.gjs-pn-btn[class*='fa-paint-brush']")
                    .attr("data-content", "Styles");
                $(".gjs-pn-buttons span.gjs-pn-btn[class*='fa-cog']")
                    .attr("data-content", "Traits");
                $(".gjs-pn-buttons span.gjs-pn-btn[class*='fa-bars']")
                    .attr("data-content", "Layers");
                $(".gjs-pn-buttons span.gjs-pn-btn[class*='fa-th-large']")
                    .attr("data-content", "Blocks");

                $(".gjs-blocks-c div.gjs-block")
                    .attr("data-toggle", "popover")
                    .attr("data-placement", "bottom")
                    .attr("data-trigger", "hover")
                    .each(function()
                    {
                        $(this).attr("data-content", $(this).attr("title"));
                    })
                    .attr("title", "");






                $('[data-toggle="popover"]').popover();

            });



        }
    }
</script>


<!--suppress CssFloatPxLength, CssUnusedSymbol -->
<style lang="stylus">
    @import "~grapesjs/dist/css/grapes.min.css"
    //@import "../../../node_modules/grapesjs/dist/css/grapes.min.css";

    rem2px(value)
        unit(value) is "rem" ? unit(value * 16, "px") : unit(value, unit(value))

    // NOTE: Change the padding here manually, as needed!                              @screen = 576px
    editor-width        = 576px - 2px - rem2px(2rem)                                // 542px
    canvas-width        = 320px                                                     // 320px
    panels-width        = editor-width - canvas-width                               // 222px
    canvas-percentage   = unit( ( canvas-width / editor-width ) * 100, "%")         // 59.040590405904055%
    panels-percentage   = 100% - canvas-percentage                                  // 40.959409594095945%

    // Set specific sizing for supported mobile displays.
    @media screen and (min-width: 576px)
        .gjs-pn-views, .gjs-pn-views-container
            width panels-width
        .gjs-pn-options
            z-index 5
            right "calc( %s - ( 35px * 2 ) - 5px )" % panels-width
        .gjs-cv-canvas, .gjs-pn-commands
            width "calc( 100% - %s )" % panels-width
        .gjs-pn-devices-c
            z-index 6

    // Reset sizing for non-mobile displays.
    @media screen and (min-width: 768px)
        .gjs-pn-views, .gjs-pn-views-container
            width panels-width
        .gjs-pn-options
            z-index 4
            right panels-width
        .gjs-cv-canvas, .gjs-pn-commands
            width "calc( 100% - %s )" % panels-width
        .gjs-pn-devices-c
            z-index 3

    //@media screen and (min-width: 992px)
    //@media screen and (min-width: 1200px)

    // Remove the extra margin on the rightmost buttons in each group.
    .gjs-pn-buttons
        justify-content flex-end
        > span:last-child
            margin-right 0

    //.gjs-am-assets
        //height auto

    // Fixup sizing in image upload dialog!
    .gjs-am-file-uploader form
        height 325px

    // Override conflicting Bootstrap styles.
    label, form
        margin-bottom 0 !important



</style>

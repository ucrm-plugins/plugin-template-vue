<!--suppress JSUnusedLocalSymbols, JSUnresolvedVariable -->
<template>
    <div class="h-100">

        <HtmlDesigner v-model="html" :dynamics="dynamics"></HtmlDesigner>


    </div>
</template>

<script>

    import HtmlDesigner from "../components/HtmlDesigner/HtmlDesigner";
    //const HtmlDesigner = () => import(/* webpackChunkName: "html-designer" */ "../components/HtmlDesigner/HtmlDesigner");


    export default {

        name: "HtmlDesignerDemo",

        components: {
            HtmlDesigner


        },

        data () {
            return {

                editor: null,

                html: "",

                dynamics: [
                    {
                        name: "user",
                        label: "User",

                    }
                ]

            }
        },

        watch: {




        },

        computed: {


        },


        methods: {




        },

        created() {
        },

        mounted: function()
        {


        }

    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>



</style>

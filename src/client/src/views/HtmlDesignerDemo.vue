<!--suppress JSUnusedLocalSymbols, JSUnresolvedVariable -->
<template>
    <div class="h-100">

        <HtmlDesigner v-model="html"></HtmlDesigner>


    </div>
</template>

<script>

    import HtmlDesigner from "../components/HtmlDesigner/HtmlDesigner";

    export default {

        name: "HtmlDesignerDemo",

        components: {
            HtmlDesigner
            //QueryBuilder,
            //VueJsonPretty,
        },

        data () {
            return {

                editor: null,

                html: ""


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

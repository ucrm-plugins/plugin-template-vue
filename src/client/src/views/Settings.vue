<template>
    <div class="hello">
        <h3>Settings</h3>

        <PermissionGroups
            :start-expanded="true"
        ></PermissionGroups>

        <!--
        <button class="btn btn-primary" @click="items = items2">Change</button>
        -->


    </div>
</template>

<script>

    import axios from "axios";

    import PermissionGroups from "../components/PermissionBuilder/PermissionGroups";

    export default {

        name: "Settings",
        components: {
            PermissionGroups
        },

        watch: {


        },


        data () {
            return {
                selected: [ "Admin Group", "Technicians", "Operators", "Assistants", "Secretaries", "Admin Group" ],
                tags: [ "Admin Group", "Operators", "Technicians" ],


                selectedIndex: -1,

                allowed: [],

                items: [
                    "Admin Group",
                    "Managers",
                    "Technicians",
                    "Operators",
                    "Installers",
                    "Assistants",
                    "Secretaries",
                    "Enterprise Clients",
                    "Interns",
                ],

                items2: [
                    "Admin Group",
                    "Managers",
                    "Technicians",
                    "Enterprise Clients",
                    "Interns",
                ],

            }
        },


        created: function()
        {





        },


    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>

    .list-group-item
        padding 0.5rem

        & i
            width 24px
            text-align center
            margin-right 0.5rem




</style>

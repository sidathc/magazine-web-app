<template>
    <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
        <v-btn
        v-bind="activatorProps"
        color="surface-variant"
        text="Add Country"
        variant="flat"
        ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
        <v-card title="Add Country">
        <v-card-text>
        <v-form v-model="valid">
        
            Please enter the name of the country you wish to add.

            <v-text-field v-model = country_select label="Name of Country"></v-text-field>
        </v-form>

        <span class="text-red">{{ status }}</span>

        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
            text="Close Dialog"
            @click="isActive.value = false"
            ></v-btn>

            <v-btn
            text="Add"
            @click="send"
            ></v-btn>

        </v-card-actions>
        </v-card>
    </template>
    </v-dialog>
  </template>
  
  <script setup>
    //
    import { ref, onMounted} from 'vue'
    import axios from 'axios'

    // creating reactive variables 
    var country_select = ref('')
    var status = ref('')
    var valid = ref(false)


    function send(){
        status.value = "You have successfully added a new country to this database."
        axios.post('http://localhost:3003/addcountry', {country_name: country_select.value}
        )
        .then(function (response) {
        console.log(response);
        location.reload()
        })
        .catch(function (error) {
        console.log(error);
        });  
    }


  </script>
  
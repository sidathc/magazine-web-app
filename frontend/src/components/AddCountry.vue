<template>
    <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
        <v-btn
        v-bind="activatorProps"
        text="Add Country"
        variant="flat"
        ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
        <v-card title="Add Country">
        <v-card-text>
        <v-form v-model="valid">
        
            <v-text-field v-model = data.country_select label="Name of Country"></v-text-field>
        </v-form>

        <span class="text-red">{{ status }}</span>

        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>

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
    import useVuelidate from '@vuelidate/core';
    import {required} from '@vuelidate/validators';

    // creating reactive variables 
    var status = ref('')
    var valid = ref(false)
    const data = ref({country_select: ""})
    const rules = {country_select: {required}}
    const v$ = useVuelidate(rules, data)

    async function send(){
        const result = await v$.value.$validate()

        if (result){
            status.value = "You have successfully added a new country to this database."
            axios.post('http://localhost:3003/addcountry', {country_name: data.value.country_select}
            )
            .then(function (response) {
            console.log(response);
            location.reload()
            })
            .catch(function (error) {
            console.log(error);
            });  

        }
        else{
            alert("Error: Fill out the form correctly.")
            status.value = "Please try again." 
        }
    }

  </script>
  
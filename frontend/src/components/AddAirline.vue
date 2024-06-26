<template>
    <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
        <v-btn
        v-bind="activatorProps"
        text="Add Airline"
        variant="flat"
        ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
        <v-card title="Add Airline">
        <v-card-text>
        <v-form v-model="valid">
        
            <v-text-field v-model = data.airline_select label="Name of Airline"></v-text-field>

            <v-combobox
                v-model="data.country_select"
                :items="country_list"
                label="Country of Origin"
                item-value="id"
                item-title="name"
                :return-object="true"
                clearable
            ></v-combobox>
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
    const country_list = ref([])
    const status = ref('')
    const valid = ref(false)
    const data = ref({country_select: "", airline_select: ""})
    const rules = {country_select: {required}, airline_select: {required}}
    const v$ = useVuelidate(rules, data)

    onMounted(async () => {
    const countries = await axios.get('http://localhost:3003/countries')
    country_list.value = countries.data
  })

    async function send(){
        const result = await v$.value.$validate()

        if (result){
            status.value = "You have successfully added an airline to this database."
      
            axios.post('http://localhost:3003/add-airline', {airline_name: data.value.airline_select, country_id: data.value.country_select.id}
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
  
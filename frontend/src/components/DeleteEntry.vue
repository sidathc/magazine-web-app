<template>
    <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
        <v-btn
        v-bind="activatorProps"
        text="Delete Entry"
        variant="flat"
        ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
        <v-card title="Delete Entry">
        <v-card-text>
        <v-form v-model="valid">
        
            <v-text-field v-model = data.magazine_name label="Name of Magazine"></v-text-field>

            <v-combobox
                v-model = "data.month_select"
                label="Month of Issue"
                :items="month_list"
                item-value="id"
                item-title="name"
                :return-object="true"
                clearable
            ></v-combobox>

            <v-text-field v-model = data.year_of_issue label="Year of Issue"></v-text-field>
            <v-combobox
                v-model="data.airline_select"
                :items="airline_list"
                label="Airline"
                item-value="airline_id"
                item-title="airline_name"
                :return-object="true"
                clearable
            ></v-combobox>
        </v-form>

        <span class="text-red">{{ status }}</span>

        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
            text="Delete"
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
    const airline_list = ref([])
    const country_list = ref([])
    const month_list = ref([])
    const status = ref('')
    const valid = ref(false)
    const data = ref({magazine_name: ""}, {year_of_issue: ""}, {airline_select: ""}, {month_select: ""})
    const rules = {magazine_name: {required}, year_of_issue: {required}, airline_select: {required}, month_select: {required}}
    const v$ = useVuelidate(rules, data)

    onMounted(async () => {
    const countries = await axios.get('http://localhost:3003/countries')
    country_list.value = countries.data

    const airlines = await axios.get('http://localhost:3003/airlines')
    airline_list.value = airlines.data

    const months = await axios.get('http://localhost:3003/months')
    month_list.value = months.data
  })

    async function send(){
        const result = await v$.value.$validate()

        if (result){
            status.value = "Your entry has been successfully deleted!"
            axios.post('http://localhost:3003/delete-entry', {magazine_name: data.value.magazine_name, month : data.value.month_select.id, year: data.value.year_of_issue, airline_id : data.value.airline_select.airline_id}
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
  
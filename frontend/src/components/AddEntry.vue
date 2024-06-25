<template>
    <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
        <v-btn
        v-bind="activatorProps"
        text="Add Entry"
        variant="flat"
        ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
        <v-card title="Add New Entry">
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
            text="Add"
            @click="send"
            ></v-btn>

        </v-card-actions>
        </v-card>
    </template>
    </v-dialog>
  </template>
  
  <script setup>
    import { ref, onMounted} from 'vue'
    import axios from 'axios'
    import useVuelidate from '@vuelidate/core';
    import {minValue, required, maxValue} from '@vuelidate/validators';

    // creating reactive variables 
    var airline_list = ref([])
    var country_list = ref([])
    var month_list = ref([])
    var status = ref('')
    var valid = ref(false)

    const data = ref({
        magazine_name:  "",
        year_of_issue: "",
        month_select: "",
        airline_select: ""
    })

    const rules = {magazine_name: {required}, year_of_issue: {required, minValue: minValue(1914), maxValue: maxValue(2025)}, month_select: {required}, airline_select: {required}}
    const v$ = useVuelidate(rules, data)

    onMounted(async () => {
    var countries = await axios.get('http://localhost:3003/countries')
    country_list.value = countries.data

    var airlines = await axios.get('http://localhost:3003/airlines')
    airline_list.value = airlines.data

    var months = await axios.get('http://localhost:3003/months')
    month_list.value = months.data
  })

    async function send(){
        const result = await v$.value.$validate()

        if (result){
            status.value = "Your entry has been successfully added!"      
            axios.post('http://localhost:3003/entry2', {magazine_name: data.value.magazine_name.trim(), month : data.value.month_select.id, year: data.value.year_of_issue, airline_id : data.value.airline_select.airline_id}
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
            console.log(result)
            alert("Error: Fill out the form correctly.")
            status.value = "Please try again." 
        }
    }

  </script>
  
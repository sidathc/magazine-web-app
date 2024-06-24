<template>
    <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
        <v-btn
        v-bind="activatorProps"
        color="surface-variant"
        text="Delete Entry"
        variant="flat"
        ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
        <v-card title="Delete Entry">
        <v-card-text>
        <v-form v-model="valid">
        
            Please enter all of the following fields to delete an entry.

            <v-text-field v-model = magazine_name label="Name of Magazine"></v-text-field>

            <v-combobox
                v-model = "month_select"
                label="Month of Issue"
                :items="month_list"
                item-value="id"
                item-title="name"
                :return-object="true"
                clearable
            ></v-combobox>

            <v-text-field v-model = year_of_issue label="Year of Issue"></v-text-field>
            <v-combobox
                v-model="airline_select"
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
            text="Close Dialog"
            @click="isActive.value = false"
            ></v-btn>

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

    // creating reactive variables 
    var magazine_name = ref('')
    var month_of_issue = ref('')
    var year_of_issue = ref('')
    var airline_list = ref([])
    var country_list = ref([])
    var month_list = ref([])
    var country_select = ref('')
    var airline_select = ref('')
    var month_select = ref('')
    var status = ref('')
    var valid = ref(false)


    onMounted(async () => {
    var countries = await axios.get('http://localhost:3003/countries')
    country_list.value = countries.data

    var airlines = await axios.get('http://localhost:3003/airlines')
    airline_list.value = airlines.data

    var months = await axios.get('http://localhost:3003/months')
    month_list.value = months.data
  })

    function send(){
        // console.log("Sent!")
        // console.log(airline_select.value)
        status.value = "Your entry has been successfully deleted!"

        // status.value = "Your entry has been added to the database. You can use the query tool above to find your entry."
        // console.log(`You just added the country: ${magazine_name.value }.`)
       
        axios.post('http://localhost:3003/delete', {magazine_name: magazine_name.value, month : month_select.value.id, year: year_of_issue.value, airline_id : airline_select.value.airline_id}
        )
        .then(function (response) {
        console.log(response);
        })
        .catch(function (error) {
        console.log(error);
        });  
    }


  </script>
  
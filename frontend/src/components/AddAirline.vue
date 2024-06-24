<template>
    <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
        <v-btn
        v-bind="activatorProps"
        color="surface-variant"
        text="Add Airline"
        variant="flat"
        ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
        <v-card title="Add Airline">
        <v-card-text>
        <v-form v-model="valid">
        
            Please provide the name of the airline and country of origin to add it to the database.

            <v-text-field v-model = airline_select label="Name of Airline"></v-text-field>

            <v-combobox
                v-model="country_select"
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
    var airline_name = ref('')
    // var magazine_name = ref('')
    // var month_of_issue = ref('')
    // var year_of_issue = ref('')
    // var airline_list = ref([])
    var country_list = ref([])
    // var month_list = ref([])
    var country_select = ref('')
    var airline_select = ref('')
    // var month_select = ref('')
    var status = ref('')
    var valid = ref(false)


    onMounted(async () => {
    var countries = await axios.get('http://localhost:3003/countries')
    country_list.value = countries.data
  })

    function send(){
        // console.log("Sent!")
        // console.log(airline_select.value)
        status.value = "You have successfully added an airline to this database."
      
        axios.post('http://localhost:3003/addairline', {airline_name: airline_select.value, country_id: country_select.value.id}
        )
        .then(function (response) {
        console.log(response);
        })
        .catch(function (error) {
        console.log(error);
        });  
    }


  </script>
  
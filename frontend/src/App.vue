<template>
  <v-app>
    <v-app-bar :elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

     <v-app-bar-title>Magazine Database</v-app-bar-title>
  </v-app-bar>
    
    <v-main>

    <v-divider></v-divider>
    <v-card-title class="text-h6">VIEW DATABASE ENTRIES</v-card-title>
    <v-card-title class="text-subtitle-2">Select a country:</v-card-title>

      <v-row no-gutters>
      <v-col order="1">
        <v-sheet class="pa-2 ma-2">
      <v-combobox
        v-model="select"
        :items="country_list"
        item-value="id"
        item-title="name"
        :return-object="true"
        clearable
      >
      </v-combobox>
        </v-sheet>
      </v-col>
      <v-col order="2">
        <v-sheet class="pa-2 ma-2">
          <v-btn
          size="large" 
          @click="submit">
        VIEW RECORDS
        </v-btn>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row>
      <v-col order="5">
        <v-sheet class="pa-2 ma-2">
          <v-data-table :items="results_array"></v-data-table>
        </v-sheet>
      </v-col>
    </v-row>

    <v-card-title class="text-h6">ADD ENTRY</v-card-title>
    <v-row>
      <v-col order="1">
        <v-sheet class="pa-2 ma-2">
          <v-text-field v-model="magazine_name" label="Magazine Name"></v-text-field>
        </v-sheet>
      </v-col>

      <v-col order="2">
        <v-sheet class="pa-2 ma-2">
          <v-text-field v-model="month" label="Month of Issue"></v-text-field>
        </v-sheet>
      </v-col>

      <v-col order="3">
        <v-sheet class="pa-2 ma-2">
          <v-text-field v-model="year" label="Year of Issue"></v-text-field>
        </v-sheet>
      </v-col>
    

    <v-col order="4">
        <v-sheet class="pa-2 ma-2">
          <v-combobox
        v-model="select_airline"
        :items="airline_list"
        item-value="airline_id"
        item-title="airline_name"
        :return-object="true"
        clearable
      >
      </v-combobox>
        </v-sheet>
      </v-col>

      <v-col order="5">
        <v-sheet class="pa-2 ma-2">
          <v-combobox
        v-model="select_country"
        :items="country_list"
        item-value="id"
        item-title="name"
        :return-object="true"
        clearable
      >
      </v-combobox>
        </v-sheet>
      </v-col>

      <v-col order="5">
        <v-sheet class="pa-2 ma-2">
          <v-btn
          size="large" 
          @click="addEntry">
        ADD ENTRY
        </v-btn>
        </v-sheet>
      </v-col>

    </v-row>
    <v-col order="5">
        <v-sheet class="pa-2 ma-2">
          <v-card-title class="text-subtitle-2">{{status}}</v-card-title>
        </v-sheet>
      </v-col>
    
  </v-main>
  

    <AppFooter />
  </v-app>
</template>

<script setup>
  //
  import { ref, onMounted} from 'vue'
  import axios from 'axios'

  var select = ref('')
  var select_airline = ref('')
  var select_country = ref('')
  var country_list = ref([''])
  var results_array = ref([])
  var magazine_name = ref('')
  var status = ref('')
  const month = ref('')
  const year = ref('')
  const airline_id = ref('')
  const country_id = ref('')
  var airline_list = ref([])


  onMounted(async () => {
    var countries = await axios.get('http://localhost:3003/countries')
    country_list.value = countries.data

    var airlines = await axios.get('http://localhost:3003/airlines')
    airline_list.value = airlines.data
  })

  function submit(){
    console.log(`You just clicked country_ID number ${select.value.id }.`)
    const article = {country_id: select.value.id}
    console.log("SUBMITTED")
    

    axios.get('http://localhost:3003/funny', {params: article})
      .then(function (response) {
      results_array.value = response.data
      console.log(results_array.value)
    })
    .catch(function (error) {
      console.log(error);
    }); 
  }

  function addEntry(){
    status.value = "Your entry has been added to the database. You can use the query tool above to find your entry."
    console.log(`You just added the country: ${magazine_name.value }.`)

    axios.post('http://localhost:3003/entry', {magazine_name: magazine_name.value, month : month.value, year: year.value, airline_id : select_airline.value.airline_id, country_id : select_country.value.id}
    )
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });  
  }
  
</script>

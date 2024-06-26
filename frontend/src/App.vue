<template>
  <v-app>
    <v-app-bar :elevation="2">
     <v-app-bar-title>Magazine Database</v-app-bar-title>
     <v-toolbar-items>
      <AddEntry />
      <AddAirline />
      <AddCountry />
      <DeleteEntry />
    </v-toolbar-items>
     
  </v-app-bar>
  
    <v-main>
      
    <v-card-title class="text-h6">VIEW DATABASE ENTRIES</v-card-title>

      <v-row no-gutters>
        
      <v-col order="1">
        <v-sheet class="pa-2 ma-2">
      <v-combobox
        label="Select a Country"
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
      <v-combobox
        label="Select an Airline"
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

      <v-col order="3">
        <v-sheet class="pa-2 ma-2">
          <v-text-field v-model= "year_select" label="Year" clearable></v-text-field>
        </v-sheet>
      </v-col>

      <v-col order="4">
        <v-sheet class="pa-2 ma-2">
          <v-text-field v-model= "magazine_select" label="Magazine Name" clearable></v-text-field>
        </v-sheet>
      </v-col>

      <v-col order="5">
        <v-sheet class="pa-2 ma-2">
          <v-btn
          size="x-large" 
          @click="submit"
          text="View Records">
        </v-btn>
        </v-sheet>
      </v-col>

    </v-row>

    <v-row>
      <v-col order="1">
        <v-sheet class="pa-2 ma-2">
          <v-data-table 
          :items="results_array"
          :headers="headers"
          ></v-data-table>
        </v-sheet>
      </v-col>
    </v-row>   

  </v-main>
  
    <AppFooter />
  </v-app>
</template>

<script setup>
  import { ref, onMounted} from 'vue'
  import axios from 'axios'

  const select = ref('')
  const country_list = ref([''])
  const results_array = ref([])
  const airline_list = ref([])
  const select_airline = ref('')
  const year_select = ref('')
  const magazine_select = ref('')

  const headers = [
  {key: 'magazine_id', title: 'ID'},
  {key: 'magazine_name', title: 'Name of Magazine'},
  {key: 'publication_month', title: 'Month'},
  {key: 'publication_year', title: 'Year'},
  {key: 'airline_id', title: 'Airline'},
  {key: 'country_id', title: 'Country'}
]

  onMounted(async () => {
    const countries = await axios.get('http://localhost:3003/countries')
    country_list.value = countries.data

    const airlines = await axios.get('http://localhost:3003/airlines')
    airline_list.value = airlines.data
  })

  function submit(){
    const article = {country_id: select.value.id, airline_id: select_airline.value.airline_id, year: Number(year_select.value), magazine_name : magazine_select.value}
    
    axios.get('http://localhost:3003/results', {params: article})
      .then(function (response) {
      results_array.value = response.data
      console.log(results_array.value)
    })
    .catch(function (error) {
      console.log(error);
    }); 
  }
  
</script>

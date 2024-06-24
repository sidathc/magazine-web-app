<template>
  <v-app>
    <v-app-bar :elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>

     <v-app-bar-title>Magazine Database</v-app-bar-title>

     <Add />
     <AddAirline />
     <AddCountry />
     <DeleteEntry />
     
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
          <!-- {{ results_array }} -->
          <v-data-table :items="results_array"></v-data-table>
        </v-sheet>
      </v-col>
    </v-row>    
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
  
</script>

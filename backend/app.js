const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const app = express();
const port = 3003;

app.use(express.json());
app.use(cors());

// method to tell the app to start listening for visitors
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

// request method to get a list of countries from the database
app.get('/countries', async (req, res) => {
    countries = await get_countries();
    res.header("Access-Control-Allow-Origin", "*");  
    res.send(countries)
})

// request method to get a list of airlines from the database
app.get('/airlines', async (req, res) => {
    airlines = await get_airlines();
    res.header("Access-Control-Allow-Origin", "*");  
    res.send(airlines)
})

// request method to get a list of months from the database
app.get('/months', async (req, res) => {
    months = await get_months();
    res.header("Access-Control-Allow-Origin", "*");  
    res.send(months)
})

// request method to query the database using the client's inputs to get results for the datatable
app.get('/results', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    const country_id = req.query.country_id
    const airline_id = req.query.airline_id
    let year = req.query.year
    const magazine_name = req.query.magazine_name

    if (year == 0){
        year = undefined
    }
    results = await view_records(country_id, airline_id, year, magazine_name)
    res.send(results)
}) 

// request method to update database to add a new airline
app.post('/add-airline', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    const name = req.body.airline_name
    const country_id = req.body.country_id
    add_airline(name, country_id);
    res.send("Successful")
})

// request method to update database to add a new country
app.post('/add-country', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    const name = req.body.country_name
    add_new_country(name);
    res.send("Successful")
})

// request method to update database to add a new magazine entry
app.post('/add-entry', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    const magazine_name = req.body.magazine_name
    const month = req.body.month
    const year = req.body.year
    const airline_id = req.body.airline_id
    let country_id = await get_country_id(airline_id)
    country_id = country_id[0]['country_id']
    country_id = parseInt(country_id)
    add_entry(magazine_name, month, year, airline_id, country_id)    
    res.send("Successful")
})

// request method to update database to delete an existing magazine entry
app.post('/delete-entry', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    const magazine_name = req.body.magazine_name
    const month = req.body.month
    const year = req.body.year
    const airline_id = req.body.airline_id
    let country_id = await get_country_id(airline_id)
    country_id = country_id[0]['country_id']
    country_id = parseInt(country_id)
    delete_entry(magazine_name, month, year); 
    res.send("Successful")
})

// function to insert a new airline into the database
async function add_airline(name, country_id) {
    query_name = `INSERT INTO public.airline(airline_name, country_id) VALUES ('${name}', ${country_id})`
    const client = new Client({
        user: 'postgres',
        password: 'Tiggerch',
        host: 'localhost',
        port: '5432',
        database: 'airline-magazines',
    });
    await client.connect();
    result = await client.query(query_name)
}

// function to insert a new country into the database
async function add_new_country(name) {
    query_name = `INSERT INTO public.countries(name) VALUES ('${name}')`
    const client = new Client({
        user: 'postgres',
        password: 'Tiggerch',
        host: 'localhost',
        port: '5432',
        database: 'airline-magazines',
    });
    await client.connect();
    result = await client.query(query_name)
}

// function to get the country id when provided an airline_id
async function get_country_id(airline_id)  {
    query_name = 'SELECT country_id FROM public.airline WHERE airline_id = ' + airline_id
    json_ver = connectToSQL(query_name);
    return json_ver
}

// function with DELETE script to delete an entry from database
async function delete_entry(magazine_name, month, year)  {
    query_name = `DELETE FROM public.magazine WHERE magazine_name = '${magazine_name}' AND publication_month = ${month} AND publication_year = ${year};`
    json_ver = connectToSQL(query_name);
    return json_ver
}

// function with SELECT script to get all countries from the database
async function get_countries()  {
    query_name = 'SELECT * FROM countries ORDER BY name'
    json_ver = connectToSQL(query_name);
    return json_ver
}

// function with SELECT script to get a list of all months
async function get_months()  {
    query_name = 'SELECT * FROM month ORDER BY id'
    json_ver = connectToSQL(query_name);
    return json_ver
}

// function with SELECT script to get a list of all airlines
async function get_airlines()  {
    query_name = 'SELECT * FROM airline ORDER BY airline_name'
    json_ver = connectToSQL(query_name);
    return json_ver
}

// function to connect to the SQL database
async function connectToSQL(query_name)  {
    const client = new Client({
        user: 'postgres',
        password: 'Tiggerch',
        host: 'localhost',
        port: '5432',
        database: 'airline-magazines',
    });
    await client.connect();
    console.log('connectToSQL: Connected to PostgreSQL database');

    result = await client.query(query_name);
    json_ver = result.rows
    client.end()
    return json_ver;
}

// function to view all records based on user input for fields
async function view_records(country_id, airline_id, year, magazine_name) {
    if (country_id == 25){
        query_name = 'SELECT * FROM magazine'
        if (airline_id != undefined){
            query_name += ' WHERE airline_id = ' + airline_id
        }
    }
    else{
        query_name = 'SELECT * FROM magazine WHERE'
        
        if (country_id != undefined){
            query_name += ' country_id = ' + country_id
        }
        if (airline_id != undefined){
            if (country_id == undefined){
                query_name += ' airline_id = ' + airline_id
            }
            else{
                query_name += ' AND airline_id = ' + airline_id
            }
        }
        if (year != undefined){
            if (airline_id != undefined || country_id != undefined){
                query_name += ' AND publication_year = ' + year
            }
            else{
                query_name += ' publication_year = ' + year
            }
        }
        if (magazine_name != undefined){
            if (airline_id != undefined || country_id != undefined || year != undefined){
                query_name += ` AND magazine_name LIKE '%` + magazine_name + `%'`
            }
            else{
                query_name += ` magazine_name LIKE '%` + magazine_name + `%'`
            }
        }
    }

    const client = new Client({
        user: 'postgres',
        password: 'Tiggerch',
        host: 'localhost',
        port: '5432',
        database: 'airline-magazines',
    });
    await client.connect();
    console.log('Connected to PostgreSQL database: From Query function');

    result = await client.query(query_name);
    const magazines_array = result.rows;
    const months = [ "", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    if (magazines_array.length > 0){
        for (let i = 0; i < magazines_array.length; i++){
            let selectedMonthName = months[magazines_array[i]['publication_month']]
            magazines_array[i]['publication_month'] = selectedMonthName
        }
    }

    for (let i=0; i < magazines_array.length; i++){
        const airline_name = await find_airline(magazines_array[i]['airline_id'])
        magazines_array[i]['airline_id'] = airline_name
    }

    for (let i=0; i < magazines_array.length; i++){
        const country_name = await find_country(magazines_array[i]['country_id'])
        magazines_array[i]['country_id'] = country_name
    }
    const json_ver = JSON.stringify(magazines_array);
    return json_ver
}

// function to get the airline name for a given airline_id
async function find_airline(airline_id) {
    query_name = 'SELECT airline_name FROM airline WHERE airline_id = ' + airline_id
    const json_ver = await connectToSQL(query_name);
    return json_ver[0]['airline_name']
}

// function to get the country name for a given country_id
async function find_country(country_id) {
    query_name = 'SELECT name FROM countries WHERE id = ' + country_id
    const json_ver = await connectToSQL(query_name);
    return json_ver[0]['name']
}

// function to INSERT a new entry into the database
async function add_entry(magazine_name, month, year, airline_id, country_id) {
    query_name = `INSERT INTO public.magazine(magazine_name, publication_month, publication_year, airline_id, country_id) VALUES ('${magazine_name}', ${month}, ${year}, ${airline_id}, ${country_id})`

    const client = new Client({
        user: 'postgres',
        password: 'Tiggerch',
        host: 'localhost',
        port: '5432',
        database: 'airline-magazines',
    });
    await client.connect();
    result = await client.query(query_name)
}
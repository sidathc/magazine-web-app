const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const app = express();
const port = 3003;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

app.get('/countries', async (req, res) => {
    // get countries from pg
    countries = await get_countries();
    res.header("Access-Control-Allow-Origin", "*");  
    res.send(countries)
})

app.get('/airlines', async (req, res) => {
    // get countries from pg
    airlines = await get_airlines();
    res.header("Access-Control-Allow-Origin", "*");  
    res.send(airlines)
})

app.get('/months', async (req, res) => {
    // get countries from pg
    months = await get_months();
    res.header("Access-Control-Allow-Origin", "*");  
    res.send(months)
})

app.get('/funny', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    // console.log(req.query.country_id);
    // res.send("success");
    results = await query(req.query.country_id)
    res.send(results)
}) 

app.post('/entry', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    var magazine_name = req.body.magazine_name
    var month = req.body.month
    var year = req.body.year
    var airline_id = req.body.airline_id
    var country_id = req.body.country_id

    query2(magazine_name, month, year, airline_id, country_id)
    res.send("Successful")
})

app.post('/entry2', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    var magazine_name = req.body.magazine_name
    var month = req.body.month
    var year = req.body.year
    var airline_id = req.body.airline_id
    var country_id = await get_country_id(airline_id)
    country_id = parseInt(country_id.replace(/\D/g,''))
    query2(magazine_name, month, year, airline_id, country_id)    
    res.send("Successful")
})

async function get_country_id(airline_id)  {
    query_name = 'SELECT country_id FROM public.airline WHERE airline_id = ' + airline_id
    json_ver = connectToSQL(query_name);
    return json_ver
}

async function get_countries()  {
    query_name = 'SELECT * FROM countries ORDER BY name'
    json_ver = connectToSQL(query_name);
    return json_ver
}

async function get_months()  {
    query_name = 'SELECT * FROM month ORDER BY id'
    json_ver = connectToSQL(query_name);
    return json_ver
}

async function get_airlines()  {
    query_name = 'SELECT * FROM airline ORDER BY airline_name'
    json_ver = connectToSQL(query_name);
    return json_ver
}

async function connectToSQL(query_name)  {
    const client = new Client({
        user: 'postgres',
        password: 'Tiggerch',
        host: 'localhost',
        port: '5432',
        database: 'airline-magazines',
    });
    await client.connect();
    console.log('Connected to PostgreSQL database');

    result = await client.query(query_name);
    var json_ver = JSON.stringify(result.rows);

    return json_ver;
}


async function query(country_id) {
    query_name = 'SELECT * FROM magazine WHERE country_id = ' + country_id
    result_json = connectToSQL(query_name);
    return result_json
}

async function query2(magazine_name, month, year, airline_id, country_id) {
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


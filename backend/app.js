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
    countries = await get_countries();
    res.header("Access-Control-Allow-Origin", "*");  
    res.send(countries)
})

app.get('/airlines', async (req, res) => {
    airlines = await get_airlines();
    res.header("Access-Control-Allow-Origin", "*");  
    res.send(airlines)
})

app.get('/months', async (req, res) => {
    months = await get_months();
    res.header("Access-Control-Allow-Origin", "*");  
    res.send(months)
})

app.get('/funny', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    // console.log(req.query.country_id);
    // res.send("success");
    results = await query(req.query.country_id)
    // console.log(results);
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

app.post('/addairline', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    var name = req.body.airline_name
    var country_id = req.body.country_id
    console.log(name, country_id)
    add_airline(name, country_id);
    res.send("Successful")
})

app.post('/addcountry', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    var name = req.body.country_name
    add_new_country(name);
    res.send("Successful")
})

app.post('/entry2', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    var magazine_name = req.body.magazine_name
    var month = req.body.month
    var year = req.body.year
    var airline_id = req.body.airline_id
    var country_id = await get_country_id(airline_id)
    country_id = country_id[0]['country_id']
    country_id = parseInt(country_id)
    query2(magazine_name, month, year, airline_id, country_id)    
    res.send("Successful")
})

app.post('/delete', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    var magazine_name = req.body.magazine_name
    var month = req.body.month
    var year = req.body.year
    var airline_id = req.body.airline_id
    var country_id = await get_country_id(airline_id)
    country_id = country_id[0]['country_id']
    country_id = parseInt(country_id)
    console.log(magazine_name, month, year, airline_id, country_id)
    // console.log(magazine_name, month,year)
    delete_entry(magazine_name, month, year); 
    res.send("Successful")
})

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

async function get_country_id(airline_id)  {
    query_name = 'SELECT country_id FROM public.airline WHERE airline_id = ' + airline_id
    json_ver = connectToSQL(query_name);
    return json_ver
}

async function delete_entry(magazine_name, month, year)  {
    query_name = `DELETE FROM public.magazine WHERE magazine_name = '${magazine_name}' AND publication_month = ${month} AND publication_year = ${year};`
    json_ver = connectToSQL(query_name);
    return json_ver
}

async function delete_entry(magazine_name, month, year)  {
    query_name = `DELETE FROM public.magazine WHERE magazine_name = '${magazine_name}' AND publication_month = ${month} AND publication_year = ${year};`
    console.log(query_name)
    json_ver = connectToSQL(query_name);
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
    json_ver = result.rows
    client.end()
    return json_ver;
}

async function query(country_id) {
    if (country_id == 25){
        query_name = 'SELECT * FROM magazine'
    }
    else{
        query_name = 'SELECT * FROM magazine WHERE country_id = ' + country_id
    }

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
    var what = result.rows;

    var months = [ "Zero", "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];

    if (what.length > 0){
        for (var i = 0; i < what.length; i++){
            var selectedMonthName = months[what[i]['publication_month']]
            what[i]['publication_month'] = selectedMonthName
        }
    }

    for (var i=0; i < what.length; i++){
        var airline_name = await find_airline(what[i]['airline_id'])
        what[i]['airline_id'] = airline_name
    }

    for (var i=0; i < what.length; i++){
        var country_name = await find_country(what[i]['country_id'])
        what[i]['country_id'] = country_name
    }

    // find_airline(what[0]['airline_id'])

    var json_ver = JSON.stringify(what);
    return json_ver
}

async function find_airline(airline_id) {
    query_name = 'SELECT airline_name FROM airline WHERE airline_id = ' + airline_id
    json_ver = await connectToSQL(query_name);
    return json_ver[0]['airline_name']
}

async function find_country(country_id) {
    query_name = 'SELECT name FROM countries WHERE id = ' + country_id
    json_ver = await connectToSQL(query_name);
    return json_ver[0]['name']
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
const fs = require("fs");
const mysql = require("mysql");
const fastcsv = require("fast-csv");
const { connect } = require("http2");

let stream = fs.createReadStream("Isha.csv");
let csvData= [];
let csvStream = fastcsv
    .parse()
    .on("data",function(data){
        csvData.push(data);
    })
    .on("end",function(){
        //remove the first line : header
        csvData.shift();

        //create new connection to db
        const connection = mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "Xornor@123",
            database: "csvUpload"

        });

        //open the connection
        connection.connect(error=>{
            if(error){
                console.error(error);
            } else {
                let query = "INSERT INTO category(id , name , description , created_at) VALUES ?";
                connection.query(query , [csvData] , (error,response)=>{
                    console.log(error || response);
                });
            }
        });
    });

    stream.pipe(csvStream);
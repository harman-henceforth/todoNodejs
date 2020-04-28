var mysql = require('mysql');

function handleDisconnect() {
    console.log("Database connection");
    // connection
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
    //  console.log("connection ",connection)
    connection.connect(function (err) { // The server is either down
        if (err) { // or restarting (takes a while sometimes).
            console.log('Db connection error:', err);
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log("----- MYSQL connection Setup successful -----");
        }
    });
    connection.on('error', function (err) {
        console.log('!!!!!!MYSQL DB error!!!!!!! ', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
            console.log("RESTART THE SERVER");
            handleDisconnect();
        } else { // connnection idle timeout (the wait_timeout
            throw err; // server variable configures this)
        }
    });
}

handleDisconnect();
package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var db *sql.DB

func main() {

	// Must have ENV file with connection properties
	godotenv.Load()

	// Capture connection properties.
	cfg := mysql.Config{
		User:                 os.Getenv("CINEMA_FUSION_DB_USERNAME"),
		Passwd:               os.Getenv("CINEMA_FUSION_DB_PASSWORD"),
		Net:                  "tcp",
		Addr:                 os.Getenv("CINEMA_FUSION_DB_ADDRESS"),
		AllowNativePasswords: true,
	}
	// Get a database handle.
	var err error

	// Open the database connection
	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	// Ping Database
	/*pingErr := db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}*/
	fmt.Println("Connected to Database Successfully!")
}

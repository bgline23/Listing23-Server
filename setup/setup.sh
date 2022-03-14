#!/bin/bash

# set -e

readonly EXPECTED_ARGS=3
readonly E_BADARGS=65
readonly MYSQL=`which mysql`
readonly CURRENT_DIR=$(dirname $0)
readonly DB_SCRIPT="$CURRENT_DIR/schema.sql"
readonly DATA_SCRIPT="$CURRENT_DIR/data.sql"
readonly PROC_SCRIPT="$CURRENT_DIR/procedures.sql"


# Check if user provided command line arguments
if [ $# -ne $EXPECTED_ARGS ]
then
  echo
  echo "Provide script arguments for $0: [dbname] [dbuser] [dbpass]"
  echo
  exit $E_BADARGS
fi

# Run the actual command

$MYSQL -uroot -p <<SQL
DROP DATABASE IF EXISTS $1; 
CREATE DATABASE $1;
DROP USER IF EXISTS '$2'@'%'; 
CREATE USER '$2'@'%' IDENTIFIED BY '$3';
GRANT ALL PRIVILEGES ON $1.* TO '$2'@'%' ;
USE $1; 
SOURCE $DB_SCRIPT;
SOURCE $DATA_SCRIPT; 
SOURCE $PROC_SCRIPT; 
FLUSH PRIVILEGES;
SQL


# Let the user know the database was created
echo
echo "Database:\t $1 "
echo "User:\t\t $2 "
echo "Script completed."
echo
# Setup
* Install MySQL

```sh
   sudo apt install mysql-server
```

* Start service

for SystemD

```bash
   sudo systemctl start mysql
   sudo systemctl status mysql
```

If you are met with message: System has not been booted with systemd as init system (PID 1). Can't operate.
Failed to connect to bus: Host is down

Use the below for SystemV

```bash
   sudo service mysql start
   sudo service mysql status 
```

* test root user login, use root password

```
   sudo mysql -uroot -p
   mysql>   exit
```

* Running the setup script

```sh
   sudo sh test.sh [my_db_name] [my_db_user] [my_password]
```

* Test the user login 

```sh
    mysql -uadmin -p
```

# Enable remote access

## Modify configuration file to allow external requests for the DB server

```sh
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

```

* Change the bind address

```sh
bind-address            = 0.0.0.0
```

* restart the mysql service

```sh
sudo systemctl restart mysql

```

# Connect the REST Api
* Note the mysql service port, and IP Address of the server

```
   hostname -I
   sudo mysql -uroot -p
   mysql>   SHOW GLOBAL VARIABLES LIKE 'PORT';
```

* Allow firewall port 3306

```sh
   sudo ufw enable
   sudo ufw allow 3306
   sudo /lib/ufw/ufw-init force-reload

```

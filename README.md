# Hestia
A web crawler to gather home prices and housing market info

## Running with Docker (Will run with NODE_ENV = 'production')
### Create and Run Container:
docker run -a STDERR -a STDOUT --init --rm --cap-add=SYS_ADMIN -e SQL_USER='{username}' -e SQL_PASSWORD='{password}' -e SQL_SERVER='sqlserver2019' -e SQL_PORT='1433' --name hestia --link sqlserver2019:sqlserver2019 otto45/hestia:1.0

NOTE: This container is designed to be ran to perform its web scraping, then be thrown away, so you will have to use docker run to create a container each time you want to web scrape.

### Create and Run Sql Server Container
docker run --privileged -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD={your_password}' -d -p 1433:1433 -m 2GB --name sqlserver2019 mcr.microsoft.com/mssql/server:2019-latest

### Run Container Subsequently
docker container start sqlserver2019
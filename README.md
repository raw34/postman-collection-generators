# postman-collection-generators

# Usage
## Using in CLI
### Installation
`npm install -g postman-collection-generators`

### Generate postman-collection from openapi description format file
`postman-collection-generators --source=examples/openapi.json --filter=examples/openapi_filter.csv`

### Generate postman-collection from swagger description format file
`postman-collection-generators --source=examples/swagger.json --filter=examples/swagger_filter.csv`

### Generate postman-collection from charles session format file
`postman-collection-generators --source=examples/charles.chlsj --filter=examples/charles_filter.csv`

### Generate postman-collection from postman collection format file
`postman-collection-generators --source=examples/postman.json --filter=examples/postman_filter.csv`

## Using as a Library
### Installation
`npm install postman-collection-generators`
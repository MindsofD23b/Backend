.PHONY: test 

# Docker
DOCKER = docker
IMAGE_NAME = nethr-backend
CONTAINER_NAME = Nethr-server

# Testing
PRISMA = prisma
NPX = npx
NPM = npm
TESTING_CONTAINER = test-postgres

all: run

build: 
	$(DOCKER) build -t $(IMAGE_NAME) .

run: build
	$(DOCKER) run -d --name $(CONTAINER_NAME) -p 5679:5679 $(IMAGE_NAME):latest

test: 
	$(DOCKER) run -d --rm \
		--name $(TESTING_CONTAINER) \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres \
		-e POSTGRES_DB=testdb \
		-p 5432:5432 \
		postgres
	
	$(NPX) $(PRISMA) generate

	$(NPX) $(PRISMA) migrate deploy

	$(NPM) test

	$(DOCKER) stop $(TESTING_CONTAINER)


clean:
	$(DOCKER) stop $(CONTAINER_NAME)
	$(DOCKER) rm $(CONTAINER_NAME)
	$(DOCKER) rmi $(IMAGE_NAME)

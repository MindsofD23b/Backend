.PHONY: test test-withoutsq

# Docker
DOCKER = docker
IMAGE_NAME = nethr-backend
CONTAINER_NAME = Nethr-server
DB_CONTAINER = nethr-srv-db

# Testing
PRISMA = prisma
NPX = npx
NPM = npm
TESTING_CONTAINER = test-postgres
JEST = jest

all: run

build: test
	$(DOCKER) build -t $(IMAGE_NAME) .

	$(DOCKER) run -d --rm \
		--name $(DB_CONTAINER) \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres \
		-e POSTGRES_DB=testdb \
		-p 5432:5432 \
		postgres
	
frbuild: 
	$(DOCKER) build -t $(IMAGE_NAME) .

	$(DOCKER) run -d --rm \
		--name $(DB_CONTAINER) \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres \
		-e POSTGRES_DB=testdb \
		-p 5432:5432 \
		postgres
	

run: 
	$(DOCKER) run -d --name $(CONTAINER_NAME) -p 5679:5679 $(IMAGE_NAME):latest

export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/testdb?schema=public
export JWT_SECRET="TESTSECRET"

lint:
	$(NPM) run lint

test-run: lint
	$(DOCKER) run -d --rm \
		--name $(TESTING_CONTAINER) \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres \
		-e POSTGRES_DB=testdb \
		-p 5432:5432 \
		postgres


	$(NPX) $(PRISMA) generate
	$(NPX) $(PRISMA) migrate deploy
	$(NPX) $(JEST) --coverage

	$(DOCKER) stop $(TESTING_CONTAINER)

test: test-run coverage/lcov.info
	$(DOCKER) run --rm \
		-e SONAR_HOST_URL="http://sonarqube:9000" \
		-e SONAR_SCANNER_OPTS="-Dsonar.projectKey=Nethr" \
		-e SONAR_TOKEN="sqa_6222ed2405055267669af129dd3f3dd597803adf" \
		--network sonar-net \
		-v .:/usr/src \
		-u $(id -u):$(id -g) \
		sonarsource/sonar-scanner-cli


clean-coverage:
	$(NPX) rimraf coverage

test-withoutsq:
	$(MAKE) test-run

	$(NPX) rimraf coverage

sonar:
	$(DOCKER) compose up -d

reset:
	$(DOCKER) stop $(TESTING_CONTAINER)


clean:
	$(DOCKER) stop $(CONTAINER_NAME)
	$(DOCKER) rm $(CONTAINER_NAME)
	$(DOCKER) rmi $(IMAGE_NAME)


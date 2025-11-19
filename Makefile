DOCKER = docker
IMAGE_NAME = nethr-backend
CONTAINER_NAME = Nethr-server

all: run

build: 
	$(DOCKER) build -t $(IMAGE_NAME) .

run: build
	$(DOCKER) run -d --name $(CONTAINER_NAME) -p 5679:5679 $(IMAGE_NAME):latest

clean:
	$(DOCKER) stop $(CONTAINER_NAME)
	$(DOCKER) rm $(CONTAINER_NAME)
	$(DOCKER) rmi $(IMAGE_NAME)

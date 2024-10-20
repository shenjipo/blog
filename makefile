define RUN_LOCAL_TXT
Which service do you want to start run?
  1) _front-backend-server
  2) _front-server
  3) _backend-server
  4) _build-server
  5) _build-client-docker
  6) _build-server-image
  7) _build-nginx-image
  8) docker compose
  9) docker-build-tar
  10) _build-mysql-image
endef
export RUN_LOCAL_TXT

.PHONY: run
run:
	@echo "$$RUN_LOCAL_TXT";
	@read -p "ENTER THE NUMBER: " SERVICE ;\
 	if [ "$$SERVICE" = "1" ]; then make _front-backend-server; fi ;\
 	if [ "$$SERVICE" = "2" ]; then make _front-server; fi ;\
 	if [ "$$SERVICE" = "3" ]; then make _backend-server; fi ;\
	if [ "$$SERVICE" = "4" ]; then make _build-server; fi ;\
	if [ "$$SERVICE" = "5" ]; then make _build-client-docker; fi ;\
	if [ "$$SERVICE" = "6" ]; then make _build-server-image; fi ;\
	if [ "$$SERVICE" = "7" ]; then make _build-nginx-image; fi ;\
	if [ "$$SERVICE" = "8" ]; then make _docker-compose; fi ;\
	if [ "$$SERVICE" = "9" ]; then make _docker-build-tar; fi ;\
	if [ "$$SERVICE" = "10" ]; then make _build-mysql-image; fi ;\
.PHONY: _front-backend-server
_front-backend-server:
	pnpm dev & pnpm start-server

.PHONY: _front-server
_front-server:
	pnpm dev

.PHONY: _backend-server
_backend-server:
	pnpm start-server

.PHONY: _build-server
_build-server:
	pnpm build-server

.PHONY: _build-client-docker
_build-client-docker:
	pnpm build-client-docker

.PHONY: _build-server-image
_build-server-image:
	docker build -f Dockerfile.node -t blog-server:latest .

.PHONY: _build-nginx-image
_build-nginx-image:
	docker build -f Dockerfile.nginx -t blog-nginx:latest .

.PHONY: _build-mysql-image
_build-mysql-image:
	docker build -f Dockerfile.mysql -t blog-mysql:latest .

.PHONY: _docker-compose
_docker-compose:
	docker-compose up

.PHONY: _docker-build-tar
_docker-build-tar:
	docker save -o ./blog/blog-nginx.tar blog-nginx:latest
	docker save -o ./blog/blog-server.tar blog-server:latest
	docker save -o ./blog/blog-mysql.tar blog-mysql:latest

define RUN_LOCAL_TXT
Which service do you want to start run?
  1) _front-backend-server
  2) _front-server
  3) _backend-server
  4) _build-server
  5) _build-client

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
	if [ "$$SERVICE" = "5" ]; then make _build-client; fi ;\
	
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

.PHONY: _build-client
_build-client:
	pnpm build-client-docker

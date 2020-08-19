# Use /oauth step1 and 2 for getting your token
TOKEN=$(shell cat ../../secret/access_token.txt)

.PHONY: stats segments
all: starred.json
	mkdir -p ./details
	for i in `cat $< | jq '.[] | {id}' | grep id | awk -F: '{print $$2}'`;do \
		make details/$$i.json; \
	done

all.json:
	@echo "[" > $@;\
	for j in details/*.json;do \
		cat $$j >> $@;\
		echo "," >> $@; \
	done; \
	gsed -i '$$ s/.$$//' $@;\
	echo "]" >> $@

details/%.json:
	curl -X \
	GET "https://www.strava.com/api/v3/segments/$*" \
	-H "accept: application/json" \
	-H "authorization: Bearer ${TOKEN}" > $@

starred.json:
	curl -X \
	GET "https://www.strava.com/api/v3/segments/starred" \
	-H "accept: application/json" \
	-H "authorization: Bearer ${TOKEN}" > $@

stats: segments.json all.json
	echo "# of segments in segments.json: `cat segments.json | jq '.[] | {id}' | grep id |wc -l`"
	echo "# of segments in all.json: `cat all.json | jq '.[] | {id}' | grep id |wc -l`"


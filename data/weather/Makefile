hourly.json: weather.json
	cat $< | \
	jq '[.properties.periods[] | {startTime, temperature, windSpeed, windDirection, shortForecast}] ' > $@

weather.json:
	curl -X \
	GET "https://api.weather.gov/gridpoints/CHS/86,76/forecast/hourly" \
	-H "accept: application/json" > $@

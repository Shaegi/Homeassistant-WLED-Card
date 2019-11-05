Installation
1. Set up MQTT Broker for WLED (restart after setting it)

2. Download libs and put them into config/www/lib on your hassio
https://robinparisi.github.io/tingle/
https://iro.js.org/introduction.html

3. Download repo and put it under www/wled_control/

2. Add this to ressources in config/lovelace.ui.yaml
````
  - url: /local/lib/tingle.min.css
    type: css
  - url: /local/wled_control/static/wled.css
    type: css
  - url: /local/wled_control/static/effects.js
    type: js
  - url: /local/wled_control/static/fastLEDPallete.js
    type: js
  - url: /local/lib/tingle.min.js
    type: js
  - url: /local/lib/iro.min.js
    type: js
  - url: /local/wled_control/wled_control.js
    type: module

```` 
3. Add the custom card like this

````

- type: custom:wled-control-card
        topic: "wled/[MQTTCHANNEL]"
        ip: "[WLEDIP]"
        title: WLED Strip
        
````

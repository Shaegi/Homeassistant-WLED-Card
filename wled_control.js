require('/test.js')

const defaultState = {
  fx: 0,
  brightness: 0,
  primColor: '#fffff',
  fxSpeed: 0,
  fxIntensity: 0,
}


class ContentCardExample extends HTMLElement {

  set hass(hass) {
    const self = this

    this.instance = hass
    if (!this.content) {
      this.content = document.createElement('div');
      fetch(`http://${this.config.ip}/win`, {
        headers: {},
        mode: "cors"
      }).then(res => {
        return res.text()
      }).then(res => {
        const xmlDoc = (new DOMParser()).parseFromString(res, "text/xml")
        const primColor = {
          r: Number(xmlDoc.getElementsByTagName('cl')[0].innerHTML),
          g: Number(xmlDoc.getElementsByTagName('cl')[1].innerHTML),
          b: Number(xmlDoc.getElementsByTagName('cl')[2].innerHTML)
        }
        const color = new iro.Color()

        function rgbToHex(r, g, b) {
          return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        self.state = {
          fx: Number(xmlDoc.getElementsByTagName('fx')[0].innerHTML),
          brightness: xmlDoc.getElementsByTagName('ac')[0].innerHTML,
          primColor: rgbToHex(primColor.r, primColor.g, primColor.b),
          fxSpeed: xmlDoc.getElementsByTagName('sx')[0].innerHTML,
          fxIntensity: xmlDoc.getElementsByTagName('ix')[0].innerHTML,
        }
        self.initContent()
      }).catch(err => {
        self.state = defaultState
        self.initContent()
      })
    }
  }

  initContent() {
    const self = this
    const result = this.state
    const modal = this.initModal(result)
    const card = document.createElement('ha-card');
    card.header = this.config.title;
    this.content = document.createElement('div');
    this.content.style.padding = '0 16px 16px';
    this.content.className = 'card'
    this.appendChild(card);
    card.append(this.content);

    const entityId = this.config.entity;
    const title = this.config.title

    this.content.innerHTML = `
            The state of ${this.title} is ${result.brightness > 0}!
          `

    const button = document.createElement('button')
    button.innerHTML = "Toggle"
    button.addEventListener('click', function () {
      self.mqttPublish("T")
    })

    const detailsButton = document.createElement('button')
    detailsButton.innerHTML = 'Open Details'

    detailsButton.addEventListener('click', function () {
      self.modal.open()
    })

    this.content.append(detailsButton)
    this.content.append(button)
  }

  initModal() {
    var modal = new tingle.modal({
      closeMethods: ['overlay', 'button', 'escape'],
      closeLabel: "Close",
      cssClass: ['custom-class-1', 'custom-class-2']
    });

    const content = document.createElement('div')
    const FXSection = this.createFXSection()
    const colorSection = this.createColorSection()

    content.append(FXSection)
    content.append(colorSection)

    modal.setContent(content);

    this.fxSelect.onchange(null, Number(this.state.fx))

    this.modal = modal
  }

  initFXSelect() {
    const el = document.createElement('select')
    const self = this
    effects.forEach(function (effect) {
      const option = document.createElement('option')
      option.selected = self.state.fx && effect.value === self.state.fx
      option.innerHTML = effect.label
      option.value = effect.value
      el.append(option)
    })

    el.onchange = function (ev, effectValue) {
      let value = effectValue
      if (ev && ev.target.value) {
        value = Number(ev.target.value)
      }
      const effect = effects.find(function (effect) {
        return effect.value === value
      })

      self.mqttPublishAPI(`FX=${value}`)

      if (effect.primaryColor === false) {
        self.primColorPicker.style.display = 'none'
      } else {
        self.primColorPicker.style.display = 'block'
      }

      if (effect.secondaryColor === false) {
        self.secColorPicker.style.display = 'none'
      } else {
        self.secColorPicker.style.display = 'block'
      }
    }
    this.fxSelect = el
    return el
  }

  createSlider(onChange, value = 0, headline, min = 0, max = 100) {
    const wrap = document.createElement('div')
    if (headline) {
      const hEl = document.createElement('h3')
      hEl.innerHTML = headline
      wrap.append(hEl)
    }
    const el = document.createElement('input')
    el.style.display = "block"
    el.type = 'range'
    el.min = min
    el.max = max
    el.value = value
    el.addEventListener('change', onChange)
    wrap.append(el)
    return wrap
  }

  createColorSection() {
    const section = document.createElement('div')
    const headline = document.createElement('h2')
    headline.innerHTML = 'Color'

    const picker = document.createElement('div')
    picker.style.display = 'flex'
    const primWrapper = this.primColorPicker = document.createElement('div')
    //primary color
    const primColorPicker = this.initColorPicker("CL=", this.state.primColor)
    const primHeadline = document.createElement('h2')
    primHeadline.innerHTML = 'Primary Color'
    primWrapper.append(primHeadline)
    primWrapper.append(primColorPicker)

    const secWrapper = this.secColorPicker = document.createElement('div')
    //sec color
    const secColorPicker = this.initColorPicker("C2=")
    const secHeadline = document.createElement('h2')
    secHeadline.innerHTML = 'Secondary Color'
    secWrapper.append(secHeadline)
    secWrapper.append(secColorPicker)

    section.append(headline)
    picker.append(primWrapper)
    picker.append(secWrapper)

    section.append(picker)
    return section
  }

  createFXSection() {
    const FXSection = document.createElement('div')

    const FXHeadline = document.createElement('h2')
    FXHeadline.innerHTML = 'Effects'

    const FXSelect = this.initFXSelect()
    const FXSpeedSlider = this.initFXSpeedSlider()
    const FXIntensitySlider = this.initFXIntensitySlider()

    FXSection.append(FXHeadline)
    FXSection.append(FXSelect)
    FXSection.append(FXSpeedSlider)
    FXSection.append(FXIntensitySlider)

    return FXSection
  }

  initFXSpeedSlider() {
    const self = this
    const onChange = function (ev) {
      const value = ev.target.value
      self.mqttPublishAPI(`SX=${value}`)
    }

    return this.createSlider(onChange, this.state.fxSpeed, "Effect speed")
  }

  initFXIntensitySlider() {
    const self = this
    const onChange = function (ev) {
      const value = ev.target.value
      self.mqttPublishAPI(`IX=${value}`)
    }

    return this.createSlider(onChange, this.state.fxIntensity, "Effect intensity")
  }

  initColorPicker(api, initColor) {
    const el = document.createElement('div')
    var colorPicker = new iro.ColorPicker(el, {
      height: 200,
      padding: 0,
      color: initColor
    });
    const self = this
    colorPicker.on("color:change", function (event) {
      const rgb = event.rgb
      self.mqttPublishAPI(api + event.hexString)
    })
    return el
  }

  mqttPublishAPI(payload) {
    this.mqttPublish(payload, this.config.topic + '/api')
  }

  mqttPublish(payload, topic = this.config.topic) {
    this.instance.callService('mqtt', 'publish', {
      topic,
      payload
    })
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
}

customElements.define('wled-control-card', ContentCardExample);
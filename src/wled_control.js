import Tingle from 'tingle.js'
import "tingle.js/dist/tingle.css"
import Iro from '@jaames/iro'
import "./static/wled.css";
import fastLEDPalette from './static/fastLEDPallete'
import effects from './static/effects'
import icons from './static/icons'

const defaultState = {
  fx: 0,
  brightness: 0,
  primColor: '#fffff',
  fastLEDPalette: 0,
  fxSpeed: 0,
  fxIntensity: 0,
}

class WledControlCard extends HTMLElement {

  set hass(hass) {
    const self = this
    this.instance = hass
    if (!this.content) {
      this.content = document.createElement('div');
      this.showLoadingState()
      fetch(`http://${this.config.ip}/win`, {
          headers: {},
          mode: 'cors',
        }).then(res => {
          return res.text()
        }).then(res => {
          const xmlDoc = (new DOMParser()).parseFromString(res, "text/xml")
          const primColor = {
            r: Number(xmlDoc.getElementsByTagName('cl')[0].innerHTML),
            g: Number(xmlDoc.getElementsByTagName('cl')[1].innerHTML),
            b: Number(xmlDoc.getElementsByTagName('cl')[2].innerHTML)
          }

          const secColor = {
            r: Number(xmlDoc.getElementsByTagName('cs')[0].innerHTML),
            g: Number(xmlDoc.getElementsByTagName('cs')[1].innerHTML),
            b: Number(xmlDoc.getElementsByTagName('cs')[2].innerHTML)
          }

          function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
          }

          self.state = {
            fx: Number(xmlDoc.getElementsByTagName('fx')[0].innerHTML),
            brightness: xmlDoc.getElementsByTagName('ac')[0].innerHTML,
            primColor: rgbToHex(primColor.r, primColor.g, primColor.b),
            secColor: rgbToHex(secColor.r, secColor.g, secColor.b),
            fxSpeed: xmlDoc.getElementsByTagName('sx')[0].innerHTML,
            fxIntensity: xmlDoc.getElementsByTagName('ix')[0].innerHTML,
            fastLEDPalette: Number(xmlDoc.getElementsByTagName('fp')[0].innerHTML)
          }
          self.initContent()
        })
        .catch((err) => {
          self.state = defaultState
          console.warn('Could not fetch data,', err)
          self.initContent()
        })
    }
  }

  showLoadingState() {
    const card = document.createElement('ha-card');
    card.header = this.config.title;
    const loadingWrapper = document.createElement('div')
    loadingWrapper.innerHTML = 'Loading...'
    loadingWrapper.id = 'loadingWrapper'
    this.content.append(loadingWrapper)
    card.append(this.content)
  }

  initCardStyle() {
    const el = document.createElement('style')
    el.innerHTML = `
      button {
        background: none;
        padding: 10px;
        margin: 5px;
        cursor: pointer;
        border: 3px solid #2c3e50;
        color: #2c3e50;
        font-weight: 600;
      }

      svg {
        cursor: pointer;
        height: 8vmin;
        width: 8vmin;
        min-height: 64px;
        min-width: 64px;
      }
    `

    return el
  }

  initContent() {
      console.log('init content')
    const self = this
    const result = this.state
    const card = document.createElement('ha-card');
    this.initModal(result)
    card.header = this.config.title;
    //clear loading
    this.content = document.createElement('div');
    this.content.style.padding = '0 16px 16px';
    this.content.className = 'wled-control-card'
    card.append(this.initCardStyle())
    this.appendChild(card);
    card.append(this.content);
    this.content.append(this.initCardContent())
    
    const title = this.config.title
  }

  initCardContent() {
    const self = this
    const el = document.createElement('div')

    this.lampIcon = document.createElement('div')
    this.lampIcon.style.display = 'flex';
    this.lampIcon.style.justifyContent = 'center'

    this.updateOnState(self)

    this.lampIcon.onclick = function () {
      const brightnessSlider = self.brightnessSlider.querySelector('input')
      if (self.state.brightness == 0) {
        //on
        self.state.brightness = 127
        brightnessSlider.value = 127
      } else {
        //off
        self.state.brightness = 0
        brightnessSlider.value = 0
      }
      self.updateOnState(self)
      self.mqttPublish("T")
    }

    const detailsButton = document.createElement('button')
    detailsButton.innerHTML = 'Open Details'

    detailsButton.addEventListener('click', function () {
      console.log('open', self.modal)
      self.modal.open()
    })

    el.append(this.lampIcon)
    el.append(detailsButton)

    return el
  }

  updateOnState (self){
    const icon = icons[this.config.icon || 'lamp']
    if (Number(self.state.brightness) > 0) {
      //on
      self.lampIcon.innerHTML = icon.on
    } else {
      //off
      self.lampIcon.innerHTML = icon.off
    }
  }

  initModal() {
    var modal = new Tingle.modal({
      closeMethods: ['overlay', 'button', 'escape'],
      closeLabel: "Close",
      cssClass: ['custom-class-1', 'custom-class-2']
    });

    const content = document.createElement('div')
    const FXSection = this.createFXSection()
    const colorSection = this.createColorSection()
    const brightnessSection = this.initBrightnessSection()

    content.append(brightnessSection)
    content.append(FXSection)
    content.append(colorSection)

    modal.setContent(content);

    this.fxSelect.onchange(null, Number(this.state.fx))

    this.modal = modal
  }

  initBrightnessSection () {
    const self = this

    const section = document.createElement('div')
    const headline = document.createElement('h2')
    headline.innerHTML = 'Color'

    const onChange = function (ev) {
      const value = ev.target.value
      self.mqttPublishAPI(`A=${value}`)
      self.state.brightness = value
      self.updateOnState(self)
    }

    this.brightnessSlider = createSlider(onChange, this.state.brightness, "Master Brightness", 0, 255)

    section.append(this.brightnessSlider)

    return section
  }

  initFXSelect() {
    const self = this
    const onChange = function (ev, effectValue, emitOnChange) {
      let value = effectValue
      if (ev && ev.target.value) {
        value = Number(ev.target.value)
      }
      const effect = effects.find(function (effect) {
        return effect.value === value
      })

      self.state.fx = value

      self.mqttPublishAPI(`FX=${value}`)
      self.changeColorPickerVisibility(effect.primColor, effect.secondaryColor)

      if (effect.fastLED === false) {
        self.fastLedSelectSection.style.display = 'none'
      } else {
        self.fastLedSelectSection.style.display = 'block'
      }

    }

    return this.fxSelect = createSelect(effects, self.state && self.state.fx ? self.state.fx : 0, onChange)
  }

  changeColorPickerVisibility(primVisible, secVisible) {
    if (primVisible === false) {
      this.primColorPicker.style.display = 'none'
    } else {
      this.primColorPicker.style.display = 'block'
    }

    if (secVisible === false) {
      this.secColorPicker.style.display = 'none'
    } else {
      this.secColorPicker.style.display = 'block'
    }
  }

  initFastLEDSelect() {
    const self = this
    const onChange = function (ev, paletteValue) {
      let value = paletteValue
      if (ev && ev.target.value) {
        value = Number(ev.target.value)
      }

      if (value > 5 || value === 1) {
        self.changeColorPickerVisibility(false, false)
      } else {
        self.fxSelect.onchange(null, self.state.fx, false)
      }

      self.state.fastLEDPalette = value

      self.mqttPublishAPI(`FP=${value}`)
    }

    const el = document.createElement('div')
    const headline = document.createElement('h3')
    headline.innerHTML = 'FastLED Palette'
    const fastLedSelect = this.fastLedSelect =
      createSelect(fastLEDPalette, self.state && self.state.fastLEDPalette ? self.state.fastLEDPalette : 0, onChange)
    el.append(headline)
    el.append(fastLedSelect)
    this.fastLedSelectSection = el
    return el
  }

  createColorSection() {
    const section = document.createElement('div')
    const headline = document.createElement('h2')
    headline.innerHTML = 'Color'

    const picker = document.createElement('div')
    picker.style.display = 'flex'
    picker.style.flexWrap = 'wrap'
    const primWrapper = this.primColorPicker = document.createElement('div')
    //primary color
    const primColorPicker = this.createColorPicker("CL=", this.state.primColor)
    const primHeadline = document.createElement('h3')
    primHeadline.innerHTML = 'Primary Color'
    primWrapper.append(primHeadline)
    primWrapper.append(primColorPicker)

    const secWrapper = this.secColorPicker = document.createElement('div')
    //sec color
    const secColorPicker = this.createColorPicker("C2=", this.state.secColor)
    const secHeadline = document.createElement('h3')
    secHeadline.innerHTML = 'Secondary Color'
    secWrapper.append(secHeadline)
    secWrapper.append(secColorPicker)

    const fastLedSelect = this.initFastLEDSelect()

    section.append(headline)
    section.append(fastLedSelect)
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

    return createSlider(onChange, this.state.fxSpeed, "Effect speed", 0, 255)
  }

  initFXIntensitySlider() {
    const self = this
    const onChange = function (ev) {
      const value = ev.target.value
      self.mqttPublishAPI(`IX=${value}`)
    }

    return createSlider(onChange, this.state.fxIntensity, "Effect intensity", 0, 255)
  }

  createColorPicker(api, initColor) {
    const el = document.createElement('div')
    var colorPicker = new Iro.ColorPicker(el, {
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


  //API Calls

  mqttPublishAPI(payload) {
    this.mqttPublish(payload, this.config.topic + '/api')
  }

  mqttPublish(payload, topic = this.config.topic) {
    try {
      this.instance.callService('mqtt', 'publish', {
        topic,
        payload
      })
    } catch(e) {
      console.log(e)
    }
  }

  setConfig(config) {
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 2;
  }
}


function createSlider(onChange, value = 0, headline, min = 0, max = 255) {
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

function createSelect(options, selectedValue, onChange) {
  const el = document.createElement('select')
  options.forEach(function (item) {
    const option = document.createElement('option')
    option.selected = item.value === selectedValue
    option.innerHTML = item.label
    option.value = item.value
    el.append(option)
  })

  el.onchange = onChange
  return el
}

customElements.define('wled-control-card', WledControlCard);
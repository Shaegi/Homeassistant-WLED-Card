const effects = [
  {
    label: "Solid",
    value: 0,
    secondaryColor: false,
    fastLED: false
  },
  {
    label: "Blink",
    value: 1,
    secondaryColor: true
  },
  {
    label: "Breath",
    value: 2,
    secondaryColor: false
  },
  {
    label: "Wipe",
    value: 3
  },
  {
    label: "Wipe Random",
    value: 4,
    primaryColor: false,
    secondaryColor: false
  },
  {
    label: "Random Colors",
    value: 5,
    primaryColor: false,
    secondaryColor: false
  },
  {
    label: "Sweep",
    value: 6
  },
  {
    label: "Dynamic",
    value: 7,
    primaryColor: false,
    secondaryColor: false
  },
  {
    label: "Colorloop",
    value: 8,
    primaryColor: false,
    secondaryColor: false
  },
  {
    label: "Rainbow",
    value: 9,
    primaryColor: false,
    secondaryColor: false
  },
  {
    label: "Scan",
    value: 10
  },
  {
    label: "Dual Scan",
    value: 11
  },
  {
    label: "Fade",
    value: 12
  },
  {
    label: "Theater",
    value: 13
  },
  {
    label: "Theater Rainbow",
    value: 14
  },
  {
    label: "Running",
    value: 15,
    secondaryColor: false
  },
  {
    label: "Saw",
    value: 16
  },
  {
    label: "Twinkle",
    value: 17
  },
  {
    label: "Dissolve",
    value: 18
  },
  {
    label: "Dissolve Rnd",
    value: 19
  },
  {
    label: "Sparkle",
    value: 20
  },
  {
    label: "Dark Sparkle",
    value: 21
  },
  {
    label: "Sparkle+",
    value: 22
  },
  {
    label: "Strobe",
    value: 23
  },
  {
    label: "Strobe Rainbow",
    value: 24
  },
  {
    label: "Mega Strobe",
    value: 25
  },
  {
    label: "Blink Rainbow",
    value: 26
  },
  {
    label: "Android",
    value: 27
  },
  {
    label: "Chase",
    value: 28
  },
  {
    label: "Chase Random",
    value: 29
  },
  {
    label: "Chase Rainbow",
    value: 30,
    secondaryColor: false
  },
  {
    label: "Chase Flash",
    value: 31
  },
  {
    label: "Chase Flash Rnd",
    value: 32
  },
  {
    label: "Rainbow Runner",
    value: 33
  },
  {
    label: "Colorful",
    value: 34,
    secondaryColor: false,
    primaryColor: false
  },
  {
    label: "Traffic Light",
    value: 35,
    secondaryColor: false,
    primaryColor: false
  },
  {
    label: "Sweep Random",
    value: 36,
    secondaryColor: false,
    primaryColor: false
  },
  {
    label: "Running 2",
    value: 37
  },
  {
    label: "Red & Blue",
    value: 38,
    secondaryColor: false,
    primaryColor: false
  },
  {
    label: "Stream",
    value: 39,
    secondaryColor: false,
    primaryColor: false
  },
  {
    label: "Scanner",
    value: 40
  },
  {
    label: "Lighthouse",
    value: 41
  },
  {
    label: "Fireworks",
    value: 42
  },
  {
    label: "Rain",
    value: 43
  },
  {
    label: "Merry Christmas",
    value: 44
  },
  {
    label: "Fire Flicker",
    value: 45
  },
  {
    label: "Gradient",
    value: 46
  },
  {
    label: "Loading",
    value: 47
  },
  {
    label: "Police",
    value: 48
  },
  {
    label: "Police All",
    value: 49
  },
  {
    label: "Two Dots",
    value: 50
  },
  {
    label: "Two Areas",
    value: 51
  },
  {
    label: "Circus",
    value: 52
  },
  {
    label: "Halloween",
    value: 53
  },
  {
    label: "Tri Chase",
    value: 54
  },
  {
    label: "Tri Wipe",
    value: 55
  },
  {
    label: "Tri Fade",
    value: 56
  },
  {
    label: "Lighting",
    value: 57
  },
  {
    label: "ICU",
    value: 58
  }, 
  {
    label: "Multi Comet",
    value: 59
  },
  {
    label: "Dual Scanner",
    value: 60
  },
  {
    label: "Stream 2",
    value: 61
  },
  {
    label: "Oscillate",
    value: 62
  },{
    label: "Pride 2015",
    value: 63
  },
  {
    label: "Juggle",
    value: 64
  },
  {
    label: "Palette",
    value: 65
  },
  {
    label: "Fire 2012",
    value: 66
  }, 
  {
    label: "Colorwaves",
    value: 67
  },
  {
    label: "BPM",
    value: 68
  },
  {
    label: "Fill Noise",
    value: 69
  },
  {
    label: "Noise 1",
    value: 70
  },{
    label: "Noise 2",
    value: 71
  },
  {
    label: "Noise 3",
    value: 72
  },
  {
    label: "Noise 4",
    value: 73
  },
  {
    label: "Colortwinkle",
    value: 74
  }, 
  {
    label: "Lake",
    value: 75
  },
  {
    label: "Meteor",
    value: 76
  },
  {
    label: "Smooth Meteor",
    value: 77
  },
  {
    label: "Railway",
    value: 78
  },
  {
    label: "Ripple",
    value: 79
  },
  {
    label: "Twinklefox",
    value: 80
  },
  {
    label: "Twinklecat",
    value: 81
  },
  {
    label: "Halloween Eyes",
    value: 82
  },
  {
    label: "Solid Pattern",
    value: 83
  },
  {
    label: "Solid Pattern Tri",
    value: 84
  },
  {
    label: "Spots",
    value: 85
  },
  {
    label: "Spots Fade",
    value: 86
  },
  {
    label: "Glitter",
    value: 87
  },
  {
    label: "Candle",
    value: 88
  },
  {
    label: "Fireworks Starburst",
    value: 89
  },
  {
    label: "Fireworks 1D",
    value: 90
  },
  {
    label: "Bouncing Balls",
    value: 91
  },
  {
    label: "Sinelon",
    value: 92
  },
  {
    label: "Sinelon Dual",
    value: 93
  },
  {
    label: "Sinelon Rainbow",
    value: 94
  },
  {
    label: "Popcorn",
    value: 95
  },
  {
    label: "Drip",
    value: 96
  },
  {
    label: "Plasma",
    value: 97
  },
  {
    label: "Percent",
    value: 98
  },
  {
    label: "Ripple Rainbow",
    value: 99
  },
  {
    label: "Heartbeat",
    value: 100
  },
  {
    label: "Pacifica",
    value: 101
  },
  {
    label: "Candle Multi",
    value: 102
  },
  {
    label: "Solid Glitter",
    value: 103
  },
  {
    label: "Sunrise",
    value: 104
  },
  {
    label: "Phased",
    value: 105
  },
  {
    label: "Twinkle Up",
    value: 106
  },
  {
    label: "Noise Pal",
    value: 107
  },
  {
    label: "Sinewave",
    value: 108
  },
  {
    label: "Phased Noise",
    value: 109
  },
  {
    label: "Flow",
    value: 110
  }
]
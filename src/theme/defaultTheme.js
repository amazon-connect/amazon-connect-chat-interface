// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

/* eslint-disable id-length */ // Doesn't make sense for this file
const palette = {
  white: '#FFFFFF', // white
  alabaster: '#FBFBFB', // basically white
  concrete: '#F3F3F3', // even lighter grey
  haze: '#F7F7F7', // invisible grey
  alto: '#DDDDDD', // light grey
  darkgold:"#E27710", 
  whiteSmoke: "#EFEFEF",
  mercury: '#F2F2F2', // lighter grey
  zumthor: '#EBF5FF', // background blue
  water: '#CEE5F6', // hover blue
  mango: '#E77600', // focus orange
  danube: '#6D9CCF', // border blue
  silver: '#BFBFBF', // medium grey
  inkwell: '#232F3E', // inkwell blue
  shuttle: '#556478', // inkwell blue 75
  azure: '#326295', // selected blue
  black: '#111111', // mostly black
  secondaryBlack: "#222222",
  emperor: '#555555', // dark grey
  boulder: '#767676', // light dark grey
  dustyGray: "rgba(242, 242, 242, 0.49)",
  darkGray: '#4A4A4A',
  lightGray: '#CCCCCC',
  mediumGrayAlt: "#777777",
  mediumGray: "#666666",
  whisper: '#EDEDED', // whisper / Gray93
  rust: '#C45500', // rust brown
  green: '#109B2B', // green
  lightGreen: '#AADFB4', // light green
  red: '#D0021B', // red
  yellow: '#F5A623',
  lightYellow: '#FDDF93',
  night: '#002B4F', // data viz 0
  aqua: '#2E8CB8', // data viz 1
  tangerine: '#DD7703', // data viz 2
  raspberry: '#A3317B', // data viz 3
  moss: '#678227', // data viz 4
  indigo: '#4F4FCD', // data viz 5
  apple: '#33C336', // high keyword traffic
  tea: '#BFEBB8', // med keyword traffic
  ghost: '#F5F9FA', // info callout bg
  honeydew: '#EFF5ED', // success callout bg
  linen: '#FFF5E9', // warning callout bg
  blush: '#FBEDED', // error callout bg
  tbd: 'transparent', // TBD COLORS
  brown: '#47596E',
  blue: '#329AD6',
  darkBlue: '#1067BA'
};

// Spacing
// ---------
// Raw values, in pixels
const spacingValues = {
  micro: 4,
  mini: 6,
  small: 10,
  base: 14,
  medium: 18,
  large: 22,
  xlarge: 26,
  xxlarge: 44,
};
const spacing = {};
Object.keys(spacingValues).forEach(key => {
  spacing[key] = `${spacingValues[key]}px`;
});

//  Defaults
// ---------

const fonts = {
  regular: `Arial, Helvetica, "sans-serif"`,
  light: `Arial, Helvetica, "sans-serif"`,
  medium: `Arial, Helvetica, "sans-serif"`,
  thick: `Arial, Helvetica, "sans-serif"`,
  bold: `Arial, Helvetica, "sans-serif"`,
  heavy: `Arial, Helvetica, "sans-serif"`
}

const fontsSize = {
  mini: "0.75rem", //12px
  small: "0.8125rem", //13px
  regular: "0.875rem", //14px
  large: "1.125rem", //18px
  extraLarge: "1.875rem", //30px
  system: "1rem", // 16px
  body: "0.875rem" //14px
  
}


const screen = {
  minWidth: 321,
  minHeight: 470,
  small: {
    width: 320,
    height: 460
  },
  medium: {
    width: 740,
    height: 760
  }
}


const color = {
  primary: "#06adcb",
  secondary: "#1166BB",
  success: palette.auigreen,
  warning: palette.mango,
  error: palette.red,
  boxShadowColor: palette.alto,
  borderColor: palette.dustyGray,
  highlightColor: "#398ADA"
}

const globals = {
  bodyBackground: palette.dustyGray,
  bodyFontColor: palette.black,
  bodyFontFamily: `${fonts.regular}, Helvetica, sans-serif`,
  bodyFontSize: '1em',
  textDisabledColor: palette.boulder,
  textSecondaryColor: palette.emperor,
  textTertiaryColor: palette.boulder,
  radius: '2px',
  boxShadowFocus: `0 0 2px 0 ${palette.mango}`,
  baseBorder: `1px solid ${palette.alto}`,
  baseMargin: spacing.small,
  basePadding: spacing.small,
  link: {
    color: palette.auiblue,
    hoverColor: palette.rust,
    decoration: 'none',
    hoverDecoration: 'underline',
    base: '1em',
    small: '0.9em',
    tiny: '0.8em',
  },
  // Applies to all disabled states
  disabled: `
    cursor: not-allowed;
    opacity: 0.7;
    outline: none;
  `,
};

export default {
  palette,
  spacingValues,
  spacing,
  globals,
  fonts,
  screen,
  color,

  // Typography
  // -------------
  typography: {
    color: {
      base: `
      color: ${globals.bodyFontColor};
      `,
      secondary: `
      color: ${globals.textSecondaryColor};
      `,
      tertiary: `
      color: ${globals.textTertiaryColor};
      `,
    },
    h1: `
      font-size: 28px;
      line-height: 1.2;
      font-weight: normal;
      font-family: ${globals.bodyFontFamily};
      padding: 0;
    `,
    h1Margin: '0.67em 0 0.34em 0',

    h2: `
      font-size: 21px;
      line-height: 1.3;
      font-weight: 700;
      font-family: ${globals.bodyFontFamily};
      padding: 0;
    `,
    h2Margin: '0.83em 0 0.42em 0',

    h3: `
      font-size: 17px;
      line-height: 1.255;
      font-weight: 700;
      font-family: ${globals.bodyFontFamily};
      padding: 0;
    `,
    h3Margin: '1em 0 0.5em 0',

    h4: `
      font-size: 17px;
      line-height: 1.255;
      font-weight: normal;
      font-family: ${globals.bodyFontFamily};
      padding: 0;
    `,
    h4Margin: '1.33em 0 0.67em 0',

    h5: `
      font-size: 13px;
      line-height: 1.465;
      font-weight: 700;
      font-family: ${globals.bodyFontFamily};
      padding: 0;
    `,
    h5Margin: '1.67em 0 0.84em 0',

    h6: `
      font-size: 11px;
      line-height: 1.465;
      font-weight: normal;
      font-family: ${globals.bodyFontFamily};
      text-transform: uppercase;
      padding: 0;
    `,
    h6Margin: '2.33em 0 1.17em 0',

    base: `
      font-size: ${globals.bodyFontSize};
      line-height: 1.465;
      font-weight: normal;
      font-family: ${globals.bodyFontFamily};
      padding: 0;
    `,
    baseMargin: '1em 0 0.5em 0',

    a: `
      font-size: ${globals.link.base};
      color: ${globals.link.color};
      text-decoration: ${globals.link.decoration};

      &:hover{
        color: ${globals.link.hoverColor};
        text-decoration: ${globals.link.hoverDecoration};
      }
    `
  },

// Button
button: {
  boxShadowFocus: globals.boxShadowFocus,
  color: globals.bodyFontColor,
  cursor: 'pointer',

  normal: {
    fontSize: fontsSize.body,
    padding: '0.45rem',
    boxShadow: '1px 2px 3px 0px rgba(0, 0, 0, 0.1)'
  },
  small: {
    fontSize: fontsSize.small,
    padding: spacing.micro,
  },

  default: {
    borderColor: '#fff #fff #fff',
    borderColorActive: '#fff #fff #fff',
    bg: 'linear-gradient(#FFFFFF,#FFFFFF 80%, #FFFFFF)',
    bgHover: 'linear-gradient(#fff, #f9f9f9)',
    bgDisabled: 'linear-gradient(#fff, #fff)',
  },

  primary: {
    borderColor: '#538000 #538000 #538000',
    borderColorActive: '#538000 #538000 #538000',
    bg: 'linear-gradient(#538000, #538000 80%, #649a00)',
    bgHover: 'linear-gradient(#649a00,#649a00)',
    bgDisabled: 'linear-gradient(#538000, #538000 80%, #538000)',
    color: palette.white
  },

  secondary: {
    borderColor: '#D0021B #D0021B #D0021B',
    borderColorActive: '#D0021B #D0021B #D0021B',
    bg: 'linear-gradient(#D0021B, #D0021B 80%, #e9021e)',
    bgHover: 'linear-gradient(#e9021e,#D0021B)',
    bgDisabled: 'linear-gradient(#D0021B, #D0021B 80%, #D0021B)',
    color: palette.white
  },

  tertiary: {
    borderColor: '#329AD6 #329AD6 #329AD6',
    borderColorActive: '#329AD6 #329AD6 #329AD6',
    bg: 'linear-gradient(#329AD6, #329AD6 80%, #47a4da)',
    bgHover: 'linear-gradient(#47a4da,#5cafde)',
    bgDisabled: 'linear-gradient(#329AD6, #329AD6 80%, #329AD6)',
    color: palette.white
  },

  standard: {
    borderColor: '#47596E #47596E #47596E',
    borderColorActive: '#47596E #47596E #47596E',
    bg: 'linear-gradient(#47596E, #47596E 80%, #47596E)',
    bgHover: 'linear-gradient(#476b94,#47596E)',
    bgDisabled: 'linear-gradient(#47596E, #47596E 80%, #47596E)',
    color: palette.white
  },

  secondary_alt: {
    borderColor: ' #CCCCCC #CCCCCC',
    borderColorActive: '#CCCCCC ##CCCCCC ##CCCCCC',
    bg: 'linear-gradient(#CCCCCC, #CCCCCC 80%, #CCCCCC)',
    bgHover: 'linear-gradient(#CCCCCC,#E6E6E6)',
    bgDisabled: 'linear-gradient(#CCCCCC, #47596E 80%, #CCCCCC)',
    color: palette.secondaryBlack
  },

  toggle: {
    borderColor: palette.silver,
    borderColorActive: palette.azure,
    bg: palette.white,
    bgHover: palette.concrete,
    bgActive: palette.zumthor,
  },
},
  // Message (Alerts)
  message: {
    iconSize: '24px',
    bg: palette.white,
    borderRadius: '3px',

    info: {
      bg: palette.ghost,
      solidBg: palette.auiblue,
      iconColor: palette.azure,
      color: globals.bodyFontColor,
      borderColor: palette.azure,
    },
    success: {
      bg: palette.honeydew,
      solidBg: palette.auigreen,
      iconColor: palette.auigreen,
      color: palette.auigreen,
      borderColor: palette.apple,
    },
    warning: {
      bg: palette.linen,
      solidBg: palette.mango,
      iconColor: palette.mango,
      color: palette.rust,
      borderColor: palette.rust,
    },
    error: {
      bg: palette.blush,
      solidBg: palette.red,
      iconColor: palette.red,
      color: palette.red,
      borderColor: palette.red,
    }
  },

  listItem: {
    selectedBg: palette.brown,
    selectedColor: palette.white,
    hoverBg: "#398ADA",
    hoverColor: palette.white,
    height: "38px"
  },


  contactStatusColors: {
    incoming: palette.blue,
    connected: palette.green,
    missed: palette.lightGrayAlt,
    acw: palette.lightGrayAlt,
    disconnected: palette.lightGrayAlt,
    connecting: palette.blue,
    ended: palette.lightGrayAlt,
    error: "#D0021B"
  },

  chatTranscriptor: {
    loading: color.primary,
    outgoingMsgBg: palette.lightGreen,
    incomingMsgBg: palette.whisper,
    outgoingMsg: `
      color: ${palette.secondaryBlack};
      background: ${palette.lightGreen};
      font-family: "${fonts.regular}";
      `,

    incomingMsg: `
      color: ${palette.secondaryBlack};
      background: ${palette.whisper};
      font-family: "${fonts.regular}";
      `
  }
};


/* eslint-enable */

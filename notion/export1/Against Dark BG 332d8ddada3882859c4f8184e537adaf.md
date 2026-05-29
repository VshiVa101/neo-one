# Against Dark BG

Owner: leo

# against Dark BG

https://leonardocolor.io/theme.html?name=NEO-PALETTE&config=%7B%22baseScale%22%3A%22Gray%22%2C%22colorScales%22%3A%5B%7B%22name%22%3A%22Gray%22%2C%22colorKeys%22%3A%5B%22%23000000%22%5D%2C%22colorspace%22%3A%22RGB%22%2C%22ratios%22%3A%5B%223%22%2C%223.66%22%2C%224.49%22%2C%225.39%22%2C%226.49%22%2C%227.84%22%2C%229.25%22%2C%2210.94%22%2C%2212.81%22%2C%2214.88%22%5D%2C%22smooth%22%3Afalse%7D%2C%7B%22name%22%3A%22acid+green%22%2C%22colorKeys%22%3A%5B%22%23b9df31%22%5D%2C%22colorspace%22%3A%22LAB%22%2C%22ratios%22%3A%5B%223%22%2C%223.66%22%2C%224.49%22%2C%225.39%22%2C%226.49%22%2C%227.84%22%2C%229.25%22%2C%2210.94%22%2C%2212.81%22%2C%2214.88%22%5D%2C%22smooth%22%3Afalse%7D%2C%7B%22name%22%3A%22candy+kiss%22%2C%22colorKeys%22%3A%5B%22%23ff5696%22%5D%2C%22colorspace%22%3A%22LAB%22%2C%22ratios%22%3A%5B%223%22%2C%223.66%22%2C%224.49%22%2C%225.39%22%2C%226.49%22%2C%227.84%22%2C%229.25%22%2C%2210.94%22%2C%2212.81%22%2C%2214.88%22%5D%2C%22smooth%22%3Afalse%7D%2C%7B%22name%22%3A%22candy+pink%22%2C%22colorKeys%22%3A%5B%22%23f5b0bd%22%5D%2C%22colorspace%22%3A%22LAB%22%2C%22ratios%22%3A%5B%223%22%2C%223.66%22%2C%224.49%22%2C%225.39%22%2C%226.49%22%2C%227.84%22%2C%229.25%22%2C%2210.94%22%2C%2212.81%22%2C%2214.88%22%5D%2C%22smooth%22%3Afalse%7D%5D%2C%22lightness%22%3A0%2C%22contrast%22%3A1%2C%22saturation%22%3A100%2C%22formula%22%3A%22wcag2%22%7D

SVG KIT 

[NEO-PALETTE.svg](NEO-PALETTE.svg)

contrast check (+18px pass) 

![image.png](image.png)

js 

```jsx
let gray = new Leo.Color({
  name: "Gray",
  colorKeys: ['#000000'],
  ratios: [3,3.66,4.49,5.39,6.49,7.84,9.25,10.94,12.81,14.88],
  colorspace: "RGB",
  smooth: false
});

let acidGreen = new Leo.Color({
  name: "acid green",
  colorKeys: ['#b9df31'],
  ratios: [3,3.66,4.49,5.39,6.49,7.84,9.25,10.94,12.81,14.88],
  colorspace: "LAB",
  smooth: false
});

let candyKiss = new Leo.Color({
  name: "candy kiss",
  colorKeys: ['#ff5696'],
  ratios: [3,3.66,4.49,5.39,6.49,7.84,9.25,10.94,12.81,14.88],
  colorspace: "LAB",
  smooth: false
});

let candyPink = new Leo.Color({
  name: "candy pink",
  colorKeys: ['#f5b0bd'],
  ratios: [3,3.66,4.49,5.39,6.49,7.84,9.25,10.94,12.81,14.88],
  colorspace: "LAB",
  smooth: false
});

let NEO-PALETTE = new Leo.Theme({
  colors: [gray,acidGreen,candyKiss,candyPink],
  backgroundColor: gray,
  lightness: 0,
  contrast: 1,
  saturation: 100,
  output: "HEX"
  formula: "wcag2"
});
```

```css
.NEO-PALETTE {
  --background: #000000;
  --Gray100: #595959;
  --Gray200: #666666;
  --Gray300: #747474;
  --Gray400: #818181;
  --Gray500: #8f8f8f;
  --Gray600: #9e9e9e;
  --Gray700: #acacac;
  --Gray800: #bbbbbb;
  --Gray900: #cacaca;
  --Gray1000: #d9d9d9;
  --acidgreen100: #515f1f;
  --acidgreen200: #5c6d22;
  --acidgreen300: #697b24;
  --acidgreen400: #748a27;
  --acidgreen500: #809829;
  --acidgreen600: #8da92b;
  --acidgreen700: #99b82d;
  --acidgreen800: #a7c82f;
  --acidgreen900: #b4d830;
  --acidgreen1000: #cae561;
  --candykiss100: #95395a;
  --candykiss200: #ac3f67;
  --candykiss300: #c44675;
  --candykiss400: #dc4c82;
  --candykiss500: #f45390;
  --candykiss600: #ff6ba0;
  --candykiss700: #ff85ae;
  --candykiss800: #ff9fbe;
  --candykiss900: #ffb6cc;
  --candykiss1000: #ffcbdb;
  --candypink100: #6e5257;
  --candypink200: #7f5d64;
  --candypink300: #916a71;
  --candypink400: #a2757e;
  --candypink500: #b3828b;
  --candypink600: #c78f9a;
  --candypink700: #d99ca7;
  --candypink800: #ecaab6;
  --candypink900: #f7bac5;
  --candypink1000: #faced6;
}
```

design tokens 

```basic
{
  "NEO-PALETTE": {
    "description": "Color theme tokens at lightness of 0%",
    "Background": {
      "value": "#000000",
      "type": "color",
      "description": "UI background color. All color contrasts evaluated and generated against this color."
    },
    "Gray100": {
      "value": "#595959",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3:1 against background #000000"
    },
    "Gray200": {
      "value": "#666666",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3.66:1 against background #000000"
    },
    "Gray300": {
      "value": "#747474",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 4.49:1 against background #000000"
    },
    "Gray400": {
      "value": "#818181",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 5.39:1 against background #000000"
    },
    "Gray500": {
      "value": "#8f8f8f",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 6.49:1 against background #000000"
    },
    "Gray600": {
      "value": "#9e9e9e",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 7.84:1 against background #000000"
    },
    "Gray700": {
      "value": "#acacac",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 9.25:1 against background #000000"
    },
    "Gray800": {
      "value": "#bbbbbb",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 10.94:1 against background #000000"
    },
    "Gray900": {
      "value": "#cacaca",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 12.81:1 against background #000000"
    },
    "Gray1000": {
      "value": "#d9d9d9",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 14.88:1 against background #000000"
    },
    "acidgreen100": {
      "value": "#515f1f",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3:1 against background #000000"
    },
    "acidgreen200": {
      "value": "#5c6d22",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3.66:1 against background #000000"
    },
    "acidgreen300": {
      "value": "#697b24",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 4.49:1 against background #000000"
    },
    "acidgreen400": {
      "value": "#748a27",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 5.39:1 against background #000000"
    },
    "acidgreen500": {
      "value": "#809829",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 6.49:1 against background #000000"
    },
    "acidgreen600": {
      "value": "#8da92b",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 7.84:1 against background #000000"
    },
    "acidgreen700": {
      "value": "#99b82d",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 9.25:1 against background #000000"
    },
    "acidgreen800": {
      "value": "#a7c82f",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 10.94:1 against background #000000"
    },
    "acidgreen900": {
      "value": "#b4d830",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 12.81:1 against background #000000"
    },
    "acidgreen1000": {
      "value": "#cae561",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 14.88:1 against background #000000"
    },
    "candykiss100": {
      "value": "#95395a",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3:1 against background #000000"
    },
    "candykiss200": {
      "value": "#ac3f67",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3.66:1 against background #000000"
    },
    "candykiss300": {
      "value": "#c44675",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 4.49:1 against background #000000"
    },
    "candykiss400": {
      "value": "#dc4c82",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 5.39:1 against background #000000"
    },
    "candykiss500": {
      "value": "#f45390",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 6.49:1 against background #000000"
    },
    "candykiss600": {
      "value": "#ff6ba0",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 7.84:1 against background #000000"
    },
    "candykiss700": {
      "value": "#ff85ae",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 9.25:1 against background #000000"
    },
    "candykiss800": {
      "value": "#ff9fbe",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 10.94:1 against background #000000"
    },
    "candykiss900": {
      "value": "#ffb6cc",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 12.81:1 against background #000000"
    },
    "candykiss1000": {
      "value": "#ffcbdb",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 14.88:1 against background #000000"
    },
    "candypink100": {
      "value": "#6e5257",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3:1 against background #000000"
    },
    "candypink200": {
      "value": "#7f5d64",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3.66:1 against background #000000"
    },
    "candypink300": {
      "value": "#916a71",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 4.49:1 against background #000000"
    },
    "candypink400": {
      "value": "#a2757e",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 5.39:1 against background #000000"
    },
    "candypink500": {
      "value": "#b3828b",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 6.49:1 against background #000000"
    },
    "candypink600": {
      "value": "#c78f9a",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 7.84:1 against background #000000"
    },
    "candypink700": {
      "value": "#d99ca7",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 9.25:1 against background #000000"
    },
    "candypink800": {
      "value": "#ecaab6",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 10.94:1 against background #000000"
    },
    "candypink900": {
      "value": "#f7bac5",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 12.81:1 against background #000000"
    },
    "candypink1000": {
      "value": "#faced6",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 14.88:1 against background #000000"
    }
  }
}
```

```
.NEO-PALETTE {
  --background: rgb(0, 0, 0);
  --Gray100: rgb(89, 89, 89);
  --Gray200: rgb(102, 102, 102);
  --Gray300: rgb(116, 116, 116);
  --Gray400: rgb(129, 129, 129);
  --Gray500: rgb(143, 143, 143);
  --Gray600: rgb(158, 158, 158);
  --Gray700: rgb(172, 172, 172);
  --Gray800: rgb(187, 187, 187);
  --Gray900: rgb(202, 202, 202);
  --Gray1000: rgb(217, 217, 217);
  --acidgreen100: rgb(81, 95, 31);
  --acidgreen200: rgb(92, 109, 34);
  --acidgreen300: rgb(105, 123, 36);
  --acidgreen400: rgb(116, 138, 39);
  --acidgreen500: rgb(128, 152, 41);
  --acidgreen600: rgb(141, 169, 43);
  --acidgreen700: rgb(153, 184, 45);
  --acidgreen800: rgb(167, 200, 47);
  --acidgreen900: rgb(180, 216, 48);
  --acidgreen1000: rgb(202, 229, 97);
  --candykiss100: rgb(149, 57, 90);
  --candykiss200: rgb(172, 63, 103);
  --candykiss300: rgb(196, 70, 117);
  --candykiss400: rgb(220, 76, 130);
  --candykiss500: rgb(244, 83, 144);
  --candykiss600: rgb(255, 107, 160);
  --candykiss700: rgb(255, 133, 174);
  --candykiss800: rgb(255, 159, 190);
  --candykiss900: rgb(255, 182, 204);
  --candykiss1000: rgb(255, 203, 219);
  --candypink100: rgb(110, 82, 87);
  --candypink200: rgb(127, 93, 100);
  --candypink300: rgb(145, 106, 113);
  --candypink400: rgb(162, 117, 126);
  --candypink500: rgb(179, 130, 139);
  --candypink600: rgb(199, 143, 154);
  --candypink700: rgb(217, 156, 167);
  --candypink800: rgb(236, 170, 182);
  --candypink900: rgb(247, 186, 197);
  --candypink1000: rgb(250, 206, 214);
}
```
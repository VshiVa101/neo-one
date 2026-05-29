# against gray BG 20%ligthness

Owner: leo

https://leonardocolor.io/theme.html?name=NEO-PALETTE&config=%7B%22baseScale%22%3A%22Gray%22%2C%22colorScales%22%3A%5B%7B%22name%22%3A%22Gray%22%2C%22colorKeys%22%3A%5B%22%23000000%22%5D%2C%22colorspace%22%3A%22RGB%22%2C%22ratios%22%3A%5B%223%22%2C%223.66%22%2C%224.49%22%2C%225.39%22%2C%226.49%22%2C%227.84%22%2C%229.25%22%2C%2210.94%22%2C%2212.81%22%2C%2214.88%22%5D%2C%22smooth%22%3Afalse%7D%2C%7B%22name%22%3A%22acid+green%22%2C%22colorKeys%22%3A%5B%22%23b9df31%22%5D%2C%22colorspace%22%3A%22LAB%22%2C%22ratios%22%3A%5B%223%22%2C%223.66%22%2C%224.49%22%2C%225.39%22%2C%226.49%22%2C%227.84%22%2C%229.25%22%2C%2210.94%22%2C%2212.81%22%2C%2214.88%22%5D%2C%22smooth%22%3Afalse%7D%2C%7B%22name%22%3A%22candy+kiss%22%2C%22colorKeys%22%3A%5B%22%23ff5696%22%5D%2C%22colorspace%22%3A%22LAB%22%2C%22ratios%22%3A%5B%223%22%2C%223.66%22%2C%224.49%22%2C%225.39%22%2C%226.49%22%2C%227.84%22%2C%229.25%22%2C%2210.94%22%2C%2212.81%22%2C%2214.88%22%5D%2C%22smooth%22%3Afalse%7D%2C%7B%22name%22%3A%22candy+pink%22%2C%22colorKeys%22%3A%5B%22%23f5b0bd%22%5D%2C%22colorspace%22%3A%22LAB%22%2C%22ratios%22%3A%5B%223%22%2C%223.66%22%2C%224.49%22%2C%225.39%22%2C%226.49%22%2C%227.84%22%2C%229.25%22%2C%2210.94%22%2C%2212.81%22%2C%2214.88%22%5D%2C%22smooth%22%3Afalse%7D%5D%2C%22lightness%22%3A20%2C%22contrast%22%3A1%2C%22saturation%22%3A100%2C%22formula%22%3A%22wcag2%22%7D

![Screenshot 2026-02-05 195326.png](Screenshot_2026-02-05_195326.png)

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
  lightness: 20,
  contrast: 1,
  saturation: 100,
  output: "HEX"
  formula: "wcag2"
});
```

css

```css
.NEO-PALETTE {
  --background: #303030;
  --Gray100: #787878;
  --Gray200: #878787;
  --Gray300: #969696;
  --Gray400: #a5a5a5;
  --Gray500: #b5b5b5;
  --Gray600: #c7c7c7;
  --Gray700: #d8d8d8;
  --Gray800: #e9e9e9;
  --Gray900: #fbfbfb;
  --Gray1000: #ffffff;
  --acidgreen100: #6d8025;
  --acidgreen200: #799028;
  --acidgreen300: #87a12a;
  --acidgreen400: #94b12c;
  --acidgreen500: #a2c32e;
  --acidgreen600: #b1d530;
  --acidgreen700: #c8e45d;
  --acidgreen800: #e4f0a8;
  --acidgreen900: #fbfcf0;
  --acidgreen1000: #ffffff;
  --candykiss100: #cc4879;
  --candykiss200: #e64f88;
  --candykiss300: #ff5a98;
  --candykiss400: #ff79a8;
  --candykiss500: #ff97b8;
  --candykiss600: #ffb2ca;
  --candykiss700: #ffcada;
  --candykiss800: #ffe2eb;
  --candykiss900: #fffafc;
  --candykiss1000: #ffffff;
  --candypink100: #966e75;
  --candypink200: #a97a83;
  --candypink300: #bd8993;
  --candypink400: #d196a1;
  --candypink500: #e5a5b1;
  --candypink600: #f6b7c3;
  --candypink700: #facdd4;
  --candypink800: #fde3e8;
  --candypink900: #fffafb;
  --candypink1000: #ffffff;
}
```

design tokens 

```basic
{
  "NEO-PALETTE": {
    "description": "Color theme tokens at lightness of 20%",
    "Background": {
      "value": "#303030",
      "type": "color",
      "description": "UI background color. All color contrasts evaluated and generated against this color."
    },
    "Gray100": {
      "value": "#787878",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3:1 against background #303030"
    },
    "Gray200": {
      "value": "#878787",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3.66:1 against background #303030"
    },
    "Gray300": {
      "value": "#969696",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 4.49:1 against background #303030"
    },
    "Gray400": {
      "value": "#a5a5a5",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 5.39:1 against background #303030"
    },
    "Gray500": {
      "value": "#b5b5b5",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 6.49:1 against background #303030"
    },
    "Gray600": {
      "value": "#c7c7c7",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 7.84:1 against background #303030"
    },
    "Gray700": {
      "value": "#d8d8d8",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 9.25:1 against background #303030"
    },
    "Gray800": {
      "value": "#e9e9e9",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 10.94:1 against background #303030"
    },
    "Gray900": {
      "value": "#fbfbfb",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 12.81:1 against background #303030"
    },
    "Gray1000": {
      "value": "#ffffff",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 14.88:1 against background #303030"
    },
    "acidgreen100": {
      "value": "#6d8025",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3:1 against background #303030"
    },
    "acidgreen200": {
      "value": "#799028",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3.66:1 against background #303030"
    },
    "acidgreen300": {
      "value": "#87a12a",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 4.49:1 against background #303030"
    },
    "acidgreen400": {
      "value": "#94b12c",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 5.39:1 against background #303030"
    },
    "acidgreen500": {
      "value": "#a2c32e",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 6.49:1 against background #303030"
    },
    "acidgreen600": {
      "value": "#b1d530",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 7.84:1 against background #303030"
    },
    "acidgreen700": {
      "value": "#c8e45d",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 9.25:1 against background #303030"
    },
    "acidgreen800": {
      "value": "#e4f0a8",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 10.94:1 against background #303030"
    },
    "acidgreen900": {
      "value": "#fbfcf0",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 12.81:1 against background #303030"
    },
    "acidgreen1000": {
      "value": "#ffffff",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 14.88:1 against background #303030"
    },
    "candykiss100": {
      "value": "#cc4879",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3:1 against background #303030"
    },
    "candykiss200": {
      "value": "#e64f88",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3.66:1 against background #303030"
    },
    "candykiss300": {
      "value": "#ff5a98",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 4.49:1 against background #303030"
    },
    "candykiss400": {
      "value": "#ff79a8",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 5.39:1 against background #303030"
    },
    "candykiss500": {
      "value": "#ff97b8",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 6.49:1 against background #303030"
    },
    "candykiss600": {
      "value": "#ffb2ca",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 7.84:1 against background #303030"
    },
    "candykiss700": {
      "value": "#ffcada",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 9.25:1 against background #303030"
    },
    "candykiss800": {
      "value": "#ffe2eb",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 10.94:1 against background #303030"
    },
    "candykiss900": {
      "value": "#fffafc",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 12.81:1 against background #303030"
    },
    "candykiss1000": {
      "value": "#ffffff",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 14.88:1 against background #303030"
    },
    "candypink100": {
      "value": "#966e75",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3:1 against background #303030"
    },
    "candypink200": {
      "value": "#a97a83",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3.66:1 against background #303030"
    },
    "candypink300": {
      "value": "#bd8993",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 4.49:1 against background #303030"
    },
    "candypink400": {
      "value": "#d196a1",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 5.39:1 against background #303030"
    },
    "candypink500": {
      "value": "#e5a5b1",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 6.49:1 against background #303030"
    },
    "candypink600": {
      "value": "#f6b7c3",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 7.84:1 against background #303030"
    },
    "candypink700": {
      "value": "#facdd4",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 9.25:1 against background #303030"
    },
    "candypink800": {
      "value": "#fde3e8",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 10.94:1 against background #303030"
    },
    "candypink900": {
      "value": "#fffafb",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 12.81:1 against background #303030"
    },
    "candypink1000": {
      "value": "#ffffff",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 14.88:1 against background #303030"
    }
  }
}
```

```
.NEO-PALETTE {
  --background: rgb(48, 48, 48);
  --Gray100: rgb(120, 120, 120);
  --Gray200: rgb(135, 135, 135);
  --Gray300: rgb(150, 150, 150);
  --Gray400: rgb(165, 165, 165);
  --Gray500: rgb(181, 181, 181);
  --Gray600: rgb(199, 199, 199);
  --Gray700: rgb(216, 216, 216);
  --Gray800: rgb(233, 233, 233);
  --Gray900: rgb(251, 251, 251);
  --Gray1000: rgb(255, 255, 255);
  --acidgreen100: rgb(109, 128, 37);
  --acidgreen200: rgb(121, 144, 40);
  --acidgreen300: rgb(135, 161, 42);
  --acidgreen400: rgb(148, 177, 44);
  --acidgreen500: rgb(162, 195, 46);
  --acidgreen600: rgb(177, 213, 48);
  --acidgreen700: rgb(200, 228, 93);
  --acidgreen800: rgb(228, 240, 168);
  --acidgreen900: rgb(251, 252, 240);
  --acidgreen1000: rgb(255, 255, 255);
  --candykiss100: rgb(204, 72, 121);
  --candykiss200: rgb(230, 79, 136);
  --candykiss300: rgb(255, 90, 152);
  --candykiss400: rgb(255, 121, 168);
  --candykiss500: rgb(255, 151, 184);
  --candykiss600: rgb(255, 178, 202);
  --candykiss700: rgb(255, 202, 218);
  --candykiss800: rgb(255, 226, 235);
  --candykiss900: rgb(255, 250, 252);
  --candykiss1000: rgb(255, 255, 255);
  --candypink100: rgb(150, 110, 117);
  --candypink200: rgb(169, 122, 131);
  --candypink300: rgb(189, 137, 147);
  --candypink400: rgb(209, 150, 161);
  --candypink500: rgb(229, 165, 177);
  --candypink600: rgb(246, 183, 195);
  --candypink700: rgb(250, 205, 212);
  --candypink800: rgb(253, 227, 232);
  --candypink900: rgb(255, 250, 251);
  --candypink1000: rgb(255, 255, 255);
}
```
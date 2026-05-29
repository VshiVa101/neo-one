# against white BG

Owner: leo

https://leonardocolor.io/theme.html?name=NEO-PALETTE&config=%7B%22baseScale%22%3A%22Gray%22%2C%22colorScales%22%3A%5B%7B%22name%22%3A%22Gray%22%2C%22colorKeys%22%3A%5B%22%23000000%22%5D%2C%22colorspace%22%3A%22RGB%22%2C%22ratios%22%3A%5B%223%22%2C%223.66%22%2C%224.49%22%2C%225.39%22%2C%226.49%22%2C%227.84%22%2C%229.25%22%2C%2210.94%22%2C%2212.81%22%2C%2214.88%22%5D%2C%22smooth%22%3Afalse%7D%2C%7B%22name%22%3A%22acid+green%22%2C%22colorKeys%22%3A%5B%22%23b9df31%22%5D%2C%22colorspace%22%3A%22LAB%22%2C%22ratios%22%3A%5B%223%22%2C%223.66%22%2C%224.49%22%2C%225.39%22%2C%226.49%22%2C%227.84%22%2C%229.25%22%2C%2210.94%22%2C%2212.81%22%2C%2214.88%22%5D%2C%22smooth%22%3Afalse%7D%2C%7B%22name%22%3A%22candy+kiss%22%2C%22colorKeys%22%3A%5B%22%23ff5696%22%5D%2C%22colorspace%22%3A%22LAB%22%2C%22ratios%22%3A%5B%223%22%2C%223.66%22%2C%224.49%22%2C%225.39%22%2C%226.49%22%2C%227.84%22%2C%229.25%22%2C%2210.94%22%2C%2212.81%22%2C%2214.88%22%5D%2C%22smooth%22%3Afalse%7D%2C%7B%22name%22%3A%22candy+pink%22%2C%22colorKeys%22%3A%5B%22%23f5b0bd%22%5D%2C%22colorspace%22%3A%22LAB%22%2C%22ratios%22%3A%5B%223%22%2C%223.66%22%2C%224.49%22%2C%225.39%22%2C%226.49%22%2C%227.84%22%2C%229.25%22%2C%2210.94%22%2C%2212.81%22%2C%2214.88%22%5D%2C%22smooth%22%3Afalse%7D%5D%2C%22lightness%22%3A100%2C%22contrast%22%3A1%2C%22saturation%22%3A100%2C%22formula%22%3A%22wcag2%22%7D

[NEO-PALETTE (2).svg](NEO-PALETTE_(2).svg)

![Screenshot 2026-02-05 194511.png](Screenshot_2026-02-05_194511.png)

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
  lightness: 100,
  contrast: 1,
  saturation: 100,
  output: "HEX"
  formula: "wcag2"
});
```

css

```css
.NEO-PALETTE {
  --background: #ffffff;
  --Gray100: #959595;
  --Gray200: #858585;
  --Gray300: #767676;
  --Gray400: #6a6a6a;
  --Gray500: #5d5d5d;
  --Gray600: #515151;
  --Gray700: #474747;
  --Gray800: #3d3d3d;
  --Gray900: #323232;
  --Gray1000: #272727;
  --acidgreen100: #859f2a;
  --acidgreen200: #788e27;
  --acidgreen300: #6b7e25;
  --acidgreen400: #607123;
  --acidgreen500: #556420;
  --acidgreen600: #4b571e;
  --acidgreen700: #414b1b;
  --acidgreen800: #384019;
  --acidgreen900: #2e3516;
  --acidgreen1000: #252913;
  --candykiss100: #fe5695;
  --candykiss200: #e34f86;
  --candykiss300: #c94777;
  --candykiss400: #b3416b;
  --candykiss500: #9e3b5e;
  --candykiss600: #883552;
  --candykiss700: #762f48;
  --candykiss800: #63293d;
  --candykiss900: #512333;
  --candykiss1000: #3e1d27;
  --candypink100: #bb8791;
  --candypink200: #a77982;
  --candypink300: #956c74;
  --candypink400: #846167;
  --candypink500: #74565b;
  --candypink600: #654b50;
  --candypink700: #584146;
  --candypink800: #4a383b;
  --candypink900: #3d2e31;
  --candypink1000: #2f2426;
}
```

design tokens 

```basic
{
  "NEO-PALETTE": {
    "description": "Color theme tokens at lightness of 100%",
    "Background": {
      "value": "#ffffff",
      "type": "color",
      "description": "UI background color. All color contrasts evaluated and generated against this color."
    },
    "Gray100": {
      "value": "#959595",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3:1 against background #ffffff"
    },
    "Gray200": {
      "value": "#858585",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3.66:1 against background #ffffff"
    },
    "Gray300": {
      "value": "#767676",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 4.49:1 against background #ffffff"
    },
    "Gray400": {
      "value": "#6a6a6a",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 5.39:1 against background #ffffff"
    },
    "Gray500": {
      "value": "#5d5d5d",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 6.49:1 against background #ffffff"
    },
    "Gray600": {
      "value": "#515151",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 7.84:1 against background #ffffff"
    },
    "Gray700": {
      "value": "#474747",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 9.25:1 against background #ffffff"
    },
    "Gray800": {
      "value": "#3d3d3d",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 10.94:1 against background #ffffff"
    },
    "Gray900": {
      "value": "#323232",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 12.81:1 against background #ffffff"
    },
    "Gray1000": {
      "value": "#272727",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 14.88:1 against background #ffffff"
    },
    "acidgreen100": {
      "value": "#859f2a",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3:1 against background #ffffff"
    },
    "acidgreen200": {
      "value": "#788e27",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3.66:1 against background #ffffff"
    },
    "acidgreen300": {
      "value": "#6b7e25",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 4.49:1 against background #ffffff"
    },
    "acidgreen400": {
      "value": "#607123",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 5.39:1 against background #ffffff"
    },
    "acidgreen500": {
      "value": "#556420",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 6.49:1 against background #ffffff"
    },
    "acidgreen600": {
      "value": "#4b571e",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 7.84:1 against background #ffffff"
    },
    "acidgreen700": {
      "value": "#414b1b",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 9.25:1 against background #ffffff"
    },
    "acidgreen800": {
      "value": "#384019",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 10.94:1 against background #ffffff"
    },
    "acidgreen900": {
      "value": "#2e3516",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 12.81:1 against background #ffffff"
    },
    "acidgreen1000": {
      "value": "#252913",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 14.88:1 against background #ffffff"
    },
    "candykiss100": {
      "value": "#fe5695",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3:1 against background #ffffff"
    },
    "candykiss200": {
      "value": "#e34f86",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3.66:1 against background #ffffff"
    },
    "candykiss300": {
      "value": "#c94777",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 4.49:1 against background #ffffff"
    },
    "candykiss400": {
      "value": "#b3416b",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 5.39:1 against background #ffffff"
    },
    "candykiss500": {
      "value": "#9e3b5e",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 6.49:1 against background #ffffff"
    },
    "candykiss600": {
      "value": "#883552",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 7.84:1 against background #ffffff"
    },
    "candykiss700": {
      "value": "#762f48",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 9.25:1 against background #ffffff"
    },
    "candykiss800": {
      "value": "#63293d",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 10.94:1 against background #ffffff"
    },
    "candykiss900": {
      "value": "#512333",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 12.81:1 against background #ffffff"
    },
    "candykiss1000": {
      "value": "#3e1d27",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 14.88:1 against background #ffffff"
    },
    "candypink100": {
      "value": "#bb8791",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3:1 against background #ffffff"
    },
    "candypink200": {
      "value": "#a77982",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 3.66:1 against background #ffffff"
    },
    "candypink300": {
      "value": "#956c74",
      "type": "color",
      "description": "Color can be used for UI elements or large text. WCAG 2.x (relative luminance) contrast is 4.49:1 against background #ffffff"
    },
    "candypink400": {
      "value": "#846167",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 5.39:1 against background #ffffff"
    },
    "candypink500": {
      "value": "#74565b",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 6.49:1 against background #ffffff"
    },
    "candypink600": {
      "value": "#654b50",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 7.84:1 against background #ffffff"
    },
    "candypink700": {
      "value": "#584146",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 9.25:1 against background #ffffff"
    },
    "candypink800": {
      "value": "#4a383b",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 10.94:1 against background #ffffff"
    },
    "candypink900": {
      "value": "#3d2e31",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 12.81:1 against background #ffffff"
    },
    "candypink1000": {
      "value": "#2f2426",
      "type": "color",
      "description": "Color can be used for small text. WCAG 2.x (relative luminance) contrast is 14.88:1 against background #ffffff"
    }
  }
}
```

```
.NEO-PALETTE {
  --background: rgb(255, 255, 255);
  --Gray100: rgb(149, 149, 149);
  --Gray200: rgb(133, 133, 133);
  --Gray300: rgb(118, 118, 118);
  --Gray400: rgb(106, 106, 106);
  --Gray500: rgb(93, 93, 93);
  --Gray600: rgb(81, 81, 81);
  --Gray700: rgb(71, 71, 71);
  --Gray800: rgb(61, 61, 61);
  --Gray900: rgb(50, 50, 50);
  --Gray1000: rgb(39, 39, 39);
  --acidgreen100: rgb(133, 159, 42);
  --acidgreen200: rgb(120, 142, 39);
  --acidgreen300: rgb(107, 126, 37);
  --acidgreen400: rgb(96, 113, 35);
  --acidgreen500: rgb(85, 100, 32);
  --acidgreen600: rgb(75, 87, 30);
  --acidgreen700: rgb(65, 75, 27);
  --acidgreen800: rgb(56, 64, 25);
  --acidgreen900: rgb(46, 53, 22);
  --acidgreen1000: rgb(37, 41, 19);
  --candykiss100: rgb(254, 86, 149);
  --candykiss200: rgb(227, 79, 134);
  --candykiss300: rgb(201, 71, 119);
  --candykiss400: rgb(179, 65, 107);
  --candykiss500: rgb(158, 59, 94);
  --candykiss600: rgb(136, 53, 82);
  --candykiss700: rgb(118, 47, 72);
  --candykiss800: rgb(99, 41, 61);
  --candykiss900: rgb(81, 35, 51);
  --candykiss1000: rgb(62, 29, 39);
  --candypink100: rgb(187, 135, 145);
  --candypink200: rgb(167, 121, 130);
  --candypink300: rgb(149, 108, 116);
  --candypink400: rgb(132, 97, 103);
  --candypink500: rgb(116, 86, 91);
  --candypink600: rgb(101, 75, 80);
  --candypink700: rgb(88, 65, 70);
  --candypink800: rgb(74, 56, 59);
  --candypink900: rgb(61, 46, 49);
  --candypink1000: rgb(47, 36, 38);
}
```
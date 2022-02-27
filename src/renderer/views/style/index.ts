import { injectGlobal } from '@emotion/css';
import pingFang from '@/assets/fonts/PingFang-SC-Regular.ttf';
import segoeUi from '@/assets/fonts/segoeui.ttf';
import tingFont from '@/assets/fonts/ting-font.ttf';

injectGlobal`
:root {
  --theme-blue: #3b78d6;
  --theme-pink: #dd4e7c;
  --lable: #000000;
  --secondary-label: #3c3c43;
  --tertiary-label: #3c3c43;

  --red: #e54d42;
  --orange: #f37b1d;
  --yellow: #fbbd08;
  --olive: #8dc63f;
  --green: #39b54a;
  --cyan: #1cbbb4;
  --blue: #0081ff;
  --purple: #6739b6;
  --mauve: #9c26b0;
  --pink: #e03997;
  --brown: #a5673f;
  --grey: #8799a3;
  --black: #333333;
  --darkGray: #666666;
  --gray: #aaaaaa;
  --ghostWhite: #f1f1f1;
  --white: #ffffff;
}
@font-face {
  font-family: ping-fang;
  src: url(${pingFang});
}

@font-face {
  font-family: segoe-ui;
  src: url(${segoeUi});
}

@font-face {
  font-family: 'ting-font';
  src: url(${tingFont});
}

.ting-font {
  font-family: 'ting-font' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000000;
}

*,
*:after,
*:before {
  box-sizing: border-box;
}
html,
body,
#root,
.container {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background-color: transparent;
  position: relative;
  user-select: none;
}
.drag {
  -webkit-app-region: drag;
}
.no-drag {
  -webkit-app-region: no-drag;
}
.user-select-text {
  user-select: text;
}
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
a:link {
  color: #ffffff;
}
a:visited {
  color: #ffffff;
}
a,
button,
select,
input {
  -webkit-app-region: no-drag;
}
input,
button,
select {
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  background-color: #f1f1f1;
  vertical-align: middle;
}
button {
  &:hover {
    background-image: -webkit-gradient(
      linear,
      left top,
      left bottom,
      from(rgba(0, 0, 0, 0.1)),
      to(rgba(0, 0, 0, 0.1))
    );
    background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
  }
  &:active {
    background-image: -webkit-gradient(
      linear,
      left top,
      left bottom,
      from(rgba(0, 0, 0, 0.2)),
      to(rgba(0, 0, 0, 0.2))
    );
    background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
  }
}
`;

import { css } from '@emotion/css/macro';

export default css`
  position: relative;
  padding: ${window.customize.headNative ? '10px' : '32px'} 10px 10px;

  > .text {
    word-break: break-all;
    font: normal 16px sans-serif;
  }

  > .test {
    position: absolute;
    right: 50px;
    bottom: 5px;
  }

  > .close {
    position: absolute;
    right: 5px;
    bottom: 5px;
  }
`;

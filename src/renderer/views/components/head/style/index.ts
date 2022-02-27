import { css } from '@emotion/css';

export default css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 32px;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > .content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${window.environment.platform === 'darwin' ? 'padding-right: 10px;' : 'padding-left: 10px;'}

    > .title {
      font: normal 13px /13px ping-fang;
    }

    > .events {
      display: flex;
      justify-content: space-between;
      align-items: center;

      > .event {
        width: 40px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        > * {
          font-size: 10px !important;
        }

        > .ting-font {
          font-family: 'ting-font' !important;
          font-size: 16px;
          font-style: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          color: #000000;
        }

        > .ting-font-minimize:before {
          content: '\\e60f';
        }

        > .ting-font-maximize:before {
          content: '\\e60b';
        }

        > .ting-font-close:before {
          content: '\\e613';
        }
      }
    }
  }
`;
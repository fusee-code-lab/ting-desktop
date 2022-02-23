import { css } from '@emotion/css';
import { getCustomize } from '@/renderer/store';
import rocket from '@/assets/rocket.png'

const args = getCustomize();

export default css`
  width: 100%;
  height: 100%;
  ${args.headNative ? 'padding: 10px;' : 'padding: 32px 10px 10px;'}
  padding: 32px 10px 10px;
  position: relative;
  background-image: url(${rocket});

  > .main {
    ${window.environment.platform === 'darwin' ? 'left: 0;' : 'right: 0;'}
    position: absolute;
    top: 0;
    bottom: 0;
    width: 380px;
    background-color: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    justify-content: center;

    > .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      ${window.environment.platform === 'darwin'
        ? 'align-items: flex-start;padding-left: 60px;'
        : 'align-items: flex-end;padding-right: 60px;'}

      > img {
        width: 20%;
      }

      > .title {
        margin-top: 17px;
        height: 41px;
        font: bold 40px/40px ping-fang;
        letter-spacing: 1px;
        color: var(--theme-blue);
        text-align: ${window.environment.platform === 'darwin' ? 'left' : 'right'};
      }

      > .but {
        margin-top: 35px;
        width: 120px;
        height: 32px;
        background-color: var(--theme-blue);
        outline: none;
        color: var(--white);
        font: 600 17px/32px segoe-ui;
      }
    }
  }
`;

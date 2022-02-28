import { css } from '@emotion/css/macro';

export const infoStyle = css`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;

  > .left {
    width: 220px;
  }

  > .right {
    position: relative;
    width: calc(100% - 220px);

    > .audio {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 50px;
    }
  }
`;

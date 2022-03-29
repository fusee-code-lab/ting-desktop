import { css } from '@emotion/css/macro';

export const infoStyle = css`
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  padding: 10px;
  > .songs,
  .sheets {
    > .title {
      padding: 10px 0;
      color: var(--label);
      font: normal 16px/16px ping-fang;
    }
    > .items {
      > .item {
        position: relative;
        display: inline-flex;
        width: 120px;
        height: 120px;
        > .bg {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        > .name {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 5px;
          color: var(--white);
          font: normal 12px/12px ping-fang;
          background-color: rgba(0, 0, 0, 0.2);
        }
      }
    }
  }
`;

import { css } from '@emotion/css/macro';

export default css`
  width: 100%;
  height: 100%;
  background-color: #e2e2e2;
  padding: 32px 0 0;
  > .elastic {
    height: 30px;
  }
  > .search {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    padding: 0 10px;
    --h: 26px;
    --bw: 40px;
    > input,
    button {
      height: var(--h);
      background-color: var(--white);
    }
    > input {
      width: calc(100% - var(--bw));
      padding: 0 10px;
    }
    > button {
      font: normal 12px/12px segoe-ui;
      width: var(--bw);
    }
  }
`;

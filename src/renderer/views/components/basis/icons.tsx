import { css, cx } from '@emotion/css';

const style = css`
  font-family: 'ting-font' !important;
  font-size: var(--size-xs);
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--label-color);
`;

export const CloseIcon = (props: { onClick?: (e: MouseEvent) => void }) => (
  <span class={cx(style, css`
    &::before {
      content: '\\e613';
    }
  `)} onClick={props.onClick}></span>
);

export const PlusIcon = (props: { onClick?: (e: MouseEvent) => void }) => (
  <span class={cx(style, css`
    &::before {
      content: '\\e60e';
    }
  `)} onClick={props.onClick}></span>
);

export const BackIcon = (props: { onClick?: (e: MouseEvent) => void }) => (
  <span class={cx(style, css`
    &::before {
      content: '\\e61b';
    }
  `)} onClick={props.onClick}></span>
);

export const MenuIcon = (props: { onClick?: (e: MouseEvent) => void }) => (
  <span class={cx(style, css`
    &::before {
      content: '\\e60d';
    }
  `)} onClick={props.onClick}></span>
);

export const LyricsIcon = (props: { onClick?: (e: MouseEvent) => void }) => (
  <span class={cx(style, css`
    &::before {
      content: '\\e60c';
    }
  `)} onClick={props.onClick}></span>
);

export const NextIcon = (props: { onClick?: (e: MouseEvent) => void }) => (
  <span class={cx(style, css`
    &::before {
      content: '\\e614';
    }
  `)} onClick={props.onClick}></span>
);

export const PreviousIcon = (props: { onClick?: (e: MouseEvent) => void }) => (
  <span class={cx(style, css`
    &::before {
      content: '\\e615';
    }
  `)} onClick={props.onClick}></span>
);

export const PlayIcon = (props: { onClick?: (e: MouseEvent) => void }) => (
  <span class={cx(style, css`
    &::before {
      content: '\\e610';
    }
  `)} onClick={props.onClick}></span>
);

export const PauseIcon = (props: { onClick?: (e: MouseEvent) => void }) => (
  <span class={cx(style, css`
    &::before {
      content: '\\e611';
    }
  `)} onClick={props.onClick}></span>
);

export const ShuffleIcon = (props: { class?: string; onClick?: (e: MouseEvent) => void }) => (
  <span class={cx(props.class, style, css`
    &::before {
      content: '\\e61a';
    }
  `)} onClick={props.onClick}></span>
);

export const RepeatIcon = (props: { class?: string; onClick?: (e: MouseEvent) => void }) => (
  <span class={cx(props.class, style, css`
    &::before {
      content: '\\e612';
    }
  `)} onClick={props.onClick}></span>
);

export const Volumes1Icon = (props: { class?: string; onClick?: (e: MouseEvent) => void }) => (
  <span class={cx(props.class, style, css`
    &::before {
      content: '\\e618';
    }
  `)} onClick={props.onClick}></span>
);

export const Volumes2Icon = (props: { class?: string; onClick?: (e: MouseEvent) => void }) => (
  <span class={cx(props.class, style, css`
    &::before {
      content: '\\e617';
    }
  `)} onClick={props.onClick}></span>
);

export const Volumes3Icon = (props: { class?: string; onClick?: (e: MouseEvent) => void }) => (
  <span class={cx(props.class, style, css`
    &::before {
      content: '\\e619';
    }
  `)} onClick={props.onClick}></span>
);

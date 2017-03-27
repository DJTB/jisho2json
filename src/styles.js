import { classnames } from './constants';

const primaryColorRGB = '100, 150, 240';
const primaryColor = `rgb(${primaryColorRGB})`;

/**
 * css styles to be injected into head of jisho document
 * @type {String} css rules
 */
export const jishoStyle = `
   /* highlight clickable entries on hover */
  .${classnames.ENTRY} {
    transition: all .5s ease-in
  }
  .${classnames.ENTRY}:hover {
    transition: all .3s ease-out;
    box-shadow: 0 0 4px 0 ${primaryColor};
    cursor: pointer;
  }
`;


export const toastStyle = `
  /* notification we will add to body */
  .${classnames.TOAST} {
    position: fixed;
    font-size: 18px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: .25em;
    max-width: calc(100vw);
    max-height: calc(50vh);
    overflow: auto;
    opacity: 0;
    background-color: whitesmoke;
    border: 4px solid rgba(${primaryColorRGB}, .6);
    border-top-color: rgba(${primaryColorRGB}, .8);
    color: #444;
    cursor: pointer;
    z-index: 100; /* jisho overlay is at 95 already */
    /* <pre> formatting */
    white-space: pre-wrap;
    word-wrap: break-word;
    transition: opacity .35s ease-in;
    /* disable clicks */
    pointer-events: none;
  }
  .${classnames.TOAST}.${classnames.VISIBLE} {
    transition: opacity .25s ease-out;
    pointer-events: initial;
    opacity: .95;
  }
`;

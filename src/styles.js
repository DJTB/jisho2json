/**
 * css styles to be injected into head of jisho document
 * @type {String} css rules
 */
const styles = `
   /* highlight clickable entries on hover */
  .concept_light {
    transition: all .5s ease-in
  }
  .concept_light:hover {
    transition: all .3s ease-out;
    box-shadow: 0 0 4px 0 cornflowerblue;
    cursor: pointer;
  }
  /* notification we will add to body */
  .toast {
    position: fixed;
    top: .5rem;
    right: .5rem;
    bottom: .5rem;
    left: .5rem;
    padding: .5rem;
    max-width: calc(100vw - 1rem);
    max-height: calc(100vh - 1rem);
    overflow: auto;
    font-size: 1.2rem;
    opacity: 0;
    margin: 0 .3rem;
    border: 4px solid gainsboro;
    border-radius: 5px;
    background-color: cornflowerblue;
    color: whitesmoke;
    cursor: pointer;
    z-index: 100; /* jisho overlay is at 95 already */
    /* <pre> formatting */
    white-space: pre-wrap;
    word-wrap: break-word;
    transition: opacity .35s ease-in;
    /* disable clicks */
    pointer-events: none;
  }
  .toast.--isVisible {
    transition: opacity .25s ease-out;
    pointer-events: initial;
    opacity: .95;
  }
`;

export default styles;

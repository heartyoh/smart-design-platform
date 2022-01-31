import { css } from 'lit'

export const CommonListStyle = css`
  :host {
    display: flex;

    width: 100%;

    --grid-record-emphasized-background-color: red;
    --grid-record-emphasized-color: yellow;
  }

  ox-grist {
    flex: 1;
    overflow-y: auto;

    --grid-record-emphasized-background-color: red;
    --grid-record-emphasized-color: yellow;
  }

  [slot='headroom'] {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: var(--padding-default) var(--padding-wide);
    border-top: 2px solid rgba(0, 0, 0, 0.2);
    background-color: var(--theme-white-color);
    box-shadow: var(--box-shadow);

    --mdc-icon-size: 24px;
  }

  #sorters {
    margin-left: auto;
    position: relative;
  }

  #sorters > * {
    padding: var(--padding-narrow);
    margin-right: var(--margin-default);
  }

  #modes > * {
    padding: var(--padding-narrow);
    opacity: 0.5;
    color: var(--primary-text-color);
    cursor: pointer;
  }

  #modes > mwc-icon[active] {
    border-radius: 9px;
    background-color: rgba(var(--primary-color-rgb), 0.05);
    opacity: 1;
    color: var(--secondary-text-color);
    cursor: default;
  }

  #modes > mwc-icon:hover {
    opacity: 1;
    color: var(--secondary-text-color);
  }

  #add {
    width: 50px;
    text-align: right;
  }

  #add button {
    background-color: var(--status-success-color);
    border: 0;
    border-radius: 50%;
    padding: 5px;
    width: 36px;
    height: 36px;
    cursor: pointer;
  }

  #add button:hover {
    background-color: var(--focus-background-color);
    box-shadow: var(--box-shadow);
  }

  #add button mwc-icon {
    font-size: 2em;
    color: var(--theme-white-color);
  }

  #filters {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #filters * {
    margin-right: var(--margin-default);
  }

  @media only screen and (max-width: 460px) {
    #filters {
      flex-direction: column;
    }

    #modes {
      display: none;
    }
  }
`

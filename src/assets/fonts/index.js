import { createGlobalStyle } from 'styled-components'

/**
 * Add your own custom fonts here.
 * 
 * e.g.
 * 
 * @font-face {
 *   font-family: 'Open_Sans_LtIt';
 *   src: url('${Open_Sans_LtIt}') format('truetype');
 *   font-weight: normal;
 *   font-style: normal;
 * }
 */
const Fonts = createGlobalStyle`
  @font-face {
    font-family: 'Arial';
    font-weight: normal;
    font-style: normal;
  }
`;

export default Fonts;

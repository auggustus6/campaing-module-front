export const globalStyles = {
  '*': {
    margin: 0,
    padding: 0,
    'box-sizing': 'border-box',
    '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
    '-moz-tap-highlight-color': 'rgba(0, 0, 0, 0)',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    '&::before, &::after': {
      'box-sizing': 'inherit',
    },
  },
  html: {
    'scroll-behavior': 'smooth',
  },

  '::-webkit-scrollbar': {
    width: 5,
  },
  '::-webkit-scrollbar-track': {
    'border-radius': 10,
  },
  '::-webkit-scrollbar-thumb': {
    background: '#aaaaaa',
    'border-radius': 10,
    '&:hover': {
      background: '#868585',
    },
  },
};

// import GlobalStyles from '@mui/material/GlobalStyles';

// const GlobalSlys = GlobalStyles()

// import {
//   createGlobalStyle,
//   css,
//   // DefaultTheme,
//   GlobalStyleComponent,
// } from 'styled-components';

// // import { GlobalStylesProps } from "@mui/styled-engine-sc/GlobalStyles/";
// import { DefaultTheme, GlobalStylesProps as cuzin } from "@mui/styled-engine-sc/";

// import {theme} from "./theme"

// const GlobalStyles: GlobalStyleComponent<
//   // DefaultTheme
//   cuzin<any>,
//   // any,,
//   DefaultTheme
// > = createGlobalStyle`
//   * {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
//     -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
//     -moz-tap-highlight-color: rgba(0, 0, 0, 0);
//     -webkit-font-smoothing: antialiased;
//     -moz-osx-font-smoothing: grayscale;
//     &::before,
//     &::after {
//       box-sizing: inherit;
//     }
//   }

//   *:focus-visible{
//     outline: none;
//     box-shadow: 0px 0px 5px blue;
//   }

//   html{
//     scroll-behavior: smooth;
//   }

//   body {
//     font-family: "Inter", "Roboto", Helvetica, sans-serif;
//     color: #333;
//   }

//   ::-webkit-scrollbar {
//     width: 5px;
//   }
//   ::-webkit-scrollbar-track {
//     border-radius: 10px;
//   }
//   ::-webkit-scrollbar-thumb {
//     background: #aaaaaa;
//     border-radius: 10px;
//   }
//   ::-webkit-scrollbar-thumb:hover {
//     background: #868585;
//   }

//   @media (max-width: 1080px) {
//     html {
//       font-size: 93.75%;
//     }
//   }
//   @media (max-width: 720px) {
//     html {
//       font-size: 87.5%;
//     }
//   }

//   ${({ theme }) => css`
//     .swal-confirm {
//       /* background-color: ${theme.colors.primary} !important; */
//     }

//     .swal-danger {
//       /* background-color: ${theme.colors.red} !important; */
//       /* color: ${theme.colors.white} !important; */
//     }

//     .swal-cancel {
//       /* background-color: ${theme.colors.lightGray} !important; */
//       /* color: ${theme.colors.gray} !important; */
//     }
//   `}
// `;

// export default GlobalStyles;

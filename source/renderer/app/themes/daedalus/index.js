import { isEmpty } from 'lodash';
import { CARDANO_THEME_OUTPUT } from './cardano';
import { LIGHT_BLUE_THEME_OUTPUT } from './light-blue';
import { DARK_BLUE_THEME_OUTPUT } from './dark-blue';
import { DARK_CARDANO_THEME_OUTPUT } from './dark-cardano';
import { WHITE_THEME_OUTPUT } from './white';
import { YELLOW_THEME_OUTPUT } from './yellow';

export const EXISTING_THEME_OUTPUTS = [
  ['cardano.js', CARDANO_THEME_OUTPUT],
  ['light-blue.js', LIGHT_BLUE_THEME_OUTPUT],
  ['dark-blue.js', DARK_BLUE_THEME_OUTPUT],
  ['dark-cardano.js', DARK_CARDANO_THEME_OUTPUT],
  ['white.js', WHITE_THEME_OUTPUT],
  ['yellow.js', YELLOW_THEME_OUTPUT],
];

export const EXISTING_THEME_OUTPUTS_OBJ = EXISTING_THEME_OUTPUTS.reduce(
  (outputsObj, theme) => {
    const [themeName, themeOutput] = theme;
    if (themeName && !isEmpty(themeOutput)) {
      outputsObj[themeName] = themeOutput;
    }
    return outputsObj;
  },
  {}
);

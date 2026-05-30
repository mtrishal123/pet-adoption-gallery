// Augments styled-components' `DefaultTheme` with our `AppTheme` shape so that
// `props.theme` is fully typed inside every styled component and `css` helper.
import 'styled-components';
import type { AppTheme } from './theme/theme';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}

import { logoDark, logoLight, logoMobile } from '../../assets'
import type { HeaderMode } from './Header.types'

// Resolves the correct logo source from mode and mobile header layout.
export function getLogoSource(mode: HeaderMode, isMobile: boolean): string {
  if (isMobile) {
    return logoMobile
  }

  return mode === 'dark' ? logoLight : logoDark
}

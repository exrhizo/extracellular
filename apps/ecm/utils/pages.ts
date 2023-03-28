import { SITE_CONFIG_DIRECTORY_NAME } from './constants';
import { VaultFiles } from './types';

// The site config file configure site wide things, like the nav bar
export function getSiteConfig(vaultFiles: VaultFiles, currentSiteName: string) {
  return vaultFiles[`${SITE_CONFIG_DIRECTORY_NAME}/${currentSiteName}`];
}

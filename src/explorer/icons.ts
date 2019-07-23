import * as path from 'path';
import { Uri } from 'vscode';
import { EXTENSION_ROOT_DIR } from './constants';

const darkIconsPath = path.join(EXTENSION_ROOT_DIR, 'resources', 'dark');
const lightIconsPath = path.join(EXTENSION_ROOT_DIR, 'resources', 'light');

export function getIcon(fileName: string): { light: string | Uri; dark: string | Uri } {
    return {
        dark: path.join(darkIconsPath, fileName),
        light: path.join(lightIconsPath, fileName)
    };
}

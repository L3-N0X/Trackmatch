// tailwind.config.js
import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export const content = [
  './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  './src/**/*.{js,ts,jsx,tsx}'
];
export const theme = {
  extend: {}
};
export const darkMode = 'class';
export const plugins = [
  nextui({
    layout: {
      fontSize: {
        tiny: '0.75rem', // text-tiny
        small: '0.875rem', // text-small
        medium: '1rem', // text-medium
        large: '1.125rem' // text-large
      },
      lineHeight: {
        tiny: '1rem', // text-tiny
        small: '1.25rem', // text-small
        medium: '1.5rem', // text-medium
        large: '1.75rem' // text-large
      },
      radius: {
        small: '4px', // rounded-small
        medium: '6px', // rounded-medium
        large: '8px' // rounded-large
      },
      borderWidth: {
        small: '1px', // border-small
        medium: '2px', // border-medium (default)
        large: '3px' // border-large
      }
    },
    themes: {
      'purple-light': {
        // extend: 'light', // <- inherit default values from dark theme
        colors: {
          background: '#fef5fe',
          foreground: '#180231',
          primary: {
            50: '#fef5fe',
            100: '#FDDBEC',
            200: '#FBB8E1',
            300: '#F391D6',
            400: '#E873D0',
            500: '#D948C9',
            600: '#BA34B8',
            700: '#93249C',
            800: '#6C167D',
            900: '#500D68',
            1000: '#3E0959',
            1100: '#2F064A',
            1200: '#21043C',
            1300: '#180231',
            DEFAULT: '#D948C9',
            foreground: '#180231'
          },
          secondary: {
            50: '#eff8ff',
            100: '#D2EAFE',
            200: '#A6D2FE',
            300: '#79B6FC',
            400: '#589DFA',
            500: '#2274F7',
            600: '#1859D4',
            700: '#1142B1',
            800: '#0A2E8F',
            900: '#062076',
            DEFAULT: '#2274F7',
            foreground: '#062076'
          },
          success: {
            50: '#f3fcf1',
            100: '#E8FCDA',
            200: '#CDF9B6',
            300: '#A7EF8F',
            400: '#83E06F',
            500: '#50CC43',
            600: '#32AF30',
            700: '#219229',
            800: '#157623',
            900: '#0C6120',
            DEFAULT: '#50CC43',
            foreground: '#0C6120'
          },
          warning: {
            50: '#fffbec',
            100: '#FFF1CC',
            200: '#FFE099',
            300: '#FFCA66',
            400: '#FFB43F',
            500: '#ff9100',
            600: '#DB7300',
            700: '#B75800',
            800: '#934000',
            900: '#7A3000',
            DEFAULT: '#ff9100',
            foreground: '#7A3000'
          },
          danger: {
            50: '#fff1f1',
            100: '#FFE5D9',
            200: '#FFC5B3',
            300: '#FF9E8D',
            400: '#FF7971',
            500: '#FF4248',
            600: '#DB3044',
            700: '#B72140',
            800: '#93153A',
            900: '#7A0C36',
            DEFAULT: '#FF4248',
            foreground: '#7A0C36'
          },
          default: {
            50: '#fef5fe',
            100: '#fef1f7',
            200: '#fddbec',
            300: '#F391D6',
            400: '#E873D0',
            500: '#D948C9',
            600: '#BA34B8',
            700: '#93249C',
            800: '#6C167D',
            900: '#500D68',
            1000: '#3E0959',
            1100: '#2F064A',
            1200: '#21043C',
            1300: '#180231',
            DEFAULT: '#D948C9',
            foreground: '#180231'
          },
          base: {
            default: '#DD62ED',
            primary: '#DD62ED',
            secondary: '#2274F7',
            success: '#50CC43',
            warning: '#ff9100',
            danger: '#FF4248'
          },
          content: {
            content1: '#0D001A',
            content2: '#0D001A',
            content3: '#0D001A',
            content4: '#0D001A'
          },
          layout: {
            background: '#fef5fe',
            foreground: '#180231',
            divider: '#2F064A',
            focus: '#DD62ED'
          }
        }
      },

      'purple-dark': {
        // inverts all colors
        colors: {
          background: '#0D001A',
          foreground: '#faf5ff',
          primary: {
            50: '#3f0863',
            100: '#5d1d86',
            200: '#7123a6',
            300: '#8524cc',
            400: '#9b35e8',
            500: '#af57f5',
            600: '#c585fb',
            700: '#dbb5fd',
            800: '#ebd6fe',
            900: '#f4e8ff',
            950: '#faf5ff',
            DEFAULT: '#af57f5',
            foreground: '#faf5ff'
          },
          secondary: {
            50: '#062076',
            100: '#0A2E8F',
            200: '#1142B1',
            300: '#1859D4',
            400: '#2274F7',
            500: '#589DFA',
            600: '#79B6FC',
            700: '#A6D2FE',
            800: '#D2EAFE',
            900: '#eff8ff',
            DEFAULT: '#589DFA',
            foreground: '#eff8ff'
          },
          success: {
            50: '#0C6120',
            100: '#157623',
            200: '#219229',
            300: '#32AF30',
            400: '#50CC43',
            500: '#83E06F',
            600: '#A7EF8F',
            700: '#CDF9B6',
            800: '#E8FCDA',
            900: '#f3fcf1',
            DEFAULT: '#83E06F',
            foreground: '#f3fcf1'
          },
          warning: {
            50: '#7A3000',
            100: '#934000',
            200: '#B75800',
            300: '#DB7300',
            400: '#ff9100',
            500: '#FFB43F',
            600: '#FFCA66',
            700: '#FFE099',
            800: '#FFF1CC',
            900: '#fffbec',
            DEFAULT: '#FFB43F',
            foreground: '#fffbec'
          },
          danger: {
            50: '#7A0C36',
            100: '#93153A',
            200: '#B72140',
            300: '#DB3044',
            400: '#FF4248',
            500: '#FF7971',
            600: '#FF9E8D',
            700: '#FFC5B3',
            800: '#FFE5D9',
            900: '#fff1f1',
            DEFAULT: '#FF7971',
            foreground: '#fff1f1'
          },
          default: {
            50: '#170736',
            100: '#3f0863',
            200: '#7123a6',
            300: '#8524cc',
            400: '#9b35e8',
            500: '#af57f5',
            600: '#c585fb',
            700: '#dbb5fd',
            800: '#ebd6fe',
            900: '#f4e8ff',
            950: '#faf5ff',
            DEFAULT: '#af57f5',
            foreground: '#faf5ff'
          },
          base: {
            default: '#af57f5',
            primary: '#af57f5',
            secondary: '#2274F7',
            success: '#50CC43',
            warning: '#ff9100',
            danger: '#FF4248'
          },
          content: {
            content1: '#faf5ff',
            content2: '#faf5ff',
            content3: '#faf5ff',
            content4: '#faf5ff'
          },

          content1: '#170736',
          layout: {
            background: '#0D001A',
            foreground: '#faf5ff',
            divider: '#0D001A',
            focus: '#af57f5'
          }
        }
      }
    }
  })
];

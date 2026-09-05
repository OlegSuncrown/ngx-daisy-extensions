import { randomCryptoId } from './random-crypto-id';

export interface DemoOption {
  id: string;
  value: string;
}

export interface DemoOptionWithIcon extends DemoOption {
  icon: string;
}

const STATUS_VALUES = [
  'Important',
  'Starred',
  'Work',
  'Personal',
  'To Do',
  'Later',
  'Read',
  'Travel',
] as const;

const STATUS_OPTIONS_WITH_ICONS = [
  { value: 'Important', icon: 'label' },
  { value: 'Starred', icon: 'star' },
  { value: 'Work', icon: 'work' },
  { value: 'Personal', icon: 'person' },
  { value: 'To Do', icon: 'checklist' },
  { value: 'Later', icon: 'schedule' },
  { value: 'Read', icon: 'menu_book' },
  { value: 'Travel', icon: 'flight' },
] as const;

export function generateStatusOptions(count: number): DemoOption[] {
  return Array.from({ length: count }, (_, index) => {
    const value = STATUS_VALUES[index % STATUS_VALUES.length];
    return {
      id: randomCryptoId(),
      value: count > STATUS_VALUES.length ? `${value} ${index + 1}` : value,
    };
  });
}

export function generateStatusOptionsWithIcons(count: number): DemoOptionWithIcon[] {
  return Array.from({ length: count }, (_, index) => {
    const base = STATUS_OPTIONS_WITH_ICONS[index % STATUS_OPTIONS_WITH_ICONS.length];
    return {
      id: randomCryptoId(),
      value: count > STATUS_OPTIONS_WITH_ICONS.length ? `${base.value} ${index + 1}` : base.value,
      icon: base.icon,
    };
  });
}

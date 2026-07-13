import { AppIcon, type AppIconName, type AppIconSize } from './AppIcon';

type Props = {
  name: AppIconName;
  size?: AppIconSize | number;
  className?: string;
  title?: string;
};

export function IconBadge({ name, size = 'md', className, title }: Props) {
  return (
    <span className={['icon-badge', className].filter(Boolean).join(' ')} title={title}>
      <AppIcon name={name} size={size} aria-hidden title={title} />
    </span>
  );
}

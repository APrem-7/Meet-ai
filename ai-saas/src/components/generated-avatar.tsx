import { createAvatar } from '@dicebear/core';
import { adventurer, botttsNeutral, initials } from '@dicebear/collection';

import { Avatar, AvatarImage } from '@/components/ui/avatar';

import { cn } from '@/lib/utils';
import { AvatarFallback } from '@radix-ui/react-avatar';

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
  variant: 'adventurer' | 'bottsNeutral' | 'initials';
}

export const GeneratedAvatar = ({
  seed,
  variant,
  className,
}: GeneratedAvatarProps) => {
  let avatar;

  if (variant === 'adventurer') {
    avatar = createAvatar(adventurer, {
      seed,
    });
  } else if (variant === 'bottsNeutral') {
    avatar = createAvatar(botttsNeutral, {
      seed,
    });
  } else {
    avatar = createAvatar(initials, {
      seed,
      fontWeight: 500,
      fontSize: 42,
    });
  }
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar.toDataUri()} alt="Avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

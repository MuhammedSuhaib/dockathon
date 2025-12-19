import React from 'react';
import NavbarItem from '@theme-original/NavbarItem';
import CustomAuthNavbarItem from './CustomAuthNavbarItem';

export default function NavbarItemWrapper(props: any): React.ReactElement {
  if (props?.type === 'custom-auth') {
    return <CustomAuthNavbarItem />;
  }

  return <NavbarItem {...props} />;
}

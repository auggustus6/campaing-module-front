import { Outlet } from 'react-router-dom';
import * as Styles from './styles';
import LoadingScreen from '../../components/LoadingScreen';
import {   } from 'react';

export default function AuthLayout() {
  return (
    <Styles.Wrapper>
      <Styles.Content>
        <Styles.LeftSide>
          <Styles.Image
            src="background-pc.jpg"
            style={{ objectFit: 'cover' }}
          />
        </Styles.LeftSide>
        <Styles.RightSide>
          <Styles.LoginContent>
            <Outlet />
          </Styles.LoginContent>
        </Styles.RightSide>
      </Styles.Content>
    </Styles.Wrapper>
  );
}

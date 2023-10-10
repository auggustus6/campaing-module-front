import styled from 'styled-components';

import { theme } from '../../styles/theme';

interface TextAreaProps {
  error?: boolean;
}

export const TextAreaStyle = styled.textarea<TextAreaProps>`
  width: 100%;
  height: 200px;
  padding: 1rem;
  resize: none;
  font-size: 1.2rem;
  font-family: Roboto, sans-serif, Helvetica;
  font-weight: 300;
  overflow: scroll;
  border-radius: 5px;

  color: rgba(0, 0, 0, 0.87);

  outline-color: ${() => theme.palette.primary.main};
  border-color: ${(p) =>
    p.error ? theme.palette.error.main : 'rgba(0, 0, 0, 0.23)'};

  &:not(:disabled):hover {
    border-color: rgba(0, 0, 0, 1);
  }

  &:disabled {
    color: rgba(0, 0, 0, 0.23);
  }
`;
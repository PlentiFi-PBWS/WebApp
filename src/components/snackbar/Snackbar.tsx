import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import Slide, { SlideProps } from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

interface TransitionsSnackbarProps {
  data: string; // Prop to pass the data/message to be displayed
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export default function TransitionsSnackbar({ data }: TransitionsSnackbarProps) {
  const [state, setState] = React.useState<{
    open: boolean;
    Transition: React.ComponentType<
      TransitionProps & {
        children: React.ReactElement<any, any>;
      }
    >;
  }>({
    open: false,
    Transition: Fade,
  });

  const handleClick =
    (
      Transition: React.ComponentType<
        TransitionProps & {
          children: React.ReactElement<any, any>;
        }
      >,
    ) =>
    () => {
      setState({
        open: true,
        Transition,
      });
    };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  return (
    <div>
      <Button onClick={handleClick(SlideTransition)}>Slide Transition</Button>
      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        message={data}
        key={state.Transition.name}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{
            sx: {
              backgroundColor: 'white', 
              color: 'black',
              border: '1px solid orange',
              height: '60px',
              boxShadow: '0 0 20px #ffa011',
              borderRadius: '10px',
            }
          }}
      />
    </div>
  );
}

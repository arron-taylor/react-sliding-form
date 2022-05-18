export const styles = {
  paperChin: {
    background: '#f1f1f1',
    width: '100%',
    flexDirection: 'column',
    display: 'flex',
    position: 'inherit',
    bottom: '0px',
    marginTop: 'auto',
    padding: '1rem',
    boxSizing: 'border-box',
    borderTop: '2px solid #ddd',
    borderRadius: {
      xl: '0px 0px 12px 12px',
      lg: '0px 0px 12px 12px',
      md: '0px 0px 12px 12px',
      sm: '0px',
      xs: '0px'
    }
  },
  paperContainer: {
    minWidth: '400px',
    maxWidth: '560px',
    borderRadius: {
      xl: '12px 12px 12px 12px',
      lg: '12px 12px 12px 12px',
      md: '12px 12px 12px 12px',
      sm: '12px 12px 12px 12px',
      tablet: '12px',
      minitablet: '12px',
      xs: '0px'
    },
    background: '#fff',
    boxShadow: 0,
    display: 'flex',
    flexDirection: 'column',
    margin: {
      xl: '0px auto 1rem auto',
      lg: '0px auto 1rem auto',
      md: '0px auto 1rem auto',
      sm: '0px',
      xs: '0px'
    },
    width: {
      xl: '560px',
      lg: '560px',
      md: '560px',
      sm: '560px',
      tablet: '560px',
      minitablet: '100vw',
      bigphone: '100vw',
      xs: '100vw'
    }
  },
  paper: {
    margin: {
      xl: '0px auto 1rem auto',
      lg: '0px auto 1rem auto',
      md: '0px auto 1rem auto',
      sm: 'auto',
      xs: 'auto'
    },
    width: {
      xl: '560px',
      lg: '560px',
      md: '560px',
      sm: '100vw',
      xs: '100vw'
    },
    height: {
      xl: '619px',
      lg: '600px',
      md: '800px',
      sm: '300px'
      // xs: '100%'
    },
    display: 'flex',
    flexDirection: 'column'
  },
  closeButton: {
    position: 'fixed',
    color: '#fff',
    '&:hover': {
      background: 'transparent'
    },
    ml: {
      xl: '580px',
      lg: '580px',
      md: '580px',
      sm: 'auto',
      xs: 'auto'
    },
    mr: {
      sm: '-3rem',
      xs: '-1rem'
    },
    mt: {
      xl: '-40px',
      lg: '-40px',
      md: '-40px'
    }
  },
  filledButton: {
    ml: 'auto',
    fontWeight: 600,
    fontSize: '14px',
    textTransform: 'none',
    fontFamily: 'Gotham SSm',
    borderRadius: '8px'
  },
  textButton: {
    mr: 'auto',
    fontWeight: 600,
    fontSize: '14px',
    textTransform: 'none',
    fontFamily: 'Gotham SSm',
    borderRadius: '8px'
  },
}

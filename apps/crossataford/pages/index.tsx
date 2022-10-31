import { styled } from '../theme/stitches.config';

const Button = styled('button', {
  backgroundColor: 'red',
  borderRadius: '9999px',
  fontSize: '13px',
  padding: '10px 15px',
  '&:hover': {
    backgroundColor: 'lightgray',
  },
});

export function Index() {
  return (
    <div>
      <h2>crossataford</h2>
      <Button>CLICK CLICK</Button>
    </div>
  );
}

export default Index;

import { styled } from '../theme/stitches.config';

const Button = styled('button', {
  backgroundColor: 'medium',
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
      <h2>Pipe My DAO</h2>
      <Button>Use the pipe</Button>
    </div>
  );
}

export default Index;

import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import './globals.css';

const App = () => {
  return (
    <div className="content flex justify-center h-full items-center flex-col">
      <h1>Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <div className="flex flex-row gap-2">
        <Input type="email" placeholder="Email" />
        <Button>Button</Button>
      </div>
    </div>
  );
};

export default App;

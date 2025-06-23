import { Button } from "../../atoms/ui/button";
import { Input } from "../../atoms/ui/input";

const Map = () => {
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
export default Map;
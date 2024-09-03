import image from '../public/image.png';
import { Input } from '@/components/Input';

export const App: React.FC = () => {
  return (
    <div className="App">
      <span>App Component</span>
      <img src={image} />
      <Input />
    </div>
  );
};

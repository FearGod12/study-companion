import DarkLogo from '../Common/DarkLogo';
import Carousel from '../Carousel';

const Home = () => {
  return (
      <div className='container max-w-none h-screen'>
        <div >
          <DarkLogo />
          <Carousel/>
        </div>
      </div>
  );
}

export default Home
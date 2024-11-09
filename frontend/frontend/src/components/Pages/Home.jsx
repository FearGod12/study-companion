import Logo from '../Common/Logo';
import Carousel from '../Carousel';

const Home = () => {
  return (
      <div className='container max-w-none h-screen'>
        <div >
          <Logo />
          <Carousel/>
        </div>
      </div>
  );
}

export default Home
import DarkLogo from '../../common/DarkLogo';
import Button from '../../common/Button';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
      <div className="container max-w-none h-screen font-inria-sans ">
          <div className="py-2 pl-4">
              <DarkLogo />
          </div>
<div className='h-screen flex border justify-center items-center relative'>
    <div className="flex flex-col items-center justify-center h-3/5 w-3/5 bg-secondary shadow-2xl shadow-secondary absolute top-20 right-40 rounded"></div>
     <div className="flex flex-col items-center justify-center h-3/5 w-3/5 bg-secondary shadow-lg shadow-white z-10 rounded border-t border-white">
              <div className="flex flex-col items-center">
                  <h1 className="text-3xl text-white font-bold py-3">
                      Welcome
                  </h1>
                  <p className="font-ink-free text-sm w-1/2 px-4 py-3 mb-6 text-center text-white">
                      We are glad to have you! TopicalTest.NG is designed to
                      give you a smooth studying experience, helping you achieve
                      your academic goals with ease.
                  </p>
              </div>
              <div className="flex gap-3 text-center lg:flex-row md:flex-row flex-col">
                <Link to='/login'>
                  <Button
                      text="Login"
                      className="text-secondary hover:border border-gray-100 bg-white hover:bg-secondary hover:text-white"
                  />
                  </Link>

                  <Link to='/signup'>
                  <Button
                      text="Sign up"
                      className="text-secondary hover:border border-gray-100 bg-white hover:bg-secondary hover:text-white"
                  />
                  </Link>
              </div>
          </div>
</div>
         
      </div>
  );
}

export default Welcome
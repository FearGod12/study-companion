import DarkLogo from '../../common/DarkLogo';
import Button from '../../common/Button';
import { Link } from 'react-router-dom';

const GetStarted = () => {
  return (
      <div className="container max-w-none h-screen font-inria-sans ">
          <div className="py-2 pl-4">
              <DarkLogo />
          </div>

          <div className="flex flex-col h-full items-center justify-center relative">
            {/* <img src={getStarted} alt="" className='absolute h-screen w-screen mx-auto' /> */}
              <div className="flex flex-col items-center">
                  <h1 className="text-3xl text-secondary font-bold py-3">
                      Welcome
                  </h1>
                  <p className="font-ink-free text-sm w-1/2 px-4 py-3 mb-6 text-center">
                      We are glad to have you! TopicalTest.NG is designed to
                      give you a smooth studying experience, helping you achieve
                      your academic goals with ease.
                  </p>
              </div>
              <div className="flex gap-3 text-center">
                <Link to='/login'>
                  <Button
                      text="Login"
                      className="text-secondary border border-secondary bg-white hover:bg-secondary hover:text-white"
                  />
                  </Link>

                  <Link to='/signup'>
                  <Button
                      text="Sign up"
                      className="text-white hover:text-secondary hover:border border-secondary hover:bg-white"
                  />
                  </Link>
              </div>
          </div>
      </div>
  );
}

export default GetStarted